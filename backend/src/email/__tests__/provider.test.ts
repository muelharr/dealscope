import { EmailProviderFactory, LogEmailProvider, ResendEmailProvider, SmtpEmailProvider } from '../provider';
import { env } from '../../config/env';

jest.mock('../../config/env', () => ({
  env: {
    EMAIL_PROVIDER: 'log',
    RESEND_API_KEY: 'test-resend-key',
    SMTP_HOST: 'smtp.example.com',
    SMTP_PORT: 587,
    SMTP_USER: 'testuser',
    SMTP_PASS: 'testpass',
    SMTP_SECURE: false,
  },
}));

describe('EmailProviderFactory', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should create LogEmailProvider when EMAIL_PROVIDER is set to log', () => {
    env.EMAIL_PROVIDER = 'log';
    const provider = EmailProviderFactory.createProvider();
    expect(provider).toBeInstanceOf(LogEmailProvider);
  });

  it('should create ResendEmailProvider when EMAIL_PROVIDER is set to resend', () => {
    env.EMAIL_PROVIDER = 'resend';
    env.RESEND_API_KEY = 'mock-key';
    const provider = EmailProviderFactory.createProvider();
    expect(provider).toBeInstanceOf(ResendEmailProvider);
  });

  it('should create SmtpEmailProvider when EMAIL_PROVIDER is set to smtp', () => {
    env.EMAIL_PROVIDER = 'smtp';
    env.SMTP_HOST = 'smtp.example.com';
    const provider = EmailProviderFactory.createProvider();
    expect(provider).toBeInstanceOf(SmtpEmailProvider);
  });

  it('should default to LogEmailProvider if provider type is unknown', () => {
    env.EMAIL_PROVIDER = 'invalid-provider';
    const provider = EmailProviderFactory.createProvider();
    expect(provider).toBeInstanceOf(LogEmailProvider);
  });
});
