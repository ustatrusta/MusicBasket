import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { useAuthStore } from '../../src/stores/auth.store';
import { useFavoritesStore } from '../../src/stores/favorites.store';
import { useTheme } from '../../src/theme/ThemeProvider';

export default function FavoritesScreen(): React.JSX.Element {
  const { theme } = useTheme();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const favorites = useFavoritesStore((state) => state.items);
  const load = useFavoritesStore((state) => state.load);

  useEffect(() => {
    if (isAuthenticated) {
      void load();
    }
  }, [isAuthenticated, load]);

  return (
    <ScreenContainer>
      <Text style={{ color: theme.colors.textPrimary, fontSize: theme.typography.h2 }}>Favoriler</Text>
      {!isAuthenticated ? (
        <Text style={{ color: theme.colors.textSecondary, marginTop: 8 }}>Favorilerinizi görmek için giriş yapmanız gerekiyor.</Text>
      ) : (
        favorites.map((id) => (
          <View key={id} style={{ backgroundColor: theme.colors.secondary, padding: 10, borderRadius: 10, marginTop: 8 }}>
            <Text style={{ color: theme.colors.textPrimary }}>{id}</Text>
          </View>
        ))
      )}
    </ScreenContainer>
  );
}
