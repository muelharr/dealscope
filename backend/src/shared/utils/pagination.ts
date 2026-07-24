import { PaginationMeta } from './response';

export interface PaginationParams {
  limit: number;
  offset: number;
}

/**
 * Parses limit and offset query parameters safely with fallback defaults.
 */
export function getPaginationParams(
  query: Record<string, unknown>,
  defaultLimit = 10,
  maxLimit = 100
): PaginationParams {
  const rawLimit = parseInt(String(query.limit), 10);
  const rawOffset = parseInt(String(query.offset), 10);

  const limit = isNaN(rawLimit) || rawLimit <= 0 ? defaultLimit : Math.min(rawLimit, maxLimit);
  const offset = isNaN(rawOffset) || rawOffset < 0 ? 0 : rawOffset;

  return { limit, offset };
}

/**
 * Builds the standard pagination metadata object.
 */
export function buildPaginationMeta(
  total: number,
  limit: number,
  offset: number
): PaginationMeta {
  const perPage = limit;
  const currentPage = limit > 0 ? Math.floor(offset / limit) + 1 : 1;
  const totalPages = limit > 0 ? Math.ceil(total / limit) : 0;
  const count = limit > 0 ? Math.min(limit, Math.max(0, total - offset)) : 0;

  return {
    total,
    count,
    perPage,
    currentPage,
    totalPages,
  };
}

