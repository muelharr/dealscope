import { Buffer } from 'buffer';

export enum EmailResultStatus {
  SUCCESS = 'SUCCESS',
  TRANSIENT_FAILURE = 'TRANSIENT_FAILURE',
  PERMANENT_FAILURE = 'PERMANENT_FAILURE',
}

export interface EmailResult {
  status: EmailResultStatus;
  providerMessageId?: string;
  providerResponse?: any;
  errorCode?: string;
  errorMessage?: string;
}

export interface EmailAttachment {
  filename: string;
  content: Buffer | string;
  contentType?: string;
}

export interface SendEmailParams {
  to: string;
  subject: string;
  htmlBody: string;
  from?: { name: string; email: string };
  attachments?: EmailAttachment[];
}
