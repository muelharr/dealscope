"use client";

import * as React from "react";
import { ComparisonHeader, ComparisonHeaderData } from "@/components/comparison/ComparisonHeader";
import { ComparisonContent } from "@/components/comparison/ComparisonContent";
import { ComparisonSection } from "@/components/comparison/ComparisonSection";
import { ComparisonSummaryCards, ComparisonSummaryData } from "@/components/comparison/ComparisonSummaryCards";
import { SelectedProductsSection, ComparedProduct } from "@/components/comparison/SelectedProductsSection";
import { ComparisonMatrix, ComparisonProductHeader, ComparisonCategory } from "@/components/comparison/ComparisonMatrix";
import { MarketplaceComparisonSection, MarketplaceComparison } from "@/components/comparison/MarketplaceComparisonSection";
import { PriceHistoryComparisonSection, ProductPriceSeries } from "@/components/comparison/PriceHistoryComparisonSection";
import { AIComparisonInsights, AIRecommendation } from "@/components/comparison/AIComparisonInsights";
import { BottomActionsSection } from "@/components/comparison/BottomActionsSection";

const MOCK_HEADER_DATA: ComparisonHeaderData = {
  title: "RTX 5070 Market Comparison",
  breadcrumbs: [
    { label: "Home", href: "#" },
    { label: "Comparison" },
  ],
};

const MOCK_SUMMARY_DATA: ComparisonSummaryData = {
  productsCount: 3,
  bestOverallName: "ASUS ROG Strix",
  avgDealScore: 82,
  lastUpdated: "14:02",
};

const MOCK_COMPARED_PRODUCTS: ComparedProduct[] = [
  {
    id: "asus-rog-strix",
    brand: "ASUS",
    name: "ASUS ROG Strix RTX 5070",
    price: 11249000,
    dealScore: 94,
    marketplace: "Amazon",
    status: "available",
    badgeLabel: "DEALSCOPE TOP PICK",
  },
  {
    id: "msi-ventus",
    brand: "MSI",
    name: "MSI Ventus 3X RTX 5070",
    price: 10949000,
    dealScore: 68,
    marketplace: "Best Buy",
    status: "limited",
    badgeLabel: "VALUE CHOICE",
  },
  {
    id: "gigabyte-eagle",
    brand: "Gigabyte",
    name: "Gigabyte Eagle RTX 5070",
    price: 11999000,
    dealScore: 85,
    marketplace: "Newegg",
    status: "available",
    badgeLabel: "STABLE ENTRY",
  },
];

// Product headers representing target Picks
const MATRIX_PRODUCT_HEADERS: ComparisonProductHeader[] = [
  { id: "asus-rog-strix", name: "ASUS ROG Strix", badgeLabel: "DEALSCOPE TOP PICK", isTopPick: true },
  { id: "msi-ventus", name: "MSI Ventus 3X", badgeLabel: "VALUE CHOICE" },
  { id: "gigabyte-eagle", name: "Gigabyte Eagle", badgeLabel: "STABLE ENTRY" },
];

// Comparison row categories mapping specifications and AI scoring
const MATRIX_CATEGORIES: ComparisonCategory[] = [
  {
    id: "overview",
    title: "Market Refinements Overview",
    rows: [
      {
        id: "current-price",
        label: "Current Price",
        values: [
          { productId: "asus-rog-strix", value: "11249000", highlight: "best" },
          { productId: "msi-ventus", value: "10949000" },
          { productId: "gigabyte-eagle", value: "11999000" },
        ],
      },
      {
        id: "deal-score",
        label: "Deal Score",
        values: [
          { productId: "asus-rog-strix", value: "Exceptional 94", highlight: "best" },
          { productId: "msi-ventus", value: "Fair 68" },
          { productId: "gigabyte-eagle", value: "Great 85" },
        ],
      },
      {
        id: "ai-verdict",
        label: "AI Verdict",
        values: [
          { productId: "asus-rog-strix", value: "BUY NOW", highlight: "best" },
          { productId: "msi-ventus", value: "WAIT" },
          { productId: "gigabyte-eagle", value: "FAIR PRICE" },
        ],
      },
    ],
  },
];

const MOCK_MARKETPLACE_COMPARISONS: MarketplaceComparison[] = [
  {
    id: "amazon-comp",
    marketplace: "Amazon",
    seller: "Amazon.com",
    iconName: "cart",
    offers: [
      {
        productId: "asus-rog-strix",
        variantName: "ASUS ROG Strix RTX 5070",
        price: 11249000,
        availability: "In Stock (12 units)",
        availabilityType: "positive",
        actionLabel: "View Deal",
      },
      {
        productId: "msi-ventus",
        variantName: "MSI Ventus 3X RTX 5070",
        price: 10499000,
        availability: "Backorder (Ships Jun 1)",
        availabilityType: "warning",
        actionLabel: "Pre-order",
      },
    ],
  },
  {
    id: "bestbuy-comp",
    marketplace: "Best Buy",
    seller: "Best Buy Official",
    iconName: "store",
    offers: [
      {
        productId: "msi-ventus",
        variantName: "MSI Ventus 3X RTX 5070",
        price: 10949000,
        availability: "In Stock",
        availabilityType: "positive",
        actionLabel: "View Deal",
      },
    ],
  },
  {
    id: "newegg-comp",
    marketplace: "Newegg",
    seller: "Newegg Global",
    iconName: "shipping",
    offers: [
      {
        productId: "gigabyte-eagle",
        variantName: "Gigabyte Eagle RTX 5070",
        price: 11999000,
        availability: "In Stock",
        availabilityType: "positive",
        actionLabel: "View Deal",
      },
    ],
  },
];

