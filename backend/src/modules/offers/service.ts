import { Prisma } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { CreateOfferRequest, UpdateOfferRequest, OfferQueryFilters } from './types';
import { PriceHistoryService } from '../history/service';

const priceHistoryService = new PriceHistoryService();

export class OfferService {
  /**
   * Retrieves offers with filters, sorting, and pagination.
   * Excludes inactive offers by default.
   */
  public async getOffers(filters: OfferQueryFilters) {
    const {
      page,
      limit,
      marketplace,
      minimumPrice,
      maximumPrice,
      officialStore,
      stockStatus,
      minimumRating,
      productId,
      sortBy,
      sortOrder,
    } = filters;

    const where: Prisma.MarketplaceOfferWhereInput = {
      isActive: true,
    };

    if (productId) {
      where.productId = productId;
    }

    if (marketplace) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(marketplace);
      if (isUuid) {
        where.marketplaceId = marketplace;
      } else {
        where.marketplace = { slug: marketplace };
      }
    }

    if (minimumPrice !== undefined || maximumPrice !== undefined) {
      where.price = {
        ...(minimumPrice !== undefined ? { gte: minimumPrice } : {}),
        ...(maximumPrice !== undefined ? { lte: maximumPrice } : {}),
      };
    }

    if (officialStore !== undefined) {
      where.isOfficialStore = officialStore;
    }

    if (stockStatus) {
      where.stockStatus = stockStatus;
    }

    if (minimumRating !== undefined) {
      where.marketplaceRating = { gte: minimumRating };
    }

    const total = await prisma.marketplaceOffer.count({ where });
    const skip = (page - 1) * limit;

    const items = await prisma.marketplaceOffer.findMany({
      where,
      include: {
        marketplace: true,
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip,
      take: limit,
    });

    return {
      items,
      total,
    };
  }

  /**
   * Fetches a single active offer by ID.
   */
  public async getOfferById(id: string) {
    return prisma.marketplaceOffer.findFirst({
      where: {
        id,
        isActive: true,
      },
      include: {
        marketplace: true,
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });
  }

  /**
   * Creates a new offer or reactivates an inactive matching one.
   * Only one active offer may exist for the combination of (productId, marketplaceId, sellerId).
   */
  public async createOffer(data: CreateOfferRequest) {
    const sellerId = data.sellerId || null;

    // Execute lookup and write operations in a transaction to prevent race conditions
    return prisma.$transaction(async (tx) => {
      const existing = await tx.marketplaceOffer.findFirst({
        where: {
          productId: data.productId,
          marketplaceId: data.marketplaceId,
          sellerId,
        },
      });

      if (existing) {
        if (existing.isActive) {
          throw new Error('An active offer for this product, marketplace, and seller combination already exists.');
        }

        // Reactivate inactive offer
        const updated = await tx.marketplaceOffer.update({
          where: { id: existing.id },
          data: {
            isActive: true,
            price: data.price,
            originalPrice: data.originalPrice,
            currency: data.currency,
            stockStatus: data.stockStatus,
            shippingCost: data.shippingCost ?? 0.00,
            shippingEstimate: data.shippingEstimate || null,
            marketplaceRating: data.marketplaceRating || null,
            reviewCount: data.reviewCount ?? 0,
            isOfficialStore: data.isOfficialStore ?? false,
            productUrl: data.productUrl,
            lastScrapedAt: new Date(),
          },
          include: {
            marketplace: true,
          },
        });
        await priceHistoryService.recordSnapshot(tx, updated);
        return updated;
      }

      // Create new active offer
      const created = await tx.marketplaceOffer.create({
        data: {
          productId: data.productId,
          marketplaceId: data.marketplaceId,
          sellerId,
          productUrl: data.productUrl,
          price: data.price,
          originalPrice: data.originalPrice,
          currency: data.currency,
          stockStatus: data.stockStatus,
          shippingCost: data.shippingCost ?? 0.00,
          shippingEstimate: data.shippingEstimate || null,
          marketplaceRating: data.marketplaceRating || null,
          reviewCount: data.reviewCount ?? 0,
          isOfficialStore: data.isOfficialStore ?? false,
          isActive: true,
          lastScrapedAt: new Date(),
        },
        include: {
          marketplace: true,
        },
      });
      await priceHistoryService.recordSnapshot(tx, created);
      return created;
    });
  }

  /**
   * Updates an active offer. Reject updates if inactive.
   */
  public async updateOffer(id: string, data: UpdateOfferRequest) {
    return prisma.$transaction(async (tx) => {
      const existing = await tx.marketplaceOffer.findUnique({
        where: { id },
      });

      if (!existing || !existing.isActive) {
        throw new Error('Marketplace offer not found or is inactive.');
      }

      // Check if new sellerId clashes with another active offer
      if (data.sellerId !== undefined && data.sellerId !== existing.sellerId) {
        const duplicate = await tx.marketplaceOffer.findFirst({
          where: {
            productId: existing.productId,
            marketplaceId: existing.marketplaceId,
            sellerId: data.sellerId || null,
            isActive: true,
            NOT: { id },
          },
        });

        if (duplicate) {
          throw new Error('Another active offer for this product, marketplace, and seller combination already exists.');
        }
      }

      const updateData: Prisma.MarketplaceOfferUpdateInput = {
        lastScrapedAt: new Date(),
      };

      if (data.sellerId !== undefined) {
        updateData.sellerId = data.sellerId;
      }
      if (data.productUrl !== undefined) {
        updateData.productUrl = data.productUrl;
      }
      if (data.price !== undefined) {
        updateData.price = data.price;
      }
      if (data.originalPrice !== undefined) {
        updateData.originalPrice = data.originalPrice;
      }
      if (data.currency !== undefined) {
        updateData.currency = data.currency;
      }
      if (data.stockStatus !== undefined) {
        updateData.stockStatus = data.stockStatus;
      }
      if (data.shippingCost !== undefined) {
        updateData.shippingCost = data.shippingCost;
      }
      if (data.shippingEstimate !== undefined) {
        updateData.shippingEstimate = data.shippingEstimate;
      }
      if (data.marketplaceRating !== undefined) {
        updateData.marketplaceRating = data.marketplaceRating;
      }
      if (data.reviewCount !== undefined) {
        updateData.reviewCount = data.reviewCount;
      }
      if (data.isOfficialStore !== undefined) {
        updateData.isOfficialStore = data.isOfficialStore;
      }
      if (data.isActive !== undefined) {
        updateData.isActive = data.isActive;
      }

      const updated = await tx.marketplaceOffer.update({
        where: { id },
        data: updateData,
        include: {
          marketplace: true,
        },
      });
      await priceHistoryService.recordSnapshot(tx, updated);
      return updated;
    });
  }

  /**
   * Deactivates an offer (sets isActive = false).
   */
  public async deleteOffer(id: string) {
    const existing = await prisma.marketplaceOffer.findUnique({
      where: { id },
    });

    if (!existing || !existing.isActive) {
      throw new Error('Marketplace offer not found or is already inactive.');
    }

    return prisma.marketplaceOffer.update({
      where: { id },
      data: {
        isActive: false,
        lastScrapedAt: new Date(),
      },
    });
  }
}
