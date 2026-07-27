import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export const locales = ["id", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "id";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("NEXT_LOCALE")?.value;

  const locale: Locale = localeCookie === "en" ? "en" : "id";

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
