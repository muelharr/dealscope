import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { User, Account } from '@prisma/client';
import { env } from '../../config/env';
import { prisma } from '../../config/prisma';
import { UserJwtClaims, UserResponse } from './types';

export class AuthService {
  /**
   * Hashes a password using bcrypt with 12 salt rounds.
   */
  public async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  /**
   * Compares a plain text password with its stored bcrypt hash.
   */
  public async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Generates a short-lived access token containing claims.
   */
  public generateAccessToken(claims: Omit<UserJwtClaims, 'iat' | 'exp'>): string {
    return jwt.sign(claims, env.JWT_ACCESS_SECRET, {
      expiresIn: '15m',
    });
  }

  /**
   * Generates a cryptographically secure refresh token.
   */
  public generateRefreshToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Computes the SHA-256 hash of a refresh token.
   */
  public hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  /**
   * Creates a new session in the database and returns the raw refresh token.
   */
  public async createSession(
    userId: string,
    userAgent?: string,
    ipAddress?: string
  ): Promise<{ rawRefreshToken: string; expiresAt: Date; sessionId: string }> {
    const rawRefreshToken = this.generateRefreshToken();
    const refreshTokenHash = this.hashToken(rawRefreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const session = await prisma.session.create({
      data: {
        userId,
        refreshTokenHash,
        userAgent,
        ipAddress,
        expiresAt,
      },
    });

    return {
      rawRefreshToken,
      expiresAt,
      sessionId: session.id,
    };
  }

  /**
   * Rotates a session: verifies old token hash, updates it to a new one,
   * updates lastUsedAt explicitly in a single transaction.
   */
  public async rotateSession(
    rawRefreshToken: string,
    userAgent?: string,
    ipAddress?: string
  ): Promise<{ rawRefreshToken: string; expiresAt: Date; sessionId: string } | null> {
    const oldHash = this.hashToken(rawRefreshToken);

    return prisma.$transaction(async (tx) => {
      const session = await tx.session.findUnique({
        where: { refreshTokenHash: oldHash },
      });

      if (!session || session.revokedAt || session.expiresAt < new Date()) {
        return null;
      }

      const newRawRefreshToken = this.generateRefreshToken();
      const newHash = this.hashToken(newRawRefreshToken);
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Extend by 7 days

      const updated = await tx.session.update({
        where: { id: session.id },
        data: {
          refreshTokenHash: newHash,
          lastUsedAt: new Date(),
          expiresAt,
          ipAddress: ipAddress ?? session.ipAddress,
          userAgent: userAgent ?? session.userAgent,
        },
      });

      return {
        rawRefreshToken: newRawRefreshToken,
        expiresAt,
        sessionId: updated.id,
      };
    });
  }

  /**
   * Revokes a session by marking its revokedAt timestamp.
   */
  public async revokeSession(rawRefreshToken: string): Promise<boolean> {
    const hash = this.hashToken(rawRefreshToken);
    try {
      await prisma.session.update({
        where: { refreshTokenHash: hash },
        data: { revokedAt: new Date() },
      });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Verifies an access token and returns its decoded claims.
   */
  public verifyAccessToken(token: string): UserJwtClaims {
    return jwt.verify(token, env.JWT_ACCESS_SECRET) as UserJwtClaims;
  }

  /**
   * Fetches user profile matching a user ID.
   */
  public async getUserById(id: string): Promise<UserResponse | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!user) return null;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.image,
      role: user.role as 'user' | 'admin',
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  /**
   * Fetches user profile along with credentials account matching email.
   */
  public async getUserByEmail(email: string): Promise<(User & { accounts: Account[] }) | null> {
    return prisma.user.findUnique({
      where: { email },
      include: {
        accounts: {
          where: { providerId: 'credentials' },
        },
      },
    });
  }

  /**
   * Registers a user and hashes their credentials inside a transaction.
   */
  public async registerUser(
    name: string,
    email: string,
    passwordPlain: string
  ): Promise<UserResponse> {
    const hashedPassword = await this.hashPassword(passwordPlain);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        role: 'user',
        accounts: {
          create: {
            accountId: email,
            providerId: 'credentials',
            password: hashedPassword,
          },
        },
      },
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.image,
      role: user.role as 'user' | 'admin',
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}

