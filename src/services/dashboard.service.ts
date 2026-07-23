/**
 * Dashboard Service
 *
 * Fetches all data required for the user's main dashboard.
 */

import { authApiClient } from '@/auth';
import { DASHBOARD, WISHLIST } from '@/api/endpoints';
import type { PaginatedResponse } from '@/types/api';
import type { DashboardMetric, DashboardInsight, WishlistItem, ActivityItem } from '@/types/domain';

class DashboardService {
  public async getMetrics(): Promise<DashboardMetric[]> {
    const { data: response } = await authApiClient.get<{ metrics: DashboardMetric[] }>(DASHBOARD.METRICS);
    return response.metrics;
  }

  public async getInsights(): Promise<DashboardInsight[]> {
    const { data: response } = await authApiClient.get<{ insights: DashboardInsight[] }>(DASHBOARD.INSIGHTS);
    return response.insights;
  }

  public async getWatchlistPreview(): Promise<WishlistItem[]> {
    const { data: response } = await authApiClient.get<PaginatedResponse<WishlistItem>>(WISHLIST.LIST, {
      params: { limit: 5, sortBy: 'priority' },
    });
    return response.data;
  }

  public async getActivity(): Promise<ActivityItem[]> {
    // Assuming ACTIVITY endpoint exists and returns ActivityItem[]
    // This part is speculative based on the architecture doc
    // const { data: response } = await authApiClient.get<PaginatedResponse<ActivityItem>>(ACTIVITY.LIST, {
    //   params: { limit: 10 },
    // });
    // return response.data;

    // Returning mock data as the ACTIVITY endpoint is not confirmed yet.
    console.warn("Returning mock data for getActivity() as endpoint is not fully defined.");
    return Promise.resolve([
      { id: '1', type: 'search', summary: 'Searched for "RTX 5090"', timestamp: new Date().toISOString() },
      { id: '2', type: 'wishlist', summary: 'Added "AMD Ryzen 9" to wishlist', timestamp: new Date().toISOString() },
    ]);
  }
}

export const dashboardService = new DashboardService();
