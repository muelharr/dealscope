import { Request, Response } from 'express';
import { AuthController } from '../controller';
import { AuthService } from '../service';
import { prisma } from '../../../config/prisma';

jest.mock('../service');
jest.mock('../../../config/prisma', () => ({
  prisma: {
    session: {
      findUnique: jest.fn(),
    },
  },
}));

// Mock ioredis globally
jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => {
    return {
      on: jest.fn(),
      ping: jest.fn().mockResolvedValue('PONG'),
      quit: jest.fn().mockResolvedValue('OK'),
    };
  });
});

describe('AuthController Unit Tests', () => {
  let controller: AuthController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;
  let cookieMock: jest.Mock;
  let clearCookieMock: jest.Mock;

  beforeEach(() => {
    controller = new AuthController();
    jsonMock = jest.fn();
    statusMock = jest.fn().mockImplementation(() => mockResponse);
    cookieMock = jest.fn();
    clearCookieMock = jest.fn();

    mockResponse = {
      status: statusMock,
      json: jsonMock,
      cookie: cookieMock,
      clearCookie: clearCookieMock,
    };

    mockRequest = {
      body: {},
      headers: {},
      cookies: {},
      ip: '127.0.0.1',
    };

    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a user and set cookie', async () => {
      mockRequest.body = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'P@ssword123',
      };

      const mockUser = {
        id: 'u-1',
        name: 'Jane Doe',
        email: 'jane@example.com',
        role: 'user',
        avatarUrl: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      (AuthService.prototype.getUserByEmail as jest.Mock).mockResolvedValue(null);
      (AuthService.prototype.registerUser as jest.Mock).mockResolvedValue(mockUser);
      (AuthService.prototype.createSession as jest.Mock).mockResolvedValue({
        rawRefreshToken: 'rt-123',
        expiresAt: new Date(),
        sessionId: 's-123',
      });
      (AuthService.prototype.generateAccessToken as jest.Mock).mockReturnValue('at-123');

      await controller.register(mockRequest as Request, mockResponse as Response);

      expect(AuthService.prototype.getUserByEmail).toHaveBeenCalledWith('jane@example.com');
      expect(AuthService.prototype.registerUser).toHaveBeenCalledWith('Jane Doe', 'jane@example.com', 'P@ssword123');
      expect(cookieMock).toHaveBeenCalledWith('refreshToken', 'rt-123', expect.any(Object));
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            accessToken: 'at-123',
            user: mockUser,
          }),
        })
      );
    });

    it('should fail registration if email already exists', async () => {
      mockRequest.body = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'P@ssword123',
      };

      (AuthService.prototype.getUserByEmail as jest.Mock).mockResolvedValue({ id: 'existing' });

      await controller.register(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            code: 'BAD_REQUEST',
            message: 'An account with this email already exists.',
          }),
        })
      );
    });
  });

  describe('login', () => {
    it('should authenticate user and set cookie on login', async () => {
      mockRequest.body = {
        email: 'jane@example.com',
        password: 'P@ssword123',
      };

      const mockDbUser = {
        id: 'u-1',
        name: 'Jane Doe',
        email: 'jane@example.com',
        role: 'user',
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        accounts: [{ password: 'hashedpassword' }],
      };

      (AuthService.prototype.getUserByEmail as jest.Mock).mockResolvedValue(mockDbUser);
      (AuthService.prototype.comparePassword as jest.Mock).mockResolvedValue(true);
      (AuthService.prototype.createSession as jest.Mock).mockResolvedValue({
        rawRefreshToken: 'rt-123',
        expiresAt: new Date(),
        sessionId: 's-123',
      });
      (AuthService.prototype.generateAccessToken as jest.Mock).mockReturnValue('at-123');

      await controller.login(mockRequest as Request, mockResponse as Response);

      expect(AuthService.prototype.comparePassword).toHaveBeenCalledWith('P@ssword123', 'hashedpassword');
      expect(cookieMock).toHaveBeenCalledWith('refreshToken', 'rt-123', expect.any(Object));
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            accessToken: 'at-123',
          }),
        })
      );
    });

    it('should return 401 on bad password', async () => {
      mockRequest.body = {
        email: 'jane@example.com',
        password: 'wrong_password',
      };

      const mockDbUser = {
        accounts: [{ password: 'hashedpassword' }],
      };

      (AuthService.prototype.getUserByEmail as jest.Mock).mockResolvedValue(mockDbUser);
      (AuthService.prototype.comparePassword as jest.Mock).mockResolvedValue(false);

      await controller.login(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            code: 'UNAUTHORIZED',
            message: 'Invalid email or password.',
          }),
        })
      );
    });
  });

  describe('refresh', () => {
    it('should return 401 if refresh cookie is missing', async () => {
      mockRequest.cookies = {};

      await controller.refresh(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({ code: 'UNAUTHORIZED', message: 'Refresh token is missing.' }),
        })
      );
    });

    it('should rotate cookies and issue a new token when valid', async () => {
      mockRequest.cookies = { refreshToken: 'old-rt' };

      (AuthService.prototype.rotateSession as jest.Mock).mockResolvedValue({
        rawRefreshToken: 'new-rt',
        expiresAt: new Date(),
        sessionId: 's-123',
      });
      (prisma.session.findUnique as jest.Mock).mockResolvedValue({ userId: 'u-1' });
      (AuthService.prototype.getUserById as jest.Mock).mockResolvedValue({
        id: 'u-1',
        email: 'u@example.com',
        role: 'user',
      });
      (AuthService.prototype.generateAccessToken as jest.Mock).mockReturnValue('new-at');

      await controller.refresh(mockRequest as Request, mockResponse as Response);

      expect(AuthService.prototype.rotateSession).toHaveBeenCalledWith('old-rt', undefined, '127.0.0.1');
      expect(cookieMock).toHaveBeenCalledWith('refreshToken', 'new-rt', expect.any(Object));
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({ accessToken: 'new-at' }),
        })
      );
    });
  });

  describe('logout', () => {
    it('should revoke session and clear cookie', async () => {
      mockRequest.cookies = { refreshToken: 'rt-123' };

      await controller.logout(mockRequest as Request, mockResponse as Response);

      expect(AuthService.prototype.revokeSession).toHaveBeenCalledWith('rt-123');
      expect(clearCookieMock).toHaveBeenCalledWith('refreshToken', expect.any(Object));
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
        })
      );
    });
  });
});
