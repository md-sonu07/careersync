import apiClient from './axios'
import ENDPOINTS from './endpoints'

export const applicationApi = {
  // Student submits an application for an opportunity
  applyForOpportunity: async (opportunityId, payload) => {
    const { data } = await apiClient.post(ENDPOINTS.OPPORTUNITIES.APPLY(opportunityId), payload)
    return data
  },

  // Student fetches their submitted applications
  getMyApplications: async () => {
    const { data } = await apiClient.get(ENDPOINTS.APPLICATIONS.MY)
    return data
  },

  // Company recruiter fetches applications received for their opportunities
  getCompanyApplications: async () => {
    const { data } = await apiClient.get(ENDPOINTS.APPLICATIONS.COMPANY)
    return data
  },

  // Company recruiter updates application status
  updateApplicationStatus: async (applicationId, status, remarks = '') => {
    const { data } = await apiClient.patch(ENDPOINTS.APPLICATIONS.STATUS_UPDATE(applicationId), { status, remarks })
    return data
  },
}

export default applicationApi
