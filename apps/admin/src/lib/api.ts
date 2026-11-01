import { Song, MusicGenre } from '@muzik-sepeti/shared';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001/api/v1';

async function call<T>(path: string, token?: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    cache: 'no-store'
  });

  if (!res.ok) {
    throw new Error(`Admin API error ${res.status}`);
  }

  return (await res.json()) as T;
}

export const adminApi = {
  getSongs: (token?: string) => call<{ data: Song[] }>('/songs', token),
  getGenres: (token?: string) => call<MusicGenre[]>('/genres', token),
  getInstruments: (token?: string) => call<unknown[]>('/instruments', token),
  getTrending: (token?: string) => call<unknown[]>('/trending/songs', token)
};
