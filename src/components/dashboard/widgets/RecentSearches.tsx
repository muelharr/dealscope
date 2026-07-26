"use client";

import Link from "next/link";
import { Search, ArrowRight, History } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const RECENT_QUERIES = [
  { query: "Apple MacBook Pro M3", count: "12 offers", trend: "falling" },
  { query: "iPhone 15 Pro Max", count: "8 offers", trend: "stable" },
  { query: "RTX 5070 Series", count: "15 offers", trend: "rising" },
  { query: "Sony WH-1000XM5", count: "6 offers", trend: "falling" },
];

export function RecentSearches() {
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

        <div className="flex flex-col gap-2">
          {RECENT_QUERIES.map((item) => (
            <Link
              key={item.query}
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
                {item.count}
              </Badge>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
