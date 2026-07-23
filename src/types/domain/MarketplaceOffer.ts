import { Marketplace } from './Marketplace';

export interface MarketplaceOffer {
  id: string;
  marketplace: Marketplace;
  price: number;
  currency: string;
  url: string;
  seller: string;
  condition: 'new' | 'used' | 'refurbished';
  inStock: boolean;
  shippingInfo: string;
  updatedAt: string;
}
