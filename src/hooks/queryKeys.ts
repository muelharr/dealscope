/**
 * Centralized query and mutation keys for TanStack Query.
 *
 * This factory approach ensures that all keys are consistent, typed, and
 * easy to manage. Instead of hardcoding strings throughout the codebase,
 * we import and use these key factories. This prevents typos and makes
 * it easy to invalidate groups of queries.
 *
 * Structure:
 * - Each top-level key represents a data domain (e.g., 'products').
 * - `all`: A base key for the entire domain.
 * - `lists`: For paginated or filtered lists.
 * - `details`: For individual items.
 * - `(id)`: A function that returns the key for a specific item.
 */

import { SearchRequestParams } from '@/types/api/requests';

export const queryKeys = {
  // --- User & Session ---
  session: {
    all: ['session'] as const,
  },
  user: {
    all: ['user'] as const,
    detail: (id: string) => ['user', 'detail', id] as const,
  },

  // --- Products ---
  products: {
    all: ['products'] as const,
    lists: () => ['products', 'list'] as const,
    list: (filters: Record<string, unknown>) =>
      ['products', 'list', filters] as const,
    details: () => ['products', 'detail'] as const,
    detail: (id: string) => ['products', 'detail', id] as const,
    offers: (id: string) => ['products', 'detail', id, 'offers'] as const,
    priceHistory: (id: string) => ['products', 'detail', id, 'priceHistory'] as const,
    similar: (id: string) => ['products', 'detail', id, 'similar'] as const,
    specifications: (id: string) => ['products', 'detail', id, 'specifications'] as const,
    verifiedSellers: (id: string) => ['products', 'detail', id, 'verifiedSellers'] as const,
    aiSummary: (id: string) => ['products', 'detail', id, 'aiSummary'] as const,
  },

  // --- Search ---
  search: {
    all: ['search'] as const,
    queries: () => ['search', 'queries'] as const,
    query: (params: SearchRequestParams) =>
      ['search', 'queries', params] as const,
    suggestions: (query: string) => ['search', 'suggestions', query] as const,
  },

  // --- Dashboard ---
  dashboard: {
    all: ['dashboard'] as const,
    metrics: () => ['dashboard', 'metrics'] as const,
    insights: () => ['dashboard', 'insights'] as const,
    activity: () => ['dashboard', 'activity'] as const,
  },

  // --- Wishlist ---
  wishlist: {
    all: ['wishlist'] as const,
    lists: (filters: Record<string, unknown> = {}) => ['wishlist', 'list', filters] as const,
  },

  // --- Comparison ---
  compare: {
    all: ['compare'] as const,
    session: (ids: string[]) => ['compare', 'session', ids.sort()] as const,
  },

  // --- Notifications ---
  notifications: {
    all: ['notifications'] as const,
    lists: () => ['notifications', 'list'] as const,
    list: (filters: { unread?: boolean }) =>
      ['notifications', 'list', filters] as const,
    count: () => ['notifications', 'count'] as const,
  },
};

// ── Mutation Keys ────────────────────────────────────────────────────
// We group mutation keys by the data domain they affect.

export const mutationKeys = {
  // --- Auth ---
  auth: {
    login: ['auth', 'login'] as const,
    logout: ['auth', 'logout'] as const,
    register: ['auth', 'register'] as const,
  },

  // --- Wishlist ---
  wishlist: {
    add: ['wishlist', 'add'] as const,
    remove: ['wishlist', 'remove'] as const,
  },

  // --- Notifications ---
  notifications: {
    markRead: ['notifications', 'markRead'] as const,
    markAllRead: ['notifications', 'markAllRead'] as const,
  },
};
