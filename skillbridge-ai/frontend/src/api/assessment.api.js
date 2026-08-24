import apiClient from './axios'
import ENDPOINTS from './endpoints'

export const assessmentApi = {
  // List all active assessments (supports params: { skill, difficulty, search })
  getAssessments: async (params = {}) => {
    const { data } = await apiClient.get(ENDPOINTS.ASSESSMENTS.LIST, { params })
    return data
  },

  // Get assessment details and questions (without is_correct field)
  getAssessmentDetail: async (id) => {
    const { data } = await apiClient.get(ENDPOINTS.ASSESSMENTS.BY_ID(id))
    return data
  },

  // Start a new assessment attempt
  startAttempt: async (id) => {
    const { data } = await apiClient.post(ENDPOINTS.ASSESSMENTS.START(id))
    return data
  },

  // Submit student answers for an attempt & trigger backend result calculation
  submitAttempt: async (attemptId, payload) => {
    const { data } = await apiClient.post(ENDPOINTS.ASSESSMENTS.SUBMIT(attemptId), payload)
    return data
  },

  // Fetch past assessment attempt history for logged-in student
  getMyAttempts: async () => {
    const { data } = await apiClient.get(ENDPOINTS.ASSESSMENTS.MY_ATTEMPTS)
    return data
  },
}

export default assessmentApi
