/**
 * Default options for TanStack Query hooks.
 *
 * This module provides pre-configured sets of options that can be
 * spread into `useQuery` or `useMutation` hooks to apply consistent
 * caching and behavior based on the type of data being fetched.
 */



/**
 * Options for data that is considered static and rarely changes.
 * e.g., lists of categories, brands, etc.
 */
export const staticDataQueryOptions = {
  staleTime: Infinity,
  gcTime: Infinity, // Keep it in cache forever until manually invalidated
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
} as const;

/**
 * Options for data that changes frequently.
 * e.g., product prices, stock availability.
 */
export const volatileDataQueryOptions = {
  staleTime: 1 * 60 * 1000, // 1 minute
  refetchOnWindowFocus: true, // Always check for fresh data on focus
} as const;

/**
 * Options for data specific to the authenticated user.
 * e.g., user profile, wishlist, notification preferences.
 */
export const userDataQueryOptions = {
  staleTime: 5 * 60 * 1000, // 5 minutes (default)
  retry: 1, // Don't retry user-specific data too aggressively
} as const;

/**
 * Options for data that should always be fresh.
 * e.g., search results, comparison results.
 */
export const freshDataQueryOptions = {
  staleTime: 0,
} as const;

/**
 * Authentication Integration:
 *
 * How QueryClient and the auth layer work together.
 *
 * 1. `authApiClient`: All authenticated queries will use the `authApiClient`
 *    which automatically injects the auth token.
 *
 * 2. `onUnauthorized` Retry: The `authApiClient` is configured to catch 401s
 *    and trigger a token refresh. TanStack Query's retry mechanism will then
 *    automatically re-run the failed query with the new token.
 *
 * 3. Clearing Cache on Logout:
 *    When a user logs out, we must clear all cached data to prevent a new
 *    user from seeing the previous user's information.
 *
 *    @example
 *    const { logout } = useAuth();
 *    const queryClient = useQueryClient();
 *
 *    const handleLogout = async () => {
 *      await logout();
 *      // This will clear all query data and force a refetch for the new
 *      // (guest) user.
 *      queryClient.clear();
 *    };
 *
 * 4. User Query Invalidation:
 *    When a user logs in, we should invalidate any queries that depend on
 *    their authentication state to ensure fresh data is fetched.
 *
 *    @example
 *    const { login } = useAuth();
 *    const queryClient = useQueryClient();
 *
 *    const handleLogin = async (credentials) => {
 *      await login(credentials);
 *      // Invalidate all queries to refetch data for the authenticated user.
 *      // A more granular approach could target specific keys.
 *      queryClient.invalidateQueries();
 *    };
 */
