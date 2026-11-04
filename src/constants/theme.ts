/**
 * DARK_PREMIUM preset copy. The `name` field must stay exactly as the preset
 * defines it; only the accent colours are overridden for the GearInchTally brief
 * (workshop teal + safety orange).
 */
export const theme = {
  name: 'dark-premium',

  colors: {
    bg: {
      deep: '#0C1013',
      primary: '#101418',
      secondary: '#151B20',
      tertiary: '#1B2227',
      accent: '#263038',
    },
    accent: {
      primary: '#2EC4B6',
      primaryDark: '#1E9C92',
      secondary: '#FF9F1C',
      secondaryDark: '#E0820A',
      cool: '#74B9FF',
      success: '#55EFC4',
    },
    text: {
      primary: '#EDF2F4',
      secondary: '#8FA3AD',
      muted: '#5F7681',
      onAccent: '#06231F',
    },
    ui: {
      border: 'rgba(255,255,255,0.09)',
      borderStrong: 'rgba(255,255,255,0.16)',
      divider: 'rgba(237,242,244,0.07)',
      glass: 'rgba(255,255,255,0.05)',
      glassStrong: 'rgba(255,255,255,0.08)',
      overlay: 'rgba(0,0,0,0.32)',
      well: 'rgba(0,0,0,0.30)',
    },
  },

  gradients: {
    primary: ['#2EC4B6', '#1E9C92'],
    secondary: ['#FF9F1C', '#E0820A'],
    surface: ['#151B20', '#1B2227'],
    range: ['#2EC4B6', '#FF9F1C'],
    loader: ['rgba(8,11,14,0.94)', 'rgba(16,20,24,0.88)', 'rgba(5,7,9,0.97)'],
    menu: ['rgba(16,20,24,0.84)', 'rgba(21,27,32,0.78)', 'rgba(12,16,19,0.93)'],
    game: ['rgba(12,16,19,0.93)', 'rgba(16,20,24,0.90)', 'rgba(10,13,16,0.96)'],
    result: ['rgba(16,20,24,0.90)', 'rgba(12,16,19,0.93)', 'rgba(10,13,16,0.96)'],
  },

  typography: {
    hero: { fontSize: 34, fontWeight: '800' as const, letterSpacing: 3 },
    title: { fontSize: 26, fontWeight: '800' as const, letterSpacing: 2 },
    section: { fontSize: 16, fontWeight: '800' as const, letterSpacing: 1.6 },
    body: { fontSize: 15, fontWeight: '700' as const, letterSpacing: 0.2 },
    value: { fontSize: 24, fontWeight: '800' as const, letterSpacing: 0.4 },
    button: { fontSize: 16, fontWeight: '800' as const, letterSpacing: 1.2 },
    caption: { fontSize: 10.5, fontWeight: '700' as const, letterSpacing: 1.2 },
  },

  spacing: { xs: 4, sm: 8, md: 12, lg: 18, xl: 24, xxl: 34 },

  radius: { sm: 8, md: 12, lg: 16, xl: 20, xxl: 28, pill: 100 },

  shadows: {
    card: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.34,
      shadowRadius: 10,
      elevation: 5,
    },
    primary: {
      shadowColor: '#2EC4B6',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 8,
    },
    panel: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: -6 },
      shadowOpacity: 0.4,
      shadowRadius: 16,
      elevation: 14,
    },
  },

  animation: {
    press: { tension: 300, friction: 12 },
    entry: { tension: 48, friction: 8 },
    fadeFast: 160,
    fadeScreen: 300,
    tick: 320,
    bar: 420,
  },
};

export type Theme = typeof theme;
