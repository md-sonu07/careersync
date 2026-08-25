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
    const { data } = await apiClient.get(ENDPOINTS.ANALYTICS.SYSTEM)
    return data
  },

  // Industry demand analytics (top demanded skills & hiring partner drives)
  getIndustryDemandAnalytics: async () => {
    const { data } = await apiClient.get(ENDPOINTS.ANALYTICS.INDUSTRY_DEMAND)
    return data
  },
}

export default analyticsApi
