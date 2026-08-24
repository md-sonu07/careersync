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
    LIST: '/courses/',
    CREATE: '/courses/',
    BY_ID: (id) => `/courses/${id}/`,
    ENROLL: (id) => `/courses/${id}/enroll/`,
  },
  SKILLS: {
    LIST: '/skills/',
    CAREER_ROLES: '/skills/career-roles/',
    MY_SKILLS: '/students/my-skills/',
    MY_SKILLS_HISTORY: '/students/my-skills/history/',
    MY_SKILL_DETAIL: (id) => `/students/my-skills/${id}/`,
    RECOMMEND: '/skills/recommend/',
  },
}


export default ENDPOINTS
