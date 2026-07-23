"use client";

import * as React from "react";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface PriceHistoryPoint {
  date: string;
  price: number;
}

import { QueryResource } from "@/hooks/queries/useProductDetail";
import { PriceHistory } from "@/types/domain";
import { ProductWidgetError } from "./ProductWidgetError";
import { Skeleton } from "@/components/ui/skeleton";

export interface PriceHistoryPoint {
  date: string;
  price: number;
}

export interface PriceHistorySectionProps {
  priceHistoryResult: QueryResource<PriceHistory>;
  className?: string;
}

export function PriceHistorySection({ priceHistoryResult, className }: PriceHistorySectionProps) {
  const { data: priceHistory, isLoading, isError, refetch } = priceHistoryResult;
  const tabs = ["7D", "30D", "90D", "1Y"];
  const [activeTab, setActiveTab] = React.useState("30D");

  if (isLoading) {
    return <Skeleton className="h-56 w-full rounded-xl" />;
  }

  if (isError) {
    return <ProductWidgetError onRetry={refetch} className={className} />;
  }

  const historyPoints: PriceHistoryPoint[] = (priceHistory?.history ?? []).map(p => ({
    date: new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    price: p.price,
  }));

  if (historyPoints.length === 0) {
    return (
      <section className={cn("bg-card border border-border p-6 rounded-xl shadow-sm select-none", className)}>
        <h3 className="font-sans font-bold text-base text-ink-primary mb-4">Price History</h3>
        <p className="text-ink-muted text-sm">No price history data available for this product.</p>
      </section>
    );
  }

  // Calculate percentage height of each price point relative to the maximum price in the list
  const maxPrice = Math.max(...historyPoints.map((p) => p.price));
  const minPrice = Math.min(...historyPoints.map((p) => p.price));
  const range = maxPrice - minPrice || 1;

  const firstDate = historyPoints[0]?.date ?? "";
  const middleDate = historyPoints[Math.floor(historyPoints.length / 2)]?.date ?? "";
  const lastDate = historyPoints[historyPoints.length - 1]?.date ?? "Today";

  return (
    <section className={cn("bg-card border border-border p-6 rounded-xl shadow-sm", className)}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-sans font-bold text-base text-ink-primary">Price History</h3>
        <div className="flex gap-1 p-1 bg-surface-subtle rounded-lg border border-border/40 select-none">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-2.5 py-1 text-[10px] font-bold rounded transition-colors cursor-pointer",
                activeTab === tab
                  ? "bg-primary text-white"
                  : "text-ink-muted hover:bg-muted/60"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Bar chart mock representing historic rates */}
      <div className="h-48 w-full relative flex items-end gap-1.5 pt-4 border-b border-border/40 pb-2 select-none">
        {historyPoints.map((point, idx) => {
          // Normalize height between 25% and 95% to preserve layout proportions from Stitch
          const heightPercent = 25 + ((point.price - minPrice) / range) * 70;
          const isCurrent = idx === historyPoints.length - 1;

          return (
            <div
              key={idx}
              style={{ height: `${heightPercent}%` }}
              className={cn(
                "flex-1 rounded-t transition-all cursor-help hover:bg-primary",
                isCurrent ? "bg-primary" : "bg-primary/20"
              )}
              title={`${point.date}: ${formatPrice(point.price)}`}
            ></div>
          );
        })}
      </div>

      {/* Time axis text */}
      <div className="mt-3 flex justify-between text-[10px] font-bold text-ink-muted uppercase tracking-wider select-none">
        <span>{firstDate}</span>
        <span>{middleDate}</span>
        <span>{lastDate}</span>
      </div>
    </section>
  );
}
