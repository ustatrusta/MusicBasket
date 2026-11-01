import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { apiClient } from '../../src/services/api';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { useTheme } from '../../src/theme/ThemeProvider';

export default function TunerScreen(): React.JSX.Element {
  const { theme } = useTheme();
  const [instruments, setInstruments] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .getInstruments()
      .then((rows) => setInstruments(rows as Array<{ id: string; name: string }>))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ScreenContainer>
      <Text style={{ color: theme.colors.primaryAccent, fontSize: theme.typography.h2 }}>Akort</Text>
      <Text style={{ color: theme.colors.textSecondary, marginVertical: 8 }}>
        Tuner DSP özelliği Faz 4'te gelecek. Bu ekranda henüz gerçek zamanlı akort yapılmamaktadır.
      </Text>
      {loading ? (
        <ActivityIndicator color={theme.colors.primaryAccent} />
      ) : (
        instruments.map((instrument) => (
          <View key={instrument.id} style={{ backgroundColor: theme.colors.secondary, padding: 10, borderRadius: 10, marginBottom: 8 }}>
            <Text style={{ color: theme.colors.textPrimary }}>{instrument.name}</Text>
          </View>
        ))
      )}
    </ScreenContainer>
  );
}
