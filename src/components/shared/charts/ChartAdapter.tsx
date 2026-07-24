"use client";

import * as React from "react";
import { ChartDataPoint, ChartConfig } from "./ChartTypes";

export interface ChartAdapterProps {
  data: ChartDataPoint[];
  config?: ChartConfig;
  renderer: React.ComponentType<{ data: ChartDataPoint[]; config?: ChartConfig }>;
}

export function ChartAdapter({ data, config, renderer: Renderer }: ChartAdapterProps) {
  return <Renderer data={data} config={config} />;
}
