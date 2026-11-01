import { create } from 'zustand';
import { apiClient } from '../services/api';

interface FavoritesState {
  items: string[];
  load: () => Promise<void>;
  add: (songId: string) => Promise<void>;
  remove: (songId: string) => Promise<void>;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  items: [],
  async load() {
    const rows = await apiClient.getFavorites();
    const ids = rows.map((row: any) => row.songId).filter(Boolean);
    set({ items: ids });
  },
  async add(songId) {
    await apiClient.addFavorite(songId);
    set({ items: Array.from(new Set([...get().items, songId])) });
  },
  async remove(songId) {
    await apiClient.removeFavorite(songId);
    set({ items: get().items.filter((id) => id !== songId) });
  }
}));
