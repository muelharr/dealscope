export interface UserDashboardDto {
  totalWishlistItems: number;
  activePriceAlerts: number;
  recentlyTriggeredAlerts: Array<{
    id: string;
    productName: string;
    currentPrice: number;
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
  priceDropsToday: number;
  mostViewedCategories: Array<{
    categoryId: string;
    categoryName: string;
    viewCount: number;
  }>;
}

export interface UserDashboardResponseDto {
  success: boolean;
  data: UserDashboardDto;
  duration: number;
}
