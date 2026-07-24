import { ResolvedBestOffer } from '../../shared/utils/pricingResolver';

export interface CreateAlertRequest {
  productId: string;
  targetPrice?: number;
  targetDiscountPercentage?: number;
}

export interface UpdateAlertRequest {
  targetPrice?: number | null;
  targetDiscountPercentage?: number | null;
  isEnabled?: boolean;
}

export interface PriceAlertProductSummary {
  id: string;
  name: string;
  slug: string;
  images: string[];
  rating: number;
  reviewCount: number;
  dealScore: number;
}

export interface PriceAlertResponseDto {
  id: string;
  userId: string;
  productId: string;
  targetPrice: number | null;
  targetDiscountPercentage: number | null;
  isEnabled: boolean;
  lastTriggeredAt: string | null;
  createdAt: string;
  updatedAt: string;
  productSummary: PriceAlertProductSummary;
  bestOffer: ResolvedBestOffer | null;
  currentPrice: number | null;
  currentDiscount: number | null;
  lowestHistoricalPrice: number | null;
  trendIndicator: 'up' | 'down' | 'flat';
}
