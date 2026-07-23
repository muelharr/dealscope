import { Category } from './Category';
import { Brand } from './Brand';
import { MarketplaceOffer } from './MarketplaceOffer';
import { PriceHistory } from './PriceHistory';

export interface Product {
  id: string;
  name: string;
  description: string;
  category: Category;
  brand: Brand;
  sku: string;
  images: string[];
  specifications: Record<string, string>;
  offers: MarketplaceOffer[];
  priceHistory: PriceHistory;
  createdAt: string;
  updatedAt: string;
}
