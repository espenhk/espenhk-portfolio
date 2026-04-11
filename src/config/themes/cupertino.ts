import type { Theme } from './types';

export const theme: Theme = {
  id: 'cupertino',
  label: 'CUPERTINO',
  colors: {
    accent: '#0071E3',
    accentHover: '#0060C0',
    secondary: '#34C759',
    tertiary: '#FF9F0A',
    highlight: '#FF3B30',
    warm: '#FFD60A',
    background: { light: '#FAFAFA', dark: '#0A0A0A' },
    surface: { light: '#FFFFFF', dark: '#1C1C1E' },
    textPrimary: { light: '#1D1D1F', dark: '#F5F5F7' },
    textSecondary: { light: '#6E6E73', dark: '#A1A1A6' },
    border: { light: '#D2D2D7', dark: '#38383A' },
    success: '#34C759',
    warning: '#FF9F0A',
    error: '#FF3B30',
  },
  fonts: {
    display: "'Inter', 'SF Pro Display', system-ui, sans-serif",
    sans: "'Inter', 'SF Pro Text', system-ui, sans-serif",
    mono: "'JetBrains Mono', monospace",
  },
  radii: { sm: '8px', md: '12px', lg: '20px', full: '9999px' },
  borders: { width: '1px', style: 'solid' },
  shadows: {
    card: '0 2px 12px rgba(0,0,0,0.06)',
    cardHover: '0 4px 20px rgba(0,0,0,0.1)',
  },
  motion: { timingFunction: 'cubic-bezier(0.25, 0.1, 0.25, 1)', durationFast: '200ms', durationNormal: '350ms' },
  characterSheetTheme: {
    panelBg: '#1C1C1E',
    barGlow: 'none',
    nameFont: "'Inter', sans-serif",
  },
};
