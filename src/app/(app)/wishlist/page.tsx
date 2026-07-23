"use client";

import * as React from "react";
import { WishlistHeader } from "@/components/wishlist/WishlistHeader";
import { WishlistGrid } from "@/components/wishlist/WishlistGrid";
import { WishlistCard, WishlistItem } from "@/components/wishlist/WishlistCard";

const MOCK_ITEMS: WishlistItem[] = [
  {
    id: "acousticflow-pro",
    brand: "AcousticFlow",
    name: "AcousticFlow Pro X1",
    currentPrice: 4485000, // Rp 4.485.000 ($299.00 formatted)
    originalPrice: 5249000,
    historicLow: 4275000,
    scoreLabel: "EXCEPTIONAL",
    scoreVariant: "positive",
    aiVerdict: "BUY NOW",
    pricesHistory: [5249000, 5099000, 4899000, 4599000, 4485000],
    marketplacesCount: 12,
    sellerTrust: 98,
    inventoryStatus: "Low",
    trendDiff: "-14.5%",
  },
  {
    id: "lumina-z8",
    brand: "Lumina",
    name: "Lumina Z8 Camera",
    currentPrice: 21735000, // Rp 21.735.000 ($1,449.00 formatted)
    originalPrice: 23985000,
    historicLow: 19485000,
    scoreLabel: "GOOD",
    scoreVariant: "warning",
    aiVerdict: "WAIT",
    pricesHistory: [21485000, 21585000, 21685000, 21735000],
    marketplacesCount: 4,
    sellerTrust: 94,
    inventoryStatus: "Stable",
    trendDiff: "+2.1%",
  },
];

export default function WishlistPage() {
  const [sortOption, setSortOption] = React.useState("Potential Savings");
  const [items, setItems] = React.useState<WishlistItem[]>(MOCK_ITEMS);

  const handleSearchClick = () => {
    alert("Navigating to search catalog...");
  };

  const handleFilterClick = () => {
    alert("Opening filter drawers...");
  };

  const handleRemoveProduct = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="flex flex-col gap-spacing-6 w-full max-w-container mx-auto pb-16">
      {/* 1. Page Header matching Stitch */}
      <WishlistHeader
        totalItems={items.length}
        averageSavingsPercent={18}
        activeSortOption={sortOption}
        onFilterClick={handleFilterClick}
        onSortChange={setSortOption}
      />

      {/* 2. Wishlist Grid rendering structural WishlistCard items */}
      <WishlistGrid>
        {items.map((item) => (
          <WishlistCard key={item.id} product={item} onRemove={handleRemoveProduct} />
        ))}

        {/* WishlistAddCard Placeholder */}
        <div className="bg-card border-2 border-dashed border-border rounded-xl p-6 h-96 flex flex-col items-center justify-center text-center shadow-sm">
          <span className="font-sans text-xl font-bold text-ink-muted mb-2">+</span>
          <h4 className="font-sans font-bold text-sm text-ink-primary mb-2">Track more products</h4>
          <p className="text-ink-muted text-body-sm max-w-xs mb-4">
            Found something else you like? Save it here.
          </p>
          <button
            onClick={handleSearchClick}
            className="px-4 py-2 bg-card border border-border rounded-full font-sans text-[10px] font-bold uppercase hover:bg-muted cursor-pointer"
          >
            Search
          </button>
        </div>
      </WishlistGrid>
    </div>
  );
}
