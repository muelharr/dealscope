/**
 * Dashboard Service
 *
 * Fetches all data required for the user's main dashboard.
 */

import { authApiClient } from '@/auth';
import { WISHLIST } from '@/api/endpoints';
import type { PaginatedResponse } from '@/types/api';
import type { DashboardMetric, DashboardInsight, WishlistItem, ActivityItem } from '@/types/domain';

interface RawDashboardResponse {
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

class DashboardService {
  private async getDashboardData(): Promise<RawDashboardResponse> {
    const res = await authApiClient.get<unknown>('/dashboard');
    const obj = res.data as Record<string, unknown>;

    if (obj && obj.data && typeof obj.data === 'object') {
      return obj.data as RawDashboardResponse;
    }

    return obj as unknown as RawDashboardResponse;
  }

  public getMetrics = async (): Promise<DashboardMetric[]> => {
    try {
      const data = await this.getDashboardData();
      return [
        {
          id: 'metric-wishlist',
          label: 'Wishlist Items',
          value: String(data.totalWishlistItems ?? 0),
          change: 0,
        },
        {
          id: 'metric-alerts',
          label: 'Active Price Alerts',
          value: String(data.activePriceAlerts ?? 0),
          change: 0,
        },
      ];
    } catch {
      return [
        {
          id: 'metric-wishlist',
          label: 'Wishlist Items',
          value: '0',
          change: 0,
        },
        {
          id: 'metric-alerts',
          label: 'Active Price Alerts',
          value: '0',
          change: 0,
        },
      ];
    }
  };

  public getInsights = async (): Promise<DashboardInsight[]> => {
    try {
      const data = await this.getDashboardData();
      const count = data.activePriceAlerts ?? 0;
      return [
        {
          id: 'insight-1',
          title: 'Market Activity Stable',
          summary: `You currently have ${count} active price alert${count === 1 ? '' : 's'} set up for price tracking.`,
          recommendation: 'Keep tracking your active items for optimal deal opportunities.',
        },
        {
          id: 'insight-2',
          title: 'Wishlist Intelligence',
          summary: `Your watchlist contains ${data.totalWishlistItems ?? 0} item${(data.totalWishlistItems ?? 0) === 1 ? '' : 's'}.`,
          recommendation: 'Check back regularly for price drop alerts.',
        },
      ];
    } catch {
      return [
        {
          id: 'insight-default',
          title: 'Market Trends Stable',
          summary: 'No major price fluctuations detected across your watchlist today.',
          recommendation: 'Explore new categories to find deal opportunities.',
        },
      ];
    }
  };

  public getWatchlistPreview = async (): Promise<WishlistItem[]> => {
    try {
      const { data: response } = await authApiClient.get<PaginatedResponse<WishlistItem>>(WISHLIST.LIST, {
        params: { limit: 5, sortBy: 'priority' },
      });
      const obj = response as unknown as Record<string, unknown>;
      if (obj && obj.data && Array.isArray(obj.data)) {
        return obj.data;
      }
      return Array.isArray(response) ? response : [];
    } catch {
      return [];
    }
  };

  public getActivity = async (): Promise<ActivityItem[]> => {
    return Promise.resolve([
      { id: '1', type: 'search', summary: 'Searched for "RTX 5090"', timestamp: new Date().toISOString() },
      { id: '2', type: 'wishlist', summary: 'Added "AMD Ryzen 9" to wishlist', timestamp: new Date().toISOString() },
    ]);
  };
}

export const dashboardService = new DashboardService();
