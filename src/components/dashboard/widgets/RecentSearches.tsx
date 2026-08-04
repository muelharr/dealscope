"use client";

import Link from "next/link";
import { Search, ArrowRight, History } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSearchHistory } from "@/hooks/queries/useSearchHistory";
import { Skeleton } from "@/components/ui/skeleton";

export function RecentSearches() {
  const { data: queries = [], isLoading, isError } = useSearchHistory();

  return (
    <Card className="border border-border bg-surface shadow-sm rounded-xl overflow-hidden">
      <CardContent className="p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-ink-muted text-xs font-medium">
            <History className="h-3.5 w-3.5" />
            <span>Saved Search Queries</span>
          </div>
          <Link
            href="/search"
            className="text-xs text-primary hover:underline font-medium flex items-center gap-1"
          >
            Explore <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        ) : isError || queries.length === 0 ? (
          <div className="py-6 text-center text-xs text-ink-muted border border-dashed border-border rounded-lg bg-surface/50">
            No recent search queries.
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {queries.slice(0, 4).map((item) => (
              <Link
                key={item.id}
                href={`/search?q=${encodeURIComponent(item.query)}`}
                className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 bg-secondary/30 hover:bg-secondary transition-all group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Search className="h-3.5 w-3.5 text-ink-muted group-hover:text-primary transition-colors shrink-0" />
                  <span className="text-xs font-medium text-ink-primary truncate font-sans">
                    {item.query}
                  </span>
                </div>
                <Badge variant="outline" className="text-[10px] font-mono shrink-0 border-border bg-surface">
                  Query
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
