"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Heart, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PriceSparkline } from "@/components/shared/PriceSparkline";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

import { WishlistItem as DomainWishlistItem } from "@/types/domain";
import { useToggleWishlist } from "@/hooks/mutations/useToggleWishlist";

export interface WishlistCardProps {
  item: DomainWishlistItem;
  className?: string;
}

export function WishlistCard({
  item,
  className,
}: WishlistCardProps) {
  const queryClient = useToggleWishlist();

  const product = item.product;
  const brand = product.brand?.name ?? "Brand";
  const name = product.name;

  const bestOffer = product.offers?.[0];
  const currentPrice = bestOffer?.price ?? 0;
  const originalPrice = currentPrice * 1.2;

  const pricePoints = product.priceHistory?.history ?? [];
  const pricesHistory = pricePoints.map(p => p.price);
  const historicLow = pricesHistory.length > 0 ? Math.min(...pricesHistory) : currentPrice;

  // Mocks for AI summary values (they can be fetched if required, but for basic rendering we keep standard fallbacks)
  const scoreLabel = "EXCEPTIONAL";
  const scoreVariant: "positive" | "warning" | "critical" = "positive";
  const aiVerdict = "BUY NOW";
  const marketplacesCount = product.offers?.length ?? 0;
  const sellerTrust = 95;
  const inventoryStatus = "Stable";
  const trendDiff = "-14.5%";

  // Map AI Verdict semantic styling
  const verdictConfig = {
    "BUY NOW": "bg-primary/5 text-primary border border-primary/10 backdrop-blur-sm",
    "WAIT": "bg-surface-container-highest text-ink-muted",
    "PRICE DROP ALERT": "bg-caution/10 text-caution border border-caution/20",
  }[aiVerdict];

  // Map Score Label semantic variants
  const scoreVariantClass = {
    positive: "bg-positive/10 text-positive border-positive/20",
    warning: "bg-caution/10 text-caution border-caution/20",
    critical: "bg-negative/10 text-negative border-negative/20",
  }[scoreVariant];

  const isDown = trendDiff.startsWith("-");

  const handleToggle = () => {
    queryClient.mutate({ product });
  };

  return (
    <Card
      className={cn(
        "group bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col",
        className
      )}
    >
      {/* 1. Image Container */}
      <div className="relative h-56 w-full overflow-hidden border-b border-border bg-muted/20 select-none">
        {/* Visual product image placeholder */}
        <div className="w-full h-full flex items-center justify-center font-sans text-xs text-ink-muted">
          [ {brand} Image Placeholder ]
        </div>

        {/* Floating status tags */}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant={(scoreVariant as string) === "warning" ? "caution" : (scoreVariant as string) === "critical" ? "negative" : "positive"} className={cn("font-sans text-[10px] font-extrabold px-3 py-1 rounded-full select-none uppercase border shadow-sm", scoreVariantClass)}>
            {scoreLabel}
          </Badge>
          <Badge className={cn("font-sans text-[10px] font-extrabold px-3 py-1 rounded-full select-none uppercase", verdictConfig)}>
            {aiVerdict}
          </Badge>
        </div>

        {/* Wishlist Heart button */}
        <button
          type="button"
          onClick={handleToggle}
          className="absolute top-3 right-3 p-2 bg-card/85 backdrop-blur-sm rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-all border-none outline-none cursor-pointer z-10"
          aria-label={`Remove ${name} from wishlist`}
        >
          <Heart className="size-4 fill-current" />
        </button>
      </div>

      {/* 2. Card Content details */}
      <CardContent className="p-6 flex-1 flex flex-col justify-between">
        {/* Product Information */}
        <div className="mb-4">
          <p className="text-ink-muted text-[9px] font-bold uppercase mb-1 tracking-wider">
            {brand}
          </p>
          <h3 className="font-sans font-bold text-headline-md text-ink-primary mb-1 truncate">
            {name}
          </h3>
          <div className="flex items-baseline gap-2">
            <span className={cn("font-mono font-bold text-headline-md", isDown ? "text-primary" : "text-ink-primary")}>
              {formatPrice(currentPrice)}
            </span>
            {originalPrice && (
              <span className="text-body-sm text-ink-muted line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
          <p className="text-body-sm text-ink-muted mt-1 font-sans">
            Historical low: <span className="font-mono">{formatPrice(historicLow)}</span>
          </p>
        </div>

        {/* Sparkline & Metrics Box */}
        <div className="bg-surface-subtle rounded-lg p-3 mb-4 space-y-3 border border-border">
          {/* Sparkline header */}
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider select-none">
            <span className="text-ink-muted">90-Day Trend</span>
            <span className={isDown ? "text-positive" : "text-caution"}>{trendDiff}</span>
          </div>

          {/* SVG Sparkline */}
          <div className="h-10 w-full overflow-hidden">
            <PriceSparkline
              prices={pricesHistory}
              width={240}
              height={40}
              trend={isDown ? "falling" : "rising"}
            />
          </div>

          {/* Metrics summary columns */}
          <div className="flex justify-between border-t border-border pt-2 mt-2 select-none">
            <div className="text-center">
              <p className="text-[9px] text-ink-muted uppercase font-bold tracking-wider">Marketplaces</p>
              <p className="font-bold text-body-sm text-ink-primary">{marketplacesCount}</p>
            </div>
            <div className="text-center">
              <p className="text-[9px] text-ink-muted uppercase font-bold tracking-wider">Seller Trust</p>
              <p className="font-bold text-body-sm text-positive">{sellerTrust}%</p>
            </div>
            <div className="text-center">
              <p className="text-[9px] text-ink-muted uppercase font-bold tracking-wider">Inventory</p>
              <p className={cn("font-bold text-body-sm", (inventoryStatus as string) === "Critical" ? "text-negative" : (inventoryStatus as string) === "Low" ? "text-caution" : "text-positive")}>
                {inventoryStatus}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Area: Custom Actions */}
        <div className="grid grid-cols-2 gap-2 mt-auto pt-4 border-t border-border">
          <Button
            variant="default"
            className="font-sans text-[11px] font-bold uppercase tracking-wider rounded-lg h-9"
          >
            View Analysis
          </Button>
          <Button
            variant="outline"
            className="font-sans text-[11px] font-bold uppercase tracking-wider rounded-lg h-9 border-border"
          >
            Compare
          </Button>
          <Button
            variant="secondary"
            className="col-span-2 flex items-center justify-center gap-2 font-sans text-[11px] font-bold uppercase tracking-wider rounded-lg h-9"
          >
            <Bell className="size-3.5" />
            Set Price Alert
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
