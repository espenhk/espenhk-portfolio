import type { Theme } from './types';

export const theme: Theme = {
  id: 'foxglen',
  label: 'FOXGLEN',
  colors: {
    accent: '#D4B87B',
    accentHover: '#C4A86B',
    secondary: '#8CAA7E',
    tertiary: '#7B95A5',
    highlight: '#C4907C',
    background: { light: '#F2EDE4', dark: '#1E1B17' },
    surface: { light: '#FAF7F2', dark: '#2A2520' },
    textPrimary: { light: '#3A3632', dark: '#E8E2D6' },
    textSecondary: { light: '#7A756C', dark: '#A09A8E' },
    border: { light: '#D8D2C6', dark: '#3A3530' },
    success: '#8CAA7E',
    warning: '#D4B87B',
    error: '#C4907C',
  },
  fonts: {
    display: "'Uncial Antiqua', 'MedievalSharp', serif",
    sans: "'Nunito', 'Karla', system-ui, sans-serif",
    mono: "'Fira Code', monospace",
    runic: "'Noto Sans Runic', sans-serif",
  },
  radii: { sm: '8px', md: '16px', lg: '20px', full: '9999px' },
  borders: { width: '1px', style: 'solid' },
  shadows: {
    card: 'inset 0 1px 3px rgba(0,0,0,0.04), 0 1px 4px rgba(0,0,0,0.06)',
    cardHover: '0 4px 16px rgba(212,184,123,0.15)',
  },
  motion: { timingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', durationFast: '200ms', durationNormal: '400ms' },
  characterSheetTheme: {
    panelBg: '#2A2520',
    barGlow: '0 0 8px rgba(212,184,123,0.3)',
    nameFont: "'Uncial Antiqua', serif",
  },
};
