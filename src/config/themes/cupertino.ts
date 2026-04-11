import type { Theme } from './types';

export const theme: Theme = {
  id: 'cupertino',
  label: 'CUPERTINO',
  colors: {
    accent: '#0071E3',
    accentHover: '#005BB5',
    background: { light: '#FAFAFA', dark: '#0A0A0A' },
    surface: { light: '#FFFFFF', dark: '#1C1C1E' },
    textPrimary: { light: '#1D1D1F', dark: '#F5F5F7' },
    textSecondary: { light: '#6E6E73', dark: '#A1A1A6' },
    border: { light: '#E5E5EA', dark: '#2C2C2E' },
    success: '#34C759',
    warning: '#FF9F0A',
    error: '#FF3B30',
  },
  fonts: {
    display: "'Inter', system-ui, sans-serif",
    sans: "'Inter', system-ui, sans-serif",
    mono: "'JetBrains Mono', monospace",
  },
  radii: { sm: '8px', md: '12px', lg: '20px', full: '9999px' },
  borders: { width: '1px', style: 'solid' },
  shadows: {
    card: '0 2px 12px rgba(0,0,0,0.06)',
    cardHover: '0 8px 30px rgba(0,0,0,0.10)',
  },
  motion: { timingFunction: 'ease-out', durationFast: '150ms', durationNormal: '300ms' },
  characterSheetTheme: {
    panelBg: '#111114',
    barGlow: 'none',
    nameFont: "'Inter', sans-serif",
  },
};
