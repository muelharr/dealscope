"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface PricePoint {
  date: string;
  price: number;
}

export interface ProductPriceSeries {
  productId: string;
  name: string;
  points: PricePoint[];
  color: string;
  isDashed?: boolean;
}

export interface PriceHistoryComparisonSectionProps {
  series: ProductPriceSeries[];
  className?: string;
}

export function PriceHistoryComparisonSection({
  series,
  className,
}: PriceHistoryComparisonSectionProps) {
  // Compute global price limits to normalize vertical coordinates across all series
  const allPrices = series.flatMap((s) => s.points.map((p) => p.price));
  const maxPrice = allPrices.length > 0 ? Math.max(...allPrices) : 1000;
  const minPrice = allPrices.length > 0 ? Math.min(...allPrices) : 0;
  const priceRange = maxPrice - minPrice || 1;

  // Render a simulated multi-line chart using standardized dimensions
  const width = 800;
  const height = 240;
  const padding = 10;
  const usableHeight = height - padding * 2;

  return (
    <div
      className={cn(
        "bg-card border border-border p-6 rounded-xl h-[400px] flex flex-col justify-between shadow-sm",
        className
      )}
    >
      {/* Header & Legend block */}
      <div className="flex justify-between items-center pb-2 border-b border-border/40 select-none">
        <h3 className="font-sans font-bold text-base text-ink-primary">Price History (90 Days)</h3>

        {/* Color-coded Legends */}
        <div className="flex gap-4">
          {series.map((s) => (
            <div key={s.productId} className="flex items-center gap-2">
              <span className={cn("w-3 h-3 rounded-full", s.color)} />
              <span className="font-sans text-[10px] font-bold text-ink-muted uppercase tracking-wider">
                {s.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Chart Plot area */}
      <div className="flex-grow flex items-end justify-between relative group cursor-crosshair h-56 mt-4">
        {/* Grid Lines */}
        <div className="absolute inset-0 grid grid-rows-4 w-full h-full pointer-events-none select-none">
          <div className="border-b border-border/20"></div>
          <div className="border-b border-border/20"></div>
          <div className="border-b border-border/20"></div>
          <div className="border-b border-border/20"></div>
        </div>

        {/* Multi-series SVG lines */}
        <svg
          className="absolute inset-0 w-full h-full overflow-visible"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {series.map((s) => {
            if (s.points.length < 2) return null;

            // Map price points to coordinates
            const coords = s.points.map((p, idx) => {
              const x = (idx / (s.points.length - 1)) * width;
              // In SVG, y=0 is top, so we subtract from height
              const y = height - padding - ((p.price - minPrice) / priceRange) * usableHeight;
              return `${x.toFixed(1)},${y.toFixed(1)}`;
            });

            const pathDefinition = `M ${coords.join(" L ")}`;

            return (
              <React.Fragment key={s.productId}>
                <path
                  d={pathDefinition}
                  fill="none"
                  className={cn(s.isDashed ? "stroke-ink-muted" : s.productId === "asus-rog-strix" ? "stroke-primary" : "stroke-caution")}
                  strokeWidth={s.isDashed ? "1.5" : "2.5"}
                  strokeDasharray={s.isDashed ? "4 4" : undefined}
                  strokeLinecap="round"
                />
                {/* Last point dot indicator */}
                {coords.length > 0 && (
                  <circle
                    cx={coords[coords.length - 1].split(",")[0]}
                    cy={coords[coords.length - 1].split(",")[1]}
                    r="3.5"
                    className={cn(s.isDashed ? "fill-ink-muted" : s.productId === "asus-rog-strix" ? "fill-primary" : "fill-caution")}
                  />
                )}
              </React.Fragment>
            );
          })}
        </svg>

        {/* Interaction Tooltip mockup */}
        <div className="absolute pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-inverse-surface text-inverse-on-surface p-2 rounded text-[10px] z-10 left-1/2 top-10 shadow-md select-none border border-border/10 font-mono">
          Last 30d Average: Rp 11.249.000
        </div>
      </div>

      {/* X-axis Timeline Labels */}
      <div className="mt-4 flex justify-between text-[10px] font-bold text-ink-muted uppercase tracking-wider select-none">
        <span>90 Days Ago</span>
        <span>60 Days Ago</span>
        <span>30 Days Ago</span>
        <span>Today</span>
      </div>
    </div>
  );
}
