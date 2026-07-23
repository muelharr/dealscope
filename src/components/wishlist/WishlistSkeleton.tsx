import { Skeleton } from "@/components/ui/skeleton";
import { WishlistGrid } from "./WishlistGrid";

export function WishlistSkeleton() {
  return (
    <div className="flex flex-col gap-spacing-6 w-full max-w-container mx-auto pb-16">
      {/* Header skeleton */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-28 rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
      </div>

      {/* Grid of skeletons */}
      <WishlistGrid>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="border border-border rounded-xl overflow-hidden flex flex-col h-96">
            <Skeleton className="h-56 w-full" />
            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-6 w-1/3" />
              </div>
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
          </div>
        ))}
      </WishlistGrid>
    </div>
  );
}
