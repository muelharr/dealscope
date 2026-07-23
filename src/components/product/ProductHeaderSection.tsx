"use client";

import * as React from "react";
import { Heart, Bell, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { Product } from "@/types/domain";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";

export interface ProductHeaderSectionProps {
  product: Product;
  className?: string;
}

export function ProductHeaderSection({ product, className }: ProductHeaderSectionProps) {
  const bestOffer = product.offers?.[0];
  const bestPrice = bestOffer?.price ?? 0;

  // Try to find historical low and average from price history if attached
  const pricePoints = product.priceHistory?.history ?? [];
  const prices = pricePoints.map(p => p.price);
  const histLow = prices.length > 0 ? Math.min(...prices) : bestPrice;
  const avgPrice = prices.length > 0 ? Math.round(prices.reduce((sum, p) => sum + p, 0) / prices.length) : bestPrice;

  return (
    <div className={cn("space-y-6 w-full", className)}>
      {/* Breadcrumbs matching Stitch structure */}
      <nav className="flex items-center gap-2 text-ink-muted font-sans text-body-sm mb-6 select-none">
        <Link className="hover:text-primary transition-colors cursor-pointer" href="/">Home</Link>
        <ChevronRight className="size-4 text-ink-muted" />
        <Link className="hover:text-primary transition-colors cursor-pointer" href="/search">Search Results</Link>
        <ChevronRight className="size-4 text-ink-muted" />
        <span className="font-semibold text-ink-primary">{product.name}</span>
      </nav>

      {/* Main product summary panel */}
      <section className="bg-card border border-border p-8 rounded-xl flex flex-col md:flex-row gap-6 shadow-sm">
        {/* Left Column: Product Image */}
        <div className="w-full md:w-1/2">
          <div className="aspect-square bg-muted/20 rounded-lg overflow-hidden flex items-center justify-center p-8 border border-border/40 select-none relative">
            {product.images && product.images.length > 0 ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                unoptimized
                className="object-contain p-4"
              />
            ) : (
              <span className="text-ink-muted text-xs font-semibold">No Image Available</span>
            )}
          </div>
        </div>

        {/* Right Column: Text Details & Call To Actions */}
        <div className="w-full md:w-1/2 flex flex-col justify-between py-2">
          <div>
            <span className="font-sans text-xs font-bold text-primary uppercase mb-2 block tracking-wider">
              {product.category?.name ?? "Products"}
            </span>
            <h1 className="font-sans font-bold text-headline-lg text-ink-primary leading-tight mb-4">
              {product.name}
            </h1>
            <div className="flex flex-col gap-2 mb-6">
              <div className="flex items-baseline gap-2">
                <span className="font-mono font-bold text-[32px] text-ink-primary">{formatPrice(bestPrice)}</span>
                <span className="font-sans text-xs font-bold text-primary uppercase tracking-wider select-none">
                  Best Price Now
                </span>
              </div>
              <div className="flex gap-4 text-body-sm font-sans text-ink-muted select-none">
                <span>Hist. Low: <span className="font-mono text-positive font-bold">{formatPrice(histLow)}</span></span>
                <span>Avg: <span className="font-mono">{formatPrice(avgPrice)}</span></span>
              </div>
            </div>
          </div>

          {/* Action triggers */}
          <div className="flex flex-wrap gap-4 mt-6">
            <Button
              variant="outline"
              className="flex-1 min-w-[140px] px-6 py-5 rounded-lg border-border font-sans text-xs font-bold uppercase tracking-wider gap-2 hover:border-primary hover:text-primary transition-all active:scale-95 bg-card"
            >
              <Heart className="size-4" />
              <span>Add to Wishlist</span>
            </Button>
            <Button
              variant="outline"
              className="flex-1 min-w-[140px] px-6 py-5 rounded-lg border-border font-sans text-xs font-bold uppercase tracking-wider gap-2 hover:border-primary hover:text-primary transition-all active:scale-95 bg-card"
            >
              <Bell className="size-4" />
              <span>Price Alert</span>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
