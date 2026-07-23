"use client";

import * as React from "react";
import { SearchResultCard } from "@/components/search/SearchResultCard";
import { cn } from "@/lib/utils";

export interface SearchResultItem {
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
}

export interface SearchResultsGridProps {
  products: SearchResultItem[];
  favoritedIds?: string[];
  alertIds?: string[];
  onFavoriteToggle?: (id: string) => void;
  onAlertToggle?: (id: string) => void;
  onViewAnalysis?: (id: string) => void;
  className?: string;
}

export function SearchResultsGrid({
  products,
  favoritedIds = [],
  alertIds = [],
  onFavoriteToggle,
  onAlertToggle,
  onViewAnalysis,
  className,
}: SearchResultsGridProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {products.map((product) => (
        <SearchResultCard
          key={product.id}
          product={product}
          isFavorited={favoritedIds.includes(product.id)}
          isAlertSet={alertIds.includes(product.id)}
          onFavorite={onFavoriteToggle}
          onAlert={onAlertToggle}
          onViewAnalysis={onViewAnalysis}
        />
      ))}
    </div>
  );
}
