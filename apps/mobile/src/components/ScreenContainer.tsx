import React, { PropsWithChildren } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

export function ScreenContainer({ children }: PropsWithChildren): React.JSX.Element {
  const { theme } = useTheme();
  return <SafeAreaView style={[styles.root, { backgroundColor: theme.colors.background }]}>{children}</SafeAreaView>;
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: 16 }
});
