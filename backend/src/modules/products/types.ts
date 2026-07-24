import { Product, Category, Brand, MarketplaceOffer, Marketplace } from '@prisma/client';

export type ProductWithRelations = Product & {
  category: Category;
  brand: Brand;
  marketplaceOffers?: (MarketplaceOffer & {
    marketplace: Marketplace;
  })[];
};

export interface ProductResponse {
  id: string;
  name: string;
  slug: string;
  description: string;
  images: string[];
  dealScore: number;
  rating: number;
  reviewCount: number;
  specifications: Record<string, string | number | boolean>;
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
  offers?: {
    id: string;
    marketplace: {
      id: string;
      name: string;
      slug: string;
    };
    price: number;
    url: string;
    inStock: boolean;
    availabilityText: string | null;
    availabilityType: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  name: string;
  categoryId: string;
  brandId: string;
  description: string;
  images: string[];
  dealScore: number;
  specifications: Record<string, string | number | boolean>;
}

export interface UpdateProductRequest {
  name?: string;
  categoryId?: string;
  brandId?: string;
  description?: string;
  images?: string[];
  dealScore?: number;
  specifications?: Record<string, string | number | boolean>;
}

export interface ProductQueryFilters {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  category?: string;
  brand?: string;
  priceMin?: number;
  priceMax?: number;
  search?: string;
}
