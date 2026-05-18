import { PaginatedResult, PaginationQuery } from '../types/index';

export interface ParsedPagination {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  order: 1 | -1;
}

/**
 * Parse raw query string pagination params into safe, bounded numbers.
 * Defaults: page=1, limit=20, sortBy='createdAt', order='desc'
 */
export const parsePagination = (
  query: PaginationQuery,
  maxLimit = 100,
): ParsedPagination => {
  const page = Math.max(1, parseInt(query.page ?? '1', 10));
  const limit = Math.min(maxLimit, Math.max(1, parseInt(query.limit ?? '10', 10)));
  const skip = (page - 1) * limit;
  const sortBy = query.sortBy ?? 'createdAt';
  const order: 1 | -1 = query.order === 'asc' ? 1 : -1;

  return { page, limit, skip, sortBy, order };
};

/**
 * Shape a Mongoose query result into a typed paginated envelope.
 */
export const buildPaginatedResult = <T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
): PaginatedResult<T> => ({
  data,
  total,
  page,
  limit,
  totalPages: Math.ceil(total / limit),
});
