"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ComparisonContentProps {
  summaryCards: React.ReactNode;
  matrixContent: React.ReactNode;
  chartContent: React.ReactNode;
  insightsContent: React.ReactNode;
  specsContent: React.ReactNode;
  inventoryContent: React.ReactNode;
  className?: string;
}

export function ComparisonContent({
  summaryCards,
  matrixContent,
  chartContent,
  insightsContent,
  specsContent,
  inventoryContent,
  className,
}: ComparisonContentProps) {
  return (
    <div className={cn("grid grid-cols-12 gap-spacing-6 items-start w-full", className)}>
      {/* 1. Summary Cards row */}
      <div className="col-span-12">{summaryCards}</div>

      {/* 2. Matrix Table row */}
      <div className="col-span-12">{matrixContent}</div>

      {/* 3. Middle split area (Chart on left, AI Insights on right) */}
      <div className="col-span-12 lg:col-span-8">{chartContent}</div>
      <div className="col-span-12 lg:col-span-4">{insightsContent}</div>

      {/* 4. Specifications row */}
      <div className="col-span-12">{specsContent}</div>

      {/* 5. Inventory table row */}
      <div className="col-span-12">{inventoryContent}</div>
    </div>
  );
}
