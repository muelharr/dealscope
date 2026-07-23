"use client";

import * as React from "react";
import { Heart, Bell, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ProductHeaderSectionProps {
  className?: string;
}

export function ProductHeaderSection({ className }: ProductHeaderSectionProps) {
  return (
    <div className={cn("space-y-6 w-full", className)}>
      {/* Breadcrumbs matching Stitch structure */}
      <nav className="flex items-center gap-2 text-ink-muted font-sans text-body-sm mb-6 select-none">
        <a className="hover:text-primary transition-colors cursor-pointer" href="#">Home</a>
        <ChevronRight className="size-4 text-ink-muted" />
        <a className="hover:text-primary transition-colors cursor-pointer" href="#">Search Results</a>
        <ChevronRight className="size-4 text-ink-muted" />
        <span className="font-semibold text-ink-primary">RTX 5070</span>
      </nav>

      {/* Main product summary panel */}
      <section className="bg-card border border-border p-8 rounded-xl flex flex-col md:flex-row gap-6 shadow-sm">
        {/* Left Column: Product Image */}
        <div className="w-full md:w-1/2">
          <div className="aspect-square bg-muted/20 rounded-lg overflow-hidden flex items-center justify-center p-8 border border-border/40 select-none">
            <span className="text-ink-muted text-xs font-semibold">ASUS ROG Strix RTX 5070 Image</span>
          </div>
        </div>

        {/* Right Column: Text Details & Call To Actions */}
        <div className="w-full md:w-1/2 flex flex-col justify-between py-2">
          <div>
            <span className="font-sans text-xs font-bold text-primary uppercase mb-2 block tracking-wider">
              Graphics Cards
            </span>
            <h1 className="font-sans font-bold text-headline-lg text-ink-primary leading-tight mb-4">
              ASUS ROG Strix GeForce RTX 5070 OC Edition
            </h1>
            <div className="flex flex-col gap-2 mb-6">
              <div className="flex items-baseline gap-2">
                <span className="font-mono font-bold text-[32px] text-ink-primary">Rp 11.249.000</span>
                <span className="font-sans text-xs font-bold text-primary uppercase tracking-wider select-none">
                  Best Price Now
                </span>
              </div>
              <div className="flex gap-4 text-body-sm font-sans text-ink-muted select-none">
                <span>Hist. Low: <span className="font-mono text-positive font-bold">Rp 10.499.000</span></span>
                <span>Avg: <span className="font-mono">Rp 12.749.000</span></span>
              </div>
            </div>
          </div>

          {/* Action triggers */}
          <div className="flex flex-wrap gap-4 mt-6">
            <Button
              variant="outline"
              className="flex-1 min-w-[140px] px-6 py-5 rounded-lg border-border font-sans text-xs font-bold uppercase tracking-wider gap-2 hover:border-primary hover:text-primary transition-all active:scale-95 bg-card"
            >
              <Heart className="size-4" />
              <span>Add to Wishlist</span>
            </Button>
            <Button
              variant="outline"
              className="flex-1 min-w-[140px] px-6 py-5 rounded-lg border-border font-sans text-xs font-bold uppercase tracking-wider gap-2 hover:border-primary hover:text-primary transition-all active:scale-95 bg-card"
            >
              <Bell className="size-4" />
              <span>Price Alert</span>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
