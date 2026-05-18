/**
 * Shared TypeScript types used across the entire server.
 */

// ─── Domain Types ────────────────────────────────────────────────────────────

export type UserRole = 'admin' | 'sales';

// ─── Auth Types ───────────────────────────────────────────────────────────────

/** Shape of the JWT payload — signed into the token and decoded on each request. */
export interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
}

/** Safe user shape returned in API responses (password excluded). */
export interface IUserResponse {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

/** Shape returned by register and login endpoints. */
export interface AuthResponse {
  user: IUserResponse;
  token: string;
}

// ─── Pagination Types ────────────────────────────────────────────────────────

/** Generic paginated result wrapper. */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/** Query parameters for pagination and sorting. */
export interface PaginationQuery {
  page?: string;
  limit?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}
