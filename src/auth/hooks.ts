/**
 * Reusable React hooks for accessing authentication state.
 */

'use client';

import { useState, useEffect } from 'react';
import { getSession } from './session';
import { authApi } from './client';
import { AuthContextType, AuthSession } from './types';
import { Permission, Capability } from './permissions';

export function useAuthentication(): AuthContextType {
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

  return {
    session,
    user: session?.user ?? null,
    isAuthenticated,
    isLoading,
    hasPermission,
    hasCapability,
    login,
    register,
    logout,
  };
}

export const useSession = useAuthentication;

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
