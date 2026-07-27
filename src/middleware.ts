/**
 * Next.js Middleware for route protection and locale detection.
 */

import { NextResponse, type NextRequest } from "next/server";
import { getSession } from "@/auth/session";

const PUBLIC_ROUTES = ["/", "/pricing", "/search", "/compare", "/product/:path*"];
const AUTH_ROUTES = ["/login", "/register"];
const PROTECTED_ROUTES_DEFAULT_REDIRECT = "/login";
const AUTH_ROUTES_DEFAULT_REDIRECT = "/dashboard";
const SUPPORTED_LOCALES = ["id", "en"];
const DEFAULT_LOCALE = "id";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Locale Detection & Cookie Assignment
  let locale = request.cookies.get("NEXT_LOCALE")?.value;
  if (!locale || !SUPPORTED_LOCALES.includes(locale)) {
    const acceptLang = request.headers.get("accept-language") || "";
    locale = acceptLang.toLowerCase().includes("en") ? "en" : DEFAULT_LOCALE;
  }

  let session = await getSession();

  const sessionCookie =
    request.cookies.get("dealscope_session")?.value ||
    request.cookies.get("mock_session")?.value;

  if (!session && sessionCookie) {
    try {
      session = JSON.parse(decodeURIComponent(sessionCookie));
    } catch {
      // Ignore invalid JSON format
    }
  }

  const isAuthenticated = !!session;

  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    new RegExp(`^${route.replace(/:path\*/, ".*")}$`).test(pathname)
  );

  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  // Helper response builder to ensure NEXT_LOCALE cookie is attached
  const buildResponse = (res: NextResponse) => {
    if (request.cookies.get("NEXT_LOCALE")?.value !== locale) {
      res.cookies.set("NEXT_LOCALE", locale, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365, // 1 year
        sameSite: "lax",
      });
    }
    return res;
  };

  // If authenticated user accesses auth routes (login/register), redirect to dashboard
  if (isAuthenticated && isAuthRoute) {
    const redirectUrl = new URL(AUTH_ROUTES_DEFAULT_REDIRECT, request.url);
    return buildResponse(NextResponse.redirect(redirectUrl));
  }

  // If unauthenticated user accesses protected routes, redirect to login
  if (!isAuthenticated && !isPublicRoute && !isAuthRoute) {
    const redirectUrl = new URL(PROTECTED_ROUTES_DEFAULT_REDIRECT, request.url);
    redirectUrl.searchParams.set("callbackUrl", pathname);
    return buildResponse(NextResponse.redirect(redirectUrl));
  }

  const response = NextResponse.next();
  return buildResponse(response);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
