"use client";

import * as React from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { DashboardSection } from "@/components/dashboard/DashboardSection";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-spacing-6 w-full max-w-container mx-auto">
      {/* 1. Dashboard Header strictly matching May 24, 2024 specifications */}
      <DashboardHeader
        userName="Alex"
        statusLabel="Markets Stable"
        statusType="positive"
        dateText="May 24, 2024"
      />

      {/* 2. Dashboard Shell Layout Composition */}
      <DashboardContent
        mainContent={
          <>
            {/* Insights Region / AI Brief Container */}
            <DashboardSection title="Today's AI Shopping Brief">
              <div className="py-8 text-center text-ink-muted border border-border border-dashed rounded-lg bg-muted/10 font-sans text-xs">
                AI Shopping Brief Segment Placeholder
              </div>
            </DashboardSection>

            {/* Deals Region / Price Watchlist Container */}
            <DashboardSection title="Price Watchlist">
              <div className="py-12 text-center text-ink-muted border border-border border-dashed rounded-lg bg-muted/10 font-sans text-xs">
                Price Watchlist Grid Placeholder
              </div>
            </DashboardSection>

            {/* Analytics Region / Market Overview Container */}
            <DashboardSection title="Market Sector Overview">
              <div className="py-12 text-center text-ink-muted border border-border border-dashed rounded-lg bg-muted/10 font-sans text-xs">
                Market Sector Overview Graph Placeholder
              </div>
            </DashboardSection>
          </>
        }
        sidebarContent={
          <>
            {/* KPIRegion Container */}
            <DashboardSection title="Key Metrics">
              <div className="py-12 text-center text-ink-muted border border-border border-dashed rounded-lg bg-muted/10 font-sans text-xs">
                KPI Indicators Stack Placeholder
              </div>
            </DashboardSection>

            {/* Recent Searches Container */}
            <DashboardSection title="Recent Searches">
              <div className="py-8 text-center text-ink-muted border border-border border-dashed rounded-lg bg-muted/10 font-sans text-xs">
                Recent Searches List Placeholder
              </div>
            </DashboardSection>

            {/* Activity Timeline Container */}
            <DashboardSection title="Activity Timeline">
              <div className="py-12 text-center text-ink-muted border border-border border-dashed rounded-lg bg-muted/10 font-sans text-xs">
                Activity Timeline List Placeholder
              </div>
            </DashboardSection>
          </>
        }
      />
    </div>
  );
}
