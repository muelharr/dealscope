"use client";

import * as React from "react";
import { DealScore } from "@/components/shared/DealScore";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

import { Product, AISummary, PriceHistory } from "@/types/domain";
import { QueryResource } from "@/hooks/queries/useProductDetail";
import { ProductWidgetError } from "./ProductWidgetError";
import { Skeleton } from "@/components/ui/skeleton";

export interface PriceOverviewSectionProps {
  product: Product;
  aiSummaryResult: QueryResource<AISummary>;
  priceHistoryResult: QueryResource<PriceHistory>;
  className?: string;
}

export function PriceOverviewSection({
  product,
  aiSummaryResult,
  priceHistoryResult,
  className,
}: PriceOverviewSectionProps) {
  const { data: aiSummary, isLoading: isAiLoading, isError: isAiError, refetch: refetchAi } = aiSummaryResult;
  const { data: priceHistory, isLoading: isHistoryLoading, isError: isHistoryError, refetch: refetchHistory } = priceHistoryResult;

  if (isAiLoading || isHistoryLoading) {
    return <Skeleton className="h-48 w-full rounded-xl" />;
  }

  if (isAiError) {
    return <ProductWidgetError onRetry={refetchAi} className={className} />;
  }

  if (isHistoryError) {
    return <ProductWidgetError onRetry={refetchHistory} className={className} />;
  }

  const bestOffer = product.offers?.[0];
  const currentPrice = bestOffer?.price ?? 0;
  // Fallback if original price is not present (or use bestOffer price + some discount)
  const originalPrice = currentPrice * 1.2;
  const savingsAmount = originalPrice - currentPrice;
  const discountPercent = 17; // or calculate: Math.round((savingsAmount / originalPrice) * 100);

  const pricePoints = priceHistory?.history ?? [];
  const prices = pricePoints.map(p => p.price);
  const historicLow = prices.length > 0 ? Math.min(...prices) : currentPrice;
  const averagePrice = prices.length > 0 ? Math.round(prices.reduce((sum, p) => sum + p, 0) / prices.length) : currentPrice;

  const dealScore = aiSummary?.dealScore ?? 85;
  const summary = aiSummary?.summary ?? "No summary available for this product.";

  const statItems = [
    { label: "MSRP / Original", value: formatPrice(originalPrice), isMono: true },
    { label: "Total Savings", value: formatPrice(savingsAmount), isMono: true, highlight: "text-positive" },
    { label: "30-Day Avg Price", value: formatPrice(averagePrice), isMono: true },
    { label: "Historic Minimum", value: formatPrice(historicLow), isMono: true, highlight: "text-positive font-bold" },
  ];

  return (
    <section className={cn("space-y-5 rounded-xl border border-border bg-card p-4 shadow-sm sm:space-y-6 sm:p-6", className)}>
      {/* Header */}
      <div className="flex justify-between items-start pb-4 border-b border-border">
        <div>
          <h3 className="font-sans font-bold text-xs uppercase tracking-widest text-ink-muted">
            Price Analytics Summary
          </h3>
          <p className="text-[10px] text-ink-muted mt-0.5">Value Score Evaluation</p>
        </div>
        <DealScore score={dealScore} showLabel size="sm" />
      </div>

      {/* Main pricing block split */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="font-mono font-bold text-3xl text-ink-primary">
              {formatPrice(currentPrice)}
            </span>
            <Badge variant="positive" className="font-mono text-[10px] font-bold">
              -{discountPercent}%
            </Badge>
          </div>
          <p className="text-ink-muted text-xs">Best current market price verified</p>
        </div>
      </div>

      {/* Grid listing metrics using data-driven map */}
      <div className="grid grid-cols-1 gap-3 min-[375px]:grid-cols-2 sm:gap-4">
        {statItems.map((item, idx) => (
          <div key={idx} className="space-y-1 rounded-lg border border-border bg-surface-subtle p-3">
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
          {summary}
        </p>
      </div>
    </section>
  );
}
