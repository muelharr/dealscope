import { ApiResponse } from './ApiResponse';
import { Pagination } from './Pagination';

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: Pagination;
}
