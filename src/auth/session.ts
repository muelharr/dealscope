/**
 * Session management for DealScope.
 */

import { AuthSession } from './types';

let memorySession: AuthSession | null = null;

export async function getSession(): Promise<AuthSession | null> {
  if (memorySession) {
    return memorySession;
  }

  if (typeof window !== 'undefined') {
    const match = document.cookie.match(/(^|;)\s*dealscope_session\s*=\s*([^;]+)/);
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
      document.cookie = `dealscope_session=${encoded}; path=/; expires=${expires}; SameSite=Lax`;
    } else {
      document.cookie = 'dealscope_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    }
  }
}

export async function clearSession(): Promise<void> {
  await setSession(null);
}
