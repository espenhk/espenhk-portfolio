import type { Theme } from './types';

export const theme: Theme = {
  id: 'foxglen',
  label: 'FOXGLEN',
  colors: {
    accent: '#D4B87B',
    accentHover: '#BFA262',
    secondary: '#8CAA7E',
    tertiary: '#C4907C',
    highlight: '#C4907C',
    warm: '#E8D5B0',
    background: { light: '#F5F0E8', dark: '#1E1B17' },
    surface: { light: '#FBF8F2', dark: '#2A2520' },
    textPrimary: { light: '#2C2820', dark: '#E8DCC8' },
    textSecondary: { light: '#6B6358', dark: '#9A9080' },
    border: { light: '#DDD5C5', dark: '#3A3530' },
    success: '#8CAA7E',
    warning: '#D4B87B',
    error: '#C4907C',
  },
  fonts: {
    display: "'Cinzel', 'Georgia', serif",
    sans: "'Lora', 'Georgia', serif",
    mono: "'JetBrains Mono', monospace",
  },
  radii: { sm: '4px', md: '8px', lg: '12px', full: '9999px' },
  borders: { width: '1px', style: 'solid' },
  shadows: {
    card: '0 2px 8px rgba(30,27,23,0.12)',
    cardHover: '0 4px 16px rgba(30,27,23,0.18)',
  },
  motion: { timingFunction: 'ease-in-out', durationFast: '200ms', durationNormal: '400ms' },
  characterSheetTheme: {
    panelBg: '#2A2520',
    barGlow: 'none',
    nameFont: "'Cinzel', serif",
  },
};
