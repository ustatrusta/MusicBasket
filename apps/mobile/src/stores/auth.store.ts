import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import { apiClient } from '../services/api';

const REFRESH_TOKEN_KEY = 'ms_refresh_token';

interface AuthState {
  isAuthenticated: boolean;
  profile: { email: string; displayName: string } | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  profile: null,
  async login(email, password) {
    const tokens = await apiClient.login({ email, password });
    await apiClient.saveTokens(tokens.accessToken, tokens.refreshToken);
    set({ isAuthenticated: true, profile: { email, displayName: email } });
  },
  async register(email, password, displayName) {
    const tokens = await apiClient.register({ email, password, displayName });
    await apiClient.saveTokens(tokens.accessToken, tokens.refreshToken);
    set({ isAuthenticated: true, profile: { email, displayName } });
  },
  async refresh() {
    const token = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    if (!token) return;
    const next = await apiClient.refresh(token);
    await apiClient.saveTokens(next.accessToken, next.refreshToken);
    set({ isAuthenticated: true });
  },
  async logout() {
    const token = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    if (token) {
      await apiClient.logout(token);
    }
    await apiClient.clearTokens();
    set({ isAuthenticated: false, profile: null });
  }
}));
