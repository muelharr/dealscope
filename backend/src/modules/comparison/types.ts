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

export interface ComparisonPricePoint {
  date: string;
  price: number;
}

export interface ComparisonPriceSeriesDto {
  productId: string;
  name: string;
  color: string;
  points: ComparisonPricePoint[];
}

export interface ComparisonAIInsightDto {
  id: string;
  title: string;
  description: string;
}

export interface ComparisonAIRecommendationDto {
  winner: string;
  confidence: number;
  summary: string;
  insights: ComparisonAIInsightDto[];
}

export interface ComparisonMarketplaceOfferDto {
  productId: string;
  variantName: string;
  price: number;
  availability: string;
  availabilityType: 'positive' | 'warning' | 'critical';
  actionLabel: string;
}

export interface ComparisonMarketplaceDto {
  id: string;
  marketplace: string;
  seller: string;
  iconName: 'cart' | 'store' | 'shipping';
  offers: ComparisonMarketplaceOfferDto[];
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
  priceSeries: ComparisonPriceSeriesDto[];
  aiRecommendation: ComparisonAIRecommendationDto;
  marketplaceComparisons: ComparisonMarketplaceDto[];
}
