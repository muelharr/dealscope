"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface PriceSparklineProps extends React.ComponentProps<"svg"> {
  prices: number[];
  trend?: "stable" | "rising" | "falling";
  width?: number;
  height?: number;
}

export function PriceSparkline({
  prices,
  trend: explicitTrend,
  width = 120,
  height = 36,
  className,
  ...props
}: PriceSparklineProps) {
  // Calculate automatically if no trend is provided (hooks must be at the top)
  const trend = React.useMemo(() => {
    if (explicitTrend) return explicitTrend;
    if (!prices || prices.length < 2) return "stable";
    const first = prices[0];
    const last = prices[prices.length - 1];
    if (last < first) return "falling"; // Good (price dropped)
    if (last > first) return "rising";  // Bad (price increased)
    return "stable";
  }, [prices, explicitTrend]);

  // If we don't have enough data to draw a line, return a horizontal placeholder line
  if (!prices || prices.length < 2) {
    return (
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className={cn("text-ink-muted/30", className)}
        {...props}
      >
        <line
          x1="0"
          y1={height / 2}
          x2={width}
          y2={height / 2}
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="4 4"
        />
      </svg>
    );
  }

  // Determine trend color stroke mapping
  const strokeClass = {
    stable: "stroke-accent", // Vivid Blue (#0066ff / #2563EB)
    rising: "stroke-caution",  // Amber (#CA8A04)
    falling: "stroke-positive", // Green/Emerald (#16A34A)
  }[trend];

  // Map values to coordinates
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min === 0 ? 1 : max - min;

  // Add standard padding top and bottom to prevent clipping paths on limits
  const padding = 4;
  const usableHeight = height - padding * 2;

  const points = prices.map((price, index) => {
    const x = (index / (prices.length - 1)) * width;
    // In SVG, y=0 is top, so we subtract mapped value from height
    const y = height - padding - ((price - min) / range) * usableHeight;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const pathDefinition = `M ${points.join(" L ")}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={cn("overflow-visible fill-none", strokeClass, className)}
      {...props}
    >
      <path
        d={pathDefinition}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
