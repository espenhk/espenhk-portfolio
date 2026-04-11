import type { Theme } from './types';

export const theme: Theme = {
  id: 'nightcity',
  label: 'NIGHTCITY',
  colors: {
    accent: '#00F0FF',
    accentHover: '#00C8D8',
    secondary: '#FF2A6D',
    tertiary: '#FCEE0A',
    highlight: '#FF2A6D',
    warm: '#FCEE0A',
    background: { light: '#F0F0F5', dark: '#0D0E14' },
    surface: { light: '#FFFFFF', dark: '#161822' },
    textPrimary: { light: '#0D0E14', dark: '#E0E0F0' },
    textSecondary: { light: '#555568', dark: '#7878A0' },
    border: { light: '#D0D0E0', dark: '#252838' },
    success: '#05D9A6',
    warning: '#FCEE0A',
    error: '#FF2A6D',
  },
  fonts: {
    display: "'Orbitron', 'Antonio', system-ui, sans-serif",
    sans: "'Rajdhani', 'Outfit', system-ui, sans-serif",
    mono: "'JetBrains Mono', monospace",
  },
  radii: { sm: '2px', md: '4px', lg: '2px', full: '2px' },
  borders: { width: '1px', style: 'solid' },
  shadows: {
    card: '0 0 15px rgba(0,240,255,0.08)',
    cardHover: '0 0 30px rgba(0,240,255,0.15), 0 0 60px rgba(255,42,109,0.08)',
  },
  motion: { timingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)', durationFast: '100ms', durationNormal: '200ms' },
  characterSheetTheme: {
    panelBg: '#161822',
    barGlow: '0 0 8px rgba(0,240,255,0.3)',
    nameFont: "'Orbitron', sans-serif",
  },
};
