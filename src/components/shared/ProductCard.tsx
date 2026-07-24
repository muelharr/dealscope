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
import { Product } from "@/types/domain";
import { formatPrice } from "@/lib/format";
import { useWishlist } from "@/hooks/queries/useWishlist";
import { useToggleWishlist } from "@/hooks/mutations/useToggleWishlist";

export interface ProductCardProps {
  product: Product;
  onCompare?: (id: string) => void;
  onWishlist?: (id: string) => void;
  isWishlisted?: boolean;
  isCompared?: boolean;
  className?: string;
  aiVerdict?: "BUY NOW" | "WAIT" | "PRICE DROP ALERT" | string;
}

// 1. Main polymorphic wrapper
export function ProductCard({
  product,
  onCompare,
  onWishlist,
  isWishlisted,
  isCompared,
  aiVerdict,
  children,
  className,
}: {
  product?: Product;
  onCompare?: (id: string) => void;
  onWishlist?: (id: string) => void;
  isWishlisted?: boolean;
  isCompared?: boolean;
  aiVerdict?: "BUY NOW" | "WAIT" | "PRICE DROP ALERT" | string;
  children?: React.ReactNode;
  className?: string;
}) {
  if (children) {
    return (
      <Card
        className={cn(
          "group relative flex flex-col justify-between overflow-hidden bg-surface border border-border h-full rounded-xl transition-shadow hover:shadow-md",
          className
        )}
      >
        {children}
      </Card>
    );
  }

  if (!product) return null;

  const offerCount = product.offers?.length ?? 0;

  return (
    <Card
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden bg-surface border border-border h-full rounded-xl transition-shadow hover:shadow-md",
        className
      )}
    >
      <ProductCardMedia
        product={product}
        onWishlist={onWishlist}
        isWishlisted={isWishlisted}
        aiVerdict={aiVerdict}
      />
      <ProductCardContent>
        <ProductCardHeader product={product} />
        <ProductCardPrice product={product} />
        {offerCount > 1 && (
          <div className="text-[11px] font-sans text-accent font-medium mt-1">
            Compare {offerCount} offers from other shops
          </div>
        )}
      </ProductCardContent>
      <ProductCardActions
        product={product}
        onCompare={onCompare}
        isCompared={isCompared}
      />
    </Card>
  );
}

// 2. Media / Image Section
export function ProductCardMedia({
  product,
  onWishlist,
  isWishlisted: isWishlistedProp,
  showWishlistToggle = true,
  showScore = true,
  aiVerdict,
  className,
}: {
  product: Product;
  onWishlist?: (id: string) => void;
  isWishlisted?: boolean;
  showWishlistToggle?: boolean;
  showScore?: boolean;
  aiVerdict?: "BUY NOW" | "WAIT" | "PRICE DROP ALERT" | string;
  className?: string;
}) {
  const { id, images, name: title } = product;
  const imageUrl = images?.[0];
  const [imageError, setImageError] = React.useState(false);

  const { data: wishlist } = useWishlist();
  const toggleWishlist = useToggleWishlist();

  const isWishlisted = isWishlistedProp !== undefined
    ? isWishlistedProp
    : (wishlist?.some((item) => item.product.id === id) ?? false);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onWishlist) {
      onWishlist(id);
    } else {
      toggleWishlist.mutate({ product });
    }
  };

  const dealScore = 78;
  const originalPrice = (product.offers?.[0]?.price ?? 0) * 1.2;
  const currentPrice = product.offers?.[0]?.price ?? 0;
  const hasDiscount = originalPrice && originalPrice > currentPrice;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  const verdictConfig = aiVerdict
    ? {
        "BUY NOW": "bg-primary/5 text-primary border border-primary/10 backdrop-blur-xs",
        "WAIT": "bg-surface-container-highest text-ink-muted border border-border/40",
        "PRICE DROP ALERT": "bg-caution/10 text-caution border border-caution/20",
      }[aiVerdict] || "bg-secondary text-secondary-foreground"
    : "";

  return (
    <div
      className={cn(
        "relative aspect-square w-full overflow-hidden bg-muted/30 border-b border-border/40 select-none",
        className
      )}
    >
      {showScore && (
        <div className="absolute top-spacing-3 right-spacing-3 z-10">
          <DealScore score={dealScore} size="sm" />
        </div>
      )}

      {aiVerdict && (
        <div className="absolute top-spacing-3 left-spacing-3 flex gap-spacing-2 z-10">
          <Badge
            className={cn(
              "font-sans text-[10px] font-extrabold px-3 py-1 rounded-full uppercase border shadow-sm",
              verdictConfig
            )}
          >
            {aiVerdict}
          </Badge>
        </div>
      )}

      {showWishlistToggle && !aiVerdict && (
        <Button
          size="icon-xs"
          variant="ghost"
          onClick={handleWishlistClick}
          className={cn(
            "absolute top-spacing-3 left-spacing-3 z-10 bg-surface/80 hover:bg-surface border border-border/40 backdrop-blur-xs text-ink-muted hover:text-red-500",
            isWishlisted && "text-red-500 bg-surface"
          )}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={cn("size-3.5", isWishlisted && "fill-current")} />
        </Button>
      )}

      {showWishlistToggle && aiVerdict && (
        <button
          type="button"
          onClick={handleWishlistClick}
          className="absolute top-spacing-3 right-spacing-3 p-2 bg-surface/85 backdrop-blur-xs rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-all border border-border/40 outline-none cursor-pointer z-10"
          aria-label={`Remove ${title} from wishlist`}
        >
          <Heart className={cn("size-4", isWishlisted && "fill-current")} />
        </button>
      )}

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

      {hasDiscount && !aiVerdict && (
        <Badge
          variant="negative"
          className="absolute bottom-spacing-3 left-spacing-3 font-mono font-bold text-[10px]"
        >
          -{discountPercent}%
        </Badge>
      )}
    </div>
  );
}

