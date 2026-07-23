"use client";

import * as React from "react";
import { ShieldCheck, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { MarketplaceOffer } from "@/types/domain";
import { QueryResource } from "@/hooks/queries/useProductDetail";
import { ProductWidgetError } from "./ProductWidgetError";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/format";

export interface MarketplaceOffersSectionProps {
  offersResult: QueryResource<MarketplaceOffer[]>;
  className?: string;
}

export function MarketplaceOffersSection({ offersResult, className }: MarketplaceOffersSectionProps) {
  const { data: offers, isLoading, isError, refetch } = offersResult;

  if (isLoading) {
    return <Skeleton className="h-64 w-full rounded-xl" />;
  }

  if (isError) {
    return <ProductWidgetError onRetry={refetch} className={className} />;
  }

  if (!offers || offers.length === 0) {
    return (
      <section className={cn("bg-card border border-border rounded-xl p-8 text-center shadow-sm select-none", className)}>
        <p className="text-ink-muted text-sm">No marketplace offers currently available for this product.</p>
      </section>
    );
  }

  const getBadgeConfig = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("amazon")) {
      return { initial: "A", color: "bg-ink-primary text-white" };
    }
    if (lowerName.includes("best buy") || lowerName.includes("bestbuy")) {
      return { initial: "B", color: "bg-primary text-primary-foreground" };
    }
    if (lowerName.includes("newegg")) {
      return { initial: "N", color: "bg-[#ff6600] text-white" };
    }
    return { initial: name.charAt(0).toUpperCase(), color: "bg-muted text-ink-muted" };
  };

  return (
    <section className={cn("bg-card border border-border rounded-xl overflow-hidden shadow-sm", className)}>
      {/* Table Header block */}
      <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-muted/20 select-none">
        <h3 className="font-sans font-bold text-base text-ink-primary">Marketplace Offers</h3>
        <span className="font-sans text-[10px] font-bold text-ink-muted uppercase tracking-wider">
          Live Data
        </span>
      </div>

      {/* Table listing */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/10 font-sans text-[10px] font-bold uppercase tracking-wider border-b border-border text-ink-muted select-none">
              <th className="px-6 py-4">Marketplace</th>
              <th className="px-6 py-4">Seller</th>
              <th className="px-6 py-4 text-right">Price</th>
              <th className="px-6 py-4">Trust</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border font-sans text-body-sm text-ink-primary">
            {offers.map((offer) => {
              const badge = getBadgeConfig(offer.marketplace.name);
              // Mock trust score for now as it's not in the new domain model
              const trustScore = 95;
              const isElite = trustScore >= 95;

              return (
                <tr key={offer.id} className="hover:bg-muted/25 transition-colors group">
                  <td className="px-6 py-4 flex items-center gap-2">
                    <div className={cn("w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold select-none", badge.color)}>
                      {badge.initial}
                    </div>
                    <span className="font-semibold">{offer.marketplace.name}</span>
                  </td>
                  <td className="px-6 py-4 text-ink-muted">{offer.seller}</td>
                  <td className="px-6 py-4 text-right font-mono font-bold">{formatPrice(offer.price)}</td>
                  <td className="px-6 py-4">
                    <div
                      className={cn(
                        "flex items-center gap-1 font-bold",
                        isElite ? "text-positive" : "text-caution"
                      )}
                    >
                      {isElite ? <ShieldCheck className="size-4" /> : <Info className="size-4" />}
                      <span>{trustScore}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      variant="ghost"
                      className="px-4 py-1.5 h-auto rounded-full text-primary hover:bg-primary hover:text-white transition-all font-semibold font-sans text-xs border border-transparent hover:border-primary"
                      asChild
                    >
                      <a href={offer.url} target="_blank" rel="noopener noreferrer">
                        View Analysis
                      </a>
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
