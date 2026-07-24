export interface AdminDashboardDto {
  userMetrics: {
    totalUsers: number;
    activeUsersLast30Days: number;
    newUsersLast7Days: number;
  };
  productMetrics: {
    totalProducts: number;
    totalOffers: number;
    averageProductPrice: number | null;
    totalPriceAlerts: number;
  };
  notificationMetrics: {
    totalNotifications: number;
    emailDeliverySuccessRate: number | null;
    pendingNotifications: number;
  };
  queueHealth: Array<{
    queueName: string;
    waiting: number;
    active: number;
    delayed: number;
    failed: number;
    completed: number;
  }>;
  topProducts: Array<{
    productId: string;
    productName: string;
    wishlistCount: number;
    alertCount: number;
  }>;
  marketplaceDistribution: Array<{
    marketplaceId: string;
    marketplaceName: string;
    offerCount: number;
    percentage: number;
  }>;
}

export interface AdminDashboardResponseDto {
  success: boolean;
  data: AdminDashboardDto;
  duration: number;
}
