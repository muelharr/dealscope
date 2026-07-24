import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import logger from '../shared/utils/logger';
import { sendError, ErrorDetail } from '../shared/utils/response';
import { mapPrismaError } from '../shared/utils/prismaErrors';

/**
 * Global Express Error Handling Middleware.
 * Captures Zod, Prisma, and generic runtime exceptions, translating them to the standard REST contract.
 */
export function errorHandlerMiddleware(
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  const requestId = req.requestId;
  
  // Log internal error with trace details
  logger.error('Unhandled request exception:', { 
    error: err instanceof Error ? err.stack : err,
    requestId,
    url: req.originalUrl,
    method: req.method,
  });

  // 1. Handle Zod Validation Errors
  if (err instanceof ZodError) {
    const details: ErrorDetail[] = err.errors.map((e) => ({
      field: String(e.path.join('.')),
      message: e.message,
    }));
    sendError(res, 400, 'BAD_REQUEST', 'Validation failed.', details);
    return;
  }

  // 2. Handle Prisma Client Known Request Errors
  const prismaError = mapPrismaError(err);
  if (prismaError) {
    sendError(
      res,
      prismaError.statusCode,
      prismaError.code,
      prismaError.message,
      prismaError.details
    );
    return;
  }

  // 3. Custom API Error (if it matches code / status pattern)
  const isCustomError = 
    err && 
    typeof err === 'object' && 
    'statusCode' in err && 
    'code' in err && 
    'message' in err;
    
  if (isCustomError) {
    const customErr = err as { statusCode: number; code: string; message: string; details?: ErrorDetail[] };
    sendError(res, customErr.statusCode, customErr.code, customErr.message, customErr.details);
    return;
  }

  // 4. Fallback Default: 500 Internal Server Error
  sendError(
    res,
    500,
    'INTERNAL_SERVER_ERROR',
    'An unexpected internal server error occurred.'
  );
}

export default errorHandlerMiddleware;
