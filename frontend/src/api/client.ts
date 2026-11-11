import axios, { AxiosError } from 'axios'
import { useAuthStore } from '../stores/authStore'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor — attach auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor — handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && window.location.pathname.startsWith('/admin')) {
      const token = useAuthStore.getState().token
      if (token && token !== 'demo-jwt-token') {
        useAuthStore.getState().logout()
        window.location.href = '/admin/login'
      }
    }

    const message =
      (error.response?.data as { detail?: string })?.detail ||
      error.message ||
      'An unexpected error occurred'

    return Promise.reject(new Error(message))
  }
)

export default apiClient
