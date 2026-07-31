import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@/testing/test-utils";
import { KeyMetricCard } from "../KeyMetricCard";

describe("KeyMetricCard Component", () => {
  it("renders key metric information correctly", () => {
    render(
      <KeyMetricCard
        label="Total Savings"
        value="$120.50"
        icon={<span data-testid="mock-icon">💸</span>}
      />
    );

    expect(screen.getByText("Total Savings")).toBeInTheDocument();
    expect(screen.getByText("$120.50")).toBeInTheDocument();
    expect(screen.getByTestId("mock-icon")).toBeInTheDocument();
  });

  it("applies correct variant styling for default variant", () => {
    const { container } = render(
      <KeyMetricCard
        label="Total Savings"
        value="$120.50"
        icon={<span>💸</span>}
        variant="default"
      />
    );

    const card = container.querySelector(".relative");
    expect(card).toHaveClass("bg-surface");
  });

  it("applies correct variant styling for gradient variant", () => {
    const { container } = render(
      <KeyMetricCard
        label="Total Savings"
        value="$120.50"
        icon={<span>💸</span>}
        variant="gradient"
      />
    );

    const card = container.querySelector(".relative");
    expect(card).toHaveClass("bg-gradient-to-br");
  });
});
