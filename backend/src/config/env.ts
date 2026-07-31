import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().transform((val) => parseInt(val, 10)).default('4000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  ALLOWED_ORIGINS: z.string().default('http://localhost:3000'),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url().default('redis://localhost:6379'),
  JWT_ACCESS_SECRET: z.string().default('dealscope-access-token-default-secret-key-123456!'),
  JWT_REFRESH_SECRET: z.string().default('dealscope-refresh-token-default-secret-key-654321!'),
  EMAIL_PROVIDER: z.string().default('log'),
  RESEND_API_KEY: z.string().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional().transform((val) => (val ? parseInt(val, 10) : undefined)),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_SECURE: z.string().optional().transform((val) => val === 'true'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  process.stderr.write('❌ Invalid environment configuration: ' + JSON.stringify(_env.error.format(), null, 2) + '\n');
  process.exit(1);
}

export const env = _env.data;
export type Env = z.infer<typeof envSchema>;
