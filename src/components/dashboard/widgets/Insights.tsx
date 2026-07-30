"use client";

import type { QueryResource } from "@/hooks/queries/useDashboardData";
import type { DashboardInsight } from "@/types/domain";
import { WidgetError } from "@/components/shared/WidgetError";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, TrendingDown, PackageSearch, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// This is a new type based on the design, which isn't in the backend data yet
type InsightTag = {
  label: string;
  type: "positive" | "negative";
  icon: React.ReactNode;
};

// Mocking the tags from the design
const MOCKED_TAGS: InsightTag[] = [
  { label: "ELECTRONICS DIP", type: "positive", icon: <TrendingDown className="h-3 w-3" /> },
  { label: "LOW STOCK: RTX 5070", type: "negative", icon: <PackageSearch className="h-3 w-3" /> },
];

export function Insights({ result }: { result: QueryResource<DashboardInsight[]> }) {
  const { data, isFetching, isError, refetch } = result;

  if (isFetching && !data) return <Skeleton className="h-36 w-full rounded-xl" />;
  if (isError) return <WidgetError onRetry={refetch} title="Failed to load AI brief" message="Could not fetch insights today." />;
  
  const mainInsight = data?.[0]; // The design shows one main brief, not a list

  return (
    <div className="flex flex-col gap-3">
      {/* Tag Chips from design */}
      <div className="flex items-center gap-2">
        {MOCKED_TAGS.map((tag) => (
          <div
            key={tag.label}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold uppercase tracking-wider",
              tag.type === 'positive' && 'bg-positive/5 border-positive/20 text-positive',
              tag.type === 'negative' && 'bg-negative/5 border-negative/20 text-negative',
            )}
          >
            {tag.icon}
            {tag.label}
          </div>
        ))}
      </div>

      {/* Main Insight Card */}
      {!mainInsight ? (
        <div className="text-center text-xs text-ink-muted py-8">No insights available today.</div>
      ) : (
        <div
          key={mainInsight.id}
          className="p-4 border border-ai-border bg-gradient-to-br from-ai-bg/60 to-ai-bg/40 rounded-xl flex flex-col gap-2 relative overflow-hidden transition-all hover:shadow-sm"
        >
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-purple-600/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <h4 className="font-sans font-bold text-sm text-ink-primary leading-tight">
              {mainInsight.title}
            </h4>
          </div>

          <p className="text-xs text-ink-muted leading-relaxed font-sans pl-8">
            {mainInsight.summary}
          </p>

          {mainInsight.recommendation && (
            <div className="mt-1 pl-8 flex items-center justify-between text-[11px] text-purple-700 dark:text-purple-300 font-medium">
              <span>💡 Recommendation: {mainInsight.recommendation}</span>
              {mainInsight.relatedProductId && (
                <Link
                  href={`/product/${mainInsight.relatedProductId}`}
                  className="flex items-center gap-0.5 hover:underline text-primary"
                >
                  View Product <ArrowUpRight className="h-3 w-3" />
                </Link>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
