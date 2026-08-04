import { Request, Response } from 'express';
import { AuthService } from './service';
import { sendSuccess, sendError } from '../../shared/utils/response';
import { env } from '../../config/env';
import { prisma } from '../../config/prisma';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * Registers a new user account, initializes session, and sets refresh token cookie.
   */
  public register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, email, password } = req.body;

      // Check if user already exists
      const existingUser = await this.authService.getUserByEmail(email);
      if (existingUser) {
        sendError(res, 400, 'BAD_REQUEST', 'An account with this email already exists.');
        return;
      }

      // Create new user profile and accounts entry
      const user = await this.authService.registerUser(name, email, password);

      sendSuccess(res, { user }, 201);
    } catch (err) {
      sendError(
        res,
        500,
        'INTERNAL_SERVER_ERROR',
        err instanceof Error ? err.message : String(err)
      );
    }
  };

  /**
   * Authenticates user credentials, initializes session, and sets refresh token cookie.
   */
  public login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      const userRecord = await this.authService.getUserByEmail(email);
      if (!userRecord) {
        sendError(res, 401, 'UNAUTHORIZED', 'Invalid email or password.');
        return;
      }

      const credentialsAccount = userRecord.accounts[0];
      if (!credentialsAccount || !credentialsAccount.password) {
        sendError(res, 401, 'UNAUTHORIZED', 'Invalid email or password.');
        return;
      }

      const isPasswordMatch = await this.authService.comparePassword(
        password,
        credentialsAccount.password
      );
      if (!isPasswordMatch) {
        sendError(res, 401, 'UNAUTHORIZED', 'Invalid email or password.');
        return;
      }

      const user = {
        id: userRecord.id,
        name: userRecord.name,
        email: userRecord.email,
        avatarUrl: userRecord.image,
        role: userRecord.role as 'user' | 'admin',
        createdAt: userRecord.createdAt.toISOString(),
        updatedAt: userRecord.updatedAt.toISOString(),
      };

      const userAgent = req.headers['user-agent'];
      const ipAddress = req.ip;
      const { rawRefreshToken, expiresAt, sessionId } = await this.authService.createSession(
        user.id,
        userAgent,
        ipAddress
      );

      res.cookie('refreshToken', rawRefreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/api/v1/auth',
        expires: expiresAt,
      });

      const accessToken = this.authService.generateAccessToken({
        sub: user.id,
        userId: user.id,
        email: user.email,
        role: user.role,
        sessionId,
      });

      sendSuccess(res, { user, accessToken });
    } catch (err) {
      sendError(
        res,
        500,
        'INTERNAL_SERVER_ERROR',
        err instanceof Error ? err.message : String(err)
      );
    }
  };

  /**
   * Refreshes JWT access token and rotates the refresh token session.
   */
  public refresh = async (req: Request, res: Response): Promise<void> => {
    try {
      const refreshToken = req.cookies?.refreshToken;

      if (!refreshToken) {
        sendError(res, 401, 'UNAUTHORIZED', 'Refresh token is missing.');
        return;
      }

      const userAgent = req.headers['user-agent'];
      const ipAddress = req.ip;

      const rotated = await this.authService.rotateSession(
        refreshToken,
        userAgent,
        ipAddress
      );

      if (!rotated) {
        sendError(res, 401, 'UNAUTHORIZED', 'Invalid or expired refresh token.');
        return;
      }

      // Find user details matching the rotated session's userId
      const sessionData = await prisma.session.findUnique({
        where: { id: rotated.sessionId },
      });
      if (!sessionData) {
        sendError(res, 401, 'UNAUTHORIZED', 'Invalid or expired refresh token.');
        return;
      }

      const user = await this.authService.getUserById(sessionData.userId);
      if (!user) {
        sendError(res, 401, 'UNAUTHORIZED', 'Invalid or expired refresh token.');
        return;
      }

      res.cookie('refreshToken', rotated.rawRefreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/api/v1/auth',
        expires: rotated.expiresAt,
      });

      const accessToken = this.authService.generateAccessToken({
        sub: user.id,
        userId: user.id,
        email: user.email,
        role: user.role,
        sessionId: rotated.sessionId,
      });

      sendSuccess(res, { user, accessToken });
    } catch (err) {
      sendError(
        res,
        500,
        'INTERNAL_SERVER_ERROR',
        err instanceof Error ? err.message : String(err)
      );
    }
  };

  /**
   * Revokes user session and deletes the refresh token cookie.
   */
  public logout = async (req: Request, res: Response): Promise<void> => {
    try {
      const refreshToken = req.cookies?.refreshToken;

      if (refreshToken) {
        await this.authService.revokeSession(refreshToken);
      }

      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/api/v1/auth',
      });

      sendSuccess(res, { message: 'Logged out successfully.' });
    } catch (err) {
      sendError(
        res,
        500,
        'INTERNAL_SERVER_ERROR',
        err instanceof Error ? err.message : String(err)
      );
    }
  };

  /**
   * Retrieves profile details for currently authenticated user session.
   */
  public me = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 401, 'UNAUTHORIZED', 'User session is not authenticated.');
        return;
      }

      const user = await this.authService.getUserById(req.user.sub);
      if (!user) {
        sendError(res, 404, 'NOT_FOUND', 'User profile not found.');
        return;
      }

      sendSuccess(res, { user });
    } catch (err) {
      sendError(
        res,
        500,
        'INTERNAL_SERVER_ERROR',
        err instanceof Error ? err.message : String(err)
      );
    }
  };

  /**
   * Updates user profile details.
   */
  public updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 401, 'UNAUTHORIZED', 'User session is not authenticated.');
        return;
      }

      const { name, email } = req.body;
      
      // If email is changed, check if it's already taken
      if (email) {
        const existingUser = await this.authService.getUserByEmail(email);
        if (existingUser && existingUser.id !== req.user.sub) {
          sendError(res, 400, 'BAD_REQUEST', 'Email is already in use by another account.');
          return;
        }
      }

      const updatedUser = await this.authService.updateProfile(req.user.sub, name, email);
      sendSuccess(res, { user: updatedUser, message: 'Profile updated successfully.' });
    } catch (err) {
      sendError(
        res,
        500,
        'INTERNAL_SERVER_ERROR',
        err instanceof Error ? err.message : String(err)
      );
    }
  };

  /**
   * Changes user password.
   */
  public changePassword = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 401, 'UNAUTHORIZED', 'User session is not authenticated.');
        return;
      }

      const { currentPassword, newPassword } = req.body;
      
      const userRecord = await prisma.user.findUnique({
        where: { id: req.user.sub },
        include: { accounts: { where: { provider: 'credentials' } } },
      });

      if (!userRecord || !userRecord.accounts[0]) {
        sendError(res, 400, 'BAD_REQUEST', 'Cannot change password for this account type.');
        return;
      }

      const isPasswordMatch = await this.authService.comparePassword(
        currentPassword,
        userRecord.accounts[0].password!
      );

      if (!isPasswordMatch) {
        sendError(res, 400, 'BAD_REQUEST', 'Incorrect current password.');
        return;
      }

      await this.authService.updatePassword(req.user.sub, newPassword);
      sendSuccess(res, { message: 'Password changed successfully.' });
    } catch (err) {
      sendError(
        res,
        500,
        'INTERNAL_SERVER_ERROR',
        err instanceof Error ? err.message : String(err)
      );
    }
  };
}

