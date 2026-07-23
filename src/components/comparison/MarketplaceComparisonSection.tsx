"use client";

import * as React from "react";
import { ShoppingCart, Store, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface ProductOffer {
  productId: string;
  variantName: string;
  price: number;
  availability: string;
  availabilityType: "positive" | "warning" | "critical";
  actionLabel: "View Deal" | "Pre-order";
}

export interface MarketplaceComparison {
  id: string;
  marketplace: string;
  seller: string;
  iconName: "cart" | "store" | "shipping";
  offers: ProductOffer[];
}

export interface MarketplaceComparisonSectionProps {
  comparisons: MarketplaceComparison[];
  onViewDeal?: (offerId: string) => void;
  className?: string;
}

export function MarketplaceComparisonSection({
  comparisons,
  onViewDeal,
  className,
}: MarketplaceComparisonSectionProps) {
  // Map string names to Lucide icons
  const renderIcon = (iconName: MarketplaceComparison["iconName"]) => {
    switch (iconName) {
      case "cart":
        return <ShoppingCart className="size-4 text-primary shrink-0" />;
      case "store":
        return <Store className="size-4 text-primary shrink-0" />;
      case "shipping":
        return <Truck className="size-4 text-primary shrink-0" />;
    }
  };

  // Helper to map availability type color classes
  const getAvailabilityColor = (type: ProductOffer["availabilityType"]) => {
    switch (type) {
      case "positive":
        return "text-positive font-semibold";
      case "warning":
        return "text-caution font-semibold";
      case "critical":
        return "text-negative font-semibold";
      default:
        return "text-ink-muted";
    }
  };

  // Flatten comparisons to row data for easier rendering in tabular layout
  const rows = React.useMemo(() => {
    return comparisons.flatMap((comp) =>
      comp.offers.map((offer) => ({
        id: `${comp.id}-${offer.productId}`,
        marketplace: comp.marketplace,
        seller: comp.seller,
        iconName: comp.iconName,
        ...offer,
      }))
    );
  }, [comparisons]);

  return (
    <div className={cn("overflow-x-auto scrollbar-hide w-full", className)}>
      <div className="bg-card rounded-xl border border-border min-w-[900px] overflow-hidden shadow-sm">
        {/* Table Header Section */}
        <div className="p-4 border-b border-border bg-muted/20 select-none">
          <h3 className="font-sans font-bold text-base text-ink-primary">Marketplace Inventory</h3>
        </div>

        {/* Table Grid */}
        <table className="w-full text-left border-collapse">
          <thead className="bg-muted/10 font-sans text-[10px] font-bold uppercase tracking-wider border-b border-border text-ink-muted select-none">
            <tr>
              <th className="px-6 py-4">Seller</th>
              <th className="px-6 py-4">Product Variant</th>
              <th className="px-6 py-4">Availability</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 font-sans text-body-sm text-ink-primary">
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-muted/25 transition-colors group">
                <td className="px-6 py-4 flex items-center gap-2">
                  {renderIcon(row.iconName)}
                  <span>{row.marketplace}</span>
                </td>
                <td className="px-6 py-4 font-bold">{row.variantName}</td>
                <td className={cn("px-6 py-4", getAvailabilityColor(row.availabilityType))}>
                  {row.availability}
                </td>
                <td className="px-6 py-4 font-mono font-bold">{formatPrice(row.price)}</td>
                <td className="px-6 py-4 text-right">
                  <Button
                    onClick={() => onViewDeal && onViewDeal(row.id)}
                    className="font-sans text-xs font-bold px-4 py-2 rounded-lg border border-border bg-card hover:bg-primary hover:text-white transition-all text-ink-primary hover:border-primary active:scale-95 duration-150 shadow-sm"
                  >
                    <span>{row.actionLabel}</span>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
