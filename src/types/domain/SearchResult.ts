import { Product } from './Product';

export interface SearchResult {
  query: string;
  results: Product[];
  total: number;
  page: number;
  pageSize: number;
}
