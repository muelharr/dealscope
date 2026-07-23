/**
 * TanStack Query Optimistic Update Patterns & Helpers
 *
 * This module documents the recommended patterns for implementing optimistic
 * updates and provides placeholder utilities to support them. An optimistic
* update is when we update the UI *before* the API call completes,
 * assuming it will be successful. This makes the UI feel much faster.
 *
 * The core pattern involves three steps within a `useMutation` hook:
 * 1. `onMutate`:
 *    - Cancel any outgoing queries for the data to prevent them from
 *      overwriting our optimistic update.
 *    - Snapshot the previous state.
 *    - Optimistically update the cache to the new state using `setQueryData`.
 *    - Return a context object with the snapshotted state.
 * 2. `onError`:
 *    - If the mutation fails, roll back to the previous state using the
 *      context from `onMutate`.
 * 3. `onSettled`:
 *    - Always refetch the data after the mutation is complete (either
 *      success or error) to ensure the client state is in sync with the
 *      server.
 */

import { QueryClient, QueryKey } from '@tanstack/react-query';

// ── Placeholder Helpers ──────────────────────────────────────────────
// These are conceptual helpers. In a real application, you might create
// more specific, typed hooks or functions for common optimistic updates
// (e.g., `useOptimisticAddToList`, `useOptimisticToggle`).

/**
 * A conceptual helper for adding an item to a list optimistically.
 *
 * @example
 * useMutation({
 *   mutationFn: api.wishlist.add,
 *   onMutate: async (newItem) => {
 *     return await optimisticListUpdate.add(queryClient, queryKeys.wishlist.all, newItem);
 *   },
 *   onError: (err, newItem, context) => {
 *     context?.rollback();
 *   },
 *   onSettled: () => {
 *     queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.all });
 *   },
 * });
 */
export const optimisticListUpdate = {
  add: async <T extends { id: unknown }>(
    queryClient: QueryClient,
    queryKey: QueryKey,
    newItem: T,
  ) => {
    await queryClient.cancelQueries({ queryKey });
    const previousList = queryClient.getQueryData<T[]>(queryKey);
    queryClient.setQueryData<T[]>(queryKey, (old = []) => [...old, newItem]);
    return {
      rollback: () => queryClient.setQueryData(queryKey, previousList),
    };
  },

  remove: async <T extends { id: unknown }>(
    queryClient: QueryClient,
    queryKey: QueryKey,
    itemId: unknown,
  ) => {
    await queryClient.cancelQueries({ queryKey });
    const previousList = queryClient.getQueryData<T[]>(queryKey);
    queryClient.setQueryData<T[]>(queryKey, (old = []) =>
      old.filter((item) => item.id !== itemId),
    );
    return {
      rollback: () => queryClient.setQueryData(queryKey, previousList),
    };
  },
};

/**
 * Cache Strategy Documentation
 *
 * This section serves as documentation for the intended cache strategy.
 * The `staleTime` for each data type determines how long it will be
 * considered "fresh" and served from the cache without a background refetch.
 *
 * Static Data (e.g., Categories, Brands)
 * - staleTime: `Infinity`
 * - explanation: This data rarely changes. We can cache it indefinitely
 *   and manually invalidate it if an admin makes a change.
 *
 * Frequently Changing Data (e.g., Product Prices, Offers)
 * - staleTime: `1 * 60 * 1000` (1 minute)
 * - explanation: This data is volatile. We want to show cached data for a
 *   very short time to improve UX, but refetch frequently to ensure prices
 *   are up-to-date.
 *
 * User Data (e.g., User Profile, Wishlist)
 * - staleTime: `5 * 60 * 1000` (5 minutes)
 * - explanation: This data is specific to the user and only changes when
 *   they take an action. The default 5-minute staleTime is appropriate.
 *   We can invalidate it programmatically after mutations.
 *
 * Notification Data
 * - staleTime: `30 * 1000` (30 seconds)
 * - explanation: We want notifications to feel near-real-time without
 *   implementing polling or websockets yet. A short staleTime ensures the
 *   notification indicator is updated frequently.
 *
 * Comparison & Search Data
 * - staleTime: `0`
 * - explanation: These are typically one-off queries. The user expects
 *   the freshest possible data each time they perform a search or
 *   comparison. We still benefit from caching via `gcTime` if they
 *   navigate away and back quickly.
 */
