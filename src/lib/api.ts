import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
})

// Interceptor para injetar o subdomínio no header
api.interceptors.request.use((config) => {
  const subdomain = window.location.hostname.split('.')[0]
  if (subdomain && subdomain !== 'www' && subdomain !== 'localhost') {
    config.headers['X-Store-Slug'] = subdomain
  }
  return config
})

// Interceptor para adicionar token JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Sessão expirada (401) numa rota autenticada: limpa o estado e manda pro login,
// em vez de o painel quebrar em silêncio. Não dispara no próprio /auth/login
// (onde 401 = credencial inválida, tratado na tela de login).
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status
    const url: string = error?.config?.url || ''
    const hadToken = !!localStorage.getItem('auth_token')
    if (status === 401 && hadToken && !url.includes('/auth/login')) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user')
      localStorage.removeItem('store')
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
