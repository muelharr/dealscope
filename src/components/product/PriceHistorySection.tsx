"use client";

import * as React from "react";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface PriceHistoryPoint {
  date: string;
  price: number;
}

export interface PriceHistorySectionProps {
  className?: string;
}

const MOCK_HISTORY_POINTS: PriceHistoryPoint[] = [
  { date: "Nov 1", price: 12600000 },
  { date: "Nov 5", price: 12900000 },
  { date: "Nov 10", price: 11900000 },
  { date: "Nov 15", price: 13400000 },
  { date: "Nov 20", price: 11200000 },
  { date: "Nov 25", price: 10800000 },
  { date: "Today", price: 11249000 },
];

export function PriceHistorySection({ className }: PriceHistorySectionProps) {
  const tabs = ["7D", "30D", "90D", "1Y"];
  const [activeTab, setActiveTab] = React.useState("30D");

  // Calculate percentage height of each price point relative to the maximum price in the list
  const maxPrice = Math.max(...MOCK_HISTORY_POINTS.map((p) => p.price));
  const minPrice = Math.min(...MOCK_HISTORY_POINTS.map((p) => p.price));
  const range = maxPrice - minPrice || 1;

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
        {MOCK_HISTORY_POINTS.map((point, idx) => {
          // Normalize height between 25% and 95% to preserve layout proportions from Stitch
          const heightPercent = 25 + ((point.price - minPrice) / range) * 70;
          const isCurrent = idx === MOCK_HISTORY_POINTS.length - 1;

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
        <span>Nov 1</span>
        <span>Nov 15</span>
        <span>Today</span>
      </div>
    </section>
  );
}
