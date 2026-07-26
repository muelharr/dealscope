import { describe, it, expect } from "vitest";
import { formatPrice } from "./format";

describe("formatPrice utility", () => {
  it("formats positive numbers to Indonesian Rupiah currency format", () => {
    const formatted = formatPrice(49000);
    // Replace non-breaking spaces if any from Intl output
    const normalized = formatted.replace(/\s/g, " ");
    expect(normalized).toContain("Rp");
    expect(normalized).toContain("49.000");
  });

  it("handles zero correctly", () => {
    const formatted = formatPrice(0);
    const normalized = formatted.replace(/\s/g, " ");
    expect(normalized).toContain("Rp");
    expect(normalized).toContain("0");
  });

  it("handles large amounts correctly", () => {
    const formatted = formatPrice(15000000);
    const normalized = formatted.replace(/\s/g, " ");
    expect(normalized).toContain("15.000.000");
  });
});
