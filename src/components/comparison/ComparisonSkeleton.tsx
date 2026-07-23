import { Skeleton } from "@/components/ui/skeleton";
import { ComparisonHeader } from "./ComparisonHeader";
import { ComparisonContent } from "./ComparisonContent";
import { ComparisonSection } from "./ComparisonSection";

export function ComparisonSkeleton() {
  const mockHeaderData = {
    title: "Market Comparison",
    breadcrumbs: [
      { label: "Home", href: "/" },
      { label: "Comparison" },
    ],
  };

  return (
    <div className="flex flex-col gap-spacing-6 w-full max-w-container mx-auto">
      <ComparisonHeader data={mockHeaderData} />
      <ComparisonContent
        summaryCards={
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
        }
        matrixContent={
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Skeleton className="h-32 w-full rounded-xl" />
              <Skeleton className="h-32 w-full rounded-xl" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        }
        chartContent={
          <Skeleton className="h-72 w-full rounded-xl" />
        }
        insightsContent={
          <Skeleton className="h-48 w-full rounded-xl" />
        }
        specsContent={
          <div className="space-y-6">
            <ComparisonSection title="Technical Specifications">
              <Skeleton className="h-64 w-full rounded-xl" />
            </ComparisonSection>
            <div className="flex gap-4 justify-end">
              <Skeleton className="h-10 w-32 rounded-lg" />
              <Skeleton className="h-10 w-32 rounded-lg" />
            </div>
          </div>
        }
        inventoryContent={
          <Skeleton className="h-80 w-full rounded-xl" />
        }
      />
    </div>
  );
}
