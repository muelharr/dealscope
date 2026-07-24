import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../modules/auth/service';
import { UserJwtClaims } from '../modules/auth/types';
import { sendError } from '../shared/utils/response';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: UserJwtClaims;
    }
  }
}

const authService = new AuthService();

/**
 * Authentication middleware that validates short-lived Access Tokens
 * passed via the Authorization header.
 */
export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      sendError(res, 401, 'UNAUTHORIZED', 'Access token is missing.');
      return;
    }

    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = authService.verifyAccessToken(token);
      req.user = decoded;
      next();
    } catch {
      sendError(res, 401, 'UNAUTHORIZED', 'Access token is invalid or expired.');
    }
  } catch (err) {
    sendError(
      res,
      500,
      'INTERNAL_SERVER_ERROR',
      err instanceof Error ? err.message : String(err)
    );
  }
}

/**
 * Role authorization middleware that asserts the authenticated user
 * has one of the allowed privileges.
 */
export function authorize(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, 401, 'UNAUTHORIZED', 'User session is not authenticated.');
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      sendError(
        res,
        403,
        'FORBIDDEN',
        'You do not have permission to access this resource.'
      );
      return;
    }

    next();
  };
}

