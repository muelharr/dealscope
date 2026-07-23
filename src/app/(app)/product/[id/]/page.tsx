"use client";

import * as React from "react";
import { ProductHeaderSection } from "@/components/product/ProductHeaderSection";
import { PriceOverviewSection } from "@/components/product/PriceOverviewSection";
import { MarketplaceOffersSection } from "@/components/product/MarketplaceOffersSection";
import { AISummarySection } from "@/components/product/AISummarySection";
import { PriceHistorySection } from "@/components/product/PriceHistorySection";
import { SpecificationsSection } from "@/components/product/SpecificationsSection";
import { SimilarProductsSection } from "@/components/product/SimilarProductsSection";
import { VerifiedSellersSection } from "@/components/product/VerifiedSellersSection";

export default function ProductDetailPage() {
  return (
    <div className="flex flex-col gap-spacing-6 w-full max-w-container mx-auto">
      {/* 1. Breadcrumbs path triggers, image thumbnail, title, and buttons */}
      <ProductHeaderSection />

      {/* 2. Grid split layout */}
      <div className="grid grid-cols-12 gap-spacing-6 items-start mt-spacing-4">
        {/* Left Column: Price Overview, Live Marketplace Offers & specs */}
        <div className="col-span-12 lg:col-span-7 flex flex-col gap-spacing-6">
          <PriceOverviewSection />
          <MarketplaceOffersSection />
          <SpecificationsSection />
        </div>

        {/* Right Column: AI Decision, Price history graph, and AI details checklist */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-spacing-6">
          <AISummarySection />
          <PriceHistorySection />
        </div>
      </div>

      {/* 3. Bottom Bento list of Alternatives */}
      <SimilarProductsSection />

      {/* 4. Bottom Verified Sellers row */}
      <VerifiedSellersSection />
    </div>
  );
}
