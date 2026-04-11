export interface ThemeColors {
  accent: string;
  accentHover: string;
  secondary?: string;
  tertiary?: string;
  highlight?: string;
  warm?: string;
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
