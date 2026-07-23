import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardContent } from "./DashboardContent";
import { DashboardSection } from "./DashboardSection";

export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-spacing-6 w-full max-w-container mx-auto">
      <DashboardHeader
        userName="..."
        statusLabel="Loading..."
        statusType={undefined}
        dateText="..."
      />
      <DashboardContent
        mainContent={
          <>
            <DashboardSection title="Today's AI Shopping Brief">
              <Skeleton className="h-24 w-full rounded-lg" />
            </DashboardSection>
            <DashboardSection title="Price Watchlist">
              <Skeleton className="h-48 w-full rounded-lg" />
            </DashboardSection>
            <DashboardSection title="Market Sector Overview">
              <Skeleton className="h-48 w-full rounded-lg" />
            </DashboardSection>
          </>
        }
        sidebarContent={
          <>
            <DashboardSection title="Key Metrics">
              <div className="space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            </DashboardSection>
            <DashboardSection title="Recent Searches">
              <Skeleton className="h-24 w-full rounded-lg" />
            </DashboardSection>
            <DashboardSection title="Activity Timeline">
              <Skeleton className="h-48 w-full rounded-lg" />
            </DashboardSection>
          </>
        }
      />
    </div>
  );
}
