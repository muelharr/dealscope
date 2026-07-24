import { PriceHistory, Currency, StockStatus } from '@prisma/client';

export type HistoryWithRelations = PriceHistory & {
  marketplaceOffer?: {
    id: string;
    productUrl: string;
    marketplace: {
      id: string;
      name: string;
      slug: string;
    };
  };
};

export interface HistoryResponse {
  id: string;
  marketplaceOfferId: string;
  productId: string;
  price: number;
  originalPrice: number;
  shippingCost: number;
  currency: Currency;
  stockStatus: StockStatus;
  marketplaceRating: number | null;
  reviewCount: number;
  recordedAt: string;
  marketplaceOffer?: {
    id: string;
    productUrl: string;
    marketplace: {
      id: string;
      name: string;
      slug: string;
    };
  };
}

export interface PriceExtremeResponse {
  price: number;
  recordedAt: string;
  marketplaceOfferId: string;
  marketplaceName: string;
}

export interface PriceTrendResponse {
  currentPrice: number;
  previousPrice: number;
  direction: 'up' | 'down' | 'flat';
  changeAmount: number;
  changePercentage: number;
}

export interface HistoryQueryFilters {
  page: number;
  limit: number;
  from?: Date;
  to?: Date;
}
