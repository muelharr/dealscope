"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface WishlistEmptyStateProps {
  onSearchClick?: () => void;
  className?: string;
}

export function WishlistEmptyState({ onSearchClick, className }: WishlistEmptyStateProps) {
  return (
    <div
      className={cn(
        "bg-card border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center p-12 text-center min-h-[400px] w-full",
        className
      )}
    >
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4 text-ink-muted select-none">
        <span className="font-sans text-xl font-bold">+</span>
      </div>
      <h3 className="font-sans font-bold text-headline-md text-ink-primary mb-2">
        Track more products
      </h3>
      <p className="text-body-sm text-ink-muted max-w-xs mb-6">
        Found something else you like? Save it here to start tracking price trends and intelligence.
      </p>
      {onSearchClick && (
        <button
          type="button"
          onClick={onSearchClick}
          className="px-6 py-2.5 bg-card border border-border rounded-full font-sans text-xs font-bold uppercase tracking-wider hover:bg-muted transition-colors outline-none cursor-pointer"
        >
          Search Marketplace
        </button>
      )}
    </div>
  );
}
