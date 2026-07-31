import { Category } from './Category';
import { Brand } from './Brand';
import { MarketplaceOffer } from './MarketplaceOffer';
import { PriceHistory } from './PriceHistory';

export interface Product {
  id: string;
  name: string;
  /** URL-friendly identifier. Always sent by the backend (ProductSummary.slug). */
  slug?: string;
  description: string;
  /** Product category. Present on the full detail payload, omitted on search summaries. */
  category?: Category;
  /** Product brand. Present on the full detail payload, omitted on search summaries. */
  brand?: Brand;
  /** Stock-keeping unit. Present on the full detail payload only. */
  sku?: string;
  images: string[];
  /**
   * Deal-quality score (0–100). Sent by the backend on search/comparison
   * responses. Omitted on the full product detail payload, hence optional.
   */
  dealScore?: number;
  /** Aggregate user rating (0–5). Sent by the backend on summary responses. */
  rating?: number;
  /** Number of customer reviews backing the `rating`. */
  reviewCount?: number;
  /** Grouped technical specs. Fetched separately on the detail page. */
  specifications?: Record<string, string>;
  offers: MarketplaceOffer[];
  /** Historical price points. Fetched separately on the detail page. */
  priceHistory?: PriceHistory;
  createdAt: string;
  updatedAt: string;
}
