import type { Theme } from './types';

export const theme: Theme = {
  id: 'arcadia',
  label: 'ARCADIA',
  colors: {
    accent: '#209CEE',
    accentHover: '#1A7FBF',
    secondary: '#92CC41',
    tertiary: '#F7D51D',
    highlight: '#E76E55',
    warm: '#F7D51D',
    background: { light: '#F0F0E8', dark: '#0F0F1B' },
    surface: { light: '#FAFAF2', dark: '#1A1A2E' },
    textPrimary: { light: '#1A1A2E', dark: '#E8E8D8' },
    textSecondary: { light: '#5A5A6A', dark: '#8888A0' },
    border: { light: '#D8D8C8', dark: '#2A2A40' },
    success: '#92CC41',
    warning: '#F7D51D',
    error: '#E76E55',
  },
  fonts: {
    display: "'Press Start 2P', 'VT323', monospace",
    sans: "'Outfit', system-ui, sans-serif",
    mono: "'JetBrains Mono', monospace",
  },
  radii: { sm: '0px', md: '4px', lg: '4px', full: '4px' },
  borders: { width: '2px', style: 'solid' },
  shadows: {
    card: '4px 4px 0px rgba(0,0,0,0.2)',
    cardHover: '6px 6px 0px rgba(0,0,0,0.3)',
  },
  motion: { timingFunction: 'steps(4, end)', durationFast: '100ms', durationNormal: '200ms' },
  characterSheetTheme: {
    panelBg: '#1A1A2E',
    barGlow: 'none',
    nameFont: "'Press Start 2P', monospace",
  },
};
