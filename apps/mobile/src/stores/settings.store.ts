import { create } from 'zustand';
import { ThemeMode } from '../theme/ThemeProvider';

interface SettingsState {
  theme: ThemeMode;
  language: 'tr' | 'en';
  setTheme: (theme: ThemeMode) => void;
  setLanguage: (language: 'tr' | 'en') => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  theme: 'system',
  language: 'tr',
  setTheme: (theme) => set({ theme }),
  setLanguage: (language) => set({ language })
}));
