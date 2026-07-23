'use client';
import type { QueryResource } from '@/hooks/queries/useDashboardData';
import type { ActivityItem } from '@/types/domain';
import { DashboardWidgetError } from '@/components/dashboard/DashboardWidgetError';
import { Skeleton } from '@/components/ui/skeleton';

export function Activity({ result }: { result: QueryResource<ActivityItem[]> }) {
  const { data, isFetching, isError, refetch } = result;

  if (isFetching && !data) return <Skeleton className="h-48 w-full rounded-lg" />;
  if (isError) return <DashboardWidgetError onRetry={refetch} />;
  if (!data || data.length === 0) return <div className="text-center text-xs text-ink-muted">No recent activity.</div>;

  return (
    <ul className="space-y-2">
      {data.map(item => (
        <li key={item.id} className="text-xs p-2 border-b">
          {item.summary} - <span className="text-ink-muted">{new Date(item.timestamp).toLocaleTimeString()}</span>
        </li>
      ))}
    </ul>
  );
}
