'use client';

import { Button } from "@/components/ui/button";
import { GitCompare } from "lucide-react";
import Link from "next/link";
import { ComparisonHeader } from "./ComparisonHeader";

export function ComparisonEmpty() {
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
      <div className="flex flex-col items-center justify-center p-16 text-center border border-border border-dashed rounded-2xl bg-muted/10 max-w-lg mx-auto my-12">
        <GitCompare className="w-16 h-16 text-ink-muted/50 mb-4 stroke-1" />
        <h2 className="text-2xl font-sans font-bold text-ink-primary mb-2">
          No Products Selected
        </h2>
        <p className="text-ink-muted text-body-md mb-6 leading-relaxed">
          You haven&apos;t added any products to compare yet. Go back to search to find and add products to your comparison list.
        </p>
        <Button asChild variant="default" size="lg" className="px-8 rounded-lg font-sans font-bold uppercase tracking-wider text-xs">
          <Link href="/search">Find Products</Link>
        </Button>
      </div>
    </div>
  );
}
