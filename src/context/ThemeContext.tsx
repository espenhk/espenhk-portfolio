import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { themes, type Theme } from '@/config/themes';

interface ThemeContextValue {
  theme: Theme;
  setThemeById: (id: string) => void;
  isDark: boolean;
  toggleDark: () => void;
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

  return (
    <ThemeContext.Provider value={{
      theme,
      setThemeById: setThemeId,
      isDark,
      toggleDark: () => setIsDark(d => !d),
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
