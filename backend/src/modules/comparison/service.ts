import { prisma } from '../../config/prisma';
import {
  resolveBestOffer,
  resolveLowestHistoricalPrice,
  resolveTrendIndicator,
} from '../../shared/utils/pricingResolver';
import {
  ComparisonProductDto,
  ComparisonResponseDto,
  ComparisonMarketplaceOfferDto,
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

    // 6. Generate priceSeries per compared product based on history
    const colors = ['#0066FF', '#10B981', '#F59E0B', '#EF4444'];
    const priceSeries = orderedProducts.map((prod, idx) => {
      const points = prod.priceHistories
        .map((h) => ({
          date: h.recordedAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          price: Number(h.price),
        }))
        .reverse();

      const currentBestOffer = mappedProducts.find((p) => p.productSummary.id === prod.id)?.bestOffer;
      const currentPrice = currentBestOffer ? currentBestOffer.price : null;

      if (points.length === 0 && currentPrice !== null) {
        points.push({
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          price: currentPrice,
        });
      }

      if (points.length === 1 && points[0]) {
        const prevDate = new Date();
        prevDate.setDate(prevDate.getDate() - 30);
        points.unshift({
          date: prevDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          price: points[0].price,
        });
      }

      return {
        productId: prod.id,
        name: prod.name,
        color: colors[idx % colors.length],
        points,
      };
    });

    // 7. Generate deterministic AI Recommendation
    const winnerProduct = mappedProducts.find((p) => p.productSummary.id === highestDealScoreProductId);
    const cheapestProduct = mappedProducts.find((p) => p.productSummary.id === cheapestProductId);
    const bestRatedProduct = mappedProducts.find((p) => p.productSummary.id === bestRatedProductId);

    const winnerName = winnerProduct?.productSummary.name || 'compared products';
    const winnerScore = winnerProduct?.productSummary.dealScore || 0;
    const confidence = winnerScore > 0 ? Math.min(99, Math.max(70, 80 + (winnerScore - 80))) : 80;

    let aiSummary = `We recommend ${winnerName} as the top pick, featuring the highest Deal Score of ${winnerScore}/100.`;
    if (cheapestProduct && cheapestProduct.productSummary.id !== winnerProduct?.productSummary.id) {
      aiSummary += ` If you are on a budget, ${cheapestProduct.productSummary.name} is the most cost-effective option.`;
    }

    const aiInsights = [];
    if (winnerProduct) {
      aiInsights.push({
        id: 'insight-1',
        title: 'Top Recommendation',
        description: `${winnerProduct.productSummary.name} is the clear winner with a strong Deal Score of ${winnerProduct.productSummary.dealScore}/100 based on current active offers.`,
      });
    }
    if (cheapestProduct) {
      aiInsights.push({
        id: 'insight-2',
        title: 'Best Price Value',
        description: `${cheapestProduct.productSummary.name} offers the lowest price at Rp ${cheapestProduct.bestOffer?.price.toLocaleString('id-ID')}.`,
      });
    }
    if (bestRatedProduct && bestRatedProduct.productSummary.id !== winnerProduct?.productSummary.id) {
      aiInsights.push({
        id: 'insight-3',
        title: 'Highest Rated by Users',
        description: `${bestRatedProduct.productSummary.name} has the highest consumer rating (★ ${bestRatedProduct.productSummary.rating} from ${bestRatedProduct.productSummary.reviewCount} reviews).`,
      });
    }

    const aiRecommendation = {
      winner: winnerName,
      confidence,
      summary: aiSummary,
      insights: aiInsights,
    };

    // 8. Generate aggregated marketplace comparisons
    const mpGroup: Record<string, { marketplaceName: string; offers: ComparisonMarketplaceOfferDto[] }> = {};
    for (const prod of orderedProducts) {
      for (const offer of prod.marketplaceOffers) {
        const mpName = offer.marketplace.name;
        if (!mpGroup[mpName]) {
          mpGroup[mpName] = {
            marketplaceName: mpName,
            offers: [],
          };
        }
        mpGroup[mpName].offers.push({
          productId: prod.id,
          variantName: prod.name,
          price: Number(offer.price),
          availability: offer.stockStatus === 'IN_STOCK' ? 'In Stock' : 'Out of Stock',
          availabilityType: offer.stockStatus === 'IN_STOCK' ? ('positive' as const) : ('critical' as const),
          actionLabel: 'View Deal',
        });
      }
    }

    const marketplaceComparisons = Object.entries(mpGroup).map(([name, data]) => ({
      id: `mp-${name.toLowerCase().replace(/\s+/g, '-')}`,
      marketplace: name,
      seller: 'Official Store',
      iconName: 'store' as const,
      offers: data.offers,
    }));

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
      priceSeries,
      aiRecommendation,
      marketplaceComparisons,
    };
  }
}
