import request from 'supertest';
import app from '../../../app';
import { AuthService } from '../service';
import { prisma } from '../../../config/prisma';

// Mock AuthService class methods
jest.mock('../service');
jest.mock('../../../config/prisma', () => ({
  prisma: {
    session: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

// Mock ioredis globally to prevent open connection handles
jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => {
    return {
      on: jest.fn(),
      ping: jest.fn().mockResolvedValue('PONG'),
      quit: jest.fn().mockResolvedValue('OK'),
    };
  });
});

describe('Auth Routes Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/v1/auth/register', () => {
    it('should successfully register a new user', async () => {
      const mockUser = {
        id: 'u-1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user',
        avatarUrl: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      (AuthService.prototype.getUserByEmail as jest.Mock).mockResolvedValue(null);
      (AuthService.prototype.registerUser as jest.Mock).mockResolvedValue(mockUser);
      (AuthService.prototype.createSession as jest.Mock).mockResolvedValue({
        rawRefreshToken: 'secure_refresh_token',
        expiresAt: new Date(Date.now() + 60000),
        sessionId: 'session-id-123',
      });
      (AuthService.prototype.generateAccessToken as jest.Mock).mockReturnValue('mocked_access_token');

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'P@ssword123',
        });

      expect(response.status).toBe(201);
      expect(response.headers['set-cookie']).toBeDefined();
      expect(response.body.success).toBe(true);
      expect(response.body.data.accessToken).toBe('mocked_access_token');
    });

    it('should prevent duplicate registration', async () => {
      (AuthService.prototype.getUserByEmail as jest.Mock).mockResolvedValue({ id: 'u-exists' });

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'P@ssword123',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('BAD_REQUEST');
      expect(response.body.error.message).toBe('An account with this email already exists.');
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login user successfully and issue refresh cookie', async () => {
      const mockDbUser = {
        id: 'u-1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user',
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        accounts: [{ password: 'hashedpassword' }],
      };

      (AuthService.prototype.getUserByEmail as jest.Mock).mockResolvedValue(mockDbUser);
      (AuthService.prototype.comparePassword as jest.Mock).mockResolvedValue(true);
      (AuthService.prototype.createSession as jest.Mock).mockResolvedValue({
        rawRefreshToken: 'secure_refresh_token',
        expiresAt: new Date(Date.now() + 60000),
        sessionId: 'session-id-123',
      });
      (AuthService.prototype.generateAccessToken as jest.Mock).mockReturnValue('mocked_access_token');

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'john@example.com',
          password: 'P@ssword123',
        });

      expect(response.status).toBe(200);
      expect(response.headers['set-cookie'][0]).toContain('refreshToken=secure_refresh_token');
      expect(response.body.success).toBe(true);
    });

    it('should reject invalid credentials with consistent messages', async () => {
      // Scenario A: User not found
      (AuthService.prototype.getUserByEmail as jest.Mock).mockResolvedValueOnce(null);

      const response1 = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'missing@example.com', password: 'password' });

      expect(response1.status).toBe(401);
      expect(response1.body.error.message).toBe('Invalid email or password.');

      // Scenario B: Password mismatch
      (AuthService.prototype.getUserByEmail as jest.Mock).mockResolvedValueOnce({
        accounts: [{ password: 'hash' }],
      });
      (AuthService.prototype.comparePassword as jest.Mock).mockResolvedValueOnce(false);

      const response2 = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'john@example.com', password: 'wrong' });

      expect(response2.status).toBe(401);
      expect(response2.body.error.message).toBe('Invalid email or password.');
    });
  });

  describe('POST /api/v1/auth/refresh', () => {
    it('should reject if refresh token is missing', async () => {
      const response = await request(app).post('/api/v1/auth/refresh');
      expect(response.status).toBe(401);
      expect(response.body.error.message).toBe('Refresh token is missing.');
    });

    it('should reject malformed or expired refresh token', async () => {
      (AuthService.prototype.rotateSession as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .post('/api/v1/auth/refresh')
        .set('Cookie', ['refreshToken=bad_token']);

      expect(response.status).toBe(401);
      expect(response.body.error.message).toBe('Invalid or expired refresh token.');
    });

    it('should rotate cookie and return new access token', async () => {
      (AuthService.prototype.rotateSession as jest.Mock).mockResolvedValue({
        rawRefreshToken: 'new_token',
        expiresAt: new Date(Date.now() + 60000),
        sessionId: 'session-123',
      });
      (prisma.session.findUnique as jest.Mock).mockResolvedValue({ userId: 'u-1' });
      (AuthService.prototype.getUserById as jest.Mock).mockResolvedValue({
        id: 'u-1',
        name: 'User',
        email: 'u@d.com',
        role: 'user',
      });
      (AuthService.prototype.generateAccessToken as jest.Mock).mockReturnValue('new_at');

      const response = await request(app)
        .post('/api/v1/auth/refresh')
        .set('Cookie', ['refreshToken=old_token']);

      expect(response.status).toBe(200);
      expect(response.headers['set-cookie'][0]).toContain('refreshToken=new_token');
      expect(response.body.data.accessToken).toBe('new_at');
    });

    it('should fail on refresh token reuse after rotation', async () => {
      // Re-submitting rotated token must resolve to null in database lookup
      (AuthService.prototype.rotateSession as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .post('/api/v1/auth/refresh')
        .set('Cookie', ['refreshToken=reused_token']);

      expect(response.status).toBe(401);
    });

    it('should handle concurrent refresh requests safely', async () => {
      // Simulate concurrent requests where first succeeds and second fails (returns null)
      (AuthService.prototype.rotateSession as jest.Mock)
        .mockResolvedValueOnce({
          rawRefreshToken: 'next_token',
          expiresAt: new Date(),
          sessionId: 's-1',
        })
        .mockResolvedValueOnce(null);

      (prisma.session.findUnique as jest.Mock).mockResolvedValue({ userId: 'u-1' });
      (AuthService.prototype.getUserById as jest.Mock).mockResolvedValue({ id: 'u-1', role: 'user' });

      const [res1, res2] = await Promise.all([
        request(app).post('/api/v1/auth/refresh').set('Cookie', ['refreshToken=token']),
        request(app).post('/api/v1/auth/refresh').set('Cookie', ['refreshToken=token']),
      ]);

      expect([res1.status, res2.status]).toContain(200);
      expect([res1.status, res2.status]).toContain(401);
    });
  });

  describe('GET /api/v1/auth/me', () => {
    it('should reject invalid JWT', async () => {
      (AuthService.prototype.verifyAccessToken as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid');
      });

      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', 'Bearer bad_jwt');

      expect(response.status).toBe(401);
    });

    it('should return profile for valid JWT', async () => {
      (AuthService.prototype.verifyAccessToken as jest.Mock).mockReturnValue({
        sub: 'u-1',
        email: 'john@example.com',
        role: 'user',
        sessionId: 's-123',
      });
      (AuthService.prototype.getUserById as jest.Mock).mockResolvedValue({
        id: 'u-1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user',
      });

      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', 'Bearer valid_jwt');

      expect(response.status).toBe(200);
      expect(response.body.data.user.email).toBe('john@example.com');
    });
  });

  describe('POST /api/v1/auth/logout', () => {
    it('should clear cookies and revoke session on logout', async () => {
      (AuthService.prototype.revokeSession as jest.Mock).mockResolvedValue(true);

      const response = await request(app)
        .post('/api/v1/auth/logout')
        .set('Cookie', ['refreshToken=active_token']);

      expect(response.status).toBe(200);
      // Verify cookie is cleared (hasMaxAge/expires in past)
      expect(response.headers['set-cookie'][0]).toContain('refreshToken=;');
    });
  });
});
