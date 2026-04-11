import type { Theme } from './types';

export const theme: Theme = {
  id: 'nightcity',
  label: 'NIGHTCITY',
  colors: {
    accent: '#00F0FF',
    accentHover: '#00C4CC',
    secondary: '#FF2A6D',
    tertiary: '#FCEE0A',
    background: { light: '#E8EAF0', dark: '#0D0E14' },
    surface: { light: '#F0F1F5', dark: '#1A1A2E' },
    textPrimary: { light: '#1B1B2F', dark: '#F0F1F5' },
    textSecondary: { light: '#5C647A', dark: '#939AB0' },
    border: { light: '#D1D4DE', dark: '#2A2D3A' },
    success: '#05FFA1',
    warning: '#FCEE0A',
    error: '#FF2A6D',
  },
  fonts: {
    display: "'Rajdhani', 'Orbitron', system-ui, sans-serif",
    sans: "'Exo 2', 'Inter', system-ui, sans-serif",
    mono: "'JetBrains Mono', monospace",
  },
  radii: { sm: '2px', md: '4px', lg: '0px 12px 0px 12px', full: '9999px' },
  borders: { width: '1px', style: 'solid' },
  shadows: {
    card: '0 0 0 1px rgba(0,240,255,0.05)',
    cardHover: '0 0 20px rgba(0,240,255,0.15), 0 0 40px rgba(0,240,255,0.05)',
  },
  motion: { timingFunction: 'cubic-bezier(0.77, 0, 0.175, 1)', durationFast: '150ms', durationNormal: '300ms' },
  characterSheetTheme: {
    panelBg: '#0D0E14',
    barGlow: '0 0 12px rgba(0,240,255,0.5)',
    nameFont: "'Rajdhani', sans-serif",
  },
};
