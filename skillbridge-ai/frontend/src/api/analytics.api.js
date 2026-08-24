import apiClient from './axios'
import ENDPOINTS from './endpoints'

export const analyticsApi = {
  // Student analytics (career readiness, skill progress, gaps, assessments)
  getStudentAnalytics: async () => {
    const { data } = await apiClient.get(ENDPOINTS.ANALYTICS.STUDENT)
    return data
  },

  // Company recruiter analytics (opportunities, total applications, shortlisted)
  getCompanyAnalytics: async () => {
    const { data } = await apiClient.get(ENDPOINTS.ANALYTICS.COMPANY)
    return data
  },

  // Academician analytics (aggregated student readiness, placement stats)
  getAcademicianAnalytics: async () => {
    const { data } = await apiClient.get(ENDPOINTS.ANALYTICS.ACADEMICIAN)
    return data
  },

  // System admin analytics
  getSystemAnalytics: async () => {
    try {
      const { data } = await apiClient.get('/api/analytics/system/')
      return data
    } catch {
      return null
    }
  },
}

export default analyticsApi
