import { Product } from './Product';

export interface WishlistItem {
  id: string;
  product: Product;
  addedAt: string;
  targetPrice?: number;
}
