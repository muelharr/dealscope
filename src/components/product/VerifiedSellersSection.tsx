"use client";

import * as React from "react";
import { Store, ShieldCheck, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export interface VerifiedSellersSectionProps {
  className?: string;
}

export function VerifiedSellersSection({ className }: VerifiedSellersSectionProps) {
  const sellers = [
    { id: "amazon", name: "Amazon", trust: "99.2% Trust", isOos: false, isElite: true },
    { id: "bestbuy", name: "Best Buy", trust: "98.8% Trust", isOos: false, isElite: true },
    { id: "newegg", name: "Newegg", trust: "92.4% Trust", isOos: false, isElite: false },
    { id: "bhphoto", name: "B&H Photo", trust: "Out of Stock", isOos: true, isElite: false },
  ];

  return (
    <section className={cn("space-y-6 w-full pt-8 border-t border-border", className)}>
      <h2 className="font-sans font-bold text-headline-lg text-ink-primary">Verified Sellers</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {sellers.map((seller) => (
          <div
            key={seller.id}
            className={cn(
              "p-4 bg-muted/20 rounded-xl border border-border flex items-center gap-4",
              seller.isOos && "opacity-60"
            )}
          >
            <div
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
                seller.isOos ? "bg-muted text-ink-muted" : "bg-primary/10 text-primary"
              )}
            >
              <Store className="size-5" />
            </div>
            <div>
              <div className="font-bold text-body-md text-ink-primary">{seller.name}</div>
              {seller.isOos ? (
                <div className="text-[10px] uppercase font-bold text-ink-muted">Out of Stock</div>
              ) : (
                <div className="flex items-center gap-1 text-positive font-bold text-xs uppercase tracking-tight select-none">
                  {seller.isElite ? (
                    <ShieldCheck className="size-3.5" />
                  ) : (
                    <Info className="size-3.5 text-caution" />
                  )}
                  <span>{seller.trust}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
