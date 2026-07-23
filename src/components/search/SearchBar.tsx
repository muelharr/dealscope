"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
  defaultValue?: string;
}

export function SearchBar({
  onSearch,
  placeholder = "Search products, brands, or SKU numbers...",
  className,
  defaultValue = "",
}: SearchBarProps) {
  const [query, setQuery] = React.useState(defaultValue);

  React.useEffect(() => {
    setQuery(defaultValue);
  }, [defaultValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <div className={cn("relative w-full", className)}>
      <form onSubmit={handleSubmit} className="relative w-full">
        {/* Search icon placement identical to Stitch */}
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-primary">
          <Search className="size-5" aria-hidden="true" />
        </div>

        {/* Search Input matching Stitch properties */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          aria-label="Search inputs"
          className="w-full h-16 pl-14 pr-36 bg-card border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary font-sans text-body-lg shadow-sm transition-all outline-none text-ink-primary"
        />

        {/* Search Button matching Stitch styling */}
        <div className="absolute inset-y-0 right-4 flex items-center">
          <Button
            type="submit"
            className="bg-primary hover:bg-primary/90 text-primary-foreground h-10 px-6 rounded-lg font-sans text-xs font-bold uppercase tracking-wider transition-all active:scale-95 shadow-sm"
          >
            Run Analysis
          </Button>
        </div>
      </form>
    </div>
  );
}
