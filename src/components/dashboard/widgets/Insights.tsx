'use client';
import type { QueryResource } from '@/hooks/queries/useDashboardData';
import type { DashboardInsight } from '@/types/domain';
import { WidgetError } from '@/components/shared/WidgetError';
import { Skeleton } from '@/components/ui/skeleton';

export function Insights({ result }: { result: QueryResource<DashboardInsight[]> }) {
  const { data, isFetching, isError, refetch } = result;

  if (isFetching && !data) return <Skeleton className="h-24 w-full rounded-lg" />;
  if (isError) return <WidgetError onRetry={refetch} title="Failed to load insights" message="Could not fetch insights today." />;
  if (!data || data.length === 0) return <div className="text-center text-xs text-ink-muted">No insights today.</div>;

  return (
    <div className="space-y-3">
      {data.map(insight => (
        <div key={insight.id} className="p-3 border rounded-lg bg-surface">
          <p className="font-bold text-sm">{insight.title}</p>
          <p className="text-xs text-ink-muted">{insight.summary}</p>
        </div>
      ))}
    </div>
  );
}
