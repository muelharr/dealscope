"use client";

import * as React from "react";
import { SearchBar } from "@/components/search/SearchBar";
import { SearchFilters, FilterState } from "@/components/search/SearchFilters";
import { SearchResultsHeader, ActiveFilter } from "@/components/search/SearchResultsHeader";
import { SearchResultsGrid, SearchResultItem } from "@/components/search/SearchResultsGrid";

const INITIAL_FILTERS: FilterState = {
  marketplaces: ["Amazon", "Best Buy", "Newegg"],
  minPrice: "",
  maxPrice: "",
  brands: [],
  dealScore: 80,
  sortBy: "Best Deal",
};

// Realistic mock products matching the Stitch Search Results specifications (RTX 5070 focus)
const MOCK_PRODUCTS: SearchResultItem[] = [
  {
    id: "asus-rog-5070-oc",
    title: "ASUS ROG Strix GeForce RTX 5070 OC Edition",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCYIYBpUqk4DgvZjemP2OCpJ8waj9UE4JhwdGqUv8potMbXHWGPiRZcAh__GnzSJL-x_Iq_ItOV06L_gdykypRr895zMhm0er71a4m0y4eDVOTlLFRi0UvT7FftlkwYM-KpiA0JhY-xgY85D8EgbEtFxVegHasjfXv-KXeKXQwhK9IqERaTY6Q3PiLx6W2xFpJ2sqnZo7lSNV7m9xWPlPI5vrRbql7Na_SmmjLMjXnzLYCH7jbXuS3sMw",
    currentPrice: 11249000,
    originalPrice: 13499000,
    marketplaceName: "Amazon",
    sellerTrustScore: 98,
    shippingInfo: "Ships in 2 days",
    dealScore: 94,
    dealScoreLabel: "Exceptional",
    aiVerdict: "BUY NOW" as const,
    aiVerdictReason: "This price is within 2% of the all-time low and inventory data shows stock is decreasing rapidly across major hubs.",
    priceHistory: [13499000, 12999000, 12999000, 11999000, 11249000],
  },
  {
    id: "msi-gaming-5070",
    title: "MSI GeForce RTX 5070 Gaming X Slim 12G",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCYIYBpUqk4DgvZjemP2OCpJ8waj9UE4JhwdGqUv8potMbXHWGPiRZcAh__GnzSJL-x_Iq_ItOV06L_gdykypRr895zMhm0er71a4m0y4eDVOTlLFRi0UvT7FftlkwYM-KpiA0JhY-xgY85D8EgbEtFxVegHasjfXv-KXeKXQwhK9IqERaTY6Q3PiLx6W2xFpJ2sqnZo7lSNV7m9xWPlPI5vrRbql7Na_SmmjLMjXnzLYCH7jbXuS3sMw",
    currentPrice: 10499000,
    originalPrice: 10999000,
    marketplaceName: "Best Buy",
    sellerTrustScore: 92,
    shippingInfo: "Free store pickup",
    dealScore: 78,
    dealScoreLabel: "Fair Deal",
    aiVerdict: "WAIT" as const,
    aiVerdictReason: "Prices are expected to drop by another 4% in late December based on seasonal patterns. Set an alert.",
    priceHistory: [11999000, 11499000, 10999000, 10799000, 10499000],
  },
  {
    id: "gigabyte-windforce-5070",
    title: "Gigabyte GeForce RTX 5070 Windforce OC 12G",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCYIYBpUqk4DgvZjemP2OCpJ8waj9UE4JhwdGqUv8potMbXHWGPiRZcAh__GnzSJL-x_Iq_ItOV06L_gdykypRr895zMhm0er71a4m0y4eDVOTlLFRi0UvT7FftlkwYM-KpiA0JhY-xgY85D8EgbEtFxVegHasjfXv-KXeKXQwhK9IqERaTY6Q3PiLx6W2xFpJ2sqnZo7lSNV7m9xWPlPI5vrRbql7Na_SmmjLMjXnzLYCH7jbXuS3sMw",
    currentPrice: 9799000,
    originalPrice: 9799000,
    marketplaceName: "Newegg",
    sellerTrustScore: 88,
    shippingInfo: "Ships in 3 days",
    dealScore: 68,
    dealScoreLabel: "Standard Value",
    aiVerdict: "PRICE DROP ALERT" as const,
    aiVerdictReason: "Stable pricing over last 30 days. Recommend monitoring for third-party marketplace drops.",
    priceHistory: [9799000, 9799000, 9799000, 9799000, 9799000],
  },
];

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = React.useState("RTX 5070");
  const [activeFilters, setActiveFilters] = React.useState<FilterState>(INITIAL_FILTERS);
  const [favoritedIds, setFavoritedIds] = React.useState<string[]>(["asus-rog-5070-oc"]);
  const [alertIds, setAlertIds] = React.useState<string[]>([]);

  // Convert filter state to simple ActiveFilter list for header summary display
  const getHeaderFilters = (): ActiveFilter[] => {
    const list: ActiveFilter[] = [];

    // Add marketplaces
    activeFilters.marketplaces.forEach((market) => {
      list.push({ id: `market-${market}`, label: market });
    });

    // Add brands
    activeFilters.brands.forEach((brand) => {
      list.push({ id: `brand-${brand}`, label: `Brand: ${brand}` });
    });

    // Add deal score if customized
    if (activeFilters.dealScore > 50) {
      list.push({ id: "dealScore", label: `Deal Score: ${activeFilters.dealScore}+` });
    }

    // Add price range
    if (activeFilters.minPrice || activeFilters.maxPrice) {
      const minStr = activeFilters.minPrice ? `Rp ${activeFilters.minPrice}` : "0";
      const maxStr = activeFilters.maxPrice ? `Rp ${activeFilters.maxPrice}` : "Any";
      list.push({ id: "priceRange", label: `Price: ${minStr}-${maxStr}` });
    }

    return list;
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleApplyFilters = (filters: FilterState) => {
    setActiveFilters(filters);
  };

  const handleRemoveFilter = (filterId: string) => {
    if (filterId.startsWith("market-")) {
      const market = filterId.replace("market-", "");
      setActiveFilters((prev) => ({
        ...prev,
        marketplaces: prev.marketplaces.filter((m) => m !== market),
      }));
    } else if (filterId.startsWith("brand-")) {
      const brand = filterId.replace("brand-", "");
      setActiveFilters((prev) => ({
        ...prev,
        brands: prev.brands.filter((b) => b !== brand),
      }));
    } else if (filterId === "dealScore") {
      setActiveFilters((prev) => ({ ...prev, dealScore: 50 }));
    } else if (filterId === "priceRange") {
      setActiveFilters((prev) => ({ ...prev, minPrice: "", maxPrice: "" }));
    }
  };

  const handleSortChange = (sortBy: string) => {
    setActiveFilters((prev) => ({ ...prev, sortBy }));
  };

  const handleFavoriteToggle = (id: string) => {
    setFavoritedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAlertToggle = (id: string) => {
    setAlertIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filter products based on applied side-bar parameters (marketplaces & brands)
  const filteredProducts = MOCK_PRODUCTS.filter((product) => {
    // Marketplace check
    if (
      activeFilters.marketplaces.length > 0 &&
      !activeFilters.marketplaces.includes(product.marketplaceName)
    ) {
      return false;
    }
    // Brand/Manufacturer check
    if (activeFilters.brands.length > 0) {
      const matchedBrand = activeFilters.brands.some((b) =>
        product.title.toLowerCase().includes(b.toLowerCase())
      );
      if (!matchedBrand) return false;
    }
    return true;
  });

  return (
    <div className="flex flex-col gap-spacing-6 w-full max-w-container mx-auto">
      {/* Search Header */}
      <div className="flex flex-col gap-spacing-2">
        <h1 className="font-sans font-bold text-3xl tracking-tight text-ink-primary">
          Search
        </h1>
        <p className="text-ink-muted text-body-md">
          Find products and compare prices across all connected marketplaces.
        </p>
      </div>

      {/* Search Input and Button */}
      <div className="w-full">
        <SearchBar onSearch={handleSearch} defaultValue={searchQuery} />
      </div>

      {/* Grid Layout containing Filters Sidebar and Main content Column */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-spacing-6 items-start mt-spacing-4">
        {/* Left Column: Data Filters Sidebar */}
        <div className="md:col-span-1">
          <SearchFilters onApplyFilters={handleApplyFilters} />
        </div>

        {/* Right Column: Search Results Header & Results Card Grid list */}
        <div className="md:col-span-3 space-y-6">
          <SearchResultsHeader
            count={filteredProducts.length}
            query={searchQuery}
            activeFilters={getHeaderFilters()}
            onRemoveFilter={handleRemoveFilter}
            sortBy={activeFilters.sortBy}
            onSortChange={handleSortChange}
          />

          {/* Render SearchResultsGrid list */}
          <div className="pt-4">
            {filteredProducts.length > 0 ? (
              <SearchResultsGrid
                products={filteredProducts}
                favoritedIds={favoritedIds}
                alertIds={alertIds}
                onFavoriteToggle={handleFavoriteToggle}
                onAlertToggle={handleAlertToggle}
                onViewAnalysis={(id) => alert(`Opening analysis module for ${id}...`)}
              />
            ) : (
              <div className="p-8 text-center text-ink-muted border border-border border-dashed rounded-xl bg-card">
                No mock products match your selected marketplace or brand filters.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
