/**
 * Formats a number to Indonesian Rupiah currency format.
 * @param price The price as a number
 * @returns Formatted currency string (e.g. "Rp 49.000")
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
}
