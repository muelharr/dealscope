/**
 * Reusable React hooks for accessing authentication state.
 *
 * These hooks provide a simple and consistent way for components to
 * access the current user's session, permissions, and authentication status.
 *
 * NOTE: This is a placeholder implementation. A full implementation would
 * require a React Context Provider at the root of the application to
 * hold and distribute the authentication state.
 */

'use client';

import { useState, useEffect } from 'react';
import { getSession, createMockSession } from './session';
import { AuthContextType, AuthSession } from './types';
import { Role, Permission, Capability } from './permissions';

// ── Placeholder Hook Implementation ──────────────────────────────────
// This is a temporary implementation to allow components to be built.
// It simulates a session loading flow and provides a basic context.

function useAuthentication(): AuthContextType {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      setIsLoading(true);
      const loadedSession = await getSession();
      setSession(loadedSession);
      setIsLoading(false);
    };

    loadSession();
  }, []);

  const isAuthenticated = !!session && session.user.id !== 'guest-123';

  const hasPermission = (permission: Permission): boolean => {
    return session?.permissions.includes(permission) ?? false;
  };

  const hasCapability = (capability: Capability): boolean => {
    return session?.capabilities.includes(capability) ?? false;
  };

  // Placeholder login/logout for development
  const login = async (credentials: unknown) => {
    console.log('Logging in with (mock):', credentials);
    // Determine role from credentials for mock, or default
    const role =
      (credentials as { role?: Role })?.role === 'admin'
        ? Role.Admin
        : Role.User;
    setIsLoading(true);
    const mockSession = createMockSession(role);
    setSession(mockSession);
    setIsLoading(false);
  };

  const logout = async () => {
    setIsLoading(true);
    // await api.auth.logout();
    setSession(null);
    setIsLoading(false);
  };

  return {
    session,
    user: session?.user ?? null,
    isAuthenticated,
    isLoading,
    hasPermission,
    hasCapability,
    login,
    logout,
  };
}

// ── Public Hooks ─────────────────────────────────────────────────────

/**
 * Hook to access the full authentication session and status.
 *
 * @returns The complete `AuthContextType` object.
 */
export const useSession = useAuthentication;

/**
 * Hook to get the currently authenticated user object.
 *
 * @returns The `User` object or `null` if not authenticated.
 */
export function useCurrentUser() {
  const { user } = useSession();
  return user;
}

/**
 * Hook to quickly check if the user is authenticated.
 *
 * @returns `true` if the user is authenticated, `false` otherwise.
 */
export function useIsAuthenticated() {
  const { isAuthenticated } = useSession();
  return isAuthenticated;
}

/**
 * Hook to check for specific permissions and capabilities.
 *
 * @returns An object with `hasPermission` and `hasCapability` methods.
 */
export function usePermissions() {
  const { hasPermission, hasCapability } = useSession();
  return { hasPermission, hasCapability };
}
