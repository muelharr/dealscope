import { Product, MarketplaceOffer, WishlistItem, DashboardMetric } from "@/types/domain";

export function createMockOffer(overrides?: Partial<MarketplaceOffer>): MarketplaceOffer {
  return {
    id: "offer-1",
    price: 1499,
    currency: "USD",
    url: "https://amazon.com/product/1",
    seller: "Amazon Official",
    condition: "new",
    inStock: true,
    shippingInfo: "Free Shipping",
    updatedAt: new Date().toISOString(),
    marketplace: {
      id: "market-1",
      name: "Amazon",
      url: "https://amazon.com",
      logoUrl: "https://amazon.com/logo.png",
    },
    ...overrides,
  };
}

export function createMockProduct(overrides?: Partial<Product>): Product {
  return {
    id: "product-1",
    name: "Apple MacBook Pro 14\" M3",
    description: "Apple M3 chip, 16GB RAM, 512GB SSD Storage",
    category: { id: "cat-1", name: "Laptops", subCategories: [] },
    brand: { id: "brand-1", name: "Apple", logoUrl: "https://apple.com/logo.png" },
    sku: "MBP-14-M3",
    images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8"],
    specifications: { ram: "16GB", storage: "512GB" },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    offers: [createMockOffer()],
    priceHistory: {
      productId: "product-1",
      history: [
        { date: "2026-01-01", price: 1799, currency: "USD", marketplaceId: "market-1" },
        { date: "2026-02-01", price: 1649, currency: "USD", marketplaceId: "market-1" },
        { date: "2026-03-01", price: 1499, currency: "USD", marketplaceId: "market-1" },
      ],
    },
    ...overrides,
  };
}

export function createMockWishlistItem(overrides?: Partial<WishlistItem>): WishlistItem {
  return {
    id: "wishlist-1",
    addedAt: new Date().toISOString(),
    targetPrice: 1400,
    product: createMockProduct(),
    ...overrides,
  };
}

export function createMockMetrics(): DashboardMetric[] {
  return [
    { id: "1", label: "Tracked Products", value: 24, change: 12 },
    { id: "2", label: "Price Drops Today", value: 8, change: -5 },
    { id: "3", label: "Total Saved", value: "$420.00", change: 18 },
  ];
}
