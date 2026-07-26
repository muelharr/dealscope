import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@/testing/test-utils";
import { ProductCard } from "./ProductCard";
import { createMockProduct } from "@/testing/mock-factories";

describe("ProductCard Component", () => {
  const mockProduct = createMockProduct();

  it("renders product name, price, and marketplace info", () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText('Apple MacBook Pro 14" M3')).toBeInTheDocument();
    expect(screen.getByText(/amazon/i)).toBeInTheDocument();
  });

  it("triggers onWishlist callback when wishlist button is clicked", () => {
    const handleWishlist = vi.fn();
    render(<ProductCard product={mockProduct} onWishlist={handleWishlist} />);

    const wishlistButton = screen.getByRole("button", { name: /add to wishlist/i });
    fireEvent.click(wishlistButton);

    expect(handleWishlist).toHaveBeenCalledWith("product-1");
  });

  it("triggers onCompare callback when compare button is clicked", () => {
    const handleCompare = vi.fn();
    render(<ProductCard product={mockProduct} onCompare={handleCompare} />);

    const compareButton = screen.getByRole("button", { name: /compare/i });
    fireEvent.click(compareButton);

    expect(handleCompare).toHaveBeenCalledWith("product-1");
  });
});
