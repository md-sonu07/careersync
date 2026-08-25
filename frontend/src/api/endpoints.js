// Centralized API endpoint map - single source of truth
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login/',
    REGISTER: '/auth/register/',
    LOGOUT: '/auth/logout/',
    ME: '/auth/me/',
    REFRESH: '/auth/token/refresh/',
  },
  HEALTH: '/health/',
  STUDENTS: {
    PROFILE: '/students/profile/',
  },
  COMPANIES: {
    PROFILE: '/companies/profile/',
  },
  INSTITUTES: {
    PROFILE: '/academicians/profile/',
  },
  ACADEMICIANS: {
    PROFILE: '/academicians/profile/',
  },
  INSTITUTIONS: {
    LIST: '/institutions/',
    BY_ID: (id) => `/institutions/${id}/`,
  },
  USER: {
    PROFILE: '/auth/me/',
    UPDATE_PROFILE: '/auth/me/',
    LIST: '/users/',
    BY_ID: (id) => `/users/${id}/`,
  },
  COURSES: {
    RESOURCES: '/courses/resources/',
    RESOURCE_DETAIL: (id) => `/courses/resources/${id}/`,
    ENROLL: (id) => `/courses/resources/${id}/enroll/`,
    MY_ENROLLMENTS: '/courses/my-enrollments/',
    ENROLLMENT_DETAIL: (id) => `/courses/enrollments/${id}/`,
    PROGRESS: (id) => `/courses/enrollments/${id}/progress/`,
    RECOMMENDATIONS: '/courses/recommendations/',
    RECOMMENDATION_DETAIL: (id) => `/courses/recommendations/${id}/`,
  },
  SKILLS: {
    LIST: '/skills/',
    CAREER_ROLES: '/skills/career-roles/',
    GAPS: '/skills/gaps/',
    GAPS_RECALCULATE: '/skills/gaps/recalculate/',
    MY_SKILLS: '/students/my-skills/',
    MY_SKILLS_HISTORY: '/students/my-skills/history/',
    MY_SKILL_DETAIL: (id) => `/students/my-skills/${id}/`,
    RECOMMEND: '/skills/recommend/',
  },
  ASSESSMENTS: {
    LIST: '/assessments/',
    BY_ID: (id) => `/assessments/${id}/`,
    START: (id) => `/assessments/${id}/start/`,
    SUBMIT: (attemptId) => `/assessments/attempts/${attemptId}/submit/`,
    MY_ATTEMPTS: '/assessments/my-attempts/',
  },
  OPPORTUNITIES: {
    LIST: '/opportunities/',
    BY_ID: (id) => `/opportunities/${id}/`,
    APPLY: (id) => `/opportunities/${id}/apply/`,
  },
  APPLICATIONS: {
    MY: '/applications/my/',
    COMPANY: '/company/applications/',
    STATUS_UPDATE: (id) => `/applications/${id}/status/`,
  },
  ANALYTICS: {
    STUDENT: '/analytics/student/',
    COMPANY: '/analytics/company/',
    ACADEMICIAN: '/analytics/academician/',
    SYSTEM: '/analytics/system/',
    INDUSTRY_DEMAND: '/analytics/industry-demand/',
  },
  AI: {
    CONVERSATIONS: '/ai/conversations/',
    CONVERSATION_DETAIL: (id) => `/ai/conversations/${id}/`,
    CHAT: '/ai/chat/',
    DOCUMENT_UPLOAD: '/ai/documents/upload/',
    DOCUMENT_DETAIL: (id) => `/ai/documents/${id}/`,
    DOCUMENT_CHAT: (id) => `/ai/documents/${id}/chat/`,
  },
}


export default ENDPOINTS
