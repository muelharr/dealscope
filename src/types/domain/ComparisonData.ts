export interface ComparedProduct {
  id: string;
  brand: string;
  name: string;
  price: number;
  dealScore: number;
  marketplace: string;
  status: 'available' | 'limited' | 'out-of-stock';
  badgeLabel?: string;
}

export interface ComparisonProductHeader {
  id: string;
  name: string;
  badgeLabel?: string;
  isTopPick?: boolean;
}

export interface ComparisonValue {
  productId: string;
  value: string;
  highlight?: 'best' | 'equal' | 'different';
}

export interface ComparisonRow {
  id: string;
  label: string;
  values: ComparisonValue[];
}

export interface ComparisonCategory {
  id: string;
  title: string;
  rows: ComparisonRow[];
}

export interface MarketplaceComparisonOffer {
  productId: string;
  variantName: string;
  price: number;
  availability: string;
  availabilityType: 'positive' | 'warning' | 'critical';
  actionLabel: 'View Deal' | 'Pre-order';
}

export interface MarketplaceComparison {
  id: string;
  marketplace: string;
  seller: string;
  iconName: 'cart' | 'store' | 'shipping';
  offers: MarketplaceComparisonOffer[];
}

export interface ProductPriceSeries {
  productId: string;
  name: string;
  color: string;
  isDashed?: boolean;
  points: { date: string; price: number }[];
}

export interface ComparisonAIInsight {
  id: string;
  title: string;
  description: string;
}

export interface ComparisonAIRecommendation {
  winner: string;
  confidence: number;
  summary: string;
  insights: ComparisonAIInsight[];
}

export interface ComparisonSummaryData {
  productsCount: number;
  bestOverallName: string;
  /** Average deal score across compared products. `undefined` when not computable from backend data. */
  avgDealScore?: number;
  lastUpdated: string;
}

export interface ComparisonData {
  summary: ComparisonSummaryData;
  comparedProducts: ComparedProduct[];
  matrixProductHeaders: ComparisonProductHeader[];
  matrixCategories: ComparisonCategory[];
  marketplaceComparisons: MarketplaceComparison[];
  /** Per-product historical price series. `undefined` until the backend exposes a comparison price-history endpoint. */
  priceSeries?: ProductPriceSeries[];
  /** AI-generated recommendation. `undefined` until the backend exposes a comparison AI endpoint. */
  aiRecommendation?: ComparisonAIRecommendation;
}
