import { StockStatus } from '@prisma/client';

export interface OfferForPricing {
  id: string;
  price: number | string | { toString(): string };
  originalPrice: number | string | { toString(): string };
  shippingCost: number | string | { toString(): string };
  isOfficialStore: boolean;
  marketplaceRating?: number | string | { toString(): string } | null;
  stockStatus: StockStatus;
  marketplace: {
    id: string;
    name: string;
    logoUrl?: string | null;
  };
}

export interface PriceHistoryForPricing {
  price: number | string | { toString(): string };
  marketplaceOfferId: string;
}

export interface ResolvedBestOffer {
  id: string;
  price: number;
  originalPrice: number;
  marketplace: {
    id: string;
    name: string;
    logoUrl: string | null;
  };
  officialStore: boolean;
  stockStatus: StockStatus;
  discountPercentage: number;
}

/**
 * Calculates the discount percentage between original price and current price.
 */
export function calculateDiscount(price: number, originalPrice: number): number {
  if (originalPrice > price && originalPrice > 0) {
    return Number((((originalPrice - price) / originalPrice) * 100).toFixed(2));
  }
  return 0;
}

/**
 * Resolves the best offer from a list of offers based on effective price, official store priority, and rating.
 */
export function resolveBestOffer<T extends OfferForPricing>(
  offers: T[],
  dealScore?: number
): (ResolvedBestOffer & { dealScore?: number }) | null {
  if (!offers || offers.length === 0) {
    return null;
  }

  const sortedOffers = [...offers].sort((a, b) => {
    const effA = Number(a.price) + Number(a.shippingCost);
    const effB = Number(b.price) + Number(b.shippingCost);

    if (effA !== effB) {
      return effA - effB; // Lowest effective price first
    }

    if (a.isOfficialStore !== b.isOfficialStore) {
      return a.isOfficialStore ? -1 : 1; // Official store prioritized
    }

    const ratingA = a.marketplaceRating ? Number(a.marketplaceRating) : 0;
    const ratingB = b.marketplaceRating ? Number(b.marketplaceRating) : 0;
    return ratingB - ratingA; // Higher rating prioritized
  });

  const best = sortedOffers[0];
  const price = Number(best.price);
  const originalPrice = Number(best.originalPrice);
  const discountPercentage = calculateDiscount(price, originalPrice);

  const result: ResolvedBestOffer & { dealScore?: number } = {
    id: best.id,
    price,
    originalPrice,
    marketplace: {
      id: best.marketplace.id,
      name: best.marketplace.name,
      logoUrl: best.marketplace.logoUrl ?? null,
    },
    officialStore: best.isOfficialStore,
    stockStatus: best.stockStatus,
    discountPercentage,
  };

  if (dealScore !== undefined) {
    result.dealScore = dealScore;
  }

  return result;
}

/**
 * Resolves the lowest historical price across price histories, with fallback to best offer price.
 */
export function resolveLowestHistoricalPrice(
  priceHistories: PriceHistoryForPricing[],
  bestOfferPrice?: number | null
): number | null {
  if (priceHistories && priceHistories.length > 0) {
    const sortedHist = [...priceHistories].sort((a, b) => Number(a.price) - Number(b.price));
    return Number(sortedHist[0].price);
  }
  return bestOfferPrice ?? null;
}

/**
 * Resolves the trend indicator ('up' | 'down' | 'flat') comparing best offer price with history.
 */
export function resolveTrendIndicator(
  bestOfferPrice: number | null,
  bestOfferId: string | null,
  priceHistories: PriceHistoryForPricing[]
): 'up' | 'down' | 'flat' {
  if (!bestOfferPrice || !bestOfferId || !priceHistories || priceHistories.length === 0) {
    return 'flat';
  }

  const latestHistoryForOffer = priceHistories.find(
    (h) => h.marketplaceOfferId === bestOfferId
  );

  if (latestHistoryForOffer) {
    const histPrice = Number(latestHistoryForOffer.price);
    if (bestOfferPrice > histPrice) {
      return 'up';
    } else if (bestOfferPrice < histPrice) {
      return 'down';
    }
  }

  return 'flat';
}
