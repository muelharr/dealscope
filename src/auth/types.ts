/**
 * Type definitions for the authentication module.
 *
 * These types reuse the shared domain models (User, Session) and extend
 * them with authentication-specific state.
 */

import type { User, Session } from '@/types/domain';
import type { Role, Permission, Capability } from './permissions';

// ── Auth Session State ───────────────────────────────────────────────

export interface AuthSession extends Session {
  /** The user's roles. */
  roles: Role[];
  /** The user's permissions, derived from their roles. */
  permissions: Permission[];
  /** The user's capabilities, potentially from feature flags. */
  capabilities: Capability[];
}

// ── Authentication Context ───────────────────────────────────────────
// This is the shape of the data exposed by our authentication hooks.

export interface AuthContextType {
  /** The full authentication session, or `null` if not logged in. */
  session: AuthSession | null;

  /** The authenticated user, or `null`. */
  user: User | null;

  /** `true` if the user is authenticated. */
  isAuthenticated: boolean;

  /** `true` while the initial session is being loaded. */
  isLoading: boolean;

  /**
   * Checks if the current user has a specific permission.
   * @param permission - The permission to check.
   * @returns `true` if the user has the permission.
   */
  hasPermission: (permission: Permission) => boolean;

  /**
   * Checks if the current user has a specific capability.
   * @param capability - The capability to check.
   * @returns `true` if the user has the capability.
   */
  hasCapability: (capability: Capability) => boolean;

  /** Placeholder for a login function. */
  login: (credentials: unknown) => Promise<void>;

  /** Register function. */
  register?: (data: unknown) => Promise<void>;

  /** Placeholder for a logout function. */
  logout: () => Promise<void>;

  /** Upgrade authenticated user plan (FREE/PRO). */
  upgradePlan?: (plan?: 'FREE' | 'PRO') => Promise<void>;
}
