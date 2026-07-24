import { StockStatus } from '@prisma/client';

export interface SearchQueryFilters {
  q?: string;
  category?: string;
  brand?: string;
  marketplace?: string;
  minPrice?: number;
  maxPrice?: number;
  officialStore?: boolean;
  stockStatus?: StockStatus;
  minRating?: number;
  sortBy?: 'dealScore' | 'newest' | 'price' | 'discount';
  sortOrder?: 'asc' | 'desc';
  page: number;
  limit: number;
}

export interface SearchPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface SearchResultDto {
  productSummary: {
    id: string;
    name: string;
    slug: string;
    description: string;
    images: string[];
    rating: number;
    reviewCount: number;
    dealScore: number;
    createdAt: string;
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
  };
  bestOffer: {
    id: string;
    price: number;
    originalPrice: number;
    marketplace: {
      id: string;
      name: string;
      logoUrl: string | null;
    };
    officialStore: boolean;
    stockStatus: StockStatus;
    discountPercentage: number;
    dealScore: number;
  } | null;
  availableOfferCount: number;
  lowestHistoricalPrice: number | null;
  currentTrendIndicator: 'up' | 'down' | 'flat';
}
