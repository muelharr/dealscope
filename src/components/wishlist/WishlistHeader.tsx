"use client";

import * as React from "react";
import { Filter, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface WishlistHeaderProps {
  totalItems: number;
  averageSavingsPercent?: number;
  activeSortOption?: string;
  onFilterClick?: () => void;
  onSortChange?: (option: string) => void;
  className?: string;
}

export function WishlistHeader({
  totalItems = 12,
  averageSavingsPercent = 18,
  activeSortOption = "Potential Savings",
  onFilterClick,
  onSortChange,
  className,
}: WishlistHeaderProps) {
  const handleSortClick = () => {
    if (onSortChange) {
      onSortChange("Potential Savings");
    }
  };

  return (
    <header className={cn("mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 w-full", className)}>
      {/* Title & subtitle */}
      <div>
        <h1 className="font-sans font-bold text-headline-lg text-ink-primary mb-2">
          Your Wishlist
        </h1>
        <p className="text-ink-muted font-body-md">
          Tracking {totalItems} items with an average potential saving of {averageSavingsPercent}%.
        </p>
      </div>

      {/* Action Buttons strictly matching Stitch styling */}
      <div className="flex items-center gap-3 shrink-0">
        <Button
          variant="outline"
          onClick={onFilterClick}
          className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg bg-card hover:bg-muted font-sans text-xs font-bold uppercase tracking-wider transition-colors"
        >
          <Filter className="size-4" />
          <span>Filter</span>
        </Button>
        <Button
          variant="outline"
          onClick={handleSortClick}
          className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg bg-card hover:bg-muted font-sans text-xs font-bold uppercase tracking-wider transition-colors"
        >
          <ArrowUpDown className="size-4" />
          <span>Sort by: {activeSortOption}</span>
        </Button>
      </div>
    </header>
  );
}
