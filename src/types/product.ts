export interface ProductSummary {
  id: string;
  title: string;
  imageUrl?: string;
  currentPrice: number;
  originalPrice?: number;
  marketplaceName: string;
  offerCount?: number;
  dealScore: number;
  priceHistory: number[];
  rating?: number;
  reviewCount?: number;
}
