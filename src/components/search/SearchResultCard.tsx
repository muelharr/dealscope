"use client";

import * as React from "react";
import Image from "next/image";
import { Heart, Bell, Store, ShieldCheck, ImageOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PriceSparkline } from "@/components/shared/PriceSparkline";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface SearchResultCardProps {
  product: {
    id: string;
    title: string;
    imageUrl?: string;
    currentPrice: number;
    originalPrice?: number;
    marketplaceName: string;
    sellerTrustScore: number;
    shippingInfo?: string;
    dealScore: number;
    dealScoreLabel?: string;
    aiVerdict: "BUY NOW" | "WAIT" | "PRICE DROP ALERT";
    aiVerdictReason: string;
    priceHistory: number[];
  };
  onFavorite?: (id: string) => void;
  onAlert?: (id: string) => void;
  onViewAnalysis?: (id: string) => void;
  isFavorited?: boolean;
  isAlertSet?: boolean;
  className?: string;
}

export function SearchResultCard({
  product,
  onFavorite,
  onAlert,
  onViewAnalysis,
  isFavorited = false,
  isAlertSet = false,
  className,
}: SearchResultCardProps) {
  const {
    id,
    title,
    imageUrl,
    currentPrice,
    originalPrice,
    marketplaceName,
    sellerTrustScore,
    shippingInfo,
    dealScore,
    dealScoreLabel = "Exceptional",
    aiVerdict,
    aiVerdictReason,
    priceHistory,
  } = product;

  const [imageError, setImageError] = React.useState(false);

  // Map AI Verdict semantic styling
  const verdictConfig = {
    "BUY NOW": { border: "border-data-positive", text: "text-data-positive", bg: "bg-data-positive/10" },
    "WAIT": { border: "border-border-interactive", text: "text-ink-muted", bg: "bg-muted" },
    "PRICE DROP ALERT": { border: "border-caution", text: "text-caution", bg: "bg-caution/10" },
  }[aiVerdict];

  // Map Deal Score progress bar color
  const dealScoreColor = dealScore >= 80 ? "bg-data-positive" : dealScore >= 50 ? "bg-data-warning" : "bg-data-critical";

  return (
    <div
      className={cn(
        "bg-card rounded-xl border border-border p-6 hover:shadow-sm transition-shadow flex flex-col xl:flex-row gap-8 relative overflow-hidden group",
        className
      )}
    >
      {/* Background Watermark Symbol */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.03] pointer-events-none text-primary select-none">
        <svg
          className="w-full h-full"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
        </svg>
      </div>

      {/* Product Image Section */}
      <div className="w-full xl:w-64 h-48 bg-surface-subtle rounded-lg flex items-center justify-center p-4 shrink-0 relative">
        {imageUrl && !imageError ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            unoptimized
            onError={() => setImageError(true)}
            className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-ink-muted/50 gap-2">
            <ImageOff className="size-8 stroke-1" />
            <span className="text-[10px]">No image available</span>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="flex-1 flex flex-col justify-between gap-4">
        {/* Upper Area: Title and Pricing */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="space-y-2">
            <h3
              onClick={() => onViewAnalysis && onViewAnalysis(id)}
              className="font-sans font-bold text-headline-md text-ink-primary leading-tight hover:text-primary cursor-pointer transition-colors"
            >
              {title}
            </h3>

            {/* Metadata Row */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-body-sm text-ink-muted">
              <div className="flex items-center gap-1.5">
                <Store className="size-4" />
                <span>{marketplaceName}</span>
              </div>
              <div className="flex items-center gap-1.5 text-positive font-semibold">
                <ShieldCheck className="size-4" />
                <span>{sellerTrustScore}% Trust Score</span>
              </div>
              {shippingInfo && (
                <div className="text-[11px] text-ink-muted/80">{shippingInfo}</div>
              )}
            </div>
          </div>

          {/* Pricing Block */}
          <div className="text-left md:text-right shrink-0">
            <div className="font-mono font-bold text-2xl text-ink-primary tracking-tight">
              {formatPrice(currentPrice)}
            </div>
            {originalPrice && originalPrice > currentPrice && (
              <div className="text-body-sm text-ink-muted line-through">
                MSRP {formatPrice(originalPrice)}
              </div>
            )}
            <div className="text-[11px] font-bold text-positive mt-1">Historic Low</div>
          </div>
        </div>

        {/* Middle Area: AI Verdict Panel & Deal Score Progress Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* AI Verdict Card */}
          <div className={cn("p-4 rounded-lg border-l-4", verdictConfig.border, "bg-surface-subtle")}>
            <div className="flex items-center gap-2 mb-1">
              <span className={cn("font-sans text-[10px] font-bold tracking-wider", verdictConfig.text)}>
                AI VERDICT: {aiVerdict}
              </span>
            </div>
            <p className="text-body-sm text-ink-muted leading-relaxed">
              {aiVerdictReason}
            </p>
          </div>

          {/* Deal Score Progress Bar */}
          <div className="flex flex-col justify-center gap-2">
            <div className="flex items-center justify-between text-body-sm font-semibold text-ink-primary">
              <span>Deal Score</span>
              <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-bold", verdictConfig.bg, verdictConfig.text)}>
                {dealScore}/100 • {dealScoreLabel}
              </span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div className={cn("h-full", dealScoreColor)} style={{ width: `${dealScore}%` }}></div>
            </div>
          </div>
        </div>

        {/* Bottom Area: Trend Sparkline & Call To Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-border/40">
          <div className="flex items-center gap-4">
            <PriceSparkline
              prices={priceHistory}
              width={120}
              height={32}
              className="opacity-90"
            />
            <span className="text-[10px] text-ink-muted font-bold uppercase tracking-wider">
              90-Day Trend
            </span>
          </div>

          {/* Interaction buttons */}
          <div className="flex items-center gap-2.5">
            {/* Wishlist Button */}
            <button
              onClick={() => onFavorite && onFavorite(id)}
              className={cn(
                "p-2 border border-border rounded-lg hover:bg-surface-subtle transition-colors group/fav flex items-center justify-center outline-none cursor-pointer",
                isFavorited ? "text-red-500" : "text-ink-muted hover:text-red-500"
              )}
              aria-label={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className={cn("size-4", isFavorited && "fill-current")} />
            </button>

            {/* Alert Button */}
            <button
              onClick={() => onAlert && onAlert(id)}
              className={cn(
                "p-2 border border-border rounded-lg hover:bg-surface-subtle transition-colors flex items-center gap-2 px-3 outline-none cursor-pointer",
                isAlertSet ? "text-primary border-primary bg-primary/5" : "text-ink-muted hover:text-ink-primary"
              )}
              aria-label={isAlertSet ? "Remove price alert" : "Create price alert"}
            >
              <Bell className="size-4" />
              <span className="text-xs font-semibold">Alert</span>
            </button>

            {/* View Analysis Action Button */}
            <Button
              onClick={() => onViewAnalysis && onViewAnalysis(id)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 rounded-lg font-sans text-xs font-bold uppercase tracking-wider transition-all active:scale-95 shadow-md shadow-primary/10"
            >
              View Analysis
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
