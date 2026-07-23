/**
 * TanStack Query hook for searching products.
 *
 * This hook is the single source of truth for fetching, caching, and managing
 * the state of product search results from the backend. It encapsulates all
 * the data-fetching logic, exposing a simple, clean interface to the UI.
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import {
  searchService,
  SearchServiceResponse,
} from '@/services/search.service';
import { SearchRequestParams } from '@/types/api/requests';
import { queryKeys } from '@/hooks/queryKeys';
import { freshDataQueryOptions } from '@/hooks/queryDefaults';
import { ApiClientError } from '@/api';

/**
 * Custom hook to fetch and manage product search results.
 *
 * @param params - The search request parameters, including query, filters, and pagination.
 * @param enabled - Whether the query should be enabled to run. Defaults to `true`.
 *
 * @returns An object containing the query state, including the fetched products,
 *          pagination metadata, loading/error states, and a refetch function.
 */
export const useSearchProducts = (
  params: SearchRequestParams,
  enabled = true,
) => {
  const query = useQuery<
    SearchServiceResponse,
    ApiClientError,
    SearchServiceResponse
  >({
    /**
     * `queryKey`: We use the centralized key factory to create a unique key
     * for this specific set of search parameters. TanStack Query uses this key
     * for caching. If `params` changes, the key changes, and a new query is
     * triggered.
     */
    queryKey: queryKeys.search.query(params),

    /**
     * `queryFn`: The function that performs the data fetching. It calls our
     * type-safe service method. We use an arrow function to pass the `params`
     * to the service.
     */
    queryFn: () => searchService.searchProducts(params),

    /**
     * `enabled`: This flag controls whether the query runs automatically.
     * We can use it to prevent a search from running if the query string is empty.
     */
    enabled,

    /**
     * `...freshDataQueryOptions`: We spread the default options for "fresh"
     * data, which sets `staleTime` to 0. This ensures that every time this
     * hook mounts with the same parameters, it will show cached data but
     * immediately trigger a background refetch for the latest results.
     */
    ...freshDataQueryOptions,
  });

  return {
    /**
     * `products`: The array of `Product` objects from the API.
     * We default to an empty array to prevent UI errors during the initial load.
     */
    products: query.data?.products ?? [],
    /**
     * `pagination`: The pagination metadata from the API.
     */
    pagination: query.data?.pagination,
    /**
     * `isLoading`: `true` only on the initial fetch for a new query key,
     * when no cached data is available. The UI should show a skeleton loader.
     */
    isLoading: query.isLoading,
    /**
     * `isFetching`: `true` whenever a request is in-flight, including initial
     * load and background refetches. The UI can show a subtle loading indicator.
     */
    isFetching: query.isFetching,
    /**
     * `isError`: `true` if the query has failed.
     */
    isError: query.isError,
    /**
     * `error`: The `ApiClientError` object if the query failed.
     */
    error: query.error,
    /**
     * `refetch`: A function to manually trigger a refetch of the query.
     */
    refetch: query.refetch,
    /**
     * `status`: The detailed status of the query ('pending', 'success', 'error').
     */
    status: query.status,
    /**
     * `isSuccess`: `true` if the query has completed successfully.
     */
    isSuccess: query.isSuccess,
  };
};

/**
 * Future Compatibility with `useInfiniteQuery`:
 *
 * This hook is structured to be easily migrated to `useInfiniteQuery` for
 * "Load More" style pagination without major changes to the consuming UI.
 *
 * The migration would look like this:
 *
 * 1. Change `useQuery` to `useInfiniteQuery`.
 * 2. Update the `queryFn` to accept a `pageParam`.
 *    - `queryFn: ({ pageParam = 1 }) => searchService.searchProducts({ ...params, page: pageParam })`
 * 3. Add a `getNextPageParam` function.
 *    - `getNextPageParam: (lastPage) => lastPage.pagination.currentPage < lastPage.pagination.totalPages ? lastPage.pagination.currentPage + 1 : undefined`
 * 4. Add an `initialPageParam` of `1`.
 * 5. The returned `data` would now be an object with `pages` and `pageParams` arrays.
 *    - We would use `flatMap` to merge the pages into a single `products` array for the UI.
 *    - `products: data?.pages.flatMap((page) => page.products) ?? []`
 * 6. The hook would also return `fetchNextPage`, `hasNextPage`, etc.
 *
 * Because the core return shape (`products`, `isLoading`, etc.) remains the same,
 * the UI components would require minimal changes.
 */
