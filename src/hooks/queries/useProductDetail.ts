"use client";

import { useQuery, useQueries, UseQueryResult } from '@tanstack/react-query';
import { productService } from '@/services/product.service';
import { queryKeys } from '@/hooks/queryKeys';
import { userDataQueryOptions, volatileDataQueryOptions } from '@/hooks/queryDefaults';
import type {
  Product,
  MarketplaceOffer,
  PriceHistory,
  SpecificationGroup,
  VerifiedSeller,
  AISummary,
} from '@/types/domain';
import type { ApiClientError } from '@/api';

export type QueryResource<T> = UseQueryResult<T, ApiClientError>;

export interface UseProductDetailResult {
  primaryProduct: QueryResource<Product>;
  offers: QueryResource<MarketplaceOffer[]>;
  priceHistory: QueryResource<PriceHistory>;
  similarProducts: QueryResource<Product[]>;
  specifications: QueryResource<SpecificationGroup[]>;
  verifiedSellers: QueryResource<VerifiedSeller[]>;
  aiSummary: QueryResource<AISummary>;
  isInitialLoading: boolean;
}

export function useProductDetail(id: string): UseProductDetailResult {
  // 1. Fetch Primary Product (Critical Path)
  const primaryProductQuery = useQuery<Product, ApiClientError, Product>({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => productService.getProduct(id),
    ...userDataQueryOptions,
  });

  const isPrimarySuccess = primaryProductQuery.status === 'success';

  // 2. Fetch Secondary Dependent Resources (Parallel, enabled only when primary succeeds)
  const [
    offersQuery,
    priceHistoryQuery,
    similarProductsQuery,
    specificationsQuery,
    verifiedSellersQuery,
    aiSummaryQuery,
  ] = useQueries({
    queries: [
      {
        queryKey: queryKeys.products.offers(id),
        queryFn: () => productService.getMarketplaceOffers(id),
        enabled: isPrimarySuccess,
        ...volatileDataQueryOptions,
      },
      {
        queryKey: queryKeys.products.priceHistory(id),
        queryFn: () => productService.getPriceHistory(id),
        enabled: isPrimarySuccess,
        ...volatileDataQueryOptions,
      },
      {
        queryKey: queryKeys.products.similar(id),
        queryFn: () => productService.getSimilarProducts(id),
        enabled: isPrimarySuccess,
        ...userDataQueryOptions,
      },
      {
        queryKey: queryKeys.products.specifications(id),
        queryFn: () => productService.getSpecifications(id),
        enabled: isPrimarySuccess,
        ...userDataQueryOptions,
      },
      {
        queryKey: queryKeys.products.verifiedSellers(id),
        queryFn: () => productService.getVerifiedSellers(id),
        enabled: isPrimarySuccess,
        ...userDataQueryOptions,
      },
      {
        queryKey: queryKeys.products.aiSummary(id),
        queryFn: () => productService.getAISummary(id),
        enabled: isPrimarySuccess,
        ...userDataQueryOptions,
      },
    ],
  });

  // isInitialLoading is derived ONLY from the primary product loading state.
  // Once the primary product is loaded, the page structure renders, and each widget handles
  // its own independent loading state.
  const isInitialLoading = primaryProductQuery.isLoading;

  return {
    primaryProduct: primaryProductQuery as QueryResource<Product>,
    offers: offersQuery as QueryResource<MarketplaceOffer[]>,
    priceHistory: priceHistoryQuery as QueryResource<PriceHistory>,
    similarProducts: similarProductsQuery as QueryResource<Product[]>,
    specifications: specificationsQuery as QueryResource<SpecificationGroup[]>,
    verifiedSellers: verifiedSellersQuery as QueryResource<VerifiedSeller[]>,
    aiSummary: aiSummaryQuery as QueryResource<AISummary>,
    isInitialLoading,
  };
}
