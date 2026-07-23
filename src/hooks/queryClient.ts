/**
 * Global TanStack Query client.
 *
 * This module creates and configures a single, global instance of the
 * QueryClient to be used throughout the application. Default options
 * are set here to ensure consistency and follow best practices.
 */

import { QueryClient, QueryClientConfig } from '@tanstack/react-query';
import { ApiClientError } from '@/api';

// ── Production Best Practices ────────────────────────────────────────
// We configure the QueryClient with sensible defaults for a production
// environment. These options are chosen to optimize for performance,
// reduce unnecessary network requests, and provide a good user experience.

const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      /**
       * `staleTime`: The time in milliseconds after data is considered stale.
       * A stale query will be refetched in the background on the next mount,
       * window focus, or reconnect.
       *
       * Default: `5 * 60 * 1000` (5 minutes)
       * We choose 5 minutes as a reasonable default for most data. This means
       * that for 5 minutes, the same query will return cached data without
       * triggering a background refetch, reducing network traffic for data
       * that doesn't change too frequently. Specific queries can override
       * this as needed (e.g., for real-time data).
       */
      staleTime: 5 * 60 * 1000,

      /**
       * `gcTime` (Garbage Collection Time): The time in milliseconds
       * that inactive queries are kept in the cache. Once a query becomes
       * inactive (no active observers), it will be garbage collected after
       * this time.
       *
       * Default: `15 * 60 * 1000` (15 minutes)
       * We set this longer than `staleTime` to allow users to navigate away
       * and come back to a page and still have the data available instantly,
       * even if it's stale. This improves perceived performance.
       */
      gcTime: 15 * 60 * 1000,

      /**
       * Global error handling via the `retry` option.
       * We don't want to retry on certain HTTP status codes that indicate
       * a permanent error (e.g., 404 Not Found, 401 Unauthorized).
       */
      retry: (failureCount: number, error: unknown) => {
        if (error instanceof ApiClientError) {
          // Do not retry on client-side errors
          if (error.status >= 400 && error.status < 500) {
            return false;
          }
        }
        // Otherwise, retry up to 3 times
        return failureCount < 3;
      },

      /**
       * `retryDelay`: The delay between retries.
       *
       * Default: `(attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)`
       * This is an exponential backoff strategy that prevents overwhelming
       * the server with rapid-fire retries. It starts with a 1s delay and
       * doubles with each attempt, capped at 30s.
       */
      retryDelay: (attemptIndex: number) =>
        Math.min(1000 * 2 ** attemptIndex, 30000),

      /**
       * `refetchOnWindowFocus`: Whether to refetch on window focus.
       *
       * Default: `true` (in development), `false` (in production)
       * In development, it's useful for seeing updates immediately. In
       * production, this can lead to excessive refetching, so we disable it.
       * Important data can opt-in to this behavior.
       */
      refetchOnWindowFocus: process.env.NODE_ENV === 'development',

      /**
       * `refetchOnReconnect`: Whether to refetch on network reconnect.
       *
       * Default: `true`
       * This is a good default as data may have changed while the user
       * was offline.
       */
      refetchOnReconnect: true,

      /**
       * `refetchOnMount`: Whether to refetch on component mount.
       *
       * Default: `true`
       * If a query is stale, it will be refetched on mount. This ensures
       * data is kept reasonably fresh.
       */
      refetchOnMount: true,

    },
    mutations: {
      /**
       * `networkMode`: 'online'
       * This ensures mutations only run when the network is available,
       * preventing errors when a user tries to perform an action while offline.
       * Optimistic updates can provide an offline UI, but the actual mutation
       * will wait for connectivity.
       */
      networkMode: 'online',
    },
  },
};

export const queryClient = new QueryClient(queryClientConfig);
