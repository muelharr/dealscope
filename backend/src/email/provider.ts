import { logger } from '../shared/utils/logger';
import { createId } from '@paralleldrive/cuid2';
import { EmailResult, EmailResultStatus, SendEmailParams } from './types';
import { env } from '../config/env';
import { Resend } from 'resend';
import nodemailer from 'nodemailer';

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
      providerMessageId: `mock-${createId()}`,
      providerResponse: {
        message: 'Email logged to console successfully.',
        timestamp: new Date().toISOString(),
      },
    };
  }
}

/**
 * An email provider that sends emails using the Resend service.
 */
export class ResendEmailProvider implements EmailProvider {
  private resend: Resend;

  constructor() {
    const apiKey = env.RESEND_API_KEY || process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY environment variable is required for ResendEmailProvider');
    }
    this.resend = new Resend(apiKey);
  }

  async sendEmail(params: SendEmailParams): Promise<EmailResult> {
    try {
      const fromEmail = params.from
        ? `${params.from.name} <${params.from.email}>`
        : 'DealScope <noreply@dealscope.com>';

      const { data, error } = await this.resend.emails.send({
        from: fromEmail,
        to: [params.to],
        subject: params.subject,
        html: params.htmlBody,
        attachments: params.attachments?.map((att) => ({
          filename: att.filename,
          content: typeof att.content === 'string' ? att.content : att.content.toString('base64'),
        })),
      });

      if (error) {
        return {
          status: EmailResultStatus.PERMANENT_FAILURE,
          errorMessage: error.message,
        };
      }

      return {
        status: EmailResultStatus.SUCCESS,
        providerMessageId: data?.id,
        providerResponse: data,
      };
    } catch (err: unknown) {
      return {
        status: EmailResultStatus.TRANSIENT_FAILURE,
        errorMessage: err instanceof Error ? err.message : String(err),
      };
    }
  }
}

/**
 * An email provider that sends emails using SMTP.
 */
export class SmtpEmailProvider implements EmailProvider {
  private transporter: nodemailer.Transporter;

  constructor() {
    const host = env.SMTP_HOST || process.env.SMTP_HOST;
    const port = env.SMTP_PORT || (process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587);
    const user = env.SMTP_USER || process.env.SMTP_USER;
    const pass = env.SMTP_PASS || process.env.SMTP_PASS;
    const secure = env.SMTP_SECURE || process.env.SMTP_SECURE === 'true';

    if (!host) {
      throw new Error('SMTP_HOST environment variable is required for SmtpEmailProvider');
    }

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: user && pass ? { user, pass } : undefined,
    });
  }

  async sendEmail(params: SendEmailParams): Promise<EmailResult> {
    try {
      const fromEmail = params.from
        ? `${params.from.name} <${params.from.email}>`
        : 'DealScope <noreply@dealscope.com>';

      const info = await this.transporter.sendMail({
        from: fromEmail,
        to: params.to,
        subject: params.subject,
        html: params.htmlBody,
        attachments: params.attachments?.map((att) => ({
          filename: att.filename,
          content: att.content,
        })),
      });

      return {
        status: EmailResultStatus.SUCCESS,
        providerMessageId: info.messageId,
        providerResponse: info,
      };
    } catch (err: unknown) {
      return {
        status: EmailResultStatus.TRANSIENT_FAILURE,
        errorMessage: err instanceof Error ? err.message : String(err),
      };
    }
  }
}

/**
 * A factory responsible for creating the correct email provider instance
 * based on the application's configuration.
 */
export class EmailProviderFactory {
  static createProvider(): EmailProvider {
    const providerType = env.EMAIL_PROVIDER || process.env.EMAIL_PROVIDER || 'log';

    switch (providerType) {
      case 'resend':
        return new ResendEmailProvider();
      case 'smtp':
        return new SmtpEmailProvider();
      case 'log':
      default:
        logger.info('Using LogEmailProvider. Emails will be printed to the console.');
        return new LogEmailProvider();
    }
  }
}
