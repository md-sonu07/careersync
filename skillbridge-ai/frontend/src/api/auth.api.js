import apiClient from './axios'
import ENDPOINTS from './endpoints'

export const authApi = {
  login: async (credentials) => {
    const { data } = await apiClient.post(ENDPOINTS.AUTH.LOGIN, credentials)
    return data
  },

  register: async (payload) => {
    const { data } = await apiClient.post(ENDPOINTS.AUTH.REGISTER, payload)
    return data
  },

  logout: async (refreshToken) => {
    const refresh = refreshToken || localStorage.getItem('refresh_token')
    const { data } = await apiClient.post(ENDPOINTS.AUTH.LOGOUT, { refresh })
    return data
  },

  getMe: async () => {
    const { data } = await apiClient.get(ENDPOINTS.AUTH.ME)
    return data
  },

  updateMe: async (payload) => {
    const isFormData = payload instanceof FormData
    const { data } = await apiClient.patch(ENDPOINTS.AUTH.ME, payload, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    })
    return data
  },

  refreshToken: async (refreshToken) => {
    const refresh = refreshToken || localStorage.getItem('refresh_token')
    const { data } = await apiClient.post(ENDPOINTS.AUTH.REFRESH, { refresh })
    return data
  },
}

