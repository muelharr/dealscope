/**
 * Search Service
 *
 * Encapsulates search requests and transforms backend search DTOs to Product domain models.
 */

import { SEARCH } from '@/api/endpoints';
import { QueryParams } from '@/api/request';
import { authApiClient } from '@/auth';
import type { SearchRequestParams } from '@/types/api/requests';
import type { Product } from '@/types/domain';

export interface SearchServiceResponse {
  products: Product[];
  pagination: {
    total: number;
    currentPage: number;
    totalPages: number;
    perPage: number;
  };
}

interface RawSearchItem {
  productSummary?: {
    id: string;
    name: string;
    slug: string;
    description: string;
    images?: string[];
    dealScore?: number;
    rating?: number;
    reviewCount?: number;
    createdAt?: string;
    updatedAt?: string;
  };
  bestOffer?: {
    id?: string;
    marketplaceId?: string;
    marketplaceName?: string;
    price: number;
    originalPrice?: number;
    currency?: string;
    stockStatus?: string;
    productUrl?: string;
    marketplace?: {
      name?: string;
    };
  };
  availableOfferCount?: number;
  lowestHistoricalPrice?: number;
  currentTrendIndicator?: string;
  id?: string;
  name?: string;
  slug?: string;
  description?: string;
  images?: string[];
  offers?: unknown[];
}

interface BodyWrapper {
  data?: RawSearchItem[];
  items?: RawSearchItem[];
  pagination?: {
    total?: number;
    page?: number;
    currentPage?: number;
    limit?: number;
    perPage?: number;
    totalPages?: number;
  };
}

class SearchService {
  public async searchProducts(
    params: SearchRequestParams,
  ): Promise<SearchServiceResponse> {
    const queryParams: Record<string, unknown> = {};

    if (params.search_query && params.search_query.trim() !== '') {
      queryParams.q = params.search_query;
    }
    if (params.price_min !== undefined) queryParams.minPrice = String(params.price_min);
    if (params.price_max !== undefined) queryParams.maxPrice = String(params.price_max);
    if (params.page !== undefined) queryParams.page = String(params.page);

    if (params.sort_by) {
      if (params.sort_by === 'best_deal') queryParams.sortBy = 'dealScore';
      else if (params.sort_by === 'price_asc') { queryParams.sortBy = 'price'; queryParams.sortOrder = 'asc'; }
      else if (params.sort_by === 'price_desc') { queryParams.sortBy = 'price'; queryParams.sortOrder = 'desc'; }
      else if (params.sort_by === 'latest') queryParams.sortBy = 'newest';
      else queryParams.sortBy = params.sort_by;
    }

    if (params.marketplace && (Array.isArray(params.marketplace) ? params.marketplace.length > 0 : Boolean(params.marketplace))) {
      queryParams.marketplace = Array.isArray(params.marketplace) ? params.marketplace.join(',') : params.marketplace;
    }
    if (params.brand_id && (Array.isArray(params.brand_id) ? params.brand_id.length > 0 : Boolean(params.brand_id))) {
      queryParams.brand = Array.isArray(params.brand_id) ? params.brand_id.join(',') : params.brand_id;
    }

    const { data: res } = await authApiClient.get<unknown>(SEARCH.QUERY, {
      params: queryParams as unknown as QueryParams,
    });

    const obj = res as Record<string, unknown>;
    const body = (obj.data || obj) as RawSearchItem[] | BodyWrapper;

    let rawItems: RawSearchItem[] = [];
    if (Array.isArray(body)) {
      rawItems = body;
    } else if (body && typeof body === 'object') {
      if (Array.isArray(body.data)) rawItems = body.data;
      else if (Array.isArray(body.items)) rawItems = body.items;
    }

    const products: Product[] = rawItems.map((item) => {
      if (item.productSummary) {
        const primaryPrice = item.bestOffer?.price ?? 0;
        const originalPrice = item.bestOffer?.originalPrice ?? (primaryPrice > 0 ? primaryPrice * 1.15 : 0);
        const marketplaceName = item.bestOffer?.marketplaceName || item.bestOffer?.marketplace?.name || 'Verified Seller';

        return {
          id: item.productSummary.id,
          name: item.productSummary.name,
          slug: item.productSummary.slug,
          description: item.productSummary.description || '',
          images: item.productSummary.images || [],
          dealScore: item.productSummary.dealScore || 85,
          rating: item.productSummary.rating || 4.5,
          reviewCount: item.productSummary.reviewCount || 0,
          createdAt: item.productSummary.createdAt || new Date().toISOString(),
          updatedAt: item.productSummary.updatedAt || new Date().toISOString(),
          offers: item.bestOffer
            ? [
                {
                  id: item.bestOffer.id || `offer-${item.productSummary.id}`,
                  productId: item.productSummary.id,
                  marketplaceId: item.bestOffer.marketplaceId || 'mp-1',
                  price: primaryPrice,
                  originalPrice,
                  currency: item.bestOffer.currency || 'USD',
                  stockStatus: item.bestOffer.stockStatus || 'IN_STOCK',
                  productUrl: item.bestOffer.productUrl || '#',
                  isActive: true,
                  lastScrapedAt: new Date().toISOString(),
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  marketplace: {
                    id: item.bestOffer.marketplaceId || 'mp-1',
                    name: marketplaceName,
                    code: 'OFFICIAL',
                    logoUrl: '',
                    isActive: true,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                  },
                },
              ]
            : [],
        } as unknown as Product;
      }

      return {
        id: item.id || 'prod-unknown',
        name: item.name || 'Product',
        slug: item.slug || 'product',
        description: item.description || '',
        images: item.images || [],
        dealScore: 80,
        rating: 4.5,
        reviewCount: 10,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        offers: (item.offers as unknown[]) || [],
      } as unknown as Product;
    });

    const metaObj = (obj.meta as Record<string, unknown>)?.pagination as Record<string, number> | undefined;
    const bodyPagination = !Array.isArray(body) ? body?.pagination : undefined;

    const total = metaObj?.total ?? bodyPagination?.total ?? products.length;
    const page = metaObj?.page ?? metaObj?.currentPage ?? bodyPagination?.page ?? bodyPagination?.currentPage ?? 1;
    const limit = metaObj?.limit ?? metaObj?.perPage ?? bodyPagination?.limit ?? bodyPagination?.perPage ?? 10;
    const totalPages = metaObj?.totalPages ?? bodyPagination?.totalPages ?? 1;

    return {
      products,
      pagination: {
        total,
        currentPage: page,
        totalPages,
        perPage: limit,
      },
    };
  }

  public async getSearchSuggestions(query: string): Promise<string[]> {
    try {
      const { data: res } = await authApiClient.get<unknown>(SEARCH.SUGGESTIONS, {
        params: { q: query },
      });
      const obj = res as Record<string, unknown>;
      if (Array.isArray(obj.data)) return obj.data as string[];
      if (Array.isArray(res)) return res as string[];
      return [];
    } catch {
      return [];
    }
  }
}

export const searchService = new SearchService();
