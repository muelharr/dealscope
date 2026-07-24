import { prisma } from '../../../config/prisma';

export interface UserDashboardData {
  totalWishlistItems: number;
  activePriceAlerts: number;
  recentlyTriggeredAlerts: Array<{
    id: string;
    productName: string;
    targetPrice: number | null;
    triggeredAt: string;
  }>;
  recentNotifications: Array<{
    id: string;
    type: string;
    title: string;
    message: string;
    createdAt: string;
    isRead: boolean;
  }>;
  wishlistHighlights: Array<{
    id: string;
    productName: string;
    productSlug: string;
    bestPrice: number | null;
    hasPriceDrop: boolean;
  }>;
}

export class UserDashboardService {
  public async getUserDashboard(userId: string): Promise<UserDashboardData> {
    const [
      totalWishlistItems,
      activePriceAlerts,
      triggeredAlertsRaw,
      notificationsRaw,
      wishlistRaw,
    ] = await Promise.all([
      prisma.wishlist.count({ where: { userId } }),
      prisma.priceAlert.count({ where: { userId, isEnabled: true } }),
      prisma.priceAlert.findMany({
        where: { userId, lastTriggeredAt: { not: null } },
        include: { product: true },
        orderBy: { lastTriggeredAt: 'desc' },
        take: 5,
      }),
      prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      prisma.wishlist.findMany({
        where: { userId },
        include: {
          product: {
            include: {
              marketplaceOffers: {
                where: { isActive: true, stockStatus: { not: 'DISCONTINUED' } },
                orderBy: { price: 'asc' },
                take: 1,
              },
            },
          },
        },
        take: 5,
      }),
    ]);

    const recentlyTriggeredAlerts = triggeredAlertsRaw.map((alert) => ({
      id: alert.id,
      productName: alert.product.name,
      targetPrice: alert.targetPrice ? Number(alert.targetPrice) : null,
      triggeredAt: alert.lastTriggeredAt!.toISOString(),
    }));

    const recentNotifications = notificationsRaw.map((n) => ({
      id: n.id,
      type: n.type,
      title: n.title,
      message: n.message,
      createdAt: n.createdAt.toISOString(),
      isRead: n.readAt !== null,
    }));

    const wishlistHighlights = wishlistRaw.map((w) => {
      const bestOffer = w.product.marketplaceOffers[0];
      const bestPrice = bestOffer ? Number(bestOffer.price) : null;
      const originalPrice = bestOffer ? Number(bestOffer.originalPrice) : null;
      const hasPriceDrop = originalPrice !== null && bestPrice !== null && originalPrice > bestPrice;

      return {
        id: w.id,
        productName: w.product.name,
        productSlug: w.product.slug,
        bestPrice,
        hasPriceDrop,
      };
    });

    return {
      totalWishlistItems,
      activePriceAlerts,
      recentlyTriggeredAlerts,
      recentNotifications,
      wishlistHighlights,
    };
  }
}
