"use client";

import * as React from "react";
import { X } from "lucide-react";
import { DealScore } from "@/components/shared/DealScore";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface ComparedProduct {
  id: string;
  name: string;
  brand: string;
  price: number;
  dealScore: number;
  marketplace: string;
  status: "available" | "limited" | "out-of-stock";
  badgeLabel?: string;
  imageUrl?: string;
}

export interface SelectedProductsSectionProps {
  products: ComparedProduct[];
  onRemoveProduct?: (id: string) => void;
  className?: string;
}

export function SelectedProductsSection({
  products,
  onRemoveProduct,
  className,
}: SelectedProductsSectionProps) {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-3 gap-6 w-full", className)}>
      {products.map((product) => {
        const statusConfig = {
          available: { label: "In Stock", variant: "positive" as const },
          limited: { label: "Low Stock", variant: "caution" as const },
          "out-of-stock": { label: "Out of Stock", variant: "negative" as const },
        }[product.status];

        return (
          <div
            key={product.id}
            className="bg-card border border-border rounded-xl p-5 relative overflow-hidden flex flex-col justify-between shadow-sm group hover:border-border-interactive transition-all"
          >
            {/* Remove Button */}
            {onRemoveProduct && (
              <button
                type="button"
                onClick={() => onRemoveProduct(product.id)}
                className="absolute top-3 right-3 text-ink-muted hover:text-ink-primary p-1 rounded-full hover:bg-muted transition-colors bg-transparent border-none outline-none cursor-pointer z-10"
                aria-label={`Remove ${product.name} from comparison`}
              >
                <X className="size-4" />
              </button>
            )}

            <div className="space-y-4">
              {/* Product Badge Tag */}
              {product.badgeLabel ? (
                <span className="font-sans text-[9px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase tracking-wider select-none inline-block">
                  {product.badgeLabel}
                </span>
              ) : (
                <div className="h-5"></div>
              )}

              {/* Image box placeholder matching product summary */}
              <div className="aspect-square bg-muted/20 rounded-lg overflow-hidden flex items-center justify-center p-4 border border-border/40 select-none">
                <span className="text-ink-muted text-xs font-semibold">{product.brand} Visual</span>
              </div>

              {/* Product details */}
              <div className="space-y-1">
                <p className="text-[10px] text-ink-muted font-bold uppercase tracking-wider">
                  {product.brand}
                </p>
                <h4 className="font-sans font-bold text-sm text-ink-primary line-clamp-1">
                  {product.name}
                </h4>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono font-bold text-base text-ink-primary">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-ink-muted text-xs">MSRP</span>
                </div>
              </div>
            </div>

            {/* Footer data summary row */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border select-none">
              <Badge variant={statusConfig.variant} className="font-sans text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                {statusConfig.label}
              </Badge>
              <DealScore score={product.dealScore} size="sm" showLabel />
            </div>
          </div>
        );
      })}
    </div>
  );
}
