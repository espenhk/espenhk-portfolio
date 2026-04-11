import type { Theme } from './types';

export const theme: Theme = {
  id: 'starfleet',
  label: 'STARFLEET',
  colors: {
    accent: '#FF9F1C',
    accentHover: '#E08A0C',
    secondary: '#CC99FF',
    tertiary: '#99CCFF',
    highlight: '#E8655A',
    warm: '#FFCC99',
    background: { light: '#F4F1EC', dark: '#0A0E1A' },
    surface: { light: '#FFFFFF', dark: '#131A2E' },
    textPrimary: { light: '#1A1A2E', dark: '#F0EDDF' },
    textSecondary: { light: '#5A5A6A', dark: '#9A9AAF' },
    border: { light: '#E0DDD5', dark: '#1E2640' },
    success: '#66CC99',
    warning: '#FF9F1C',
    error: '#E8655A',
  },
  fonts: {
    display: "'Antonio', 'Chakra Petch', system-ui, sans-serif",
    sans: "'Outfit', 'Inter', system-ui, sans-serif",
    mono: "'JetBrains Mono', monospace",
  },
  radii: { sm: '4px', md: '8px', lg: '24px 8px 8px 24px', full: '9999px' },
  borders: { width: '0px', style: 'none' },
  shadows: {
    card: '0 2px 8px rgba(0,0,0,0.2)',
    cardHover: '0 4px 16px rgba(0,0,0,0.3)',
  },
  motion: { timingFunction: 'ease-out', durationFast: '150ms', durationNormal: '250ms' },
  characterSheetTheme: {
    panelBg: '#131A2E',
    barGlow: 'none',
    nameFont: "'Antonio', sans-serif",
  },
};
