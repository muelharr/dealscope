"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useWishlist } from "@/hooks/queries/useWishlist";
import { WishlistHeader } from "@/components/wishlist/WishlistHeader";
import { WishlistGrid } from "@/components/wishlist/WishlistGrid";
import {
  ProductCard,
  ProductCardMedia,
  ProductCardContent,
  ProductCardHeader,
  ProductCardPrice,
  ProductCardMetrics,
  ProductCardActions,
} from "@/components/shared/ProductCard";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { WishlistSkeleton } from "@/components/wishlist/WishlistSkeleton";
import { WidgetError } from "@/components/shared/WidgetError";
import { WishlistEmptyState } from "@/components/wishlist/WishlistEmptyState";
import { WishlistAddCard } from "@/components/wishlist/WishlistAddCard";

export default function WishlistPage() {
  const router = useRouter();
  const [sortOption, setSortOption] = React.useState("Potential Savings");

  // Fetch live wishlist data from React Query cache / API
  const { data: items, isLoading, isError, refetch } = useWishlist();

  const handleSearchClick = () => {
    router.push("/search");
  };

  const handleFilterClick = () => {
    alert("Opening filter drawers...");
  };

  // Perform client-side sorting of live wishlist items
  const sortedItems = React.useMemo(() => {
    if (!items) return [];

    const itemsCopy = [...items];

    if (sortOption === "Potential Savings") {
      // Sort by absolute discount savings descending
      return itemsCopy.sort((a, b) => {
        const offersA = a.product.offers || [];
        const bestOfferA = [...offersA].sort((x, y) => x.price - y.price)[0];
        const priceA = bestOfferA?.price ?? 0;
        const originalPriceA = bestOfferA?.originalPrice ?? priceA;
        const savingsA = originalPriceA - priceA;

        const offersB = b.product.offers || [];
        const bestOfferB = [...offersB].sort((x, y) => x.price - y.price)[0];
        const priceB = bestOfferB?.price ?? 0;
        const originalPriceB = bestOfferB?.originalPrice ?? priceB;
        const savingsB = originalPriceB - priceB;

        return savingsB - savingsA;
      });
    }

    if (sortOption === "Price: Low to High") {
      return itemsCopy.sort((a, b) => {
        const offersA = a.product.offers || [];
        const priceA = [...offersA].sort((x, y) => x.price - y.price)[0]?.price ?? 0;
        const offersB = b.product.offers || [];
        const priceB = [...offersB].sort((x, y) => x.price - y.price)[0]?.price ?? 0;
        return priceA - priceB;
      });
    }

    if (sortOption === "Price: High to Low") {
      return itemsCopy.sort((a, b) => {
        const offersA = a.product.offers || [];
        const priceA = [...offersA].sort((x, y) => x.price - y.price)[0]?.price ?? 0;
        const offersB = b.product.offers || [];
        const priceB = [...offersB].sort((x, y) => x.price - y.price)[0]?.price ?? 0;
        return priceB - priceA;
      });
    }

    return itemsCopy;
  }, [items, sortOption]);

  // Calculate real average savings percentage based on best price and original price
  const averageSavingsPercent = React.useMemo(() => {
    if (!items || items.length === 0) return 0;
    let totalOriginal = 0;
    let totalCurrent = 0;
    let count = 0;

    items.forEach((item) => {
      const offers = item.product.offers || [];
      const bestOffer = [...offers].sort((x, y) => x.price - y.price)[0];
      if (bestOffer) {
        const price = bestOffer.price;
        const original = bestOffer.originalPrice || price;
        totalOriginal += original;
        totalCurrent += price;
        count++;
      }
    });

    if (count > 0 && totalOriginal > 0) {
      const percent = ((totalOriginal - totalCurrent) / totalOriginal) * 100;
      return Math.round(percent);
    }
    return 0;
  }, [items]);

  if (isLoading) {
    return <WishlistSkeleton />;
  }

  if (isError || !items) {
    return (
      <WidgetError
        title="Error Loading Wishlist"
        message="We encountered a problem loading your tracked items. Please try again."
        onRetry={refetch}
        showHomeButton={true}
      />
    );
  }

  return (
    <div className="flex flex-col gap-spacing-6 w-full max-w-container mx-auto pb-16">
      {/* 1. Page Header */}
      <WishlistHeader
        totalItems={items.length}
        averageSavingsPercent={averageSavingsPercent}
        activeSortOption={sortOption}
        onFilterClick={handleFilterClick}
        onSortChange={setSortOption}
      />

      {/* 2. Grid rendering active wishlist cards */}
      {items.length === 0 ? (
        <WishlistEmptyState onSearchClick={handleSearchClick} />
      ) : (
        <WishlistGrid>
          {sortedItems.map((item) => (
            <ProductCard
              key={item.id}
              className="hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col"
            >
              <ProductCardMedia
                product={item.product}
                aiVerdict="BUY NOW"
              />
              <ProductCardContent>
                <ProductCardHeader product={item.product} />
                <ProductCardPrice product={item.product} showHistoricLow />
                <ProductCardMetrics product={item.product} trendDiff="-14.5%" />
              </ProductCardContent>
              <ProductCardActions>
                <Button
                  variant="default"
                  className="font-sans text-[11px] font-bold uppercase tracking-wider rounded-lg h-9"
                  onClick={() => router.push(`/product/${item.product.id}`)}
                >
                  View Analysis
                </Button>
                <Button
                  variant="outline"
                  className="font-sans text-[11px] font-bold uppercase tracking-wider rounded-lg h-9 border-border"
                  onClick={() => router.push(`/compare?ids=${item.product.id}`)}
                >
                  Compare
                </Button>
                <Button
                  variant="secondary"
                  className="col-span-2 flex items-center justify-center gap-2 font-sans text-[11px] font-bold uppercase tracking-wider rounded-lg h-9"
                >
                  <Bell className="size-3.5" />
                  Set Price Alert
                </Button>
              </ProductCardActions>
            </ProductCard>
          ))}

          {/* Dotted "Track more products" placeholder card at the end of the grid */}
          <WishlistAddCard onSearchClick={handleSearchClick} />
        </WishlistGrid>
      )}
    </div>
  );
}
