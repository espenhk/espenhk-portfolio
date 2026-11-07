export interface ThemeColors {
  /** Flat accent colour (buttons, rails, bars, tints). Text/icons should use `accentInk`. */
  accent: string;
  accentHover: string;
  secondary?: string;
  tertiary?: string;
  highlight?: string;
  warm?: string;
  /**
   * "Ink" variants: the colour used for text, icons and control borders. Optional —
   * themes without them fall back to the flat colour (unchanged look).
   */
  accentInk?: string;
  secondaryInk?: string;
  tertiaryInk?: string;
  highlightInk?: string;
  /** Text on an accent-filled surface. */
  onAccent?: { light: string; dark: string };
  background: { light: string; dark: string };
  surface: { light: string; dark: string };
  textPrimary: { light: string; dark: string };
  textSecondary: { light: string; dark: string };
  border: { light: string; dark: string };
  success: string;
  warning: string;
  error: string;
}

export interface Theme {
  id: string;
  label: string;
  colors: ThemeColors;
  fonts: {
    display: string;
    sans: string;
    mono: string;
    runic?: string;
  };
  radii: { sm: string; md: string; lg: string; full: string };
  borders: { width: string; style: string };
  shadows: { card: string; cardHover: string };
  motion: { timingFunction: string; durationFast: string; durationNormal: string };
  characterSheetTheme: {
    panelBg: string;
    barGlow: string;
    nameFont: string;
    statLabels?: string[];
  };
}
