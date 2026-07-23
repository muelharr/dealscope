"use client";

import * as React from "react";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

import { QueryResource } from "@/hooks/queries/useProductDetail";
import { Product } from "@/types/domain";
import { ProductWidgetError } from "./ProductWidgetError";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

export interface SimilarProductsSectionProps {
  similarProductsResult: QueryResource<Product[]>;
  className?: string;
}

export function SimilarProductsSection({ similarProductsResult, className }: SimilarProductsSectionProps) {
  const { data: alternatives, isLoading, isError, refetch } = similarProductsResult;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  if (isError) {
    return <ProductWidgetError onRetry={refetch} className={className} />;
  }

  if (!alternatives || alternatives.length === 0) {
    return (
      <section className={cn("space-y-6 w-full select-none", className)}>
        <h2 className="font-sans font-bold text-headline-lg text-ink-primary">
          Market Alternatives
        </h2>
        <p className="text-ink-muted text-sm">No alternative products found in this category.</p>
      </section>
    );
  }

  return (
    <section className={cn("space-y-6 w-full", className)}>
      <h2 className="font-sans font-bold text-headline-lg text-ink-primary">
        Market Alternatives
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {alternatives.map((alt) => {
          const price = alt.offers?.[0]?.price ?? 0;
          // Mock score and type since it depends on AI analysis which is separate
          const score = 85;
          const scoreType = "positive";
          const scoreClass = {
            positive: "bg-positive/10 text-positive",
            warning: "bg-caution/10 text-caution",
            critical: "bg-negative/10 text-negative",
          }[scoreType];

          return (
            <div
              key={alt.id}
              className="bg-card border border-border rounded-xl p-5 group hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="aspect-video bg-surface-subtle rounded-lg mb-4 flex items-center justify-center p-4 border border-border/40 select-none relative">
                  {alt.images && alt.images.length > 0 ? (
                    <Image
                      src={alt.images[0]}
                      alt={alt.name}
                      fill
                      unoptimized
                      className="object-contain p-2"
                    />
                  ) : (
                    <span className="text-ink-muted text-xs font-semibold">Image Placeholder</span>
                  )}
                </div>
                <div className="flex justify-between items-start mb-2 gap-2">
                  <h4 className="font-sans font-bold text-sm text-ink-primary truncate">
                    {alt.name}
                  </h4>
                  <div className={cn("px-2 py-0.5 rounded text-[9px] font-bold shrink-0 select-none", scoreClass)}>
                    {score} SCORE
                  </div>
                </div>
                <div className="font-mono font-bold text-sm text-ink-primary">
                  {formatPrice(price)}
                </div>
              </div>
              <p className="text-body-sm text-ink-muted mt-2 leading-relaxed line-clamp-2">
                {alt.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
