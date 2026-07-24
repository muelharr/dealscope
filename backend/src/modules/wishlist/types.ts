import { StockStatus } from '@prisma/client';

export interface WishlistItemDto {
  id: string;
  productId: string;
  targetPrice: number | null;
  createdAt: string;
  product: {
    id: string;
    name: string;
    slug: string;
    description: string;
    images: string[];
    dealScore: number;
    rating: number;
    reviewCount: number;
    category: {
      id: string;
      name: string;
      slug: string;
    };
    brand: {
      id: string;
      name: string;
      slug: string;
    };
    bestOffer: {
      id: string;
      price: number;
      originalPrice: number;
      shippingCost: number;
      effectivePrice: number;
      discountPercentage: number;
      stockStatus: StockStatus;
      isOfficialStore: boolean;
      marketplace: {
        id: string;
        name: string;
        logoUrl: string | null;
      };
    } | null;
    availableOfferCount: number;
    priceDropAmount: number;
    hasPriceDrop: boolean;
  };
}

export interface AddWishlistRequest {
  productId: string;
  targetPrice?: number;
}
