"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { ComparisonSummaryData } from "@/types/domain";

export interface ComparisonSummaryCardsProps {
  data: ComparisonSummaryData;
  className?: string;
}

export function ComparisonSummaryCards({ data, className }: ComparisonSummaryCardsProps) {
  const { productsCount, bestOverallName, avgDealScore, lastUpdated } = data;

  const cardItems = [
    { label: "Comparing", value: `${productsCount} Products` },
    { label: "Best Overall", value: bestOverallName, highlight: "text-primary font-bold" },
    ...(avgDealScore !== undefined
      ? [
          {
            label: "Avg. Deal Score",
            value: (
              <>
                {avgDealScore}{" "}
                <span className="text-positive text-body-sm font-normal">/ 100</span>
              </>
            ),
          },
        ]
      : []),
    {
      label: "Last Updated",
      value: (
        <>
          Today{" "}
          <span className="text-ink-muted text-body-sm font-normal">{lastUpdated}</span>
        </>
      ),
    },
  ];

  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-4 gap-6 w-full select-none", className)}>
      {cardItems.map((item, idx) => (
        <div
          key={idx}
          className="bg-card p-4 rounded-xl border border-border flex flex-col justify-center space-y-1 shadow-sm hover:border-border-interactive transition-all"
        >
          <span className="font-sans text-[10px] font-bold text-ink-muted uppercase tracking-wider block">
            {item.label}
          </span>
          <span className={cn("text-headline-md font-sans font-extrabold text-ink-primary block leading-none", item.highlight)}>
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}
