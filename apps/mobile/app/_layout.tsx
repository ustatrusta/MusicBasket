import React from 'react';
import { Stack } from 'expo-router';
import { ThemeProvider } from '../src/theme/ThemeProvider';
import { ApiProvider } from '../src/services/ApiProvider';
import { AuthBootstrap } from '../src/components/AuthBootstrap';

export default function RootLayout(): React.JSX.Element {
  return (
    <ThemeProvider>
      <ApiProvider>
        <AuthBootstrap>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
          </Stack>
        </AuthBootstrap>
      </ApiProvider>
    </ThemeProvider>
  );
}
