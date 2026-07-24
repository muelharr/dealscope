/**
 * Session management for DealScope.
 */

import { AuthSession } from './types';
import { Role, ROLE_PERMISSIONS, CAPABILITIES } from './permissions';

let memorySession: AuthSession | null = null;

export async function getSession(): Promise<AuthSession | null> {
  if (memorySession) {
    return memorySession;
  }

  if (typeof window !== 'undefined') {
    const match = document.cookie.match(/(^|;)\s*mock_session\s*=\s*([^;]+)/) || document.cookie.match(/(^|;)\s*dealscope_session\s*=\s*([^;]+)/);
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

export async function setSession(session: AuthSession | null): Promise<void> {
  memorySession = session;

  if (typeof window !== 'undefined') {
    if (session) {
      const expires = new Date(session.expiresAt).toUTCString();
      const encoded = encodeURIComponent(JSON.stringify(session));
      document.cookie = `mock_session=${encoded}; path=/; expires=${expires}; SameSite=Lax`;
      document.cookie = `dealscope_session=${encoded}; path=/; expires=${expires}; SameSite=Lax`;
    } else {
      document.cookie = 'mock_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
      document.cookie = 'dealscope_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    }
  }
}

export async function clearSession(): Promise<void> {
  await setSession(null);
}

export function createMockSession(role: Role): AuthSession {
  const user = {
    id: role === Role.Guest ? 'guest-123' : 'user-456',
    username: role === Role.Guest ? 'guest' : 'deal-finder',
    email: 'test@example.com',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const permissions = ROLE_PERMISSIONS[role] || [];
  const capabilities = role === Role.Guest ? [] : Object.values(CAPABILITIES);

  return {
    id: `session-${Math.random().toString(36).substring(2, 9)}`,
    user,
    token: `mock-token-for-${role}`,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    roles: [role],
    permissions,
    capabilities,
  };
}
