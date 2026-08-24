import apiClient from './axios'
import ENDPOINTS from './endpoints'

export const skillApi = {
  // Get all active skills (supports params: { category, search })
  getSkills: async (params = {}) => {
    const { data } = await apiClient.get(ENDPOINTS.SKILLS.LIST, { params })
    return data
  },

  // Create a new skill definition
  createSkill: async (payload) => {
    const { data } = await apiClient.post(ENDPOINTS.SKILLS.LIST, payload)
    return data
  },

  // Get all career roles with required skill benchmarks
  getCareerRoles: async () => {
    const { data } = await apiClient.get(ENDPOINTS.SKILLS.CAREER_ROLES)
    return data
  },

  // Get authenticated student's assigned skills
  getMySkills: async () => {
    const { data } = await apiClient.get(ENDPOINTS.SKILLS.MY_SKILLS)
    return data
  },

  // Add or update a skill on authenticated student's profile
  addMySkill: async (payload) => {
    const { data } = await apiClient.post(ENDPOINTS.SKILLS.MY_SKILLS, payload)
    return data
  },

  // Update a student skill entry (score, level, source)
  updateMySkill: async (id, payload) => {
    const { data } = await apiClient.patch(ENDPOINTS.SKILLS.MY_SKILL_DETAIL(id), payload)
    return data
  },

  // Delete a student skill entry
  deleteMySkill: async (id) => {
    const { data } = await apiClient.delete(ENDPOINTS.SKILLS.MY_SKILL_DETAIL(id))
    return data
  },

  // Get student's skill score history log
  getMySkillHistory: async () => {
    const { data } = await apiClient.get(ENDPOINTS.SKILLS.MY_SKILLS_HISTORY)
    return data
  },
}

export default skillApi
