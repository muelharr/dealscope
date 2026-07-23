/**
 * Next.js Middleware for route protection.
 *
 * This middleware inspects incoming requests and applies redirection logic
 * based on the user's authentication status and the route they are
 * trying to access.
 *
 * - Unauthenticated users are redirected from protected routes to the login page.
 * - Authenticated users are redirected from public auth pages (login, register)
 *   to the main application dashboard.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { getSession } from '@/auth/session';

// ── Configuration ────────────────────────────────────────────────────

const PUBLIC_ROUTES = ['/', '/pricing', '/product/:path*'];
const AUTH_ROUTES = ['/login', '/register'];
const PROTECTED_ROUTES_DEFAULT_REDIRECT = '/login';
const AUTH_ROUTES_DEFAULT_REDIRECT = '/dashboard';

// ── Middleware Logic ─────────────────────────────────────────────────

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Retrieve the session. In a real app, this might involve a fast,
  // edge-compatible session store or JWT verification.
  const session = await getSession();
  const isAuthenticated = !!session;

  // --- Route Matching ---

  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    new RegExp(`^${route.replace(/:path\*/, '.*')}$`).test(pathname),
  );

  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  // --- Redirection Logic ---

  // If the user is authenticated and tries to access an auth page (e.g., login),
  // redirect them to the dashboard.
  if (isAuthenticated && isAuthRoute) {
    const redirectUrl = new URL(AUTH_ROUTES_DEFAULT_REDIRECT, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // If the user is not authenticated and tries to access a protected route,
  // redirect them to the login page.
  if (!isAuthenticated && !isPublicRoute && !isAuthRoute) {
    const redirectUrl = new URL(PROTECTED_ROUTES_DEFAULT_REDIRECT, request.url);
    // Preserve the original destination for a post-login redirect.
    redirectUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Otherwise, allow the request to proceed.
  return NextResponse.next();
}

// ── Matcher Configuration ───────────────────────────────────────────
// This configures which paths the middleware will run on.
// We use a negative lookahead to exclude static assets and internal
// Next.js paths.

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
