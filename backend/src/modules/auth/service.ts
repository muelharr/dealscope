import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { User, Account } from '@prisma/client';
import { env } from '../../config/env';
import { prisma } from '../../config/prisma';
import { UserJwtClaims, UserResponse } from './types';

export class AuthService {
  public async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  public async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  public generateAccessToken(claims: Omit<UserJwtClaims, 'iat' | 'exp'>): string {
    return jwt.sign(claims, env.JWT_ACCESS_SECRET, {
      expiresIn: '15m',
    });
  }

  public generateRefreshToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  public hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

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

      if (!session || session.revokedAt || (session.expiresAt && session.expiresAt < new Date())) {
        return null;
      }

      const newRawRefreshToken = this.generateRefreshToken();
      const newHash = this.hashToken(newRawRefreshToken);
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

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

  public verifyAccessToken(token: string): UserJwtClaims {
    return jwt.verify(token, env.JWT_ACCESS_SECRET) as UserJwtClaims;
  }

  public async getUserById(id: string): Promise<UserResponse | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!user) return null;
    return {
      id: user.id,
      name: user.name || '',
      email: user.email,
      avatarUrl: user.image,
      role: user.role as 'user' | 'admin',
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  public async getUserByEmail(email: string): Promise<(User & { accounts: Account[] }) | null> {
    return prisma.user.findUnique({
      where: { email },
      include: {
        accounts: {
          where: { provider: 'credentials' },
        },
      },
    });
  }

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
            type: 'credentials',
            provider: 'credentials',
            providerAccountId: email,
            password: hashedPassword,
          },
        },
      },
    });

    return {
      id: user.id,
      name: user.name || '',
      email: user.email,
      avatarUrl: user.image,
      role: user.role as 'user' | 'admin',
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  public async updateProfile(userId: string, name?: string, email?: string): Promise<UserResponse> {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(email && { email }),
      },
    });

    return {
      id: user.id,
      name: user.name || '',
      email: user.email,
      avatarUrl: user.image,
      role: user.role as 'user' | 'admin',
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  public async updatePassword(userId: string, newPasswordPlain: string): Promise<void> {
    const hashedPassword = await this.hashPassword(newPasswordPlain);
    
    // Find the credentials account
    const account = await prisma.account.findFirst({
      where: { userId, provider: 'credentials' },
    });

    if (account) {
      await prisma.account.update({
        where: { id: account.id },
        data: { password: hashedPassword },
      });
    } else {
      // In case they didn't have a credential account (e.g. OAuth only), though our system uses credentials
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user) {
        await prisma.account.create({
          data: {
            userId,
            type: 'credentials',
            provider: 'credentials',
            providerAccountId: user.email,
            password: hashedPassword,
          },
        });
      }
    }
  }
}
