import { ValidationError } from './ValidationError';

export interface ApiError {
  code: number;
  message: string;
  details?: string;
  validationErrors?: ValidationError[];
}
