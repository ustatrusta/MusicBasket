import { ContentStatus } from '../enums';
import { Song } from '../entities';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface SongListQuery {
  page?: number;
  limit?: number;
  q?: string;
  sort?: 'newest' | 'views' | 'alphabetical';
  status?: ContentStatus;
}

export interface SongListResponse extends PaginatedResponse<Song> {}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
