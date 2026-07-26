import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useSearchProducts } from "./useSearchProducts";
import { searchService } from "@/services/search.service";
import { AllTheProviders } from "@/testing/test-utils";
import { createMockProduct } from "@/testing/mock-factories";

vi.mock("@/services/search.service", () => ({
  searchService: {
    searchProducts: vi.fn(),
  },
}));

describe("useSearchProducts Hook", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("fetches products and returns query results", async () => {
    const mockProducts = [createMockProduct()];
    const mockResponse = {
      products: mockProducts,
      pagination: { currentPage: 1, totalPages: 1, totalItems: 1, itemsPerPage: 10 },
    };

    vi.mocked(searchService.searchProducts).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useSearchProducts({ search_query: "MacBook" }), {
      wrapper: AllTheProviders,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(searchService.searchProducts).toHaveBeenCalledWith({ search_query: "MacBook" });
    expect(result.current.products).toEqual(mockProducts);
    expect(result.current.pagination?.totalItems).toBe(1);
  });

  it("handles error states gracefully", async () => {
    const mockError = new Error("Network Error");
    vi.mocked(searchService.searchProducts).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useSearchProducts({ search_query: "Invalid" }), {
      wrapper: AllTheProviders,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.isError).toBe(true);
    expect(result.current.products).toEqual([]);
  });

  it("respects the enabled parameter", () => {
    const { result } = renderHook(() => useSearchProducts({ search_query: "" }, false), {
      wrapper: AllTheProviders,
    });

    expect(searchService.searchProducts).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
  });
});
