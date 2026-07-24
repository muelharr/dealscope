import { PriceAlert, Product, MarketplaceOffer, PriceHistory, Marketplace } from '@prisma/client';
import { prisma } from '../../config/prisma';
import {
  resolveBestOffer,
  resolveLowestHistoricalPrice,
  resolveTrendIndicator,
  ResolvedBestOffer,
} from '../../shared/utils/pricingResolver';
import {
  CreateAlertRequest,
  PriceAlertResponseDto,
  UpdateAlertRequest,
} from './types';

export type PriceAlertWithRelations = PriceAlert & {
  product: Product & {
    marketplaceOffers: (MarketplaceOffer & {
      marketplace: Marketplace;
    })[];
    priceHistories: PriceHistory[];
  };
};

// Helper function to map a database record to the DTO
export function mapToPriceAlertResponse(alert: PriceAlertWithRelations): PriceAlertResponseDto {
  const bestOffer = resolveBestOffer(alert.product.marketplaceOffers, alert.product.dealScore);
  const currentPrice = bestOffer ? bestOffer.price : null;
  const currentDiscount = bestOffer ? bestOffer.discountPercentage : null;
  const lowestHistoricalPrice = resolveLowestHistoricalPrice(
    alert.product.priceHistories,
    currentPrice
  );
  const trendIndicator = resolveTrendIndicator(
    currentPrice,
    bestOffer ? bestOffer.id : null,
    alert.product.priceHistories
  );

  return {
    id: alert.id,
    userId: alert.userId,
    productId: alert.productId,
    targetPrice: alert.targetPrice ? Number(alert.targetPrice) : null,
    targetDiscountPercentage: alert.targetDiscountPercentage ? Number(alert.targetDiscountPercentage) : null,
    isEnabled: alert.isEnabled,
    lastTriggeredAt: alert.lastTriggeredAt ? alert.lastTriggeredAt.toISOString() : null,
    createdAt: alert.createdAt.toISOString(),
    updatedAt: alert.updatedAt.toISOString(),
    productSummary: {
      id: alert.product.id,
      name: alert.product.name,
      slug: alert.product.slug,
      images: alert.product.images,
      rating: alert.product.rating ? Number(alert.product.rating) : 0,
      reviewCount: alert.product.reviewCount,
      dealScore: alert.product.dealScore,
    },
    bestOffer,
    currentPrice,
    currentDiscount,
    lowestHistoricalPrice,
    trendIndicator,
  };
}

export class PriceAlertService {
  /**
   * Evaluates if a price alert is triggered by the current best offer.
   */
  public evaluateAlert(
    alert: { targetPrice: number | null; targetDiscountPercentage: number | null; isEnabled: boolean },
    bestOffer: ResolvedBestOffer | null
  ): { triggered: boolean; reason: 'PRICE_REACHED' | 'DISCOUNT_REACHED' | null } {
    if (!alert.isEnabled || !bestOffer) {
      return { triggered: false, reason: null };
    }

    if (alert.targetPrice !== null && bestOffer.price <= alert.targetPrice) {
      return { triggered: true, reason: 'PRICE_REACHED' };
    }

    if (
      alert.targetDiscountPercentage !== null &&
      bestOffer.discountPercentage >= alert.targetDiscountPercentage
    ) {
      return { triggered: true, reason: 'DISCOUNT_REACHED' };
    }

    return { triggered: false, reason: null };
  }

  /**
   * Retrieves active price alerts for a user.
   * Soft-deleted products are excluded.
   */
  public async listAlerts(userId: string): Promise<PriceAlertResponseDto[]> {
    const alerts = await prisma.priceAlert.findMany({
      where: {
        userId,
        product: {
          deletedAt: null,
        },
      },
      include: {
        product: {
          include: {
            marketplaceOffers: {
              include: {
                marketplace: true,
              },
            },
            priceHistories: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return alerts.map(mapToPriceAlertResponse);
  }

  /**
   * Creates a new price alert.
   */
  public async createAlert(userId: string, data: CreateAlertRequest): Promise<PriceAlertResponseDto> {
    // 1. Check if product exists and is not soft-deleted
    const product = await prisma.product.findFirst({
      where: {
        id: data.productId,
        deletedAt: null,
      },
    });

    if (!product) {
      throw new Error('Product not found or has been deleted.');
    }

    // 2. Check for duplicate alert
    const existing = await prisma.priceAlert.findUnique({
      where: {
        userId_productId: {
          userId,
          productId: data.productId,
        },
      },
    });

    if (existing) {
      throw new Error('Price alert already exists for this product.');
    }

    // 3. Create the alert
    const created = await prisma.priceAlert.create({
      data: {
        userId,
        productId: data.productId,
        targetPrice: data.targetPrice,
        targetDiscountPercentage: data.targetDiscountPercentage,
      },
      include: {
        product: {
          include: {
            marketplaceOffers: {
              include: {
                marketplace: true,
              },
            },
            priceHistories: true,
          },
        },
      },
    });

    return mapToPriceAlertResponse(created);
  }

  /**
   * Updates an existing price alert.
   */
  public async updateAlert(
    userId: string,
    id: string,
    data: UpdateAlertRequest
  ): Promise<PriceAlertResponseDto> {
    // 1. Verify existence and ownership
    const existing = await prisma.priceAlert.findUnique({
      where: { id },
      include: {
        product: true,
      },
    });

    if (!existing || existing.userId !== userId) {
      throw new Error('Price alert not found.');
    }

    if (existing.product.deletedAt !== null) {
      throw new Error('Product not found or has been deleted.');
    }

    // 2. Verify at least one target criteria remains active
    const nextPrice = data.targetPrice !== undefined ? data.targetPrice : existing.targetPrice;
    const nextDiscount =
      data.targetDiscountPercentage !== undefined ? data.targetDiscountPercentage : existing.targetDiscountPercentage;

    if (nextPrice === null && nextDiscount === null) {
      throw new Error('At least one of targetPrice or targetDiscountPercentage must be provided.');
    }

    // 3. Perform update
    const updated = await prisma.priceAlert.update({
      where: { id },
      data: {
        targetPrice: data.targetPrice,
        targetDiscountPercentage: data.targetDiscountPercentage,
        isEnabled: data.isEnabled,
      },
      include: {
        product: {
          include: {
            marketplaceOffers: {
              include: {
                marketplace: true,
              },
            },
            priceHistories: true,
          },
        },
      },
    });

    return mapToPriceAlertResponse(updated);
  }

  /**
   * Toggles the active status (enabled/disabled) of an alert.
   */
  public async toggleAlert(
    userId: string,
    id: string,
    isEnabled: boolean
  ): Promise<PriceAlertResponseDto> {
    const existing = await prisma.priceAlert.findUnique({
      where: { id },
      include: {
        product: true,
      },
    });

    if (!existing || existing.userId !== userId) {
      throw new Error('Price alert not found.');
    }

    if (existing.product.deletedAt !== null) {
      throw new Error('Product not found or has been deleted.');
    }

    const updated = await prisma.priceAlert.update({
      where: { id },
      data: { isEnabled },
      include: {
        product: {
          include: {
            marketplaceOffers: {
              include: {
                marketplace: true,
              },
            },
            priceHistories: true,
          },
        },
      },
    });

    return mapToPriceAlertResponse(updated);
  }

  /**
   * Deletes a price alert.
   */
  public async deleteAlert(userId: string, id: string): Promise<void> {
    const existing = await prisma.priceAlert.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== userId) {
      throw new Error('Price alert not found.');
    }

    await prisma.priceAlert.delete({
      where: { id },
    });
  }
}
