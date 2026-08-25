import apiClient from './axios'
import ENDPOINTS from './endpoints'

export const courseApi = {
  // List active learning resources (supports params: { skill, type, level, search, limit })
  getResources: async (params = {}) => {
    try {
      const { data } = await apiClient.get(ENDPOINTS.COURSES.RESOURCES, { params })
      return data || []
    } catch {
      return []
    }
  },

  // Get specific course detail
  getCourseDetail: async (id) => {
    const { data } = await apiClient.get(`/courses/resources/${id}/`)
    return data
  },

  // Enroll in a course (Free or Paid)
  enrollCourse: async (id, payload = {}) => {
    const { data } = await apiClient.post(`/courses/resources/${id}/enroll/`, payload)
    return data
  },

  // Get list of active student enrollments
  getMyEnrollments: async () => {
    try {
      const { data } = await apiClient.get(ENDPOINTS.COURSES.MY_ENROLLMENTS)
      return data || []
    } catch {
      return []
    }
  },

  // Get single enrollment with full player details
  getEnrollmentDetail: async (id) => {
    const { data } = await apiClient.get(`/courses/enrollments/${id}/`)
    return data
  },

  // Update lesson completion & progress
  updateProgress: async (enrollmentId, payload) => {
    const { data } = await apiClient.post(`/courses/enrollments/${enrollmentId}/progress/`, payload)
    return data
  },

  // Get courses created by authenticated institute
  getMyInstituteCourses: async () => {
    try {
      const { data } = await apiClient.get('/courses/resources/my/')
      return data || []
    } catch {
      return []
    }
  },

  // Create course (Institute / Admin)
  createCourse: async (payload) => {
    const { data } = await apiClient.post(ENDPOINTS.COURSES.RESOURCES, payload)
    return data
  },

  // Update course
  updateCourse: async (id, payload) => {
    const { data } = await apiClient.patch(`/courses/resources/${id}/`, payload)
    return data
  },

  // Delete course
  deleteCourse: async (id) => {
    const { data } = await apiClient.delete(`/courses/resources/${id}/`)
    return data
  },

  // Get student's personalized recommendations
  getRecommendations: async () => {
    try {
      const { data } = await apiClient.get(ENDPOINTS.COURSES.RECOMMENDATIONS)
      return data || []
    } catch {
      return []
    }
  },

  // Update recommendation status (pending, in_progress, completed)
  updateRecommendationStatus: async (id, status) => {
    const { data } = await apiClient.patch(`/courses/recommendations/${id}/`, { status })
    return data
  },
}
