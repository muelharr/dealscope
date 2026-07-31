/**
 * Framework-agnostic HTTP client for the DealScope API.
 *
 * This client provides a single entry point for all backend communication.
 * It's built on top of the native `fetch` API and is designed to be
 * used in any JavaScript environment (server, client, edge).
 *
 * It is NOT a React component and has no UI-specific logic.
 */

import {
  ApiClientError,
  createNetworkError,
  createTimeoutError,
} from './errors';
import {
  buildSearchParams,
  mergeHeaders,
  type RequestConfig,
} from './request';
import { parseResponse, type ParsedResponse } from './response';

// ── Client Configuration ─────────────────────────────────────────────

export interface ApiClientConfig {
  /** The base URL for all requests. */
  baseUrl?: string;
  /** Default headers applied to every request. */
  headers?: HeadersInit;
  /** Default timeout in milliseconds (0 = no timeout). */
  timeout?: number;
  /** Default credential mode for cookies / auth tokens. */
  credentials?: RequestCredentials;

  /**
   * Hook to dynamically inject the `Authorization` header.
   *
   * This is a placeholder for a future auth implementation.  It allows
   * the client to fetch a token just-in-time before a request is sent.
   */
  getAuthToken?: () => Promise<string | null | undefined>;

  /**
   * Global 401 retry hook.
   *
   * If a request fails with a 401, this hook is called.  If it returns
   * `true`, the original request is retried *once*. This is where a
   * token refresh mechanism would live.
   */
  onUnauthorized?: () => Promise<boolean>;
}

// ── ApiClient ────────────────────────────────────────────────────────

export class ApiClient {
  private readonly config: ApiClientConfig;
  private isRetryingUnauthorized = false;

  constructor(config: ApiClientConfig = {}) {
    this.config = {
      baseUrl: config.baseUrl ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...config.headers,
      },
      timeout: config.timeout ?? 15000,
      credentials: config.credentials ?? 'include',
      getAuthToken: config.getAuthToken,
      onUnauthorized: config.onUnauthorized,
    };
  }

  // ── Core request method ──────────────────────────────────────────

  async request<TResponse, TBody = unknown>(
    endpoint: string,
    config: RequestConfig<TBody> = {},
  ): Promise<ParsedResponse<TResponse>> {
    const {
      method = 'GET',
      params,
      body,
      timeout: requestTimeout,
      signal: externalSignal,
    } = config;

    const url = new URL(this.buildUrl(endpoint));
    if (params) {
      const search = buildSearchParams(params);
      url.search = search.toString();
    }

    const headers = await this.buildHeaders(config.headers);

    const timeout = requestTimeout ?? this.config.timeout;
    const controller = new AbortController();
    const internalSignal = controller.signal;

    const combinedSignal = this.getCombinedSignal(internalSignal, externalSignal);

    let timeoutId: NodeJS.Timeout | undefined;
    if (timeout && timeout > 0) {
      timeoutId = setTimeout(() => {
        controller.abort();
      }, timeout);
    }

    try {
      const response = await fetch(url.toString(), {
        method,
        headers,
        body: this.serializeBody(body),
        signal: combinedSignal,
        cache: config.cache,
        next: config.next,
        credentials: config.credentials ?? this.config.credentials,
      });

      clearTimeout(timeoutId);
      return await parseResponse<TResponse>(response);
    } catch (error) {
      clearTimeout(timeoutId);

      // Timeout-triggered abort
      if (internalSignal.aborted && timeout) {
        throw createTimeoutError(timeout);
      }

      // External abort
      if (externalSignal?.aborted) {
        // Don't treat this as an error; the caller cancelled it.
        // We throw a generic error so the promise rejects, but a
        // more specific error might be confusing.
        throw new Error('Request was aborted by the caller.');
      }

      if (error instanceof ApiClientError) {
        // It's one of our own from `parseResponse`.
        if (error.isUnauthorized) {
          return this.handleUnauthorized(endpoint, config);
        }
        throw error;
      }

      // Everything else is a network failure.
      throw createNetworkError(error);
    }
  }

  // ── HTTP method shortcuts ────────────────────────────────────────

  get<TResponse>(
    endpoint: string,
    config?: RequestConfig,
  ): Promise<ParsedResponse<TResponse>> {
    return this.request<TResponse>(endpoint, { ...config, method: 'GET' });
  }

  post<TResponse, TBody = unknown>(
    endpoint: string,
    body: TBody,
    config?: RequestConfig<TBody>,
  ): Promise<ParsedResponse<TResponse>> {
    return this.request<TResponse, TBody>(endpoint, {
      ...config,
      method: 'POST',
      body,
    });
  }

  put<TResponse, TBody = unknown>(
    endpoint: string,
    body: TBody,
    config?: RequestConfig<TBody>,
  ): Promise<ParsedResponse<TResponse>> {
    return this.request<TResponse, TBody>(endpoint, {
      ...config,
      method: 'PUT',
      body,
    });
  }

  patch<TResponse, TBody = unknown>(
    endpoint: string,
    body: TBody,
    config?: RequestConfig<TBody>,
  ): Promise<ParsedResponse<TResponse>> {
    return this.request<TResponse, TBody>(endpoint, {
      ...config,
      method: 'PATCH',
      body,
    });
  }

  delete<TResponse>(
    endpoint: string,
    config?: RequestConfig,
  ): Promise<ParsedResponse<TResponse>> {
    return this.request<TResponse>(endpoint, { ...config, method: 'DELETE' });
  }

  // ── Private helpers ──────────────────────────────────────────────

  private buildUrl(endpoint: string): string {
    const base = this.config.baseUrl?.replace(/\/$/, '') ?? '';
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${base}${path}`;
  }

  private serializeBody(body: unknown): BodyInit | null {
    if (body === undefined || body === null) return null;
    if (typeof body === 'string') return body;
    if (body instanceof URLSearchParams || body instanceof FormData) return body;
    return JSON.stringify(body);
  }

  private async buildHeaders(
    requestHeaders?: HeadersInit,
  ): Promise<Record<string, string>> {
    const merged = mergeHeaders(this.config.headers, requestHeaders);

    if (this.config.getAuthToken) {
      const token = await this.config.getAuthToken();
      if (token) {
        merged['Authorization'] = `Bearer ${token}`;
      }
    }

    return merged;
  }

  private getCombinedSignal(
    internal: AbortSignal,
    external?: AbortSignal,
  ): AbortSignal {
    if (!external) return internal;

    const controller = new AbortController();
    const combined = controller.signal;

    const onAbort = () => controller.abort();
    internal.addEventListener('abort', onAbort);
    external.addEventListener('abort', onAbort);

    combined.addEventListener('abort', () => {
      internal.removeEventListener('abort', onAbort);
      external.removeEventListener('abort', onAbort);
    });

    return combined;
  }

  private async handleUnauthorized<TResponse, TBody>(
    endpoint: string,
    config: RequestConfig<TBody>,
  ): Promise<ParsedResponse<TResponse>> {
    if (this.isRetryingUnauthorized || !this.config.onUnauthorized) {
      throw new ApiClientError({
        status: 401,
        code: 401,
        message: 'Unauthorized',
      });
    }

    this.isRetryingUnauthorized = true;
    try {
      const success = await this.config.onUnauthorized();
      if (success) {
        // Retry the original request
        return this.request(endpoint, config);
      }
    } finally {
      this.isRetryingUnauthorized = false;
    }

    throw new ApiClientError({
      status: 401,
      code: 401,
      message: 'Unauthorized',
    });
  }
}
