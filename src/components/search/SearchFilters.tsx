"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface FilterState {
  marketplaces: string[];
  minPrice: string;
  maxPrice: string;
  brands: string[];
  dealScore: number;
  sortBy: string;
}

export interface SearchFiltersProps {
  onApplyFilters?: (filters: FilterState) => void;
  onResetFilters?: () => void;
  className?: string;
}

const DEFAULT_FILTERS: FilterState = {
  marketplaces: ["Amazon", "Best Buy", "Newegg"],
  minPrice: "",
  maxPrice: "",
  brands: [],
  dealScore: 50,
  sortBy: "Best Deal",
};

export function SearchFilters({
  onApplyFilters,
  onResetFilters,
  className,
}: SearchFiltersProps) {
  const [filters, setFilters] = React.useState<FilterState>(DEFAULT_FILTERS);

  const handleMarketplaceChange = (market: string, checked: boolean) => {
    setFilters((prev) => {
      const updated = checked
        ? [...prev.marketplaces, market]
        : prev.marketplaces.filter((m) => m !== market);
      return { ...prev, marketplaces: updated };
    });
  };

  const handleBrandChange = (brand: string, checked: boolean) => {
    setFilters((prev) => {
      const updated = checked
        ? [...prev.brands, brand]
        : prev.brands.filter((b) => b !== brand);
      return { ...prev, brands: updated };
    });
  };

  const handlePriceChange = (type: "minPrice" | "maxPrice", val: string) => {
    setFilters((prev) => ({ ...prev, [type]: val }));
  };

  const handleSortChange = (sortBy: string) => {
    setFilters((prev) => ({ ...prev, sortBy }));
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    if (onResetFilters) onResetFilters();
  };

  const handleApply = () => {
    if (onApplyFilters) onApplyFilters(filters);
  };

  const brandsWithCounts = [
    { id: "ASUS", label: "ASUS", count: 24 },
    { id: "MSI", label: "MSI", count: 18 },
    { id: "Gigabyte", label: "Gigabyte", count: 12 },
  ];

  return (
    <div className={cn("w-full bg-card border border-border rounded-xl p-6 space-y-6 shadow-sm", className)}>
      {/* Filters Header Section */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div>
          <h3 className="font-sans text-xs font-bold text-ink-primary uppercase tracking-widest">
            Data Filters
          </h3>
          <p className="text-[10px] text-ink-muted">Refine Intelligence</p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="text-primary text-xs font-semibold hover:underline bg-transparent border-none outline-none cursor-pointer"
        >
          Reset Filters
        </button>
      </div>

      <div className="space-y-6">
        {/* Marketplace Section */}
        <div>
          <span className="block font-sans text-xs font-bold text-ink-muted uppercase tracking-wider mb-3">
            Marketplace
          </span>
          <div className="space-y-2">
            {["Amazon", "Best Buy", "Newegg", "B&H Photo"].map((market) => {
              const isChecked = filters.marketplaces.includes(market);
              return (
                <label
                  key={market}
                  className="flex items-center gap-2 text-body-sm text-ink-primary cursor-pointer group select-none"
                >
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={(checked) => handleMarketplaceChange(market, !!checked)}
                  />
                  <span className="group-hover:text-primary transition-colors">{market}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Price Range Section */}
        <div>
          <span className="block font-sans text-xs font-bold text-ink-muted uppercase tracking-wider mb-3">
            Price Range
          </span>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={filters.minPrice}
              onChange={(e) => handlePriceChange("minPrice", e.target.value)}
              placeholder="Min"
              className="w-full bg-muted/20 border border-border-interactive rounded-md px-2 py-1.5 text-xs outline-none focus:border-primary text-ink-primary"
            />
            <span className="text-ink-muted text-xs">to</span>
            <input
              type="text"
              value={filters.maxPrice}
              onChange={(e) => handlePriceChange("maxPrice", e.target.value)}
              placeholder="Max"
              className="w-full bg-muted/20 border border-border-interactive rounded-md px-2 py-1.5 text-xs outline-none focus:border-primary text-ink-primary"
            />
          </div>
        </div>

        {/* Brand Section */}
        <div>
          <span className="block font-sans text-xs font-bold text-ink-muted uppercase tracking-wider mb-3">
            Brand
          </span>
          <div className="space-y-2">
            {brandsWithCounts.map((brand) => {
              const isChecked = filters.brands.includes(brand.id);
              return (
                <label
                  key={brand.id}
                  className="flex items-center justify-between text-body-sm text-ink-primary cursor-pointer group select-none"
                >
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={(checked) => handleBrandChange(brand.id, !!checked)}
                    />
                    <span className="group-hover:text-primary transition-colors">{brand.label}</span>
                  </div>
                  <span className="text-[10px] text-ink-muted px-1.5 py-0.5 bg-muted rounded">
                    {brand.count}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Deal Score Slider Section */}
        <div>
          <span className="block font-sans text-xs font-bold text-ink-muted uppercase tracking-wider mb-3">
            Deal Score Range
          </span>
          <input
            type="range"
            min="0"
            max="100"
            value={filters.dealScore}
            onChange={(e) => setFilters((prev) => ({ ...prev, dealScore: parseInt(e.target.value) }))}
            className="w-full accent-primary h-1.5 bg-muted rounded-full appearance-none cursor-pointer"
          />
          <div className="flex justify-between mt-2 text-[10px] text-ink-muted font-semibold uppercase tracking-wider select-none">
            <span>Low ({filters.dealScore})</span>
            <span>Mid</span>
            <span>High</span>
          </div>
        </div>

        {/* Sort Dropdown Section */}
        <div>
          <span className="block font-sans text-xs font-bold text-ink-muted uppercase tracking-wider mb-3">
            Sort Options
          </span>
          <div className="relative w-full">
            <select
              value={filters.sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="appearance-none w-full bg-card border border-border-interactive rounded-lg px-4 py-2.5 pr-10 text-xs font-semibold focus:ring-2 focus:ring-primary outline-none cursor-pointer text-ink-primary"
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

        {/* Action Button */}
        <Button
          onClick={handleApply}
          className="w-full mt-4 bg-primary text-primary-foreground py-2.5 rounded-lg font-sans text-xs font-bold uppercase tracking-wider transition-all hover:opacity-90 active:scale-95 duration-150 shadow-sm"
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
}
