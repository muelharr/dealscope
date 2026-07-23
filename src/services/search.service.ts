/**
 * Search Service
 *
 * This service is the single source of truth for all interactions with the
 * backend's search-related endpoints. It encapsulates the logic for building
 * requests, calling the API client, and returning typed, domain-model-aligned
 * responses.
 *
 * It is framework-agnostic and contains no React-specific code.
 */

import { SEARCH } from '@/api/endpoints';
import { QueryParams } from '@/api/request';
import { authApiClient } from '@/auth';
import type { PaginatedResponse } from '@/types/api';
import type { SearchRequestParams } from '@/types/api/requests';
import type { Product } from '@/types/domain';


export interface SearchServiceResponse {
  products: Product[];
  pagination: PaginatedResponse<Product>['pagination'];
}

// ── Service Implementation ───────────────────────────────────────────

class SearchService {
  /**
   * Fetches search results from the API based on a query and filters.
   *
   * @param params - The search request parameters.
   * @returns A promise that resolves to the search results and pagination info.
   */
  public async searchProducts(
    params: SearchRequestParams,
  ): Promise<SearchServiceResponse> {
    // The ApiClient's `request` method automatically handles building the
    // query string from the `params` object, so we don't need to do it
    // manually. This keeps the code clean and avoids string concatenation.
    const { data: apiResponse } = await authApiClient.get<
      PaginatedResponse<Product>
    >(SEARCH.QUERY, {
      params: params as unknown as QueryParams,
    });

    // For now, we assume the API's `Product` model matches our domain model.
    // If there were differences (e.g., snake_case vs. camelCase), this is
    // where the mapping/transformation would occur. For example:
    // const products = apiResponse.data.map(mapProductDtoToDomain);
    const products = apiResponse.data;

    // The service returns a clean, predictable object, separating the
    // list of products from the pagination metadata.
    return {
      products,
      pagination: apiResponse.pagination,
    };
  }

  /**
   * Fetches search suggestions from the API.
   * (Placeholder for future implementation)
   *
   * @param query - The partial search query.
   * @returns A promise that resolves to a list of suggestion strings.
   */
  public async getSearchSuggestions(query: string): Promise<string[]> {
    if (!SEARCH.SUGGESTIONS) {
      console.warn('Search suggestions endpoint is not defined.');
      return Promise.resolve([]);
    }

    const { data: suggestions } = await authApiClient.get<string[]>(
      SEARCH.SUGGESTIONS,
      {
        params: { q: query },
      },
    );

    return suggestions;
  }
}

// ── Singleton Instance ───────────────────────────────────────────────
// We export a singleton instance of the service to be used throughout the app.

export const searchService = new SearchService();
