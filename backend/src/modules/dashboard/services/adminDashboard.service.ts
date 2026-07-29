import { prisma } from '../../../config/prisma';

export class AdminDashboardService {
  public async getSummary() {
    const [
      totalUsers,
      totalProducts,
      totalMarketplaces,
      totalAlerts,
      recentUsers,
      activeAlerts
    ] = await Promise.all([
      prisma.user.count(),
      prisma.product.count({ where: { deletedAt: null } }),
      prisma.marketplace.count(),
      prisma.priceAlert.count(),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, email: true, createdAt: true }
      }),
      prisma.priceAlert.count({ where: { isEnabled: true } })
    ]);

    return {
      metrics: {
        totalUsers,
        totalProducts,
        totalMarketplaces,
        totalAlerts,
        activeAlerts
      },
      recentUsers
    };
  }
}
