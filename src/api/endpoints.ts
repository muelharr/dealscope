/**
 * Centralized API endpoint constants.
 *
 * All endpoint paths are defined here so that no hardcoded strings
 * appear elsewhere in the codebase.  Each namespace groups related
 * routes and exposes helper functions for parameterised paths.
 */

export const AUTH = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REGISTER: '/auth/register',
  REFRESH: '/auth/refresh',
  ME: '/auth/me',
} as const;

export const SEARCH = {
  QUERY: '/search',
  SUGGESTIONS: '/search/suggestions',
} as const;

export const PRODUCTS = {
  LIST: '/products',
  DETAIL: (id: string) => `/products/${id}` as const,
  OFFERS: (id: string) => `/products/${id}/offers` as const,
  PRICE_HISTORY: (id: string) => `/products/${id}/price-history` as const,
  SIMILAR: (id: string) => `/products/${id}/similar` as const,
  SPECIFICATIONS: (id: string) => `/products/${id}/specifications` as const,
  VERIFIED_SELLERS: (id: string) => `/products/${id}/verified-sellers` as const,
  AI_SUMMARY: (id: string) => `/products/${id}/ai-summary` as const,
} as const;

export const COMPARE = {
  ROOT: '/compare',
  RESULT: (ids: string[]) =>
    `/compare?ids=${ids.join(',')}` as const,
} as const;

export const WISHLIST = {
  LIST: '/wishlist',
  ADD: '/wishlist',
  REMOVE: (id: string) => `/wishlist/${id}` as const,
} as const;

export const NOTIFICATIONS = {
  LIST: '/notifications',
  MARK_READ: (id: string) => `/notifications/${id}/read` as const,
  MARK_ALL_READ: '/notifications/read',
  PREFERENCES: '/notifications/preferences',
} as const;

export const DASHBOARD = {
  OVERVIEW: '/dashboard',
  METRICS: '/dashboard/metrics',
  INSIGHTS: '/dashboard/insights',
} as const;

export const ACTIVITY = {
  LIST: '/activity',
} as const;

export const CATEGORIES = {
  LIST: '/categories',
  DETAIL: (id: string) => `/categories/${id}` as const,
} as const;

export const BRANDS = {
  LIST: '/brands',
  DETAIL: (id: string) => `/brands/${id}` as const,
} as const;

export const PRICE_ALERTS = {
  LIST: '/price-alerts',
  CREATE: '/price-alerts',
  UPDATE: (id: string) => `/price-alerts/${id}` as const,
  TOGGLE: (id: string) => `/price-alerts/${id}/enable` as const,
  DELETE: (id: string) => `/price-alerts/${id}` as const,
} as const;

