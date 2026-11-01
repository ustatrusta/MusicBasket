import React, { PropsWithChildren, createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { colors, radius, spacing, typography } from './tokens';
import { useSettingsStore } from '../stores/settings.store';

export type ThemeMode = 'light' | 'dark' | 'system';

type ThemeShape = {
  mode: ThemeMode;
  theme: {
    colors: (typeof colors)['dark'] | (typeof colors)['light'];
    typography: typeof typography;
    spacing: typeof spacing;
    radius: typeof radius;
  };
};

const ThemeContext = createContext<ThemeShape>({
  mode: 'dark',
  theme: {
    colors: colors.dark,
    typography,
    spacing,
    radius
  }
});

export function ThemeProvider({ children }: PropsWithChildren): React.JSX.Element {
  const systemScheme = useColorScheme();
  const mode = useSettingsStore((state) => state.theme);

  const resolvedMode: 'light' | 'dark' = mode === 'system' ? (systemScheme === 'light' ? 'light' : 'dark') : mode;

  const value = useMemo(
    () => ({
      mode,
      theme: {
        colors: resolvedMode === 'light' ? colors.light : colors.dark,
        typography,
        spacing,
        radius
      }
    }),
    [mode, resolvedMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
