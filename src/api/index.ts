/**
 * Barrel export for the API client module.
 *
 * This file exports all public-facing modules and creates a default,
 * singleton instance of the `ApiClient` for convenience.
 */

import { ApiClient } from './client';

// ── Re-exports ───────────────────────────────────────────────────────

export * from './client';
export * from './endpoints';
export * from './errors';
export * from './request';
export * from './response';

// ── Default client instance ──────────────────────────────────────────

/**
 * A default, singleton instance of the `ApiClient`.
 *
 * This instance is pre-configured with the environment variables and
 * can be used directly for most requests.  For testing or for requests
 * with special configurations, you can always create a new `ApiClient`
 * instance with custom settings.
 */
export const apiClient = new ApiClient();
