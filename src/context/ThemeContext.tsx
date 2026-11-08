import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from 'react';
import { themes, type Theme } from '@/config/themes';
import { resolvePalette, type Palette } from '@/design-system/palette';
import { tokens } from '@/design-system/starfleet/tokens.generated';

interface ThemeContextValue {
  theme: Theme;
  setThemeById: (id: string) => void;
  isDark: boolean;
  toggleDark: () => void;
  /** Mode-resolved semantic colours for the active theme (see src/design-system/palette.ts). */
  palette: Palette;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/** localStorage key for the light/dark choice – also read by the inline script in index.html. */
const DARK_KEY = 'portfolio-dark';

/**
 * Initial mode, decided before React renders: the inline script in index.html has already
 * set data-theme on <html> (stored choice, else prefers-color-scheme), so start from that and
 * the first render matches the first paint. Falls back to the same logic if the script didn't run.
 */
function initialIsDark(): boolean {
  if (typeof document === 'undefined') return false;
  const attr = document.documentElement.getAttribute('data-theme');
  if (attr === 'dark' || attr === 'light') return attr === 'dark';
  try {
    const saved = localStorage.getItem(DARK_KEY);
    if (saved !== null) return saved === 'true';
  } catch { /* storage blocked */ }
  return typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-color-scheme: dark)').matches;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeId] = useState('starfleet');
  const [isDark, setIsDark] = useState(initialIsDark);

  useEffect(() => {
    try { localStorage.setItem(DARK_KEY, String(isDark)); } catch { /* storage blocked */ }
  }, [isDark]);

  const theme = themes.find(t => t.id === themeId) ?? themes[0];

  // Design-system tokens (tokens.css) and shadcn switch on these attributes.
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute('data-theme', isDark ? 'dark' : 'light');
    html.setAttribute('data-site-theme', theme.id);
    html.classList.toggle('dark', isDark);

    // Page ground behind the app (overscroll, gaps) and the browser UI colour follow the
    // active site theme: Starfleet from its tokens, other themes from their own Theme object.
    const mode = isDark ? 'dark' : 'light';
    const isStarfleet = theme.id === 'starfleet';
    if (isStarfleet) html.style.removeProperty('--site-ground');
    else html.style.setProperty('--site-ground', theme.colors.background[mode]);
    const meta = document.querySelector('meta[name="theme-color"]');
    meta?.setAttribute('content', isStarfleet ? tokens.color[mode]['ground-deep'] : theme.colors.background[mode]);
  }, [isDark, theme]);

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
