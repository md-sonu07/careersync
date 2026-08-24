import apiClient from './axios'
import ENDPOINTS from './endpoints'

export const opportunityApi = {
  // List published opportunities (supports params: { type, work_mode, search })
  getOpportunities: async (params = {}) => {
    try {
      const { data } = await apiClient.get(ENDPOINTS.OPPORTUNITIES.LIST, { params })
      return data || []
    } catch {
      return []
    }
  },

  // Get student's personalized opportunity matches (sorted by -match_score)
  getOpportunityMatches: async () => {
    try {
      const { data } = await apiClient.get(`${ENDPOINTS.OPPORTUNITIES.LIST}matches/`)
      return data || []
    } catch {
      return []
    }
  },

  // Force recalculate opportunity matches for student
  recalculateOpportunityMatches: async () => {
    try {
      const { data } = await apiClient.post(`${ENDPOINTS.OPPORTUNITIES.LIST}matches/recalculate/`)
      return data || []
    } catch {
      return []
    }
  },

  // Get opportunity detail with skill requirements
  getOpportunityDetail: async (id) => {
    const { data } = await apiClient.get(ENDPOINTS.OPPORTUNITIES.BY_ID(id))
    return data
  },

  // Create a new opportunity posting (Industry company user only)
  createOpportunity: async (payload) => {
    const { data } = await apiClient.post(ENDPOINTS.OPPORTUNITIES.LIST, payload)
    return data
  },

  // Update opportunity posting (Owning company only)
  updateOpportunity: async (id, payload) => {
    const { data } = await apiClient.patch(ENDPOINTS.OPPORTUNITIES.BY_ID(id), payload)
    return data
  },

  // Delete opportunity posting
  deleteOpportunity: async (id) => {
    const { data } = await apiClient.delete(ENDPOINTS.OPPORTUNITIES.BY_ID(id))
    return data
  },
}

export default opportunityApi
