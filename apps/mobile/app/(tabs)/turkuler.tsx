import React, { useEffect, useState } from 'react';
import { FlatList, Text, TextInput, View } from 'react-native';
import { Song } from '@muzik-sepeti/shared';
import { apiClient } from '../../src/services/api';
import { useTurkishQuery } from '../../src/hooks/useTurkishQuery';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { useTheme } from '../../src/theme/ThemeProvider';

export default function LibraryScreen(): React.JSX.Element {
  const { theme } = useTheme();
  const [page] = useState(1);
  const [query, setQuery] = useState('');
  const [songs, setSongs] = useState<Song[]>([]);
  const normalized = useTurkishQuery(query);

  useEffect(() => {
    apiClient.getSongs(page, normalized).then((res) => setSongs(res.data)).catch(() => setSongs([]));
  }, [page, normalized]);

  return (
    <ScreenContainer>
      <Text style={{ color: theme.colors.textPrimary, fontSize: theme.typography.h2 }}>Türküler</Text>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Türkü ara"
        placeholderTextColor={theme.colors.textSecondary}
        style={{ backgroundColor: theme.colors.secondary, color: theme.colors.textPrimary, padding: 10, borderRadius: 10, marginVertical: 12 }}
      />
      <FlatList
        data={songs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ backgroundColor: theme.colors.secondary, padding: 12, borderRadius: 10, marginBottom: 8 }}>
            <Text style={{ color: theme.colors.textPrimary }}>{item.title}</Text>
          </View>
        )}
      />
    </ScreenContainer>
  );
}