// 3. Card Content Wrapper
export function ProductCardContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <CardContent
      className={cn(
        "flex flex-col flex-1 p-spacing-4 gap-spacing-3",
        className
      )}
    >
      {children}
    </CardContent>
  );
}

// 4. Header metadata section
export function ProductCardHeader({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  const { name: title, offers } = product;
  const primaryOffer = offers?.[0];
  const marketplaceName = primaryOffer?.marketplace?.name ?? "N/A";
  const rating = 4.5;
  const reviewCount = 120;

  return (
    <div className={cn("flex flex-col gap-spacing-1", className)}>
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
      <h3 className="font-sans font-bold text-body-sm text-ink-primary line-clamp-2 leading-snug min-h-[40px]">
        {title}
      </h3>
    </div>
  );
}

// 5. Pricing section
export function ProductCardPrice({
  product,
  showHistoricLow = false,
  className,
}: {
  product: Product;
  showHistoricLow?: boolean;
  className?: string;
}) {
  const currentPrice = product.offers?.[0]?.price ?? 0;
  const originalPrice = currentPrice * 1.2;
  const hasDiscount = originalPrice && originalPrice > currentPrice;

  const priceHistory =
    product.priceHistory?.history?.map((p) => p.price) ?? [];
  const historicLow =
    priceHistory.length > 0 ? Math.min(...priceHistory) : currentPrice;

  return (
    <div className={cn("flex flex-col gap-spacing-1 mt-auto", className)}>
      <div className="flex items-baseline gap-spacing-2">
        <span className="font-mono font-bold text-body-md text-ink-primary">
          {formatPrice(currentPrice)}
        </span>
        {hasDiscount && (
          <span className="font-mono text-micro-label text-ink-muted line-through">
            {formatPrice(originalPrice)}
          </span>
        )}
      </div>
      {showHistoricLow && (
        <p className="text-[11px] text-ink-muted font-sans mt-0.5">
          Historical low:{" "}
          <span className="font-mono font-medium">
            {formatPrice(historicLow)}
          </span>
        </p>
      )}
    </div>
  );
}

// 6. Sparkline & Metrics Box (Wishlist / Search custom view)
export function ProductCardMetrics({
  product,
  trendDiff = "-14.5%",
  className,
}: {
  product: Product;
  trendDiff?: string;
  className?: string;
}) {
  const priceHistory =
    product.priceHistory?.history?.map((p) => p.price) ?? [];
  const isDown = trendDiff.startsWith("-");

  const marketplacesCount = product.offers?.length ?? 0;
  const sellerTrust = 95;
  const inventoryStatus: string = "Stable";

  return (
    <div
      className={cn(
        "bg-surface rounded-lg p-spacing-3 border border-border space-y-spacing-3 mt-spacing-2",
        className
      )}
    >
      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider select-none">
        <span className="text-ink-muted">90-Day Trend</span>
        <span className={isDown ? "text-positive" : "text-caution"}>
          {trendDiff}
        </span>
      </div>

      <div className="h-10 w-full overflow-hidden">
        <PriceSparkline
          prices={priceHistory}
          width={240}
          height={40}
          trend={isDown ? "falling" : "rising"}
        />
      </div>

      <div className="flex justify-between border-t border-border pt-spacing-2 mt-spacing-2 select-none text-center">
        <div>
          <p className="text-[9px] text-ink-muted uppercase font-bold tracking-wider">
            Marketplaces
          </p>
          <p className="font-bold text-xs text-ink-primary">
            {marketplacesCount}
          </p>
        </div>
        <div>
          <p className="text-[9px] text-ink-muted uppercase font-bold tracking-wider">
            Seller Trust
          </p>
          <p className="font-bold text-xs text-positive">{sellerTrust}%</p>
        </div>
        <div>
          <p className="text-[9px] text-ink-muted uppercase font-bold tracking-wider">
            Inventory
          </p>
          <p
            className={cn(
              "font-bold text-xs",
              inventoryStatus === "Critical"
                ? "text-negative"
                : inventoryStatus === "Low"
                ? "text-caution"
                : "text-positive"
            )}
          >
            {inventoryStatus}
          </p>
        </div>
      </div>
    </div>
  );
}

// 7. Action controls
export function ProductCardActions({
  product,
  onCompare,
  isCompared = false,
  children,
  className,
}: {
  product?: Product;
  onCompare?: (id: string) => void;
  isCompared?: boolean;
  children?: React.ReactNode;
  className?: string;
}) {
  if (children) {
    return (
      <div
        className={cn(
          "grid grid-cols-2 gap-spacing-2 p-spacing-4 border-t border-border bg-muted/10 mt-auto",
          className
        )}
      >
        {children}
      </div>
    );
  }

  if (!product) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-spacing-2 border-t border-border p-spacing-4 bg-muted/10 mt-auto",
        className
      )}
    >
      {onCompare && (
        <Button
          size="sm"
          variant={isCompared ? "secondary" : "outline"}
          className="flex-1 font-sans text-xs gap-1.5 rounded-lg border-border"
          onClick={() => onCompare(product.id)}
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
        <Link href={`/product/${product.id}`}>
          <span>Details</span>
          <ExternalLink className="size-3.5" />
        </Link>
      </Button>
    </div>
  );
}


