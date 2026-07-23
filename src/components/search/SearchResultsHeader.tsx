"use client";

import * as React from "react";
import { X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ActiveFilter {
  id: string;
  label: string;
}

export interface SearchResultsHeaderProps {
  count: number;
  query: string;
  activeFilters: ActiveFilter[];
  onRemoveFilter?: (filterId: string) => void;
  sortBy: string;
  onSortChange?: (value: string) => void;
  isFetching?: boolean;
  className?: string;
}

export function SearchResultsHeader({
  count,
  query,
  activeFilters,
  onRemoveFilter,
  sortBy,
  onSortChange,
  isFetching,
  className,
}: SearchResultsHeaderProps) {
  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Upper Header Row: Count & Query, and Sort Control */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="font-sans font-bold text-headline-lg text-ink-primary leading-tight">
            {count} Results for &apos;{query}&apos;
          </h2>
          {isFetching && <span className="text-sm text-ink-muted">Updating...</span>}
        </div>

        {/* Sort by dropdown */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="font-sans text-body-sm text-ink-muted">Sort by</span>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortChange && onSortChange(e.target.value)}
              className="appearance-none bg-card border border-border-interactive rounded-lg px-4 py-2 pr-10 text-body-sm font-medium focus:ring-2 focus:ring-primary outline-none cursor-pointer text-ink-primary"
            >
              <option>Best Deal</option>
              <option>Lowest Price</option>
              <option>Highest Rating</option>
              <option>Lowest Historical Price</option>
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-ink-muted">
              <ChevronDown className="size-4" />
            </span>
          </div>
        </div>
      </div>

      {/* Lower Row: Active Filter Summary Pills */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {activeFilters.map((filter) => (
            <span
              key={filter.id}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary text-ink-primary text-xs rounded-full font-medium"
            >
              {filter.label}
              <button
                type="button"
                onClick={() => onRemoveFilter && onRemoveFilter(filter.id)}
                className="bg-transparent border-none outline-none cursor-pointer flex items-center p-0 text-ink-muted hover:text-ink-primary transition-colors"
                aria-label={`Remove filter ${filter.label}`}
              >
                <X className="size-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
