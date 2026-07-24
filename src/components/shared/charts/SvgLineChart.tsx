"use client";

import * as React from "react";
import { ChartDataPoint, ChartConfig } from "./ChartTypes";
import { cn } from "@/lib/utils";

export function SvgLineChart({ data, config }: { data: ChartDataPoint[]; config?: ChartConfig }) {
  const width = config?.width ?? 500;
  const height = config?.height ?? 200;
  const color = config?.color ?? "stroke-accent";

  if (data.length < 2) {
    return (
      <svg width={width} height={height} className={cn("text-ink-muted/30", config?.className)}>
        <line x1={0} y1={height / 2} x2={width} y2={height / 2} stroke="currentColor" strokeWidth={2} strokeDasharray="4 4" />
      </svg>
    );
  }

  const values = data.map((d) => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min === 0 ? 1 : max - min;
  const padding = 16;
  const usableHeight = height - padding * 2;
  const usableWidth = width - padding * 2;

  const points = data.map((d, index) => {
    const x = padding + (index / (data.length - 1)) * usableWidth;
    const y = height - padding - ((d.value - min) / range) * usableHeight;
    return `${x},${y}`;
  });

  const path = `M ${points.join(" L ")}`;

  return (
    <div className="relative w-full" style={{ height }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className={cn("w-full h-full overflow-visible fill-none", color, config?.className)}
      >
        {/* Draw simple grid lines */}
        <line x1={padding} y1={padding} x2={width - padding} y2={padding} className="stroke-border/30" strokeWidth={1} />
        <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} className="stroke-border/30" strokeWidth={1} />
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} className="stroke-border/30" strokeWidth={1} />

        {/* Draw connection line */}
        <path
          d={path}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Draw data point circles */}
        {points.map((pt, i) => {
          const [x, y] = pt.split(",").map(Number);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="4"
              className="fill-surface stroke-current"
              strokeWidth="2"
            />
          );
        })}
      </svg>

      {/* Optional labels at start/end */}
      <div className="absolute left-4 bottom-0 text-[9px] font-sans text-ink-muted uppercase font-bold tracking-wider select-none">
        {data[0].label}
      </div>
      <div className="absolute right-4 bottom-0 text-[9px] font-sans text-ink-muted uppercase font-bold tracking-wider select-none">
        {data[data.length - 1].label}
      </div>
    </div>
  );
}
