export interface ScrapedProduct {
  name: string;
  url: string;
  price: number;
  originalPrice?: number;
  imageUrl?: string;
  seller?: string;
  rating?: number;
  reviewCount?: number;
  marketplaceSlug: string;
  inStock?: boolean;
  specifications?: Record<string, string>;
}

export interface ScrapedProductDetail {
  name: string;
  description?: string;
  url: string;
  images: string[];
  price: number;
  originalPrice?: number;
  seller: string;
  rating?: number;
  reviewCount?: number;
  inStock: boolean;
  specifications?: Record<string, string>;
  isOfficialStore?: boolean;
  marketplaceSlug: string;
}

export interface ScrapedPrice {
  url: string;
  price: number;
  originalPrice?: number;
  inStock: boolean;
  currency: string;
  timestamp: Date;
}

export interface ScrapeJobData {
  type: 'full_product' | 'price_only' | 'search_discovery';
  productId?: string;
  offerId?: string;
  url?: string;
  marketplaceSlug?: string;
  query?: string;
  page?: number;
}

export interface ProviderStats {
  provider: string;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  blockedRequests: number;
  successRate: number;
  lastScrapedAt?: string;
}

export interface ScraperStatusResponse {
  status: 'healthy' | 'degraded' | 'error';
  queueStats: {
    waiting: number;
    active: number;
    completed: number;
    failed: number;
    delayed: number;
  };
  providers: Record<string, ProviderStats>;
  alerts: string[];
}
