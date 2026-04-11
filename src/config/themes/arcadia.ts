import type { Theme } from './types';

export const theme: Theme = {
  id: 'arcadia',
  label: 'ARCADIA',
  colors: {
    accent: '#209CEE',
    accentHover: '#187BBE',
    secondary: '#92CC41',
    highlight: '#E76E55',
    background: { light: '#F7F0D0', dark: '#0F0F1B' },
    surface: { light: '#FFFEF5', dark: '#1A1A2E' },
    textPrimary: { light: '#1B1B1B', dark: '#F0F0F0' },
    textSecondary: { light: '#5A5A5A', dark: '#9A9AB0' },
    border: { light: '#1B1B1B', dark: '#4A4A6A' },
    success: '#92CC41',
    warning: '#F7D51D',
    error: '#E76E55',
  },
  fonts: {
    display: "'Press Start 2P', cursive",
    sans: "'IBM Plex Mono', monospace",
    mono: "'IBM Plex Mono', monospace",
  },
  radii: { sm: '0px', md: '0px', lg: '0px', full: '0px' },
  borders: { width: '4px', style: 'solid' },
  shadows: {
    card: '4px 4px 0px rgba(231,110,85,0.3)',
    cardHover: '2px 2px 0px rgba(231,110,85,0.3)',
  },
  motion: { timingFunction: 'steps(6)', durationFast: '100ms', durationNormal: '200ms' },
  characterSheetTheme: {
    panelBg: '#0F0F1B',
    barGlow: 'none',
    nameFont: "'Press Start 2P', cursive",
    statLabels: ['STR', 'DEX', 'INT', 'WIS', 'CHA', 'LCK'],
  },
};
