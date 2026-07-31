import { Marketplace } from './Marketplace';

export interface MarketplaceOffer {
  id: string;
  productId?: string;
  marketplace: Marketplace;
  price: number;
  /** Pre-discount list price. `undefined` when the offer has no discount. */
  originalPrice?: number;
  currency: string;
  /** Direct product URL on the marketplace. */
  url?: string;
  productUrl?: string;
  /** Seller/store name. Present on the full detail payload. */
  seller?: string;
  /** Whether this offer comes from the marketplace's official store. */
  officialStore?: boolean;
  /** Item condition. Present on the full detail payload. */
  condition?: 'new' | 'used' | 'refurbished';
  /** Convenience boolean derived from stockStatus. */
  inStock?: boolean;
  /** Normalized stock availability, mirroring the backend StockStatus enum. */
  stockStatus?: string;
  /** Shipping details. Present on the full detail payload. */
  shippingInfo?: string;
  isActive?: boolean;
  lastScrapedAt?: string;
  updatedAt: string;
}
