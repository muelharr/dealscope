import { Skeleton } from "@/components/ui/skeleton";

export function ProductDetailSkeleton() {
  return (
    <div className="flex flex-col gap-spacing-6 w-full max-w-container mx-auto">
      {/* Breadcrumb skeleton */}
      <Skeleton className="h-4 w-48" />

      {/* Header section: image + info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-spacing-6">
        <Skeleton className="aspect-square w-full rounded-xl" />
        <div className="space-y-4">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex gap-3 mt-6">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>

      {/* Price overview skeleton */}
      <Skeleton className="h-48 w-full rounded-xl" />

      {/* Offers table skeleton */}
      <Skeleton className="h-64 w-full rounded-xl" />

      {/* Price history skeleton */}
      <Skeleton className="h-56 w-full rounded-xl" />

      {/* AI summary skeleton */}
      <Skeleton className="h-48 w-full rounded-xl" />

      {/* Specifications skeleton */}
      <Skeleton className="h-40 w-full rounded-xl" />

      {/* Similar products skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    </div>
  );
}
