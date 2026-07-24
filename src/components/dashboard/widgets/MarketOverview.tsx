"use client";

import * as React from "react";
import { ChartAdapter } from "@/components/shared/charts/ChartAdapter";
import { SvgLineChart } from "@/components/shared/charts/SvgLineChart";
import { ChartDataPoint } from "@/components/shared/charts/ChartTypes";

export function MarketOverview() {
  const data: ChartDataPoint[] = [
    { label: "Jan", value: 100 },
    { label: "Feb", value: 120 },
    { label: "Mar", value: 115 },
    { label: "Apr", value: 130 },
    { label: "May", value: 145 },
    { label: "Jun", value: 140 },
  ];

  return (
    <div className="bg-surface rounded-xl p-spacing-4 border border-border flex flex-col items-center justify-center">
      <ChartAdapter
        data={data}
        config={{
          width: 500,
          height: 180,
          color: "stroke-accent",
        }}
        renderer={SvgLineChart}
      />
    </div>
  );
}
