import { PricePoint } from './PricePoint';

export interface PriceHistory {
  productId: string;
  history: PricePoint[];
}
