// Centralized API endpoint map - single source of truth
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    REFRESH: '/auth/refresh',
  },
  USER: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    LIST: '/users',
    BY_ID: (id) => `/users/${id}`,
  },
  COURSES: {
    LIST: '/courses',
    CREATE: '/courses',
    BY_ID: (id) => `/courses/${id}`,
    ENROLL: (id) => `/courses/${id}/enroll`,
  },
  SKILLS: {
    LIST: '/skills',
    RECOMMEND: '/skills/recommend',
  },
  // Add more domains as needed:
  // JOBS: { ... }
}

export default ENDPOINTS
