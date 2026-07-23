/**
 * Product Service
 *
 * Fetches all detailed product information including price history, offers,
 * specifications, similar products, verified sellers, and AI summaries.
 */

import { authApiClient } from '@/auth';
import { PRODUCTS } from '@/api/endpoints';
import type { ApiResponse } from '@/types/api';
import type {
  Product,
  MarketplaceOffer,
  PriceHistory,
  SpecificationGroup,
  VerifiedSeller,
  AISummary,
} from '@/types/domain';

class ProductService {
  /**
   * Fetches core details for a single product.
   */
  public async getProduct(id: string): Promise<Product> {
    const { data: response } = await authApiClient.get<ApiResponse<Product>>(
      PRODUCTS.DETAIL(id)
    );
    return response.data;
  }

  /**
   * Fetches live offers from various marketplaces for a product.
   */
  public async getMarketplaceOffers(id: string): Promise<MarketplaceOffer[]> {
    const { data: response } = await authApiClient.get<ApiResponse<MarketplaceOffer[]>>(
      PRODUCTS.OFFERS(id)
    );
    return response.data;
  }

  /**
   * Fetches historical pricing data for a product.
   */
  public async getPriceHistory(id: string): Promise<PriceHistory> {
    const { data: response } = await authApiClient.get<ApiResponse<PriceHistory>>(
      PRODUCTS.PRICE_HISTORY(id)
    );
    return response.data;
  }

  /**
   * Fetches alternative similar products in the same category.
   */
  public async getSimilarProducts(id: string): Promise<Product[]> {
    const { data: response } = await authApiClient.get<ApiResponse<Product[]>>(
      PRODUCTS.SIMILAR(id)
    );
    return response.data;
  }

  /**
   * Fetches technical specifications for a product.
   */
  public async getSpecifications(id: string): Promise<SpecificationGroup[]> {
    const { data: response } = await authApiClient.get<ApiResponse<SpecificationGroup[]>>(
      PRODUCTS.SPECIFICATIONS(id)
    );
    return response.data;
  }

  /**
   * Fetches list of verified marketplace sellers selling the product.
   */
  public async getVerifiedSellers(id: string): Promise<VerifiedSeller[]> {
    const { data: response } = await authApiClient.get<ApiResponse<VerifiedSeller[]>>(
      PRODUCTS.VERIFIED_SELLERS(id)
    );
    return response.data;
  }

  /**
   * Fetches AI-generated summary, verdict, and insights for a product.
   */
  public async getAISummary(id: string): Promise<AISummary> {
    const { data: response } = await authApiClient.get<ApiResponse<AISummary>>(
      PRODUCTS.AI_SUMMARY(id)
    );
    return response.data;
  }
}

export const productService = new ProductService();
