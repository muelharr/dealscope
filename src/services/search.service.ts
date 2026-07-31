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
      logoUrl?: string;
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

    const products: Product[] = rawItems
      .map((item): Product | null => {
        // Only the canonical `productSummary` shape is a real search result.
        // Items without it are not representable as a Product and are dropped
        // rather than padded with fabricated defaults.
        if (!item.productSummary) return null;

        const summary = item.productSummary;
        const offer = item.bestOffer;
        const marketplaceName = offer?.marketplaceName ?? offer?.marketplace?.name ?? null;

        return {
          id: summary.id,
          name: summary.name,
          slug: summary.slug,
          description: summary.description ?? '',
          images: summary.images ?? [],
          // Surface real backend values only — no fabricated fallbacks.
          dealScore: summary.dealScore,
          rating: summary.rating,
          reviewCount: summary.reviewCount,
          createdAt: summary.createdAt ?? new Date().toISOString(),
          updatedAt: summary.updatedAt ?? new Date().toISOString(),
          offers: offer
              ? [
                {
                  id: offer.id ?? `offer-${summary.id}`,
                  productId: summary.id,
                  price: offer.price,
                  originalPrice: offer.originalPrice,
                  currency: offer.currency ?? 'IDR',
                  stockStatus: offer.stockStatus ?? 'IN_STOCK',
                  productUrl: offer.productUrl ?? '',
                  updatedAt: new Date().toISOString(),
                  marketplace: {
                    id: offer.marketplaceId ?? '',
                    name: marketplaceName ?? '',
                    logoUrl: offer.marketplace?.logoUrl ?? '',
                    url: offer.productUrl ?? '',
                  },
                },
              ]
            : [],
        };
      })
      .filter((p): p is Product => p !== null);

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
