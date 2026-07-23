"use client";

import * as React from "react";
import { Store, ShieldCheck, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export interface VerifiedSeller {
  id: string;
  name: string;
  marketplace: string;
  trustScore: number;
  rating: number;
  verified: boolean;
  shipping: string;
  isOos?: boolean;
}

export interface VerifiedSellersSectionProps {
  className?: string;
}

const MOCK_SELLERS: VerifiedSeller[] = [
  {
    id: "amazon",
    name: "Amazon",
    marketplace: "Amazon.com",
    trustScore: 99.2,
    rating: 4.8,
    verified: true,
    shipping: "Ships in 2 days",
    isOos: false,
  },
  {
    id: "bestbuy",
    name: "Best Buy",
    marketplace: "Best Buy Official",
    trustScore: 98.8,
    rating: 4.7,
    verified: true,
    shipping: "Free store pickup",
    isOos: false,
  },
  {
    id: "newegg",
    name: "Newegg",
    marketplace: "Newegg Global",
    trustScore: 92.4,
    rating: 4.5,
    verified: false,
    shipping: "Ships in 3 days",
    isOos: false,
  },
  {
    id: "bhphoto",
    name: "B&H Photo",
    marketplace: "B&H Photo Video",
    trustScore: 0,
    rating: 0,
    verified: false,
    shipping: "Out of Stock",
    isOos: true,
  },
];

export function VerifiedSellersSection({ className }: VerifiedSellersSectionProps) {
  return (
    <section className={cn("space-y-6 w-full pt-8 border-t border-border", className)}>
      <h2 className="font-sans font-bold text-headline-lg text-ink-primary select-none">
        Verified Sellers
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {MOCK_SELLERS.map((seller) => (
          <div
            key={seller.id}
            className={cn(
              "p-4 bg-muted/20 rounded-xl border border-border flex items-center gap-4",
              seller.isOos && "opacity-60"
            )}
          >
            {/* Store Icon */}
            <div
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center shrink-0 select-none",
                seller.isOos ? "bg-muted text-ink-muted" : "bg-primary/10 text-primary"
              )}
            >
              <Store className="size-5" />
            </div>

            {/* Seller Info Details */}
            <div>
              <div className="font-bold text-body-md text-ink-primary">{seller.name}</div>
              {seller.isOos ? (
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
