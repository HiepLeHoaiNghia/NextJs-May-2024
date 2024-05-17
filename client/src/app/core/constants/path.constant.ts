export const PATH = {
  COMMON: {
    NOTIFICATION: '*',
  },

  AUTH: {
    LOGIN: '/auth/login',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password/:token',
  },

  USER: {
    DASHBOARD: '/',
    TIME_ENTRIES: '/time-entries',
    ATTENDANCES_HISTORY: '/attendances-history',
    PROFILE: '/profile',
    PROFILE_UPDATE: '/profile/update',
    CHANGE_PASSWORD: '/change-password',
    SETTINGS: '/settings',
  },

  ADMIN: {
    DASHBOARD: '/admin',
    USERS: '/admin/users',
    USER_CREATE: '/admin/users/create',
    USER_UPDATE: '/admin/users/update',
    REQUESTS: '/admin/requests',
    TIME_ENTRIES: '/admin/time-entries',
    ATTENDANCES: '/admin/attendances',
    ATTENDANCES_DETAILS: '/admin/attendances/:user_id',
    SETTINGS: '/admin/settings',
  },
} as const
