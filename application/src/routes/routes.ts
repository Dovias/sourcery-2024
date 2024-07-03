export const AppRoutes = {
  ANY: '*',
  ROOT: '/',

  CALENDAR: '/calendar',
  BOOKINGS: '/bookings',
  APARTMENTS: '/apartments',
  APARTMENT: '/apartments/:id',
  NEW_APARTMENT: '/apartments/new',
  SETTINGS: '/settings',
  CONTACTS: '/contacts',

  SIGN_UP: '/signup',
  LOG_IN: '/login',
  LOG_OUT: '/logout',

  TERMS_OF_SERVICE: '/terms-of-service',
  SUPPORT: '/support',

  ERROR_PAGE: '/error'
} as const;

export type AppRoutes = typeof AppRoutes[keyof typeof AppRoutes];
