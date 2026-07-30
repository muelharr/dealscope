'use client';
import type { QueryResource } from '@/hooks/queries/useDashboardData';
import type { DashboardMetric } from '@/types/domain';
import { WidgetError } from '@/components/shared/WidgetError';
import { KeyMetricCard, KeyMetricCardSkeleton } from './KeyMetricCard';
import { Bookmark, Bell, DollarSign } from 'lucide-react';
import { useWishlist } from '@/hooks/queries/useWishlist';
// Assuming a new hook for alerts, we'll mock it for now.
// import { useAlerts } from '@/hooks/queries/useAlerts';

export function KeyMetrics({ result }: { result: QueryResource<DashboardMetric[]> }) {
  const { isFetching, isError, refetch } = result;
  const { data: wishlistData } = useWishlist();
  // Mock alerts data
  const activeAlertsCount = 5; 

  const wishlistCount = wishlistData?.length ?? 0;
  
  // Assuming a static value for savings from the design
  const totalSavings = "$1,204";

  if (isFetching && !wishlistData) {
    return (
      <div className="space-y-4">
        <KeyMetricCardSkeleton />
        <KeyMetricCardSkeleton />
        <KeyMetricCardSkeleton />
      </div>
    );
  }

  if (isError) {
    return <WidgetError onRetry={refetch} title="Failed to load metrics" message="Could not fetch key metrics." />;
  }

  return (
    <div className="space-y-3">
      <KeyMetricCard
        label="Saved in Wishlist"
        value={wishlistCount}
        icon={<Bookmark className="h-full w-full" />}
      />
      <KeyMetricCard
        label="Active Alerts"
        value={activeAlertsCount}
        icon={<Bell className="h-full w-full" />}
      />
      <KeyMetricCard
        label="Total Potential Savings"
        value={totalSavings}
        icon={<DollarSign className="h-full w-full" />}
        variant="gradient"
      />
    </div>
  );
}
