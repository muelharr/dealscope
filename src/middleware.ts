/**
 * Next.js Middleware for route protection.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { getSession } from '@/auth/session';

const PUBLIC_ROUTES = ['/', '/pricing', '/search', '/compare', '/product/:path*'];
const AUTH_ROUTES = ['/login', '/register'];
const PROTECTED_ROUTES_DEFAULT_REDIRECT = '/login';
const AUTH_ROUTES_DEFAULT_REDIRECT = '/dashboard';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  let session = await getSession();

  const sessionCookie =
    request.cookies.get('dealscope_session')?.value ||
    request.cookies.get('mock_session')?.value;

  if (!session && sessionCookie) {
    try {
      session = JSON.parse(decodeURIComponent(sessionCookie));
    } catch {
      // Ignore invalid JSON format
    }
  }

  const isAuthenticated = !!session;

  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    new RegExp(`^${route.replace(/:path\*/, '.*')}$`).test(pathname),
  );

  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  // If authenticated user accesses auth routes (login/register), redirect to dashboard
  if (isAuthenticated && isAuthRoute) {
    const redirectUrl = new URL(AUTH_ROUTES_DEFAULT_REDIRECT, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // If unauthenticated user accesses protected routes, redirect to login
  if (!isAuthenticated && !isPublicRoute && !isAuthRoute) {
    const redirectUrl = new URL(PROTECTED_ROUTES_DEFAULT_REDIRECT, request.url);
    redirectUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
