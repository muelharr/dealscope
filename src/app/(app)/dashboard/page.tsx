"use client";

import * as React from "react";
import { useDashboardData } from "@/hooks/queries/useDashboardData";
import { useCurrentUser } from "@/auth";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { KeyMetrics } from "@/components/dashboard/widgets/KeyMetrics";
import { Insights } from "@/components/dashboard/widgets/Insights";
import { Watchlist } from "@/components/dashboard/widgets/Watchlist";
import { Activity } from "@/components/dashboard/widgets/Activity";

export default function DashboardPage() {
  const { isInitialLoading, metrics, insights, watchlist, activity } = useDashboardData();
  const user = useCurrentUser();
  const [dateText, setDateText] = React.useState<string>("");

  React.useEffect(() => {
    setDateText(new Date().toLocaleDateString('en-US', { dateStyle: 'long' }));
  }, []);

  if (isInitialLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="flex flex-col gap-spacing-6 w-full max-w-container mx-auto">
      <DashboardHeader
        userName={user?.username ?? 'Explorer'}
        statusLabel="Markets Stable"
        statusType="positive"
        dateText={dateText}
      />

      <DashboardContent
        mainContent={
          <>
            <DashboardSection title="Today's AI Shopping Brief">
              <Insights result={insights} />
            </DashboardSection>

            <DashboardSection title="Price Watchlist">
              <Watchlist result={watchlist} />
            </DashboardSection>

            <DashboardSection title="Market Sector Overview">
              <div className="py-12 text-center text-ink-muted border border-border border-dashed rounded-lg bg-muted/10 font-sans text-xs">
                Market Sector Overview Graph Placeholder
              </div>
            </DashboardSection>
          </>
        }
        sidebarContent={
          <>
            <DashboardSection title="Key Metrics">
              <KeyMetrics result={metrics} />
            </DashboardSection>

            <DashboardSection title="Recent Searches">
              <div className="py-8 text-center text-ink-muted border border-border border-dashed rounded-lg bg-muted/10 font-sans text-xs">
                Recent Searches List Placeholder
              </div>
            </DashboardSection>

            <DashboardSection title="Activity Timeline">
              <Activity result={activity} />
            </DashboardSection>
          </>
        }
      />
    </div>
  );
}
