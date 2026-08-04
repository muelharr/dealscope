'use client';
import type { QueryResource } from '@/hooks/queries/useDashboardData';
import type { DashboardMetric } from '@/types/domain';
import { WidgetError } from '@/components/shared/WidgetError';
import { KeyMetricCard, KeyMetricCardSkeleton } from './KeyMetricCard';
import { Bookmark, Bell, DollarSign } from 'lucide-react';
import { useWishlist } from '@/hooks/queries/useWishlist';
import { usePriceAlerts } from '@/hooks/queries/usePriceAlerts';
import { formatPrice } from '@/lib/format';

export function KeyMetrics({ result }: { result: QueryResource<DashboardMetric[]> }) {
  const { isFetching, isError, refetch } = result;
  const { data: wishlistData } = useWishlist();
  const { data: alertsData, isLoading: isAlertsLoading } = usePriceAlerts();

  const wishlistCount = wishlistData?.length ?? 0;
  const activeAlertsCount = alertsData?.filter((a) => a.isEnabled).length ?? 0;
  
  // Calculate dynamic potential savings
  const potentialSavings = wishlistData?.reduce((acc, item) => {
    const offers = item.product?.offers || [];
    if (offers.length > 0) {
      const bestOffer = [...offers].sort((a, b) => a.price - b.price)[0];
      if (bestOffer && bestOffer.originalPrice && bestOffer.originalPrice > bestOffer.price) {
        return acc + (bestOffer.originalPrice - bestOffer.price);
      }
    }
    return acc;
  }, 0) ?? 0;

  const totalSavings = formatPrice(potentialSavings);

  if ((isFetching || isAlertsLoading) && !wishlistData) {
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
