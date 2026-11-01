export const colors = {
  dark: {
    background: '#121417',
    secondary: '#20252B',
    primaryAccent: '#D6A45B',
    secondaryAccent: '#3ABFA3',
    textPrimary: '#F5F2EC',
    textSecondary: '#A8ADB5'
  },
  light: {
    background: '#F5F2EC',
    secondary: '#E8E2D9',
    primaryAccent: '#B88435',
    secondaryAccent: '#238D76',
    textPrimary: '#121417',
    textSecondary: '#4A505A'
  }
} as const;

export const typography = {
  h1: 30,
  h2: 24,
  h3: 20,
  body: 16,
  caption: 13
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32
} as const;

export const radius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20
} as const;
