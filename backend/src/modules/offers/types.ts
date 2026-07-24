import { MarketplaceOffer, Marketplace, Currency, StockStatus } from '@prisma/client';

export type OfferWithRelations = MarketplaceOffer & {
  marketplace: Marketplace;
  product?: {
    id: string;
    name: string;
    slug: string;
  };
};

export interface OfferResponse {
  id: string;
  productId: string;
  marketplaceId: string;
  sellerId: string | null;
  productUrl: string;
  price: number;
  originalPrice: number;
  currency: Currency;
  stockStatus: StockStatus;
  shippingCost: number;
  shippingEstimate: string | null;
  marketplaceRating: number | null;
  reviewCount: number;
  isOfficialStore: boolean;
  isActive: boolean;
  lastScrapedAt: string;
  marketplace?: {
    id: string;
    name: string;
    slug: string;
  };
  product?: {
    id: string;
    name: string;
    slug: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateOfferRequest {
  productId: string;
  marketplaceId: string;
  sellerId?: string | null;
  productUrl: string;
  price: number;
  originalPrice: number;
  currency: Currency;
  stockStatus: StockStatus;
  shippingCost?: number;
  shippingEstimate?: string | null;
  marketplaceRating?: number | null;
  reviewCount?: number;
  isOfficialStore?: boolean;
}

export interface UpdateOfferRequest {
  sellerId?: string | null;
  productUrl?: string;
  price?: number;
  originalPrice?: number;
  currency?: Currency;
  stockStatus?: StockStatus;
  shippingCost?: number;
  shippingEstimate?: string | null;
  marketplaceRating?: number | null;
  reviewCount?: number;
  isOfficialStore?: boolean;
  isActive?: boolean;
}

export interface OfferQueryFilters {
  page: number;
  limit: number;
  marketplace?: string;
  minimumPrice?: number;
  maximumPrice?: number;
  officialStore?: boolean;
  stockStatus?: StockStatus;
  minimumRating?: number;
  productId?: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}
