"use client";

import * as React from "react";
import { useParams, notFound } from "next/navigation";
import { useProductDetail } from "@/hooks/queries/useProductDetail";
import { useWishlist } from "@/hooks/queries/useWishlist";
import { useToggleWishlist } from "@/hooks/mutations/useToggleWishlist";
import { ProductDetailSkeleton } from "@/components/product/ProductDetailSkeleton";
import { ProductDetailError } from "@/components/product/ProductDetailError";

import { ProductHeaderSection } from "@/components/product/ProductHeaderSection";
import { PriceOverviewSection } from "@/components/product/PriceOverviewSection";
import { MarketplaceOffersSection } from "@/components/product/MarketplaceOffersSection";
import { AISummarySection } from "@/components/product/AISummarySection";
import { PriceHistorySection } from "@/components/product/PriceHistorySection";
import { SpecificationsSection } from "@/components/product/SpecificationsSection";
import { SimilarProductsSection } from "@/components/product/SimilarProductsSection";
import { VerifiedSellersSection } from "@/components/product/VerifiedSellersSection";

export default function ProductDetailPage() {
  const { id } = useParams();
  const productId = Array.isArray(id) ? id[0] : id;

  const {
    primaryProduct,
    offers,
    priceHistory,
    similarProducts,
    specifications,
    verifiedSellers,
    aiSummary,
    isInitialLoading,
  } = useProductDetail(productId ?? "");

  const { data: wishlistItems } = useWishlist();
  const toggleWishlist = useToggleWishlist();

  const isWishlisted = React.useMemo(() => {
    if (!wishlistItems || !productId) return false;
    return wishlistItems.some((item) => item.product.id === productId);
  }, [wishlistItems, productId]);

  if (isInitialLoading) {
    return <ProductDetailSkeleton />;
  }

  // Handle page-level catastrophic failure of the primary product query
  if (primaryProduct.isError) {
    const error = primaryProduct.error;
    if (error && error.status === 404) {
      notFound();
    }
    return (
      <ProductDetailError
        error={error as Error}
        onRetry={() => primaryProduct.refetch()}
      />
    );
  }

  const productData = primaryProduct.data;
  if (!productData) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-spacing-6 w-full max-w-container mx-auto">
      {/* 1. Breadcrumbs path triggers, image thumbnail, title, and buttons */}
      <ProductHeaderSection
        product={productData}
        isWishlisted={isWishlisted}
        onWishlistToggle={() => toggleWishlist.mutate({ product: productData })}
      />

      {/* 2. Grid split layout */}
      <div className="grid grid-cols-12 gap-spacing-6 items-start mt-spacing-4">
        {/* Left Column: Price Overview, Live Marketplace Offers & specs */}
        <div className="col-span-12 lg:col-span-7 flex flex-col gap-spacing-6">
          <PriceOverviewSection
            product={productData}
            aiSummaryResult={aiSummary}
            priceHistoryResult={priceHistory}
          />
          <MarketplaceOffersSection offersResult={offers} />
          <SpecificationsSection specificationsResult={specifications} />
        </div>

        {/* Right Column: AI Decision, Price history graph, and AI details checklist */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-spacing-6">
          <AISummarySection aiSummaryResult={aiSummary} />
          <PriceHistorySection priceHistoryResult={priceHistory} />
        </div>
      </div>

      {/* 3. Bottom Bento list of Alternatives */}
      <SimilarProductsSection similarProductsResult={similarProducts} />

      {/* 4. Bottom Verified Sellers row */}
      <VerifiedSellersSection verifiedSellersResult={verifiedSellers} />
    </div>
  );
}
