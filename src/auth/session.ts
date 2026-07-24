/**
 * Session management for the DealScope application.
 *
 * This module is responsible for persisting, retrieving, and invalidating
 * the user's authentication session.
 *
 * In a real-world application, this would interact with secure, http-only
 * cookies. For this foundational phase, we'll use a placeholder that
 * simulates this behavior without actual backend integration.
 */

import { AuthSession } from './types';
import { Role, ROLE_PERMISSIONS, CAPABILITIES } from './permissions';

// Placeholder for a secure session store (e.g., a cookie).
// We'll use a simple in-memory variable for now.
let memorySession: AuthSession | null = null;

/**
 * Retrieves the current authentication session.
 *
 * This is a placeholder implementation. In a real app, this would
 * involve reading and verifying a secure cookie.
 *
 * @returns The current session, or `null` if none exists.
 */
export async function getSession(): Promise<AuthSession | null> {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 50));

  if (memorySession) {
    return memorySession;
  }

  // Restore from cookie on the client side
  if (typeof window !== 'undefined') {
    const match = document.cookie.match(/(^|;)\s*mock_session\s*=\s*([^;]+)/);
    if (match) {
      try {
        const decoded = decodeURIComponent(match[2]);
        const session = JSON.parse(decoded) as AuthSession;
        memorySession = session;
        return session;
      } catch {
        // Ignore JSON parse errors
      }
    }
  }

  return null;
}

/**
 * Persists an authentication session.
 *
 * This is a placeholder implementation. In a real app, this would
 * set a secure, http-only cookie.
 *
 * @param session - The session data to persist.
 */
export async function setSession(session: AuthSession | null): Promise<void> {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 10));

  memorySession = session;

  // Persist session to cookie for client-side storage so middleware can read it
  if (typeof window !== 'undefined') {
    if (session) {
      const expires = new Date(session.expiresAt).toUTCString();
      document.cookie = `mock_session=${encodeURIComponent(JSON.stringify(session))}; path=/; expires=${expires}; SameSite=Lax`;
    } else {
      document.cookie = 'mock_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    }
  }
}

/**
 * Invalidates the current session (logs the user out).
 */
export async function clearSession(): Promise<void> {
  await setSession(null);
}

/**
 * Creates a mock session for development and testing.
 *
 * This function simulates a successful login, creating a complete
 * `AuthSession` object from a user's role.
 *
 * @param role - The role of the user to simulate.
 * @returns A fully-formed mock `AuthSession`.
 */
export function createMockSession(role: Role): AuthSession {
  const user = {
    id: role === Role.Guest ? 'guest-123' : 'user-456',
    username: role === Role.Guest ? 'guest' : 'deal-finder',
    email: 'test@example.com',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const permissions = ROLE_PERMISSIONS[role] || [];
  // For now, let's say all authenticated users have all capabilities.
  const capabilities =
    role === Role.Guest ? [] : Object.values(CAPABILITIES);

  return {
    id: `session-${Math.random().toString(36).substring(2, 9)}`,
    user,
    token: `mock-token-for-${role}`,
    expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    roles: [role],
    permissions,
    capabilities,
  };
}
