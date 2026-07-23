"use client";

import * as React from "react";
import { DealScore } from "@/components/shared/DealScore";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface PriceOverviewSectionProps {
  className?: string;
}

export function PriceOverviewSection({ className }: PriceOverviewSectionProps) {
  const priceData = {
    currentPrice: 11249000,
    originalPrice: 13499000,
    discountPercent: 17,
    savingsAmount: 2250000,
    historicLow: 10499000,
    averagePrice: 12749000,
    dealScore: 94,
    summary: "The current price is 12% below the 180-day average and is close to its historical minimum.",
  };

  const statItems = [
    { label: "MSRP / Original", value: formatPrice(priceData.originalPrice), isMono: true },
    { label: "Total Savings", value: formatPrice(priceData.savingsAmount), isMono: true, highlight: "text-positive" },
    { label: "30-Day Avg Price", value: formatPrice(priceData.averagePrice), isMono: true },
    { label: "Historic Minimum", value: formatPrice(priceData.historicLow), isMono: true, highlight: "text-positive font-bold" },
  ];

  return (
    <section className={cn("bg-card border border-border p-6 rounded-xl shadow-sm space-y-6", className)}>
      {/* Header */}
      <div className="flex justify-between items-start pb-4 border-b border-border">
        <div>
          <h3 className="font-sans font-bold text-xs uppercase tracking-widest text-ink-muted">
            Price Analytics Summary
          </h3>
          <p className="text-[10px] text-ink-muted mt-0.5">Value Score Evaluation</p>
        </div>
        <DealScore score={priceData.dealScore} showLabel size="sm" />
      </div>

      {/* Main pricing block split */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="font-mono font-bold text-3xl text-ink-primary">
              {formatPrice(priceData.currentPrice)}
            </span>
            <Badge variant="positive" className="font-mono text-[10px] font-bold">
              -{priceData.discountPercent}%
            </Badge>
          </div>
          <p className="text-ink-muted text-xs">Best current market price verified</p>
        </div>
      </div>

      {/* Grid listing metrics using data-driven map */}
      <div className="grid grid-cols-2 gap-4">
        {statItems.map((item, idx) => (
          <div key={idx} className="p-3 bg-surface-subtle border border-border rounded-lg space-y-1">
            <span className="text-[10px] text-ink-muted uppercase font-bold tracking-wider block">
              {item.label}
            </span>
            <span className={cn("text-sm text-ink-primary font-sans block", item.isMono && "font-mono", item.highlight)}>
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* Quick summary text */}
      <div className="p-4 bg-muted/20 border border-border rounded-lg">
        <p className="text-body-sm text-ink-primary leading-relaxed">
          {priceData.summary}
        </p>
      </div>
    </section>
  );
}
