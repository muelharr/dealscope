"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useComparison } from "@/hooks/queries/useComparison";
import { ComparisonSkeleton } from "@/components/comparison/ComparisonSkeleton";
import { ComparisonError } from "@/components/comparison/ComparisonError";
import { ComparisonEmpty } from "@/components/comparison/ComparisonEmpty";

import { ComparisonHeader } from "@/components/comparison/ComparisonHeader";
import { ComparisonContent } from "@/components/comparison/ComparisonContent";
import { ComparisonSection } from "@/components/comparison/ComparisonSection";
import { ComparisonSummaryCards } from "@/components/comparison/ComparisonSummaryCards";
import { SelectedProductsSection } from "@/components/comparison/SelectedProductsSection";
import { ComparisonMatrix } from "@/components/comparison/ComparisonMatrix";
import { MarketplaceComparisonSection } from "@/components/comparison/MarketplaceComparisonSection";
import { PriceHistoryComparisonSection } from "@/components/comparison/PriceHistoryComparisonSection";
import { AIComparisonInsights } from "@/components/comparison/AIComparisonInsights";
import { BottomActionsSection } from "@/components/comparison/BottomActionsSection";

export default function ComparisonPage() {
  return (
    <React.Suspense fallback={<ComparisonSkeleton />}>
      <Comparison />
    </React.Suspense>
  );
}

function Comparison() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1. Parse compared product IDs from URL search parameter '?ids=id1,id2,id3'
  const ids = React.useMemo(() => {
    const idsString = searchParams.get("ids");
    if (!idsString) return [];
    return idsString.split(",").map(id => id.trim()).filter(Boolean);
  }, [searchParams]);

  // 2. Fetch live comparison data from the backend
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useComparison(ids);

  // 3. Render Empty state if no product IDs are in the URL
  if (ids.length === 0) {
    return <ComparisonEmpty />;
  }

  // 4. Render Loading skeleton during initial fetch
  if (isLoading) {
    return <ComparisonSkeleton />;
  }

  // 5. Render Error view if query fails
  if (isError || !data) {
    return <ComparisonError onRetry={refetch} />;
  }

  const handleRemoveProduct = (idToRemove: string) => {
    // Sync removal with URL. Re-push updates params and re-runs query key.
    const newIds = ids.filter((id) => id !== idToRemove);
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    if (newIds.length === 0) {
      current.delete("ids");
    } else {
      current.set("ids", newIds.join(","));
    }

    router.push(`${pathname}?${current.toString()}`);
  };

  const handleActionClick = (productId: string, actionType: "analysis" | "marketplace") => {
    alert(`Triggering ${actionType} details for ${productId}...`);
  };

  const handleExportPdf = () => {
    alert("Compiling report details... PDF download will begin shortly.");
  };

  const handleBottomActionTrigger = (actionId: string) => {
    alert(`Bottom action clicked: ${actionId}`);
  };

  const headerData = {
    title: `${data.comparedProducts[0]?.brand || ""} Comparison`,
    breadcrumbs: [
      { label: "Home", href: "/" },
      { label: "Comparison" },
    ],
  };

  return (
    <div className="flex flex-col gap-spacing-6 w-full max-w-container mx-auto">
      {/* Page Header */}
      <ComparisonHeader data={headerData} />

      {/* Page Content Shell */}
      <ComparisonContent
        summaryCards={
          <ComparisonSummaryCards data={data.summary} />
        }
        matrixContent={
          <div className="space-y-6">
            <SelectedProductsSection products={data.comparedProducts} onRemoveProduct={handleRemoveProduct} />
            <ComparisonMatrix
              products={data.matrixProductHeaders}
              categories={data.matrixCategories}
              onActionClick={handleActionClick}
            />
          </div>
        }
        chartContent={
          <PriceHistoryComparisonSection series={data.priceSeries} />
        }
        insightsContent={
          <AIComparisonInsights data={data.aiRecommendation} onExportPdf={handleExportPdf} />
        }
        specsContent={
          <div className="space-y-6">
            <ComparisonSection title="Technical Specifications">
              <div className="py-16 text-center text-ink-muted border border-border border-dashed rounded-lg bg-muted/10 font-sans text-xs">
                Technical Specifications 4-Column Grid Placeholder
              </div>
            </ComparisonSection>
            <BottomActionsSection onActionTrigger={handleBottomActionTrigger} />
          </div>
        }
        inventoryContent={
          <MarketplaceComparisonSection comparisons={data.marketplaceComparisons} />
        }
      />
    </div>
  );
}
