import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - attach JWT
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - global error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status

    if (status === 401) {
      // Auto logout on 401 - token expired/invalid
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // Optional: redirect to login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }

    // Optional: show toast / log
    // console.error('[API Error]', error.response?.data || error.message)

    return Promise.reject(error)
  }
)

export default apiClient
