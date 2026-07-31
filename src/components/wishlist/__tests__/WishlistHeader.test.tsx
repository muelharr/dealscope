import React from "react";
import { describe, it, vi, expect } from "vitest";
import { render, screen, fireEvent } from "@/testing/test-utils";
import { WishlistHeader } from "../WishlistHeader";

describe("WishlistHeader Component", () => {
  it("renders wishlist information correctly", () => {
    render(<WishlistHeader totalItems={5} averageSavingsPercent={25} />);

    expect(screen.getByRole("heading", { name: "Your Wishlist" })).toBeInTheDocument();
    expect(screen.getByText(/tracking 5 items/i)).toBeInTheDocument();
    expect(screen.getByText(/average potential saving of 25%/i)).toBeInTheDocument();
  });

  it("handles filter button click", () => {
    const handleFilterClick = vi.fn();
    render(
      <WishlistHeader
        totalItems={5}
        averageSavingsPercent={25}
        onFilterClick={handleFilterClick}
      />
    );

    const filterButton = screen.getByRole("button", { name: /filter/i });
    fireEvent.click(filterButton);

    expect(handleFilterClick).toHaveBeenCalled();
  });

  it("handles sort button click", () => {
    const handleSortChange = vi.fn();
    render(
      <WishlistHeader
        totalItems={5}
        averageSavingsPercent={25}
        activeSortOption="Potential Savings"
        onSortChange={handleSortChange}
      />
    );

    const sortButton = screen.getByRole("button", { name: /sort by: potential savings/i });
    fireEvent.click(sortButton);

    expect(handleSortChange).toHaveBeenCalledWith("Potential Savings");
  });
});
