import { Prisma } from '@prisma/client';
import { ErrorDetail } from './response';

export interface MappedPrismaError {
  statusCode: number;
  code: string;
  message: string;
  details?: ErrorDetail[];
}

/**
 * Maps a Prisma client database error to a standard API error code and status code.
 */
export function mapPrismaError(error: unknown): MappedPrismaError | null {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
    return null;
  }

  switch (error.code) {
    case 'P2002': {
      // Unique constraint failed
      const targets = error.meta?.target as string[] | undefined;
      const details: ErrorDetail[] = targets
        ? targets.map((field) => ({
            field,
            message: `Unique constraint failed on field: ${field}`,
          }))
        : [];
      return {
        statusCode: 400,
        code: 'BAD_REQUEST',
        message: 'Unique constraint validation failed.',
        details,
      };
    }

    case 'P2003': {
      // Foreign key constraint failed
      const field = error.meta?.field_name as string | undefined;
      return {
        statusCode: 400,
        code: 'BAD_REQUEST',
        message: 'Foreign key constraint validation failed.',
        details: field
          ? [
              {
                field,
                message: `Referenced entity does not exist or relation is violated.`,
              },
            ]
          : undefined,
      };
    }

    case 'P2025': {
      // Record not found
      return {
        statusCode: 404,
        code: 'NOT_FOUND',
        message: error.meta?.cause as string || 'The requested resource was not found.',
      };
    }

    default:
      return {
        statusCode: 500,
        code: 'INTERNAL_SERVER_ERROR',
        message: `Database error occurred (Code: ${error.code}).`,
      };
  }
}
