"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DealScore } from "@/components/shared/DealScore";
import { PriceSparkline } from "@/components/shared/PriceSparkline";
import { Heart, GitCompare, ExternalLink, ImageOff } from "lucide-react";
import { ProductSummary } from "@/types/product";
import { formatPrice } from "@/lib/format";

export interface ProductCardProps {
  product: ProductSummary;
  onCompare?: (id: string) => void;
  onWishlist?: (id: string) => void;
  isWishlisted?: boolean;
  isCompared?: boolean;
  className?: string;
}

export function ProductCard({
  product,
  onCompare,
  onWishlist,
  isWishlisted = false,
  isCompared = false,
  className,
}: ProductCardProps) {
  const {
    id,
    title,
    imageUrl,
    currentPrice,
    originalPrice,
    marketplaceName,
    offerCount = 1,
    dealScore,
    priceHistory,
    rating,
    reviewCount,
  } = product;

  const hasDiscount = originalPrice && originalPrice > currentPrice;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice! - currentPrice) / originalPrice!) * 100)
    : 0;

  // Track error state for image fallback
  const [imageError, setImageError] = React.useState(false);

  return (
    <Card
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden bg-surface border border-border h-full",
        className
      )}
    >
      {/* Upper Area: Image Section */}
      <div className="relative aspect-square w-full overflow-hidden bg-muted/30">
        {/* DealScore placed top-right overlay */}
        <div className="absolute top-spacing-3 right-spacing-3 z-10">
          <DealScore score={dealScore} size="sm" />
        </div>

        {/* Wishlist Button top-left overlay */}
        {onWishlist && (
          <Button
            size="icon-xs"
            variant="ghost"
            onClick={(e) => {
              e.preventDefault();
              onWishlist(id);
            }}
            className={cn(
              "absolute top-spacing-3 left-spacing-3 z-10 bg-surface/80 hover:bg-surface border border-border/40 backdrop-blur-xs text-ink-muted hover:text-red-500",
              isWishlisted && "text-red-500 bg-surface"
            )}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={cn("size-3.5", isWishlisted && "fill-current")} />
          </Button>
        )}

        {/* Product Image with Fallback */}
        {imageUrl && !imageError ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            unoptimized
            onError={() => setImageError(true)}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-spacing-2 text-ink-muted/50 bg-secondary/10 absolute inset-0">
            <ImageOff className="size-8 stroke-1" />
            <span className="text-[10px] font-sans">No Image available</span>
          </div>
        )}

        {/* Discount Badge bottom-left overlay */}
        {hasDiscount && (
          <Badge
            variant="negative"
            className="absolute bottom-spacing-3 left-spacing-3 font-mono font-bold text-[10px]"
          >
            -{discountPercent}%
          </Badge>
        )}
      </div>

      {/* Middle Area: Content details */}
      <CardContent className="flex flex-col flex-1 p-spacing-4 gap-spacing-3">
        {/* Marketplace and reviews metadata */}
        <div className="flex items-center justify-between gap-spacing-2 text-micro-label text-ink-muted">
          <span className="font-sans uppercase tracking-wider truncate">
            {marketplaceName}
          </span>
          {rating !== undefined && rating > 0 && (
            <span className="flex items-center gap-0.5 font-mono">
              ★ {rating.toFixed(1)}{" "}
              {reviewCount !== undefined && `(${reviewCount})`}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-sans font-bold text-body-sm text-ink-primary line-clamp-2 leading-snug min-h-[40px]">
          {title}
        </h3>

        {/* Pricing Area */}
        <div className="flex items-end justify-between gap-spacing-2 mt-auto">
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="font-mono text-micro-label text-ink-muted line-through">
                {formatPrice(originalPrice!)}
              </span>
            )}
            <span className="font-mono font-bold text-body-md text-ink-primary">
              {formatPrice(currentPrice)}
            </span>
          </div>

          {/* Price sparkline graph */}
          <PriceSparkline
            prices={priceHistory}
            width={72}
            height={24}
            className="shrink-0 opacity-80 group-hover:opacity-100 transition-opacity"
          />
        </div>

        {/* Offers comparison status */}
        {offerCount > 1 && (
          <div className="text-[11px] font-sans text-accent font-medium mt-1">
            Compare {offerCount} offers from other shops
          </div>
        )}
      </CardContent>

      {/* Bottom Area: Custom Actions */}
      <div className="flex items-center gap-2 border-t border-border/40 p-spacing-4 bg-muted/10">
        {onCompare && (
          <Button
            size="sm"
            variant={isCompared ? "secondary" : "outline"}
            className="flex-1 font-sans text-xs gap-1.5 rounded-lg border-border"
            onClick={() => onCompare(id)}
          >
            <GitCompare className="size-3.5" />
            <span>{isCompared ? "Compared" : "Compare"}</span>
          </Button>
        )}
        <Button
          size="sm"
          variant="default"
          className="flex-1 font-sans text-xs gap-1.5 rounded-lg"
          asChild
        >
          <Link href={`/product/${id}`}>
            <span>Details</span>
            <ExternalLink className="size-3.5" />
          </Link>
        </Button>
      </div>
    </Card>
  );
}
