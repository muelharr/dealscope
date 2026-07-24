export interface StatisticsDto {
  platformMetrics: {
    totalProducts: number;
    totalMarketplaces: number;
    totalOffers: number;
    averagePlatformDiscount: number | null;
  };
  userActivity: {
    totalUsers: number;
    activeAlerts: number;
    totalWishlistItems: number;
  };
  priceInsights: {
    priceDropsLast24Hours: number;
    priceDropsLast7Days: number;
    lowestPriceProducts: Array<{
      productId: string;
      productName: string;
      currentPrice: number;
      marketplaceName: string;
    }>;
  };
}

export interface StatisticsResponseDto {
  success: boolean;
  data: StatisticsDto;
  duration: number;
}

export interface ProductAnalyticsDto {
  timeRange: {
    from: string;
    to: string;
  };
  mostTrackedProducts: Array<{
    productId: string;
    productName: string;
    wishlistCount: number;
  }>;
  priceVolatility: Array<{
    productId: string;
    productName: string;
    averagePrice: number | null;
    minPrice: number | null;
    maxPrice: number | null;
    volatility: number | null;
  }>;
  categoryPopularity: Array<{
    categoryId: string;
    categoryName: string;
    productCount: number;
  }>;
}

export interface ProductAnalyticsResponseDto {
  success: boolean;
  data: ProductAnalyticsDto;
  duration: number;
}

export interface MarketplaceAnalyticsDto {
  timeRange: {
    from: string;
    to: string;
  };
  marketplaceDistribution: Array<{
    marketplaceId: string;
    marketplaceName: string;
    offerCount: number;
    percentage: number;
  }>;
  averageDiscountByMarketplace: Array<{
    marketplaceId: string;
    marketplaceName: string;
    averageDiscount: number | null;
    offerCount: number;
  }>;
}

export interface MarketplaceAnalyticsResponseDto {
  success: boolean;
  data: MarketplaceAnalyticsDto;
  duration: number;
}
