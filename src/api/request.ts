/**
 * Request configuration types for the HTTP client.
 *
 * `RequestConfig` is the public surface that callers pass to the client.
 * The client normalises it into a native `fetch` `RequestInit` internally.
 */

// ── HTTP methods ─────────────────────────────────────────────────────

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// ── Query-parameter map ──────────────────────────────────────────────

export type QueryParams = Record<
  string,
  string | number | boolean | string[] | undefined
>;

// ── Request configuration ────────────────────────────────────────────

export interface RequestConfig<TBody = unknown> {
  /** HTTP method (defaults to `'GET'`). */
  method?: HttpMethod;

  /** Additional headers merged on top of the defaults. */
  headers?: HeadersInit;

  /** Request body — automatically JSON-stringified unless already a string. */
  body?: TBody;

  /** Query parameters appended to the URL. `undefined` values are omitted. */
  params?: QueryParams;

  /** `AbortSignal` for manual cancellation. */
  signal?: AbortSignal;

  /** Next.js `fetch` cache directive (e.g. `'no-store'`). */
  cache?: RequestCache;

  /** Next.js extended `fetch` options (e.g. `{ revalidate: 60 }`). */
  next?: NextFetchRequestConfig;

  /** Credential mode for cookies / auth headers. */
  credentials?: RequestCredentials;

  /** Request timeout in milliseconds.  Overrides the client default. */
  timeout?: number;
}

/**
 * Next.js extends the native `fetch` with a `next` option.
 * We type only the fields we need so the client stays framework-agnostic
 * while still allowing callers to pass Next.js-specific hints.
 */
export interface NextFetchRequestConfig {
  revalidate?: number | false;
  tags?: string[];
}

// ── Helpers ──────────────────────────────────────────────────────────

/**
 * Serialise a `QueryParams` map into a `URLSearchParams` instance.
 * `undefined` values are silently dropped.  Arrays are repeated
 * (`key=a&key=b`).
 */
export function buildSearchParams(params: QueryParams): URLSearchParams {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      for (const v of value) {
        search.append(key, v);
      }
    } else {
      search.append(key, String(value));
    }
  }
  return search;
}

/**
 * Merge two `HeadersInit` values into a single plain-object header map.
 */
export function mergeHeaders(
  base: HeadersInit | undefined,
  overrides: HeadersInit | undefined,
): Record<string, string> {
  const result: Record<string, string> = {};

  const apply = (source: HeadersInit | undefined) => {
    if (!source) return;
    if (source instanceof Headers) {
      source.forEach((v, k) => {
        result[k] = v;
      });
    } else if (Array.isArray(source)) {
      for (const [k, v] of source) {
        result[k] = v;
      }
    } else {
      Object.assign(result, source);
    }
  };

  apply(base);
  apply(overrides);
  return result;
}
