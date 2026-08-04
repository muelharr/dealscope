import { MarketplaceOffer } from './MarketplaceOffer';

export interface PriceAlert {
  id: string;
  userId: string;
  productId: string;
  targetPrice: number | null;
  targetDiscountPercentage: number | null;
  isEnabled: boolean;
  lastTriggeredAt: string | null;
  createdAt: string;
  updatedAt: string;
  productSummary?: {
    id: string;
    name: string;
    slug: string;
    images: string[];
    rating: number;
    reviewCount: number;
    dealScore: number;
  };
  bestOffer?: MarketplaceOffer | null;
  currentPrice?: number | null;
  currentDiscount?: number | null;
  lowestHistoricalPrice?: number | null;
  trendIndicator?: string | null;
}