// Price history points mapping dates to amounts
const MOCK_PRICE_SERIES: ProductPriceSeries[] = [
  {
    productId: "asus-rog-strix",
    name: "ASUS",
    color: "bg-primary",
    points: [
      { date: "90 Days Ago", price: 12499000 },
      { date: "60 Days Ago", price: 12999000 },
      { date: "30 Days Ago", price: 11999000 },
      { date: "Today", price: 11249000 },
    ],
  },
  {
    productId: "msi-ventus",
    name: "MSI",
    color: "bg-outline",
    isDashed: true,
    points: [
      { date: "90 Days Ago", price: 10949000 },
      { date: "60 Days Ago", price: 10899000 },
      { date: "30 Days Ago", price: 11099000 },
      { date: "Today", price: 10949000 },
    ],
  },
  {
    productId: "gigabyte-eagle",
    name: "Gigabyte",
    color: "bg-data-warning",
    points: [
      { date: "90 Days Ago", price: 11999000 },
      { date: "60 Days Ago", price: 11999000 },
      { date: "30 Days Ago", price: 11999000 },
      { date: "Today", price: 11999000 },
    ],
  },
];

const MOCK_AI_RECOMMENDATION: AIRecommendation = {
  winner: "ASUS ROG Strix",
  confidence: 98,
  summary: "The ASUS ROG Strix currently offers a superior value/performance ratio despite its higher price point, with a historical low within reach.",
  insights: [
    {
      id: "premium-perf",
      title: "Premium Performance",
      description: "Higher cooling limits allow 12% lower thermal profiles under load compared to MSI Ventus.",
    },
    {
      id: "budget-alt",
      title: "Budget Alternative",
      description: "MSI Ventus 3X represents the lowest entry price, but with reduced overclocking margin.",
    },
    {
      id: "stability-rep",
      title: "Stability Report",
      description: "Gigabyte Eagle has maintained a +/- 2% price variance over the last 6 months, making it the least volatile choice.",
    },
  ],
};

export default function ComparisonPage() {
  const [products, setProducts] = React.useState<ComparedProduct[]>(MOCK_COMPARED_PRODUCTS);

  const handleRemoveProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleActionClick = (productId: string, actionType: "analysis" | "marketplace") => {
    alert(`Triggering ${actionType} details for ${productId}...`);
  };

  const handleExportPdf = () => {
    alert("Compiling report details... PDF download will begin shortly.");
  };

  const handleBottomActionTrigger = (actionId: string) => {
    alert(`Bottom action clicked: ${actionId}`);
  };

  return (
    <div className="flex flex-col gap-spacing-6 w-full max-w-container mx-auto">
      {/* 1. Page Header matching Stitch parameters */}
      <ComparisonHeader data={MOCK_HEADER_DATA} />

      {/* 2. Page Content Shell Composition */}
      <ComparisonContent
        summaryCards={
          <ComparisonSummaryCards
            data={{
              ...MOCK_SUMMARY_DATA,
              productsCount: products.length,
            }}
          />
        }
        matrixContent={
          <div className="space-y-6">
            <SelectedProductsSection products={products} onRemoveProduct={handleRemoveProduct} />
            <ComparisonMatrix
              products={MATRIX_PRODUCT_HEADERS}
              categories={MATRIX_CATEGORIES}
              onActionClick={handleActionClick}
            />
          </div>
        }
        chartContent={
          <PriceHistoryComparisonSection series={MOCK_PRICE_SERIES} />
        }
        insightsContent={
          <AIComparisonInsights data={MOCK_AI_RECOMMENDATION} onExportPdf={handleExportPdf} />
        }
        specsContent={
          <div className="space-y-6">
            <ComparisonSection title="Technical Specifications">
              <div className="py-16 text-center text-ink-muted border border-border border-dashed rounded-lg bg-muted/10 font-sans text-xs">
                Technical Specifications 4-Column Grid Placeholder
              </div>
            </ComparisonSection>
            {/* Render BottomActionsSection directly inside the main composition flow */}
            <BottomActionsSection onActionTrigger={handleBottomActionTrigger} />
          </div>
        }
        inventoryContent={
          <MarketplaceComparisonSection comparisons={MOCK_MARKETPLACE_COMPARISONS} />
        }
      />
    </div>
  );
}
