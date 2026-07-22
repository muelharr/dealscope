export interface MarketplaceOffer {
  id: string;
  marketplaceName: string;
  marketplaceLogoUrl?: string;
  sellerName: string;
  sellerTrustScore: number; // e.g. 0-100 or 0.0-5.0
  currentPrice: number;
  originalPrice?: number;
  availability: "in_stock" | "out_of_stock" | "low_stock";
  shippingInfo?: string;
  dealBadge?: string; // e.g. "Best Value", "Lowest Price"
  externalUrl: string;
}
