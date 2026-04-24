import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
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

export default api
