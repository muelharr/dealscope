"use client";

import * as React from "react";
import { Store, ShieldCheck, Info } from "lucide-react";
import { cn } from "@/lib/utils";

import { QueryResource } from "@/hooks/queries/useProductDetail";
import { VerifiedSeller } from "@/types/domain";
import { ProductWidgetError } from "./ProductWidgetError";
import { Skeleton } from "@/components/ui/skeleton";

export interface VerifiedSellersSectionProps {
  verifiedSellersResult: QueryResource<VerifiedSeller[]>;
  className?: string;
}

export function VerifiedSellersSection({ verifiedSellersResult, className }: VerifiedSellersSectionProps) {
  const { data: sellers, isLoading, isError, refetch } = verifiedSellersResult;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-border">
        <Skeleton className="h-20 w-full rounded-xl" />
        <Skeleton className="h-20 w-full rounded-xl" />
        <Skeleton className="h-20 w-full rounded-xl" />
        <Skeleton className="h-20 w-full rounded-xl" />
      </div>
    );
  }

  if (isError) {
    return <ProductWidgetError onRetry={refetch} className={className} />;
  }

  if (!sellers || sellers.length === 0) {
    return (
      <section className={cn("space-y-6 w-full pt-8 border-t border-border select-none", className)}>
        <h2 className="font-sans font-bold text-headline-lg text-ink-primary">
          Verified Sellers
        </h2>
        <p className="text-ink-muted text-sm">No verified sellers available for this product.</p>
      </section>
    );
  }

  return (
    <section className={cn("space-y-6 w-full pt-8 border-t border-border", className)}>
      <h2 className="font-sans font-bold text-headline-lg text-ink-primary select-none">
        Verified Sellers
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {sellers.map((seller) => (
          <div
            key={seller.id}
            className={cn(
              "p-4 bg-muted/20 rounded-xl border border-border flex items-center gap-4",
              seller.isOutOfStock && "opacity-60"
            )}
          >
            {/* Store Icon */}
            <div
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center shrink-0 select-none",
                seller.isOutOfStock ? "bg-muted text-ink-muted" : "bg-primary/10 text-primary"
              )}
            >
              <Store className="size-5" />
            </div>

            {/* Seller Info Details */}
            <div>
              <div className="font-bold text-body-md text-ink-primary">{seller.name}</div>
              {seller.isOutOfStock ? (
                <div className="text-[10px] uppercase font-bold text-ink-muted select-none">
                  Out of Stock
                </div>
              ) : (
                <div className="flex items-center gap-1 text-positive font-bold text-xs uppercase tracking-tight select-none">
                  {seller.verified ? (
                    <ShieldCheck className="size-3.5" />
                  ) : (
                    <Info className="size-3.5 text-caution" />
                  )}
                  <span>{seller.trustScore}% Trust</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
