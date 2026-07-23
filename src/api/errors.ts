/**
 * Centralized API error class.
 *
 * Every failed HTTP request is converted into an `ApiClientError` so that
 * consumers always receive a consistent, typed error regardless of whether
 * the failure was a server response, a network outage, or a timeout.
 *
 * NOTE: The shared type `ApiError` (src/types/api/ApiError.ts) describes the
 * JSON shape the *backend* returns.  `ApiClientError` is the *runtime* Error
 * subclass thrown by the HTTP client.
 */

import type { ApiError as ApiErrorBody, ValidationError } from '@/types/api';

// ── Error codes for non-HTTP failures ────────────────────────────────

export const ERROR_CODE = {
  NETWORK: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT_ERROR',
  PARSE: 'PARSE_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR',
} as const;

export type ErrorCode = (typeof ERROR_CODE)[keyof typeof ERROR_CODE];

// ── Human-readable default messages per status ───────────────────────

const STATUS_MESSAGES: Record<number, string> = {
  400: 'Bad request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not found',
  409: 'Conflict',
  422: 'Validation failed',
  429: 'Too many requests',
  500: 'Internal server error',
};

// ── ApiClientError ───────────────────────────────────────────────────

export class ApiClientError extends Error {
  /** HTTP status code, or `0` for network / timeout errors. */
  readonly status: number;

  /** Machine-readable error code (HTTP status or a non-HTTP ErrorCode). */
  readonly code: number | ErrorCode;

  /** Human-readable message. */
  override readonly message: string;

  /** Optional extended detail string from the server. */
  readonly details?: string;

  /** Validation errors returned by a 422 response. */
  readonly validationErrors?: ValidationError[];

  /** The raw `Response` object, when one exists. */
  readonly response?: Response;

  constructor(options: {
    status: number;
    code: number | ErrorCode;
    message: string;
    details?: string;
    validationErrors?: ValidationError[];
    response?: Response;
  }) {
    super(options.message);
    this.name = 'ApiClientError';
    this.status = options.status;
    this.code = options.code;
    this.message = options.message;
    this.details = options.details;
    this.validationErrors = options.validationErrors;
    this.response = options.response;
  }

  /** `true` when the server returned a 401 Unauthorized. */
  get isUnauthorized(): boolean {
    return this.status === 401;
  }

  /** `true` when the server returned a 403 Forbidden. */
  get isForbidden(): boolean {
    return this.status === 403;
  }

  /** `true` when the server returned a 404 Not Found. */
  get isNotFound(): boolean {
    return this.status === 404;
  }

  /** `true` when the server returned a 422 with validation errors. */
  get isValidationError(): boolean {
    return this.status === 422;
  }

  /** `true` when the server returned a 429 Too Many Requests. */
  get isRateLimited(): boolean {
    return this.status === 429;
  }

  /** `true` when the request never reached the server. */
  get isNetworkError(): boolean {
    return this.code === ERROR_CODE.NETWORK;
  }

  /** `true` when the request was aborted due to a timeout. */
  get isTimeout(): boolean {
    return this.code === ERROR_CODE.TIMEOUT;
  }
}

// ── Factory helpers ──────────────────────────────────────────────────

/**
 * Build an `ApiClientError` from an HTTP `Response` and an optional
 * parsed body that matches the backend `ApiError` shape.
 */
export function createHttpError(
  response: Response,
  body?: ApiErrorBody | null,
): ApiClientError {
  return new ApiClientError({
    status: response.status,
    code: body?.code ?? response.status,
    message:
      body?.message ??
      STATUS_MESSAGES[response.status] ??
      `Request failed with status ${response.status}`,
    details: body?.details,
    validationErrors: body?.validationErrors,
    response,
  });
}

/** Build an `ApiClientError` for network-level failures. */
export function createNetworkError(cause?: unknown): ApiClientError {
  return new ApiClientError({
    status: 0,
    code: ERROR_CODE.NETWORK,
    message:
      cause instanceof Error
        ? `Network error: ${cause.message}`
        : 'A network error occurred',
  });
}

/** Build an `ApiClientError` for timeout failures. */
export function createTimeoutError(timeoutMs: number): ApiClientError {
  return new ApiClientError({
    status: 0,
    code: ERROR_CODE.TIMEOUT,
    message: `Request timed out after ${timeoutMs}ms`,
  });
}

/** Build an `ApiClientError` for JSON parse failures. */
export function createParseError(cause?: unknown): ApiClientError {
  return new ApiClientError({
    status: 0,
    code: ERROR_CODE.PARSE,
    message:
      cause instanceof Error
        ? `Failed to parse response: ${cause.message}`
        : 'Failed to parse the server response',
  });
}
