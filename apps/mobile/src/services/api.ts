import * as SecureStore from 'expo-secure-store';
import { PaginatedResponse, Song } from '@muzik-sepeti/shared';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:3001/api/v1';
const ACCESS_TOKEN_KEY = 'ms_access_token';
const REFRESH_TOKEN_KEY = 'ms_refresh_token';

async function getAccessToken(): Promise<string | null> {
  return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await getAccessToken();
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {})
    }
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return (await res.json()) as T;
}

export const apiClient = {
  async saveTokens(accessToken: string, refreshToken: string): Promise<void> {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
  },
  async clearTokens(): Promise<void> {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  },
  getTrendingSongs: () => request<unknown[]>('/trending/songs'),
  getNewestSongs: () => request<PaginatedResponse<Song>>('/songs?sort=newest'),
  getSongs: (page = 1, q = '') => request<PaginatedResponse<Song>>(`/songs?page=${page}&q=${encodeURIComponent(q)}`),
  getInstruments: () => request<unknown[]>('/instruments'),
  getFavorites: () => request<unknown[]>('/favorites'),
  addFavorite: (songId: string) => request('/favorites', { method: 'POST', body: JSON.stringify({ songId }) }),
  removeFavorite: (songId: string) => request(`/favorites/${songId}`, { method: 'DELETE' }),
  register: (payload: { email: string; password: string; displayName: string }) =>
    request<{ accessToken: string; refreshToken: string }>('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload: { email: string; password: string }) =>
    request<{ accessToken: string; refreshToken: string }>('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  refresh: (refreshToken: string) =>
    request<{ accessToken: string; refreshToken: string }>('/auth/refresh', { method: 'POST', body: JSON.stringify({ refreshToken }) }),
  logout: (refreshToken: string) => request('/auth/logout', { method: 'POST', body: JSON.stringify({ refreshToken }) })
};
