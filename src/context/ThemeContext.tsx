import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from 'react';
import { themes, type Theme } from '@/config/themes';
import { resolvePalette, type Palette } from '@/design-system/palette';

interface ThemeContextValue {
  theme: Theme;
  setThemeById: (id: string) => void;
  isDark: boolean;
  toggleDark: () => void;
  /** Mode-resolved semantic colours for the active theme (see src/design-system/palette.ts). */
  palette: Palette;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeId] = useState('starfleet');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('portfolio-dark');
    if (saved !== null) setIsDark(saved === 'true');
    else if (window.matchMedia('(prefers-color-scheme: dark)').matches) setIsDark(true);
  }, []);

  useEffect(() => {
    localStorage.setItem('portfolio-dark', String(isDark));
  }, [isDark]);

  const theme = themes.find(t => t.id === themeId) ?? themes[0];

  // Design-system tokens (tokens.css) and shadcn switch on these attributes.
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute('data-theme', isDark ? 'dark' : 'light');
    html.setAttribute('data-site-theme', theme.id);
    html.classList.toggle('dark', isDark);
  }, [isDark, theme.id]);

  const palette = useMemo(() => resolvePalette(theme, isDark), [theme, isDark]);

  return (
    <ThemeContext.Provider value={{
      theme,
      setThemeById: setThemeId,
      isDark,
      toggleDark: () => setIsDark(d => !d),
      palette,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
