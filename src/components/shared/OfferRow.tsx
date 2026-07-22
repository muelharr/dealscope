"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { MarketplaceOffer } from "@/types/offer";
import { ExternalLink, ShieldCheck, Truck, ShoppingBag } from "lucide-react";

export interface OfferRowProps extends React.ComponentProps<"div"> {
  offer: MarketplaceOffer;
  onVisit?: (url: string) => void;
  actionLabel?: string;
}

export function OfferRow({
  offer,
  onVisit,
  actionLabel = "Visit Shop",
  className,
  ...props
}: OfferRowProps) {
  const {
    marketplaceName,
    marketplaceLogoUrl,
    sellerName,
    sellerTrustScore,
    currentPrice,
    originalPrice,
    availability,
    shippingInfo,
    dealBadge,
    externalUrl,
  } = offer;

  // Determine availability styling
  const availabilityConfig = {
    in_stock: { label: "In Stock", variant: "positive" as const },
    low_stock: { label: "Low Stock", variant: "caution" as const },
    out_of_stock: { label: "Out of Stock", variant: "negative" as const },
  }[availability];

  // Formatter for trust score (displays as e.g. "98% Trust")
  const formatTrust = (score: number) => {
    return score > 5 ? `${score}%` : `${(score * 20).toFixed(0)}%`;
  };

  const hasDiscount = originalPrice && originalPrice > currentPrice;

  return (
    <div
      className={cn(
        "flex flex-col gap-spacing-4 rounded-xl border border-border bg-surface p-spacing-4 sm:flex-row sm:items-center sm:justify-between transition-all duration-150 hover:border-border-interactive",
        className
      )}
      {...props}
    >
      {/* Left Column: Marketplace & Seller Info */}
      <div className="flex items-start gap-spacing-3 sm:items-center flex-1 min-w-0">
        {/* Marketplace Logo Placeholder / Image */}
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted/40 border border-border/40 overflow-hidden">
          {marketplaceLogoUrl ? (
            <Image
              src={marketplaceLogoUrl}
              alt={marketplaceName}
              fill
              unoptimized
              className="object-contain p-1"
            />
          ) : (
            <span className="font-sans font-bold text-xs text-ink-muted">
              {marketplaceName.substring(0, 2).toUpperCase()}
            </span>
          )}
        </div>

        {/* Text Details */}
        <div className="flex flex-col min-w-0 gap-0.5">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="font-sans font-bold text-body-sm text-ink-primary truncate">
              {marketplaceName}
            </span>
            {dealBadge && (
              <Badge
                variant={
                  dealBadge.toLowerCase().includes("best") ||
                  dealBadge.toLowerCase().includes("lowest")
                    ? "positive"
                    : "ai"
                }
                className="font-mono text-[9px] px-1 h-3.5"
              >
                {dealBadge}
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-x-spacing-2 gap-y-0.5 text-micro-label text-ink-muted">
            <span className="truncate">Seller: {sellerName}</span>
            <span className="flex items-center gap-0.5 text-positive">
              <ShieldCheck className="size-3" />
              <span>{formatTrust(sellerTrustScore)} rating</span>
            </span>
          </div>
        </div>
      </div>

      {/* Middle Column: Status & Shipping */}
      <div className="flex flex-row flex-wrap items-center gap-x-spacing-4 gap-y-spacing-2 sm:flex-col sm:items-start shrink-0 text-micro-label text-ink-muted">
        <Badge
          variant={availabilityConfig.variant}
          className="font-sans text-[10px] px-1.5 py-0.5 h-auto rounded-sm shrink-0"
        >
          {availabilityConfig.label}
        </Badge>
        {shippingInfo && (
          <span className="flex items-center gap-1">
            <Truck className="size-3.5" />
            <span>{shippingInfo}</span>
          </span>
        )}
      </div>

      {/* Right Column: Pricing & Action Button */}
      <div className="flex flex-row items-center justify-between sm:justify-end gap-spacing-4 shrink-0 border-t border-border/40 pt-spacing-3 sm:border-t-0 sm:pt-0">
        {/* Price Display */}
        <div className="flex flex-col text-left sm:text-right">
          {hasDiscount && (
            <span className="font-mono text-micro-label text-ink-muted line-through">
              {formatPrice(originalPrice!)}
            </span>
          )}
          <span className="font-mono font-bold text-body-md text-ink-primary">
            {formatPrice(currentPrice)}
          </span>
        </div>

        {/* Action Button */}
        <Button
          size="sm"
          variant="default"
          className="font-sans text-xs gap-1.5 rounded-lg pr-3"
          onClick={() => {
            if (onVisit) onVisit(externalUrl);
          }}
          asChild
        >
          <a href={externalUrl} target="_blank" rel="noopener noreferrer">
            <ShoppingBag className="size-3.5" />
            <span>{actionLabel}</span>
            <ExternalLink className="size-3" />
          </a>
        </Button>
      </div>
    </div>
  );
}
