"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface WishlistAddCardProps {
  onSearchClick?: () => void;
  className?: string;
}

export function WishlistAddCard({ onSearchClick, className }: WishlistAddCardProps) {
  return (
    <div
      className={cn(
        "bg-card border-2 border-dashed border-border rounded-xl p-6 h-96 flex flex-col items-center justify-center text-center shadow-sm",
        className
      )}
    >
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4 text-ink-muted">
        <span className="font-sans text-3xl font-bold">+</span>
      </div>
      <h4 className="font-sans font-bold text-sm text-ink-primary mb-2">Track more products</h4>
      <p className="text-ink-muted text-body-sm max-w-xs mb-6">
        Found something else you like? Save it here to monitor price trends.
      </p>
      <Button
        variant="outline"
        onClick={onSearchClick}
        className="px-6 py-2 rounded-full font-sans text-[10px] font-bold uppercase tracking-wider"
      >
        <Search className="size-3.5 mr-2" />
        Search Marketplace
      </Button>
    </div>
  );
}
