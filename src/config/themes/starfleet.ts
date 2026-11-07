import type { Theme } from './types';

/**
 * Starfleet is driven entirely by the Claude Design system «Starfleet»:
 * every value is a CSS variable from src/design-system/starfleet/tokens.css
 * (generated from tokens.json – run `bun run tokens`). Light/dark switch via
 * `data-theme` on <html>, so the {light, dark} pairs point at the same variable.
 */
const v = (name: string) => `var(--${name})`;
const both = (name: string) => ({ light: v(name), dark: v(name) });

export const theme: Theme = {
  id: 'starfleet',
  label: 'STARFLEET',
  colors: {
    accent: v('accent'),
    accentHover: v('accent-hover'),
    secondary: v('secondary'),
    tertiary: v('tertiary'),
    highlight: v('highlight'),
    warm: v('warm'),
    accentInk: v('accent-ink'),
    secondaryInk: v('secondary-ink'),
    tertiaryInk: v('tertiary-ink'),
    highlightInk: v('highlight-ink'),
    onAccent: both('on-accent'),
    background: both('background'),
    surface: both('surface'),
    textPrimary: both('text-primary'),
    textSecondary: both('text-secondary'),
    border: both('border'),
    success: v('success'),
    warning: v('warning'),
    error: v('error'),
  },
  fonts: {
    display: v('font-display'),
    sans: v('font-sans'),
    mono: v('font-mono'),
  },
  radii: {
    sm: v('radius-sm'),
    md: v('radius-md'),
    lg: `${v('radius-lead')} ${v('radius-md')} ${v('radius-md')} ${v('radius-lead')}`,
    full: v('radius-full'),
  },
  borders: { width: '0px', style: 'none' },
  shadows: {
    card: v('shadow-card'),
    cardHover: v('shadow-card-hover'),
  },
  // Motion is not part of the design system tokens yet.
  motion: { timingFunction: 'ease-out', durationFast: '150ms', durationNormal: '250ms' },
  characterSheetTheme: {
    panelBg: v('stat-panel'),
    barGlow: 'none',
    nameFont: v('font-display'),
  },
};
