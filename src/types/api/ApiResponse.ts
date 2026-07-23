import { ApiMeta } from './ApiMeta';
import { ApiError } from './ApiError';

export interface ApiResponse<T> {
  data: T;
  meta: ApiMeta;
  error?: ApiError;
}
