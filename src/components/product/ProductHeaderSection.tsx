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
  isWishlisted?: boolean;
  onWishlistToggle?: () => void;
  className?: string;
}

export function ProductHeaderSection({
  product,
  isWishlisted = false,
  onWishlistToggle,
  className
}: ProductHeaderSectionProps) {
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
      <nav className="mb-4 flex max-w-full items-center gap-2 overflow-x-auto whitespace-nowrap pb-1 font-sans text-body-sm text-ink-muted select-none sm:mb-6">
        <Link className="shrink-0 cursor-pointer transition-colors hover:text-primary" href="/">Home</Link>
        <ChevronRight className="size-4 shrink-0 text-ink-muted" />
        <Link className="shrink-0 cursor-pointer transition-colors hover:text-primary" href="/search">Search Results</Link>
        <ChevronRight className="size-4 shrink-0 text-ink-muted" />
        <span className="truncate font-semibold text-ink-primary">{product.name}</span>
      </nav>

      {/* Main product summary panel */}
      <section className="flex flex-col gap-5 rounded-xl border border-border bg-card p-4 shadow-sm sm:gap-6 sm:p-6 md:flex-row md:p-8">
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
            <h1 className="mb-4 font-sans text-3xl font-bold leading-tight text-ink-primary sm:text-headline-lg">
              {product.name}
            </h1>
            <div className="mb-6 flex flex-col gap-2">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="font-mono text-3xl font-bold text-ink-primary sm:text-[32px]">{formatPrice(bestPrice)}</span>
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
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
            <Button
              variant={isWishlisted ? "secondary" : "outline"}
              onClick={onWishlistToggle}
              className={cn(
                "min-h-11 w-full px-4 py-3 font-sans text-xs font-bold uppercase tracking-wider sm:min-w-[140px] sm:flex-1 sm:px-6 sm:py-5",
                isWishlisted && "text-red-500 hover:bg-muted hover:text-red-600"
              )}
            >
              <Heart className={cn("size-4", isWishlisted && "fill-current")} />
              <span>{isWishlisted ? "In Wishlist" : "Add to Wishlist"}</span>
            </Button>
            <Button
              variant="outline"
              className="min-h-11 w-full border-border bg-card px-4 py-3 font-sans text-xs font-bold uppercase tracking-wider hover:border-primary hover:text-primary sm:min-w-[140px] sm:flex-1 sm:px-6 sm:py-5"
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
