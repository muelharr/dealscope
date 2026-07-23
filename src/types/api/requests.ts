/**
 * Type definitions for API request payloads and parameters.
 */

export interface SearchRequestParams {
  search_query: string;
  category_id?: string;
  brand_id?: string | string[];
  marketplace?: string | string[];
  price_min?: number;
  price_max?: number;
  sort_by?: 'best_deal' | 'price_asc' | 'price_desc' | 'latest';
  sort_order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}
