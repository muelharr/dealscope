'use client';
import type { QueryResource } from '@/hooks/queries/useDashboardData';
import type { DashboardMetric } from '@/types/domain';
import { DashboardWidgetError } from '@/components/dashboard/DashboardWidgetError';
import { Skeleton } from '@/components/ui/skeleton';

export function KeyMetrics({ result }: { result: QueryResource<DashboardMetric[]> }) {
  const { data, isFetching, isError, refetch } = result;

  if (isFetching && !data) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  if (isError) {
    return <DashboardWidgetError onRetry={refetch} />;
  }

  if (!data || data.length === 0) {
    return <div className="text-center text-xs text-ink-muted">No metrics available.</div>;
  }

  return (
    <div className="space-y-2">
      {data.map(metric => (
        <div key={metric.id} className="p-3 border rounded-lg bg-surface">
          <p className="text-xs text-ink-muted">{metric.label}</p>
          <p className="text-xl font-bold">{metric.value}</p>
        </div>
      ))}
    </div>
  );
}
