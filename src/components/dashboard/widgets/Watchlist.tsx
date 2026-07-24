'use client';
import type { QueryResource } from '@/hooks/queries/useDashboardData';
import type { WishlistItem } from '@/types/domain';
import { WidgetError } from '@/components/shared/WidgetError';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductCard } from '@/components/shared/ProductCard';

export function Watchlist({ result }: { result: QueryResource<WishlistItem[]> }) {
  const { data, isFetching, isError, refetch } = result;

  if (isFetching && !data) return <Skeleton className="h-48 w-full rounded-lg" />;
  if (isError) return <WidgetError onRetry={refetch} title="Failed to load watchlist" message="Could not fetch watchlisted items." />;
  if (!data || data.length === 0) return <div className="text-center text-xs text-ink-muted">Your watchlist is empty.</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {data.map(item => (
        <ProductCard key={item.id} product={item.product} />
      ))}
    </div>
  );
}
