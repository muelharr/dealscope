import { StockStatus } from '@prisma/client';

export interface ComparisonProductSummary {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  images: string[];
  dealScore: number;
  rating: number;
  reviewCount: number;
}

export interface ComparisonBestOffer {
  marketplace: string;
  price: number;
  originalPrice: number;
  shippingCost: number;
  effectivePrice: number;
  discountPercentage: number;
  officialStore: boolean;
  stockStatus: StockStatus;
}

export interface ComparisonProductDto {
  productSummary: ComparisonProductSummary;
  bestOffer: ComparisonBestOffer | null;
  lowestHistoricalPrice: number | null;
  highestHistoricalPrice: number | null;
  trendIndicator: 'up' | 'down' | 'flat';
  marketplaceCount: number;
}

export interface ComparisonResponseDto {
  products: ComparisonProductDto[];
  summary: {
    cheapestProductId: string | null;
    highestDiscountProductId: string | null;
    highestDealScoreProductId: string | null;
    bestRatedProductId: string | null;
  };
  meta: {
    comparisonCount: number;
  };
}
