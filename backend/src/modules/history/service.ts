import { Prisma, MarketplaceOffer } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { HistoryQueryFilters } from './types';

export class PriceHistoryService {
  /**
   * Records a history snapshot if any tracked fields have changed.
   * Tracks: price, originalPrice, shippingCost, stockStatus, marketplaceRating, reviewCount.
   */
  public async recordSnapshot(tx: Prisma.TransactionClient, offer: MarketplaceOffer): Promise<void> {
    // Find the latest snapshot for this offer
    const latest = await tx.priceHistory.findFirst({
      where: { marketplaceOfferId: offer.id },
      orderBy: { recordedAt: 'desc' },
    });

    const hasChanged =
      !latest ||
      Number(latest.price) !== Number(offer.price) ||
      Number(latest.originalPrice) !== Number(offer.originalPrice) ||
      Number(latest.shippingCost) !== Number(offer.shippingCost) ||
      latest.stockStatus !== offer.stockStatus ||
      (offer.marketplaceRating !== null && latest.marketplaceRating !== null
        ? Number(latest.marketplaceRating) !== Number(offer.marketplaceRating)
        : latest.marketplaceRating !== offer.marketplaceRating) ||
      latest.reviewCount !== offer.reviewCount;

    if (hasChanged) {
      await tx.priceHistory.create({
        data: {
          marketplaceOfferId: offer.id,
          productId: offer.productId,
          price: offer.price,
          originalPrice: offer.originalPrice,
          shippingCost: offer.shippingCost,
          currency: offer.currency,
          stockStatus: offer.stockStatus,
          marketplaceRating: offer.marketplaceRating,
          reviewCount: offer.reviewCount,
          recordedAt: new Date(), // Always in UTC by default JS/Prisma configuration
        },
      });
    }
  }

  /**
   * GET /offers/:offerId/history
   * Retrieves snapshots for a single offer.
   */
  public async getOfferHistory(offerId: string, filters: HistoryQueryFilters) {
    const { page, limit, from, to } = filters;

    const where: Prisma.PriceHistoryWhereInput = {
      marketplaceOfferId: offerId,
    };

    if (from || to) {
      where.recordedAt = {
        ...(from ? { gte: from } : {}),
        ...(to ? { lte: to } : {}),
      };
    }

    const total = await prisma.priceHistory.count({ where });
    const skip = (page - 1) * limit;

    const items = await prisma.priceHistory.findMany({
      where,
      orderBy: { recordedAt: 'desc' },
      skip,
      take: limit,
    });

    return {
      items,
      total,
    };
  }

  /**
   * GET /products/:productId/price-history
   * Retrieves snapshots for all offers connected to a product.
   */
  public async getProductHistory(productId: string) {
    return prisma.priceHistory.findMany({
      where: { productId },
      include: {
        marketplaceOffer: {
          include: {
            marketplace: true,
          },
        },
      },
      orderBy: { recordedAt: 'asc' },
    });
  }

  /**
   * GET /products/:productId/lowest-price
   * Returns the lowest price point ever recorded.
   */
  public async getLowestPrice(productId: string) {
    return prisma.priceHistory.findFirst({
      where: { productId },
      orderBy: { price: 'asc' },
      include: {
        marketplaceOffer: {
          include: {
            marketplace: true,
          },
        },
      },
    });
  }

  /**
   * GET /products/:productId/highest-price
   * Returns the highest price point ever recorded.
   */
  public async getHighestPrice(productId: string) {
    return prisma.priceHistory.findFirst({
      where: { productId },
      orderBy: { price: 'desc' },
      include: {
        marketplaceOffer: {
          include: {
            marketplace: true,
          },
        },
      },
    });
  }

  /**
   * GET /products/:productId/price-trend
   * Returns current cheapest active price vs its previous recorded history.
   */
  public async getPriceTrend(productId: string) {
    const cheapestOffer = await prisma.marketplaceOffer.findFirst({
      where: { productId, isActive: true },
      orderBy: { price: 'asc' },
    });

    if (!cheapestOffer) {
      return {
        currentPrice: 0,
        previousPrice: 0,
        direction: 'flat' as const,
        changeAmount: 0,
        changePercentage: 0,
      };
    }

    const history = await prisma.priceHistory.findMany({
      where: { marketplaceOfferId: cheapestOffer.id },
      orderBy: { recordedAt: 'desc' },
      take: 2,
    });

    let currentPrice = Number(cheapestOffer.price);
    let previousPrice = Number(cheapestOffer.originalPrice) || currentPrice;

    if (history.length >= 2) {
      currentPrice = Number(history[0].price);
      previousPrice = Number(history[1].price);
    } else if (history.length === 1) {
      currentPrice = Number(history[0].price);
    }

    const changeAmount = Number((currentPrice - previousPrice).toFixed(2));
    const changePercentage = previousPrice > 0
      ? Number(((changeAmount / previousPrice) * 100).toFixed(2))
      : 0;
    const direction = changeAmount > 0
      ? ('up' as const)
      : changeAmount < 0
        ? ('down' as const)
        : ('flat' as const);

    return {
      currentPrice,
      previousPrice,
      direction,
      changeAmount,
      changePercentage,
    };
  }
}
