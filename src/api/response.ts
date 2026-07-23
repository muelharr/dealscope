/**
 * Response handling utilities.
 *
 * Responsible for:
 * - Parsing JSON bodies
 * - Handling empty / no-content responses
 * - Throwing typed `ApiClientError` on non-2xx status codes
 * - Preserving the original `Response` status and headers
 */

import type { ApiError as ApiErrorBody } from '@/types/api';
import { createHttpError, createParseError } from './errors';

// ── Parsed response wrapper ─────────────────────────────────────────

export interface ParsedResponse<T> {
  /** The parsed (or `undefined` for empty) body. */
  data: T;
  /** The HTTP status code. */
  status: number;
  /** The raw response headers. */
  headers: Headers;
}

// ── Core parser ─────────────────────────────────────────────────────

/**
 * Process a `fetch` `Response`:
 *
 * 1. If the status is not in the 2xx range, attempt to parse the body as
 *    the backend `ApiError` shape and throw an `ApiClientError`.
 * 2. For 204 / empty bodies, return `undefined` as the data.
 * 3. Otherwise JSON-parse the body and return it wrapped in a
 *    `ParsedResponse`.
 */
export async function parseResponse<T>(
  response: Response,
): Promise<ParsedResponse<T>> {
  // ── Non-2xx → throw ──────────────────────────────────────────────
  if (!response.ok) {
    let errorBody: ApiErrorBody | null = null;
    try {
      errorBody = (await response.json()) as ApiErrorBody;
    } catch {
      // Body wasn't JSON — that's fine; the factory handles `null`.
    }
    throw createHttpError(response, errorBody);
  }

  // ── Empty body (204 No Content, etc.) ────────────────────────────
  if (
    response.status === 204 ||
    response.headers.get('content-length') === '0'
  ) {
    return {
      data: undefined as unknown as T,
      status: response.status,
      headers: response.headers,
    };
  }

  // ── JSON body ────────────────────────────────────────────────────
  try {
    const data = (await response.json()) as T;
    return {
      data,
      status: response.status,
      headers: response.headers,
    };
  } catch (cause) {
    throw createParseError(cause);
  }
}
