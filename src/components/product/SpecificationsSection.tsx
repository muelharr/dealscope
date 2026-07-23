"use client";

import * as React from "react";
import { ListChecks } from "lucide-react";
import { cn } from "@/lib/utils";


import { QueryResource } from "@/hooks/queries/useProductDetail";
import { SpecificationGroup } from "@/types/domain";
import { ProductWidgetError } from "./ProductWidgetError";
import { Skeleton } from "@/components/ui/skeleton";

export interface SpecificationsSectionProps {
  specificationsResult: QueryResource<SpecificationGroup[]>;
  className?: string;
}

export function SpecificationsSection({ specificationsResult, className }: SpecificationsSectionProps) {
  const { data: specifications, isLoading, isError, refetch } = specificationsResult;

  if (isLoading) {
    return <Skeleton className="h-40 w-full rounded-xl" />;
  }

  if (isError) {
    return <ProductWidgetError onRetry={refetch} className={className} />;
  }

  if (!specifications || specifications.length === 0) {
    return (
      <section className={cn("bg-card border border-border p-6 rounded-xl shadow-sm select-none", className)}>
        <h3 className="font-sans font-bold text-base text-ink-primary mb-4">Specifications</h3>
        <p className="text-ink-muted text-sm">No specifications available for this product.</p>
      </section>
    );
  }

  return (
    <section className={cn("bg-card border border-border p-6 rounded-xl shadow-sm space-y-6", className)}>
      <div className="flex items-center gap-2 pb-2 border-b border-border/40 select-none">
        <ListChecks className="size-4 text-primary" />
        <h3 className="font-sans font-bold text-xs uppercase tracking-widest text-ink-muted">
          Specifications
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {specifications.map((group) => (
          <div key={group.id} className="space-y-3">
            <h4 className="font-sans text-xs font-bold text-ink-muted/80 uppercase tracking-wider select-none">
              {group.title}
            </h4>
            <div className="space-y-2">
              {group.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center py-2 border-b border-border/30 text-body-sm"
                >
                  <span className="text-ink-muted font-sans">{item.label}</span>
                  <span className="text-ink-primary font-bold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
