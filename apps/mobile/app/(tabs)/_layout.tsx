import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { useTheme } from '../../src/theme/ThemeProvider';

export default function TabsLayout(): React.JSX.Element {
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarStyle: {
          backgroundColor: theme.colors.secondary,
          borderTopColor: theme.colors.background
        },
        tabBarActiveTintColor: theme.colors.primaryAccent,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarIcon: ({ color, size, focused }) => {
          const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
            index: 'home-outline',
            turkuler: 'library-outline',
            akort: 'musical-notes-outline',
            favoriler: 'heart-outline',
            profil: 'person-outline'
          };

          const isTuner = route.name === 'akort';

          return <Ionicons name={iconMap[route.name] ?? 'ellipse'} size={isTuner ? 30 : focused ? size + 2 : size} color={isTuner ? theme.colors.primaryAccent : color} />;
        }
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Ana Sayfa' }} />
      <Tabs.Screen name="turkuler" options={{ title: 'Türküler' }} />
      <Tabs.Screen name="akort" options={{ title: 'Akort' }} />
      <Tabs.Screen name="favoriler" options={{ title: 'Favoriler' }} />
      <Tabs.Screen name="profil" options={{ title: 'Profil' }} />
    </Tabs>
  );
}
