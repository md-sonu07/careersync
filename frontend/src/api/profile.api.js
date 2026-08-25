import apiClient from './axios'
import ENDPOINTS from './endpoints'

export const profileApi = {
  // Student Profile
  getStudentProfile: async () => {
    const { data } = await apiClient.get(ENDPOINTS.STUDENTS.PROFILE)
    return data
  },
  updateStudentProfile: async (payload) => {
    const { data } = await apiClient.patch(ENDPOINTS.STUDENTS.PROFILE, payload)
    return data
  },
  getCandidates: async () => {
    try {
      const { data } = await apiClient.get('/students/candidates/')
      return data || []
    } catch {
      return []
    }
  },

  // Company Profile
  getCompanyProfile: async () => {
    const { data } = await apiClient.get(ENDPOINTS.COMPANIES.PROFILE)
    return data
  },
  updateCompanyProfile: async (payload) => {
    const { data } = await apiClient.patch(ENDPOINTS.COMPANIES.PROFILE, payload)
    return data
  },

  // Academician Profile
  getAcademicianProfile: async () => {
    const { data } = await apiClient.get(ENDPOINTS.ACADEMICIANS.PROFILE)
    return data
  },
  updateAcademicianProfile: async (payload) => {
    const { data } = await apiClient.patch(ENDPOINTS.ACADEMICIANS.PROFILE, payload)
    return data
  },

  // Institutions
  getInstitutions: async () => {
    const { data } = await apiClient.get(ENDPOINTS.INSTITUTIONS.LIST)
    return data
  },

  // Health check
  checkHealth: async () => {
    const { data } = await apiClient.get(ENDPOINTS.HEALTH)
    return data
  },
}

export default profileApi
