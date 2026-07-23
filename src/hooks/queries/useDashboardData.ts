"use client";

import { useQueries } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboard.service';
import { queryKeys } from '@/hooks/queryKeys';
import { userDataQueryOptions, volatileDataQueryOptions } from '@/hooks/queryDefaults';
import type { DashboardMetric, DashboardInsight, WishlistItem, ActivityItem } from '@/types/domain';
import type { ApiClientError } from '@/api';
import type { UseQueryResult } from '@tanstack/react-query';

// Reusable generic type for the resource state
export type QueryResource<T> = UseQueryResult<T, ApiClientError>;

export const useDashboardData = () => {
  const [
    metricsResult,
    insightsResult,
    watchlistResult,
    activityResult,
  ] = useQueries({
    queries: [
      {
        queryKey: queryKeys.dashboard.metrics(),
        queryFn: dashboardService.getMetrics,
        ...userDataQueryOptions,
      },
      {
        queryKey: queryKeys.dashboard.insights(),
        queryFn: dashboardService.getInsights,
        ...userDataQueryOptions,
      },
      {
        queryKey: queryKeys.wishlist.lists({ limit: 5, sortBy: 'priority' }),
        queryFn: dashboardService.getWatchlistPreview,
        ...volatileDataQueryOptions, // Watchlist prices are volatile
      },
      {
        queryKey: queryKeys.dashboard.activity(),
        queryFn: dashboardService.getActivity,
        ...userDataQueryOptions,
      },
    ],
  });

  const isInitialLoading = [metricsResult, insightsResult, watchlistResult, activityResult].some(
    (r) => r.isLoading
  );

  return {
    metrics: metricsResult as QueryResource<DashboardMetric[]>,
    insights: insightsResult as QueryResource<DashboardInsight[]>,
    watchlist: watchlistResult as QueryResource<WishlistItem[]>,
    activity: activityResult as QueryResource<ActivityItem[]>,
    isInitialLoading,
  };
};
