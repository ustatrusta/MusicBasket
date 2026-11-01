import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { useAuthStore } from '../../src/stores/auth.store';
import { useSettingsStore } from '../../src/stores/settings.store';
import { useTheme } from '../../src/theme/ThemeProvider';

export default function ProfileScreen(): React.JSX.Element {
  const { theme } = useTheme();
  const auth = useAuthStore();
  const settings = useSettingsStore();

  return (
    <ScreenContainer>
      <Text style={{ color: theme.colors.textPrimary, fontSize: theme.typography.h2 }}>Profil</Text>
      <Text style={{ color: theme.colors.textSecondary, marginTop: 8 }}>
        {auth.isAuthenticated ? `Giriş yapıldı: ${auth.profile?.displayName ?? ''}` : 'Henüz giriş yapılmadı'}
      </Text>

      <View style={{ marginTop: 16 }}>
        <Text style={{ color: theme.colors.textPrimary }}>Tema</Text>
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
          {(['system', 'light', 'dark'] as const).map((mode) => (
            <Pressable key={mode} onPress={() => settings.setTheme(mode)} style={{ padding: 10, borderRadius: 10, backgroundColor: theme.colors.secondary }}>
              <Text style={{ color: theme.colors.textPrimary }}>{mode === 'system' ? 'Sistem' : mode === 'light' ? 'Açık' : 'Koyu'}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </ScreenContainer>
  );
}
