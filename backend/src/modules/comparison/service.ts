import { prisma } from '../../config/prisma';
import {
  resolveBestOffer,
  resolveLowestHistoricalPrice,
  resolveTrendIndicator,
} from '../../shared/utils/pricingResolver';
import {
  ComparisonProductDto,
  ComparisonResponseDto,
} from './types';
import { PriceHistory, StockStatus } from '@prisma/client';

export class ComparisonService {
  /**
   * Private helper to resolve the highest historical price across price histories.
   * If price histories are empty, falls back to the best offer's price.
   */
  private resolveHighestHistoricalPrice(
    priceHistories: PriceHistory[],
    bestOfferPrice: number | null
  ): number | null {
    if (priceHistories && priceHistories.length > 0) {
      const prices = priceHistories.map((h) => Number(h.price));
      return Math.max(...prices);
    }
    return bestOfferPrice;
  }

  /**
   * Side-by-side comparison of 2 to 4 products.
   */
  public async compareProducts(productIds: string[]): Promise<ComparisonResponseDto> {
    // 1. Fetch matching active products from Prisma
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        deletedAt: null,
      },
      include: {
        category: true,
        brand: true,
        marketplaceOffers: {
          where: {
            isActive: true,
            stockStatus: { not: StockStatus.DISCONTINUED },
          },
          include: {
            marketplace: true,
          },
        },
        priceHistories: {
          orderBy: { recordedAt: 'desc' },
        },
      },
    });

    // 2. Validate that all requested products exist and are not soft-deleted
    if (products.length !== productIds.length) {
      throw new Error('One or more compared products were not found or have been deleted.');
    }

    // 3. Preserve the exact order requested in productIds
    const orderedProducts = [...products].sort(
      (a, b) => productIds.indexOf(a.id) - productIds.indexOf(b.id)
    );

    // 4. Map each product to its DTO
    const mappedProducts: ComparisonProductDto[] = orderedProducts.map((prod) => {
      // Resolve best offer (ignoring inactive/discontinued offers since they are filtered at query level)
      const bestOfferObj = resolveBestOffer(prod.marketplaceOffers, prod.dealScore);

      const currentPrice = bestOfferObj ? bestOfferObj.price : null;
      const bestOfferId = bestOfferObj ? bestOfferObj.id : null;

      // Lowest historical price
      const lowestHistoricalPrice = resolveLowestHistoricalPrice(
        prod.priceHistories,
        currentPrice
      );

      // Highest historical price (using local private helper)
      const highestHistoricalPrice = this.resolveHighestHistoricalPrice(
        prod.priceHistories,
        currentPrice
      );

      // Trend indicator
      const trendIndicator = resolveTrendIndicator(
        currentPrice,
        bestOfferId,
        prod.priceHistories
      );

      return {
        productSummary: {
          id: prod.id,
          name: prod.name,
          slug: prod.slug,
          brand: prod.brand.name,
          category: prod.category.name,
          images: prod.images,
          dealScore: prod.dealScore,
          rating: Number(prod.rating),
          reviewCount: prod.reviewCount,
        },
        bestOffer: bestOfferObj
          ? {
              marketplace: bestOfferObj.marketplace.name,
              price: bestOfferObj.price,
              originalPrice: bestOfferObj.originalPrice,
              shippingCost: prod.marketplaceOffers.find((o) => o.id === bestOfferObj.id)?.shippingCost
                ? Number(prod.marketplaceOffers.find((o) => o.id === bestOfferObj.id)!.shippingCost)
                : 0,
              effectivePrice:
                bestOfferObj.price +
                Number(prod.marketplaceOffers.find((o) => o.id === bestOfferObj.id)?.shippingCost || 0),
              discountPercentage: bestOfferObj.discountPercentage,
              officialStore: bestOfferObj.officialStore,
              stockStatus: bestOfferObj.stockStatus,
            }
          : null,
        lowestHistoricalPrice,
        highestHistoricalPrice,
        trendIndicator,
        marketplaceCount: prod.marketplaceOffers.length,
      };
    });

    // 5. Calculate Comparison Summary with Deterministic Tie-Breakers
    const productsWithOffers = mappedProducts.filter((p) => p.bestOffer !== null);

    // cheapestProductId
    let cheapestProductId: string | null = null;
    if (productsWithOffers.length > 0) {
      const sortedByCheapest = [...productsWithOffers].sort((a, b) => {
        const effA = a.bestOffer!.effectivePrice;
        const effB = b.bestOffer!.effectivePrice;
        if (effA !== effB) {
          return effA - effB; // Ascending effective price
        }
        const scoreA = a.productSummary.dealScore;
        const scoreB = b.productSummary.dealScore;
        if (scoreA !== scoreB) {
          return scoreB - scoreA; // Descending dealScore
        }
        const ratingA = a.productSummary.rating;
        const ratingB = b.productSummary.rating;
        if (ratingA !== ratingB) {
          return ratingB - ratingA; // Descending rating
        }
        return productIds.indexOf(a.productSummary.id) - productIds.indexOf(b.productSummary.id);
      });
      cheapestProductId = sortedByCheapest[0].productSummary.id;
    }

    // highestDiscountProductId
    let highestDiscountProductId: string | null = null;
    if (productsWithOffers.length > 0) {
      const sortedByDiscount = [...productsWithOffers].sort((a, b) => {
        const discA = a.bestOffer!.discountPercentage;
        const discB = b.bestOffer!.discountPercentage;
        if (discA !== discB) {
          return discB - discA; // Descending discount
        }
        const scoreA = a.productSummary.dealScore;
        const scoreB = b.productSummary.dealScore;
        if (scoreA !== scoreB) {
          return scoreB - scoreA; // Descending dealScore
        }
        return productIds.indexOf(a.productSummary.id) - productIds.indexOf(b.productSummary.id);
      });
      highestDiscountProductId = sortedByDiscount[0].productSummary.id;
    }

    // highestDealScoreProductId
    let highestDealScoreProductId: string | null = null;
    if (mappedProducts.length > 0) {
      const sortedByScore = [...mappedProducts].sort((a, b) => {
        const scoreA = a.productSummary.dealScore;
        const scoreB = b.productSummary.dealScore;
        if (scoreA !== scoreB) {
          return scoreB - scoreA; // Descending dealScore
        }
        const ratingA = a.productSummary.rating;
        const ratingB = b.productSummary.rating;
        if (ratingA !== ratingB) {
          return ratingB - ratingA; // Descending rating
        }
        return productIds.indexOf(a.productSummary.id) - productIds.indexOf(b.productSummary.id);
      });
      highestDealScoreProductId = sortedByScore[0].productSummary.id;
    }

    // bestRatedProductId
    let bestRatedProductId: string | null = null;
    if (mappedProducts.length > 0) {
      const sortedByRating = [...mappedProducts].sort((a, b) => {
        const ratingA = a.productSummary.rating;
        const ratingB = b.productSummary.rating;
        if (ratingA !== ratingB) {
          return ratingB - ratingA; // Descending rating
        }
        const countA = a.productSummary.reviewCount;
        const countB = b.productSummary.reviewCount;
        if (countA !== countB) {
          return countB - countA; // Descending reviewCount
        }
        return productIds.indexOf(a.productSummary.id) - productIds.indexOf(b.productSummary.id);
      });
      bestRatedProductId = sortedByRating[0].productSummary.id;
    }

    return {
      products: mappedProducts,
      summary: {
        cheapestProductId,
        highestDiscountProductId,
        highestDealScoreProductId,
        bestRatedProductId,
      },
      meta: {
        comparisonCount: productIds.length,
      },
    };
  }
}
