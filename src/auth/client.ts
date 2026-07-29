/**
 * Authentication client for DealScope.
 *
 * Configured instance of `ApiClient` connected to backend auth routes.
 */

import { ApiClient } from '@/api/client';
import { getSession, setSession } from './session';
import { Role, ROLE_PERMISSIONS, CAPABILITIES } from './permissions';
import { AuthSession } from './types';

interface BackendUser {
  id: string;
  name?: string | null;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthResponseData {
  user: BackendUser;
  accessToken: string;
}

function extractAuthData(resData: unknown): AuthResponseData {
  if (!resData || typeof resData !== 'object') {
    throw new Error('Invalid authentication response structure.');
  }

  const obj = resData as Record<string, unknown>;

  // Check if standard response envelope is present: { success: true, data: { user, accessToken } }
  if (obj.data && typeof obj.data === 'object') {
    const inner = obj.data as Record<string, unknown>;
    if (inner.user && inner.accessToken) {
      return inner as unknown as AuthResponseData;
    }
  }

  // Fallback to top-level object
  if (obj.user && obj.accessToken) {
    return obj as unknown as AuthResponseData;
  }

  throw new Error('Missing user or accessToken in backend auth response.');
}

/**
 * Refreshes JWT access token from the backend /auth/refresh endpoint.
 */
async function refreshToken(): Promise<boolean> {
  try {
    const res = await authApiClient.post<unknown>('/auth/refresh', {});
    const authData = extractAuthData(res.data);
    const userRole = authData.user.role === 'admin' ? Role.Admin : Role.User;

    const session: AuthSession = {
      id: `session-${authData.user.id}`,
      user: {
        id: authData.user.id,
        username: authData.user.name || authData.user.email.split('@')[0],
        email: authData.user.email,
        createdAt: authData.user.createdAt,
        updatedAt: authData.user.updatedAt,
      },
      token: authData.accessToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      roles: [userRole],
      permissions: ROLE_PERMISSIONS[userRole] || [],
      capabilities: Object.values(CAPABILITIES),
    };

    await setSession(session);
    return true;
  } catch {
    await setSession(null);
    return false;
  }
}

/**
 * Pre-configured ApiClient instance for auth communication.
 */
export const authApiClient = new ApiClient({
  getAuthToken: async () => {
    const session = await getSession();
    return session?.token;
  },
  onUnauthorized: async () => {
    return refreshToken();
  },
});

export const authApi = {
  /**
   * Performs backend login with email and password credentials.
   */
  login: async (credentials: unknown): Promise<AuthSession> => {
    const res = await authApiClient.post<unknown>('/auth/login', credentials);
    const authData = extractAuthData(res.data);
    const userRole = authData.user.role === 'admin' ? Role.Admin : Role.User;

    const session: AuthSession = {
      id: `session-${authData.user.id}`,
      user: {
        id: authData.user.id,
        username: authData.user.name || authData.user.email.split('@')[0],
        email: authData.user.email,
        createdAt: authData.user.createdAt,
        updatedAt: authData.user.updatedAt,
      },
      token: authData.accessToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      roles: [userRole],
      permissions: ROLE_PERMISSIONS[userRole] || [],
      capabilities: Object.values(CAPABILITIES),
    };

    await setSession(session);
    return session;
  },

  /**
   * Performs backend registration with name, email, and password.
   */
  register: async (data: unknown): Promise<AuthSession> => {
    const res = await authApiClient.post<unknown>('/auth/register', data);
    const authData = extractAuthData(res.data);
    const userRole = authData.user.role === 'admin' ? Role.Admin : Role.User;

    const session: AuthSession = {
      id: `session-${authData.user.id}`,
      user: {
        id: authData.user.id,
        username: authData.user.name || authData.user.email.split('@')[0],
        email: authData.user.email,
        createdAt: authData.user.createdAt,
        updatedAt: authData.user.updatedAt,
      },
      token: authData.accessToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      roles: [userRole],
      permissions: ROLE_PERMISSIONS[userRole] || [],
      capabilities: Object.values(CAPABILITIES),
    };

    await setSession(session);
    return session;
  },

  /**
   * Performs backend logout.
   */
  logout: async (): Promise<void> => {
    try {
      await authApiClient.post('/auth/logout', {});
    } catch {
      // Ignore network errors on logout
    }
    await setSession(null);
  },

  /**
   * Fetches currently authenticated user profile.
   */
  getMe: async () => {
    try {
      const res = await authApiClient.get<unknown>('/auth/me');
      const obj = res.data as Record<string, unknown>;
      if (obj && obj.data && (obj.data as Record<string, unknown>).user) {
        return (obj.data as Record<string, unknown>).user;
      }
      return (obj as Record<string, unknown>).user ?? null;
    } catch {
      const session = await getSession();
      return session?.user ?? null;
    }
  },

  /**
   * Updates currently authenticated user profile.
   */
  updateProfile: async (data: { name?: string; email?: string }): Promise<BackendUser> => {
    const res = await authApiClient.put<unknown>('/auth/profile', data);
    const obj = res.data as Record<string, unknown>;
    
    // Update local session
    const session = await getSession();
    if (session && obj.data && (obj.data as Record<string, unknown>).user) {
      const backendUser = (obj.data as Record<string, unknown>).user as BackendUser;
      session.user.username = backendUser.name || backendUser.email.split('@')[0];
      session.user.email = backendUser.email;
      await setSession(session);
      return backendUser;
    }
    throw new Error('Failed to update profile');
  },

  /**
   * Changes user password.
   */
  changePassword: async (data: { currentPassword?: string; newPassword?: string }): Promise<void> => {
    await authApiClient.put('/auth/change-password', data);
  },
};
