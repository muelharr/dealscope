"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { MarketplaceOffer } from "@/types/offer";
import { OfferRow } from "@/components/shared/OfferRow";
import { EmptyState } from "@/components/ui/empty-state";
import { ShoppingBag } from "lucide-react";

export interface MarketplaceOfferListProps extends React.ComponentProps<"div"> {
  offers: MarketplaceOffer[];
  onVisitOffer?: (url: string) => void;
  actionLabel?: string;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function MarketplaceOfferList({
  offers,
  onVisitOffer,
  actionLabel,
  emptyTitle = "No offers available",
  emptyDescription = "There are currently no listings from other marketplaces for this product.",
  className,
  ...props
}: MarketplaceOfferListProps) {
  // If there are no offers, display our customized EmptyState component
  if (!offers || offers.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title={emptyTitle}
        description={emptyDescription}
        className={cn("border-dashed", className)}
        {...props}
      />
    );
  }

  return (
    <div
      className={cn("flex flex-col gap-spacing-3", className)}
      {...props}
    >
      {offers.map((offer) => (
        <OfferRow
          key={offer.id}
          offer={offer}
          onVisit={onVisitOffer}
          actionLabel={actionLabel}
        />
      ))}
    </div>
  );
}
