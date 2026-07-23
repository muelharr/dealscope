/**
 * Scalable permission model for the DealScope application.
 *
 * This module defines the roles, permissions, and capabilities that govern
 * user access to features and data. It is designed to be extensible.
 *
 * - Roles are broad categories assigned to users (e.g., 'admin', 'user').
 * - Permissions are specific actions a user can take (e.g., 'product:read').
 * - Capabilities are granular feature flags (e.g., 'can_compare_products').
 */

// ── Roles ────────────────────────────────────────────────────────────

export enum Role {
  Admin = 'admin',
  User = 'user',
  Guest = 'guest',
}

// ── Permissions ──────────────────────────────────────────────────────

export const PERMISSIONS = {
  // Product-related permissions
  PRODUCT_READ: 'product:read',
  PRODUCT_WRITE: 'product:write',
  PRODUCT_DELETE: 'product:delete',

  // Wishlist-related permissions
  WISHLIST_READ: 'wishlist:read',
  WISHLIST_WRITE: 'wishlist:write',

  // Comparison-related permissions
  COMPARE_READ: 'compare:read',
  COMPARE_WRITE: 'compare:write',

  // Dashboard-related permissions
  DASHBOARD_READ: 'dashboard:read',

  // Admin-level permissions
  ADMIN_ACCESS: 'admin:access',
  USER_MANAGE: 'user:manage',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// ── Capabilities ─────────────────────────────────────────────────────
// These are more for fine-grained feature-flagging within the UI.

export const CAPABILITIES = {
  CAN_VIEW_DEAL_SCORE: 'can_view_deal_score',
  CAN_USE_AI_SUMMARY: 'can_use_ai_summary',
  CAN_COMPARE_PRODUCTS: 'can_compare_products',
  CAN_EXPORT_DATA: 'can_export_data',
} as const;

export type Capability = (typeof CAPABILITIES)[keyof typeof CAPABILITIES];

// ── Role-to-Permission Mapping ───────────────────────────────────────

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.Admin]: Object.values(PERMISSIONS),
  [Role.User]: [
    PERMISSIONS.PRODUCT_READ,
    PERMISSIONS.WISHLIST_READ,
    PERMISSIONS.WISHLIST_WRITE,
    PERMISSIONS.COMPARE_READ,
    PERMISSIONS.COMPARE_WRITE,
    PERMISSIONS.DASHBOARD_READ,
  ],
  [Role.Guest]: [PERMISSIONS.PRODUCT_READ, PERMISSIONS.COMPARE_READ],
};

// ── Permission Check Helpers ─────────────────────────────────────────

export function hasPermission(
  userRoles: Role[],
  requiredPermission: Permission,
): boolean {
  for (const role of userRoles) {
    if (ROLE_PERMISSIONS[role]?.includes(requiredPermission)) {
      return true;
    }
  }
  return false;
}
