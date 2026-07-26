"use client";

import type { QueryResource } from "@/hooks/queries/useDashboardData";
import type { DashboardInsight } from "@/types/domain";
import { WidgetError } from "@/components/shared/WidgetError";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export function Insights({ result }: { result: QueryResource<DashboardInsight[]> }) {
  const { data, isFetching, isError, refetch } = result;

  if (isFetching && !data) return <Skeleton className="h-28 w-full rounded-xl" />;
  if (isError) return <WidgetError onRetry={refetch} title="Failed to load insights" message="Could not fetch insights today." />;
  if (!data || data.length === 0) return <div className="text-center text-xs text-ink-muted">No insights available today.</div>;

  return (
    <div className="flex flex-col gap-3">
      {data.map((insight) => (
        <div
          key={insight.id}
          className="p-4 border border-ai-border bg-ai-bg/60 rounded-xl flex flex-col gap-2 relative overflow-hidden transition-all hover:shadow-sm"
        >
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-purple-600/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <h4 className="font-sans font-bold text-sm text-ink-primary leading-tight">
              {insight.title}
            </h4>
          </div>

          <p className="text-xs text-ink-muted leading-relaxed font-sans pl-8">
            {insight.summary}
          </p>

          {insight.recommendation && (
            <div className="mt-1 pl-8 flex items-center justify-between text-[11px] text-purple-700 dark:text-purple-300 font-medium">
              <span>💡 Recommendation: {insight.recommendation}</span>
              {insight.relatedProductId && (
                <Link
                  href={`/product/${insight.relatedProductId}`}
                  className="flex items-center gap-0.5 hover:underline text-primary"
                >
                  View Product <ArrowUpRight className="h-3 w-3" />
                </Link>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
