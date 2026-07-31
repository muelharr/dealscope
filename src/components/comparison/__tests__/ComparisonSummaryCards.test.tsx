import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@/testing/test-utils";
import { ComparisonSummaryCards } from "../ComparisonSummaryCards";
import { ComparisonSummaryData } from "@/types/domain";

describe("ComparisonSummaryCards Component", () => {
  it("renders comparison metrics correctly", () => {
    const data: ComparisonSummaryData = {
      productsCount: 3,
      bestOverallName: "iPhone 15 Pro",
      avgDealScore: 88,
      lastUpdated: "2026-07-31",
    };

    render(<ComparisonSummaryCards data={data} />);

    expect(screen.getByText("Comparing")).toBeInTheDocument();
    expect(screen.getByText("3 Products")).toBeInTheDocument();
    expect(screen.getByText("Best Overall")).toBeInTheDocument();
    expect(screen.getByText("iPhone 15 Pro")).toBeInTheDocument();
    expect(screen.getByText("Avg. Deal Score")).toBeInTheDocument();
    expect(screen.getByText("88")).toBeInTheDocument();
    expect(screen.getByText("Last Updated")).toBeInTheDocument();
  });

  it("omits average deal score card if avgDealScore is undefined", () => {
    const data: ComparisonSummaryData = {
      productsCount: 2,
      bestOverallName: "ASUS ROG",
      lastUpdated: "2026-07-31",
    };

    render(<ComparisonSummaryCards data={data} />);

    expect(screen.queryByText("Avg. Deal Score")).not.toBeInTheDocument();
  });
});
