import { logger } from '../shared/utils/logger';
import { cuid } from '@paralleldrive/cuid2';
import { EmailResult, EmailResultStatus, SendEmailParams } from './types';

/**
 * Abstract interface for an email sending provider.
 */
export interface EmailProvider {
  sendEmail(params: SendEmailParams): Promise<EmailResult>;
}

/**
 * A mock provider that logs emails to the console instead of sending them.
 * Used for development, testing, and as a safe default.
 */
export class LogEmailProvider implements EmailProvider {
  async sendEmail(params: SendEmailParams): Promise<EmailResult> {
    logger.info({
      message: `[LogEmailProvider] Sending email`,
      to: params.to,
      subject: params.subject,
      attachments: params.attachments?.length || 0,
    });

    // Simulate a successful delivery
    return {
      status: EmailResultStatus.SUCCESS,
      providerMessageId: `mock-${cuid()}`,
      providerResponse: {
        message: 'Email logged to console successfully.',
        timestamp: new Date().toISOString(),
      },
    };
  }
}

/**
 * A factory responsible for creating the correct email provider instance
 * based on the application's configuration.
 */
export class EmailProviderFactory {
  static createProvider(): EmailProvider {
    const providerType = process.env.EMAIL_PROVIDER || 'log';

    switch (providerType) {
      // case 'resend':
      //   return new ResendEmailProvider();
      // case 'smtp':
      //   return new SmtpEmailProvider();
      case 'log':
      default:
        logger.info('Using LogEmailProvider. Emails will be printed to the console.');
        return new LogEmailProvider();
    }
  }
}
