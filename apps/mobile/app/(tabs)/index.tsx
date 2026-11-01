import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { apiClient } from '../../src/services/api';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { useTheme } from '../../src/theme/ThemeProvider';

const shortcuts = ['Türkü Kütüphanesi', 'Akort Et', 'Enstrümanlar', 'Favorilerim', 'Son Eklenenler', 'En Çok Dinlenenler'];

export default function HomeScreen(): React.JSX.Element {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [trendingCount, setTrendingCount] = useState(0);
  const [latestCount, setLatestCount] = useState(0);

  useEffect(() => {
    Promise.all([apiClient.getTrendingSongs(), apiClient.getNewestSongs()])
      .then(([trending, latest]) => {
        setTrendingCount(trending.length);
        setLatestCount(latest.data.length);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <ScreenContainer>
      <ScrollView>
        <Text style={{ color: theme.colors.textPrimary, fontSize: theme.typography.h2, marginBottom: theme.spacing.md }}>Ana Sayfa</Text>
        <View style={{ backgroundColor: theme.colors.secondary, borderRadius: theme.radius.lg, padding: theme.spacing.lg, marginBottom: theme.spacing.lg }}>
          <Text style={{ color: theme.colors.primaryAccent, fontSize: theme.typography.h3 }}>Trend Türküler</Text>
          {loading ? <ActivityIndicator color={theme.colors.primaryAccent} /> : <Text style={{ color: theme.colors.textSecondary }}>{trendingCount} kayıt alındı</Text>}
        </View>

        <Text style={{ color: theme.colors.textPrimary, marginBottom: 8 }}>Hızlı Erişim</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {shortcuts.map((item) => (
            <View key={item} style={{ padding: 10, borderRadius: 10, backgroundColor: theme.colors.secondary }}>
              <Text style={{ color: theme.colors.textPrimary }}>{item}</Text>
            </View>
          ))}
        </View>

        <Text style={{ color: theme.colors.textPrimary, marginTop: 20 }}>Son Eklenenler: {latestCount}</Text>
      </ScrollView>
    </ScreenContainer>
  );
}
