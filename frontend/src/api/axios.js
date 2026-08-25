import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api',
  timeout: 60000,
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
    const guestId = localStorage.getItem('skillbridge_guest_id')
    if (guestId && !token) {
      config.headers['X-Guest-ID'] = guestId
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - global error handling & auto JWT refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const status = error.response?.status
    const isTokenError = status === 401 || error.response?.data?.code === 'token_not_valid'

    if (isTokenError && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true
      const refreshToken = localStorage.getItem('refresh_token')

      if (refreshToken) {
        try {
          const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'
          const refreshRes = await axios.post(`${baseURL}/auth/token/refresh/`, {
            refresh: refreshToken,
          })

          if (refreshRes.data?.access) {
            const newAccess = refreshRes.data.access
            localStorage.setItem('token', newAccess)
            if (refreshRes.data.refresh) {
              localStorage.setItem('refresh_token', refreshRes.data.refresh)
            }
            originalRequest.headers.Authorization = `Bearer ${newAccess}`
            return apiClient(originalRequest)
          }
        } catch {
          // Token refresh failed - session genuinely expired
          localStorage.removeItem('token')
          localStorage.removeItem('refresh_token')
          localStorage.removeItem('user')
          localStorage.removeItem('auth')
          if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
            alert('Your session has expired. Please log in again.')
            window.location.href = '/login'
          }
          return Promise.reject(error)
        }
      }
    }

    if (status === 401) {
      const hasToken = localStorage.getItem('token')
      if (hasToken) {
        localStorage.removeItem('token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
        localStorage.removeItem('auth')
        if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
          alert('Your session has expired. Please log in again.')
          window.location.href = '/login'
        }
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient
