'use client';
import type { QueryResource } from '@/hooks/queries/useDashboardData';
import type { ActivityItem } from '@/types/domain';
import { WidgetError } from '@/components/shared/WidgetError';
import { Skeleton } from '@/components/ui/skeleton';

export function Activity({ result }: { result: QueryResource<ActivityItem[]> }) {
  const { data, isFetching, isError, refetch } = result;

  if (isFetching && !data) return <Skeleton className="h-48 w-full rounded-lg bg-secondary/30" />;
  if (isError) return <WidgetError onRetry={refetch} title="Failed to load activity" message="Could not fetch activity list." />;
  if (!data || data.length === 0) return <div className="text-center py-8 text-xs text-ink-muted border border-dashed border-border rounded-lg bg-surface/50">No recent activity.</div>;

  return (
    <ul className="space-y-3.5 pl-1 py-1">
      {data.slice(0, 5).map((item) => (
        <li key={item.id} className="flex items-start gap-3 text-xs text-ink-primary font-sans leading-relaxed">
          <span className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0 shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]" />
          <div className="flex-1 min-w-0">
            <span className="font-medium text-ink-primary block break-words">{item.summary}</span>
            <span className="text-[10px] text-ink-muted font-mono block mt-0.5">
              {new Date(item.timestamp).toLocaleString(undefined, {
                month: 'short',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
