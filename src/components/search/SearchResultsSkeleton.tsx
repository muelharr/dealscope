import { Skeleton } from "@/components/ui/skeleton";

export function SearchResultsSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex flex-col space-y-3 p-4 border rounded-xl">
          <div className="flex gap-4">
            <Skeleton className="h-24 w-24 rounded-lg" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-8 w-1/4 mt-4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
