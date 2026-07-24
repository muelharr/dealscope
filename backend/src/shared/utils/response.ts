import { Response } from 'express';

export interface PaginationMeta {
  total: number;
  count: number;
  perPage: number;
  currentPage: number;
  totalPages: number;
}

export interface SuccessResponse<T> {
  success: true;
  data: T;
  meta: {
    timestamp: string;
    version: string;
    pagination?: PaginationMeta;
  };
}

export interface ErrorDetail {
  field: string;
  message: string;
}

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    status: number;
    details?: ErrorDetail[];
  };
  meta: {
    timestamp: string;
    version: string;
  };
}

/**
 * Sends a standardized success API response.
 */
export function sendSuccess<T>(
  res: Response,
  data: T,
  statusCode = 200,
  pagination?: PaginationMeta
): Response {
  const responsePayload: SuccessResponse<T> = {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      version: 'v1',
      ...(pagination && { pagination }),
    },
  };
  return res.status(statusCode).json(responsePayload);
}

/**
 * Sends a standardized error API response.
 */
export function sendError(
  res: Response,
  statusCode: number,
  code: string,
  message: string,
  details?: ErrorDetail[]
): Response {
  const responsePayload: ErrorResponse = {
    success: false,
    error: {
      code,
      message,
      status: statusCode,
      ...(details && { details }),
    },
    meta: {
      timestamp: new Date().toISOString(),
      version: 'v1',
    },
  };
  return res.status(statusCode).json(responsePayload);
}

