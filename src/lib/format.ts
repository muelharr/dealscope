/**
 * Locale-aware formatting utilities for DealScope.
 */

/**
 * Formats a number to specified currency format (IDR/USD/EUR etc.)
 */
export function formatCurrency(
  amount: number,
  currency: string = "IDR",
  locale: string = "id"
): string {
  const intlLocale = locale === "id" ? "id-ID" : "en-US";
  const options: Intl.NumberFormatOptions = {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "IDR" ? 0 : 2,
  };

  return new Intl.NumberFormat(intlLocale, options).format(amount);
}

/**
 * Legacy formatPrice helper for Indonesian Rupiah
 */
export function formatPrice(price: number): string {
  return formatCurrency(price, "IDR", "id");
}

/**
 * Formats date into localized string representation
 */
export function formatDate(
  date: Date | string | number,
  locale: string = "id"
): string {
  const d = new Date(date);
  const intlLocale = locale === "id" ? "id-ID" : "en-US";

  return new Intl.DateTimeFormat(intlLocale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

/**
 * Formats a number with localized thousands separators
 */
export function formatNumber(
  num: number,
  locale: string = "id"
): string {
  const intlLocale = locale === "id" ? "id-ID" : "en-US";
  return new Intl.NumberFormat(intlLocale).format(num);
}

/**
 * Formats a date relative to current time ('2 jam lalu' vs '2 hours ago')
 */
export function formatRelativeTime(
  date: Date | string | number,
  locale: string = "id"
): string {
  const d = new Date(date);
  const now = new Date();
  const diffInSeconds = Math.round((d.getTime() - now.getTime()) / 1000);
  const absDiff = Math.abs(diffInSeconds);

  const intlLocale = locale === "id" ? "id-ID" : "en-US";
  const rtf = new Intl.RelativeTimeFormat(intlLocale, { numeric: "auto" });

  if (absDiff < 60) {
    return rtf.format(diffInSeconds, "second");
  }
  if (absDiff < 3600) {
    return rtf.format(Math.round(diffInSeconds / 60), "minute");
  }
  if (absDiff < 86400) {
    return rtf.format(Math.round(diffInSeconds / 3600), "hour");
  }
  return rtf.format(Math.round(diffInSeconds / 86400), "day");
}
