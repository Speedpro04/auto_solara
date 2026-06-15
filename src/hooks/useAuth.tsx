import { useState, useEffect, createContext, useContext } from 'react'
import api from '../lib/api'

interface User {
  id: string
  email: string
  name?: string
  store_id?: string
}

interface Store {
  id: string
  name: string
  slug: string
  phone?: string
  logo_url?: string
  plan?: string
  trial_ends_at?: string
}

interface AuthContextType {
  user: User | null
  store: Store | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  refreshStore: () => Promise<Store | null>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [store, setStore] = useState<Store | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    const storedUser = localStorage.getItem('user')
    const storedStore = localStorage.getItem('store')

    if (token && storedUser) {
      try {
        if (storedUser !== 'undefined') setUser(JSON.parse(storedUser))
        if (storedStore && storedStore !== 'undefined') setStore(JSON.parse(storedStore))
      } catch (err) {
        console.error('Failed to parse auth data from localStorage', err)
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
        localStorage.removeItem('store')
      }
    }

    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // Autentica via a API FastAPI
    const { data } = await api.post('/auth/login', { email, password })

    if (!data.success) {
      throw new Error('Credenciais inválidas')
    }

    // Salva token e dados no localStorage
    localStorage.setItem('auth_token', data.access_token)
    localStorage.setItem('refresh_token', data.refresh_token)
    localStorage.setItem('user', JSON.stringify(data.user))
    
    if (data.store) {
      localStorage.setItem('store', JSON.stringify(data.store))
      setStore(data.store)
    }

    setUser(data.user)
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
    localStorage.removeItem('store')
    setUser(null)
    setStore(null)
  }

  // Recarrega os dados da loja do backend (ex: após assinar e voltar do Stripe,
  // o plano muda para 'parceiro' e o painel precisa refletir isso sem relogin).
  const refreshStore = async (): Promise<Store | null> => {
    try {
      const { data } = await api.get('/admin/store')
      localStorage.setItem('store', JSON.stringify(data))
      setStore(data)
      return data
    } catch {
      return null
    }
  }

  return (
    <AuthContext.Provider value={{ user, store, loading, login, logout, refreshStore }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
