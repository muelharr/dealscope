import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthService } from '../service';
import { prisma } from '../../../config/prisma';
import { env } from '../../../config/env';
import { UserJwtClaims } from '../types';

jest.mock('../../../config/prisma', () => ({
  prisma: {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
    session: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    $transaction: jest.fn((callback) => callback(prisma)),
  },
}));

// Mock ioredis globally to prevent open connection handles during testing
jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => {
    return {
      on: jest.fn(),
      ping: jest.fn().mockResolvedValue('PONG'),
      quit: jest.fn().mockResolvedValue('OK'),
    };
  });
});

describe('AuthService Unit Tests', () => {
  let service: AuthService;

  beforeEach(() => {
    service = new AuthService();
    jest.clearAllMocks();
  });

  describe('Password Cryptography', () => {
    it('should hash password using 12 salt rounds', async () => {
      const password = 'My$ecurePassword1';
      const spy = jest.spyOn(bcrypt, 'hash');

      const hash = await service.hashPassword(password);
      expect(hash).toBeDefined();
      expect(spy).toHaveBeenCalledWith(password, 12);
      spy.mockRestore();
    });

    it('should correctly compare valid and invalid passwords', async () => {
      const password = 'My$ecurePassword1';
      const hash = await service.hashPassword(password);

      const isValid = await service.comparePassword(password, hash);
      const isInvalid = await service.comparePassword('wrong_pwd', hash);

      expect(isValid).toBe(true);
      expect(isInvalid).toBe(false);
    });
  });

  describe('JWT Access Token Generation', () => {
    it('should create a JWT with correct standard claims', () => {
      const claims = {
        sub: 'user-id-123',
        email: 'user@example.com',
        role: 'user',
        sessionId: 'session-uuid-456',
      };

      const token = service.generateAccessToken(claims);
      expect(token).toBeDefined();

      const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as UserJwtClaims & { iat: number; exp: number };
      expect(decoded.sub).toBe(claims.sub);
      expect(decoded.email).toBe(claims.email);
      expect(decoded.role).toBe(claims.role);
      expect(decoded.sessionId).toBe(claims.sessionId);
      expect(decoded.exp - decoded.iat).toBe(15 * 60); // 15 minutes expiry window
    });
  });

  describe('Refresh Token Generation & Hashing', () => {
    it('should generate a 64-character cryptographically secure token', () => {
      const token = service.generateRefreshToken();
      expect(token).toHaveLength(64);
      expect(/^[0-9a-f]{64}$/.test(token)).toBe(true);
    });

    it('should compute the correct SHA-256 hash', () => {
      const token = 'my-sample-refresh-token';
      const hash = service.hashToken(token);

      // Expected SHA-256 for 'my-sample-refresh-token'
      // -> 2aadbd8062cb93cd7b0fbc5e03b4211c9e33ce86a8a80092f71d87576b5f45e2
      expect(hash).toBe('2aadbd8062cb93cd7b0fbc5e03b4211c9e33ce86a8a80092f71d87576b5f45e2');
    });
  });

  describe('Session Management DB Operations', () => {
    it('should insert new session record in DB', async () => {
      const mockSession = {
        id: 'session-123',
        userId: 'user-123',
        refreshTokenHash: 'somehash',
        expiresAt: new Date(),
      };
      (prisma.session.create as jest.Mock).mockResolvedValue(mockSession);

      const result = await service.createSession('user-123', 'Agent', '127.0.0.1');

      expect(prisma.session.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: 'user-123',
            userAgent: 'Agent',
            ipAddress: '127.0.0.1',
          }),
        })
      );
      expect(result.sessionId).toBe(mockSession.id);
      expect(result.rawRefreshToken).toBeDefined();
    });

    it('should rotate session in a transaction when token is valid', async () => {
      const oldToken = service.generateRefreshToken();
      const oldHash = service.hashToken(oldToken);
      const mockSession = {
        id: 'session-123',
        userId: 'user-123',
        refreshTokenHash: oldHash,
        expiresAt: new Date(Date.now() + 100000),
        revokedAt: null,
      };

      (prisma.session.findUnique as jest.Mock).mockResolvedValue(mockSession);
      (prisma.session.update as jest.Mock).mockResolvedValue({
        id: 'session-123',
        userId: 'user-123',
      });

      const result = await service.rotateSession(oldToken, 'New Agent', '10.0.0.1');

      expect(result).not.toBeNull();
      expect(result?.rawRefreshToken).toBeDefined();
      expect(result?.sessionId).toBe('session-123');

      expect(prisma.session.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'session-123' },
          data: expect.objectContaining({
            userAgent: 'New Agent',
            ipAddress: '10.0.0.1',
          }),
        })
      );
    });

    it('should return null on rotation if session is revoked or expired', async () => {
      const oldToken = service.generateRefreshToken();

      // Scenario A: Revoked
      (prisma.session.findUnique as jest.Mock).mockResolvedValueOnce({
        id: 'session-123',
        revokedAt: new Date(),
        expiresAt: new Date(Date.now() + 100000),
      });
      const resRevoked = await service.rotateSession(oldToken);
      expect(resRevoked).toBeNull();

      // Scenario B: Expired
      (prisma.session.findUnique as jest.Mock).mockResolvedValueOnce({
        id: 'session-123',
        revokedAt: null,
        expiresAt: new Date(Date.now() - 1000),
      });
      const resExpired = await service.rotateSession(oldToken);
      expect(resExpired).toBeNull();
    });
  });
});
