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

  logout: async () => {
    const { data } = await apiClient.post(ENDPOINTS.AUTH.LOGOUT)
    return data
  },

  getMe: async () => {
    const { data } = await apiClient.get(ENDPOINTS.AUTH.ME)
    return data
  },

  refreshToken: async () => {
    const { data } = await apiClient.post(ENDPOINTS.AUTH.REFRESH)
    return data
  },
}
