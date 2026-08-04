import { prisma } from '../../config/prisma';
import { AddWishlistRequest, WishlistItemDto } from './types';

export class WishlistService {
  /**
   * Retrieves all wishlist items for a given user.
   */
  public async getUserWishlist(userId: string): Promise<WishlistItemDto[]> {
    const items = await prisma.wishlist.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            category: true,
            brand: true,
            marketplaceOffers: {
              where: {
                isActive: true,
                stockStatus: { not: 'DISCONTINUED' },
              },
              include: {
                marketplace: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return items.map((item) => {
      const prod = item.product;
      const activeOffers = prod.marketplaceOffers;

      let bestOffer: WishlistItemDto['product']['bestOffer'] = null;
      let hasPriceDrop = false;
      let priceDropAmount = 0;

      if (activeOffers.length > 0) {
        // Sort active offers by effectivePrice = price + shippingCost
        const sorted = [...activeOffers].sort((a, b) => {
          const effA = Number(a.price) + Number(a.shippingCost);
          const effB = Number(b.price) + Number(b.shippingCost);
          if (effA !== effB) return effA - effB;
          if (a.isOfficialStore !== b.isOfficialStore) return a.isOfficialStore ? -1 : 1;
          return Number(b.marketplaceRating || 0) - Number(a.marketplaceRating || 0);
        });

        const best = sorted[0];
        const price = Number(best.price);
        const originalPrice = Number(best.originalPrice);
        const shippingCost = Number(best.shippingCost);
        const effectivePrice = price + shippingCost;

        let discountPercentage = 0;
        if (originalPrice > price && originalPrice > 0) {
          discountPercentage = Number((((originalPrice - price) / originalPrice) * 100).toFixed(2));
        }

        bestOffer = {
          id: best.id,
          price,
          originalPrice,
          shippingCost,
          effectivePrice,
          discountPercentage,
          stockStatus: best.stockStatus,
          isOfficialStore: best.isOfficialStore,
          marketplace: {
            id: best.marketplace.id,
            name: best.marketplace.name,
            logoUrl: best.marketplace.logoUrl,
          },
        };

        if (originalPrice > price) {
          hasPriceDrop = true;
          priceDropAmount = originalPrice - price;
        }
      }

      return {
        id: item.id,
        productId: item.productId,
        targetPrice: item.targetPrice ? Number(item.targetPrice) : null,
        createdAt: item.createdAt.toISOString(),
        product: {
          id: prod.id,
          name: prod.name,
          slug: prod.slug,
          description: prod.description,
          images: prod.images,
          dealScore: prod.dealScore,
          rating: Number(prod.rating),
          reviewCount: prod.reviewCount,
          category: {
            id: prod.category.id,
            name: prod.category.name,
            slug: prod.category.slug,
          },
          brand: {
            id: prod.brand.id,
            name: prod.brand.name,
            slug: prod.brand.slug,
          },
          bestOffer,
          availableOfferCount: activeOffers.length,
          priceDropAmount,
          hasPriceDrop,
        },
      };
    });
  }

  /**
   * Adds a product to the user's wishlist.
   */
  public async addToWishlist(userId: string, data: AddWishlistRequest) {
    const product = await prisma.product.findFirst({
      where: { id: data.productId, deletedAt: null },
    });

    if (!product) {
      throw new Error('Product not found or has been deleted.');
    }

    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId,
          productId: data.productId,
        },
      },
    });

    if (existing) {
      return existing;
    }

    const result = await prisma.wishlist.create({
      data: {
        userId,
        productId: data.productId,
        targetPrice: data.targetPrice ? data.targetPrice : undefined,
      },
    });

    try {
      await prisma.activityLog.create({
        data: {
          userId,
          action: 'wishlist:add',
          details: { productId: data.productId, productName: product.name },
        },
      });
    } catch (err) {
      console.error('Failed to log activity for wishlist:add:', err);
    }

    return result;
  }

  /**
   * Removes a product from the user's wishlist.
   */
  public async removeFromWishlist(userId: string, productId: string) {
    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
      include: {
        product: true,
      },
    });

    if (!existing) {
      throw new Error('Wishlist item not found.');
    }

    const result = await prisma.wishlist.delete({
      where: {
        id: existing.id,
      },
    });

    try {
      await prisma.activityLog.create({
        data: {
          userId,
          action: 'wishlist:remove',
          details: { productId, productName: existing.product.name },
        },
      });
    } catch (err) {
      console.error('Failed to log activity for wishlist:remove:', err);
    }

    return result;
  }
}
