/**
 * Authentication client for DealScope.
 *
 * This module configures and exports a specialized instance of the `ApiClient`
 * that is pre-configured for handling authentication (token injection,
 * 401 retries, etc.).
 *
 * It acts as the bridge between the generic HTTP client and the application's
 * specific authentication needs.
 */

import { ApiClient } from '@/api/client';
import { getSession, setSession, createMockSession } from './session';
import { Role } from './permissions';

// ── Authentication Logic ─────────────────────────────────────────────

/**
 * Placeholder for the token refresh logic.
 *
 * In a real application, this function would make an API call to the
 * '/auth/refresh' endpoint to get a new access token.
 *
 * @returns `true` if the refresh was successful, `false` otherwise.
 */
async function refreshToken(): Promise<boolean> {
  console.log('Attempting to refresh token...');
  // TODO: Implement actual refresh token flow.
  // 1. Get refresh token from secure storage.
  // 2. Call `apiClient.post('/auth/refresh', { refreshToken })`.
  // 3. If successful, `setSession(newSession)`.
  // 4. Return `true`.

  // For now, simulate a successful refresh by creating a new mock session.
  const newMockSession = createMockSession(Role.User);
  await setSession(newMockSession);

  console.log('Token refresh successful (mocked).');
  return true;
}

// ── Pre-configured ApiClient Instance ────────────────────────────────

/**
 * An instance of `ApiClient` pre-configured with authentication hooks.
 *
 * This should be used for all authenticated API requests.
 */
export const authApiClient = new ApiClient({
  /**
   * Dynamically retrieves the auth token from the current session
   * before any request is sent.
   */
  getAuthToken: async () => {
    const session = await getSession();
    return session?.token;
  },

  /**
   * Intercepts 401 Unauthorized responses and attempts to refresh
   * the token. If successful, the original request is retried.
   */
  onUnauthorized: async () => {
    return refreshToken();
  },
});

// ── High-level Auth API Methods ──────────────────────────────────────
// These methods provide a clean, high-level API for auth operations
// that can be used throughout the application (e.g., in server actions
// or API route handlers).

export const authApi = {
  /**
   * Placeholder for the login API call.
   */
  login: async (credentials: unknown) => {
    // const { data: session } = await authApiClient.post('/auth/login', credentials);
    // await setSession(session);
    console.log('Logging in with:', credentials);
    const mockSession = createMockSession(Role.User);
    await setSession(mockSession);
    return mockSession;
  },

  /**
   * Placeholder for the logout API call.
   */
  logout: async () => {
    // await authApiClient.post('/auth/logout', {});
    await setSession(null);
    console.log('Logged out.');
  },

  /**
   * Placeholder to get the current user's profile.
   */
  getMe: async () => {
    // const { data: user } = await authApiClient.get('/auth/me');
    // return user;
    const session = await getSession();
    return session?.user ?? null;
  },
};
