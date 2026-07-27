import { describe, it, expect } from "vitest";
import { formatPrice, formatCurrency, formatDate, formatNumber, formatRelativeTime } from "./format";

describe("format utilities", () => {
  it("formats positive numbers to Indonesian Rupiah currency format", () => {
    const formatted = formatPrice(49000);
    const normalized = formatted.replace(/\s/g, " ");
    expect(normalized).toContain("Rp");
    expect(normalized).toContain("49.000");
  });

  it("formats currency in USD with en locale", () => {
    const formatted = formatCurrency(1500, "USD", "en");
    expect(formatted).toContain("$");
    expect(formatted).toContain("1,500");
  });

  it("formats dates into localized string", () => {
    const d = new Date(2026, 6, 26);
    expect(formatDate(d, "id")).toContain("26 Juli 2026");
    expect(formatDate(d, "en")).toContain("July 26, 2026");
  });

  it("formats numbers with localized separators", () => {
    expect(formatNumber(1234567, "id")).toBe("1.234.567");
    expect(formatNumber(1234567, "en")).toBe("1,234,567");
  });

  it("formats relative time correctly", () => {
    const past = new Date(Date.now() - 2 * 60 * 60 * 1000);
    const relId = formatRelativeTime(past, "id");
    const relEn = formatRelativeTime(past, "en");
    expect(relId).toContain("jam");
    expect(relEn).toContain("hours ago");
  });
});
