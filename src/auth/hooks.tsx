/**
 * React context, provider, and hooks for accessing authentication state.
 *
 * Authentication state is owned by a single `AuthProvider` mounted near the
 * root of the tree and shared via React Context. This means every component
 * that calls `useSession()` (or its derived hooks) reads from the same source
 * of truth — a login/logout in one component is immediately reflected in all
 * others, instead of each component holding an isolated copy of the state.
 */

'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react';
import { getSession } from './session';
import { authApi } from './client';
import { AuthContextType, AuthSession } from './types';
import { Permission, Capability } from './permissions';

// ── Context ─────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | null>(null);

// ── Provider ────────────────────────────────────────────────────────

/**
 * Mount this once near the root of the application (inside the client tree,
 * after QueryProvider) so that all `useSession()` consumers share one
 * authentication state instance.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      setIsLoading(true);
      const loadedSession = await getSession();
      setSessionState(loadedSession);
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

  const login = async (credentials: unknown) => {
    setIsLoading(true);
    try {
      const activeSession = await authApi.login(credentials);
      setSessionState(activeSession);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: unknown) => {
    setIsLoading(true);
    try {
      const activeSession = await authApi.register(data);
      setSessionState(activeSession);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authApi.logout();
      setSessionState(null);
    } finally {
      setIsLoading(false);
    }
  };

  const value = useMemo<AuthContextType>(
    () => ({
      session,
      user: session?.user ?? null,
      isAuthenticated,
      isLoading,
      hasPermission,
      hasCapability,
      login,
      register,
      logout,
    }),
    // isLoading and session are intentionally the reactive deps; the callback
    // identities are stable across renders for a given session state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [session, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ── Hooks ───────────────────────────────────────────────────────────

/**
 * Primary authentication hook. Reads from the nearest `AuthProvider`.
 * Throws if used outside of an `AuthProvider` to surface wiring mistakes.
 */
export function useSession(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useSession must be used within an <AuthProvider>.');
  }
  return ctx;
}

export const useAuthentication = useSession;

export function useCurrentUser() {
  const { user } = useSession();
  return user;
}

export function useIsAuthenticated() {
  const { isAuthenticated } = useSession();
  return isAuthenticated;
}

export function usePermissions() {
  const { hasPermission, hasCapability } = useSession();
  return { hasPermission, hasCapability };
}
