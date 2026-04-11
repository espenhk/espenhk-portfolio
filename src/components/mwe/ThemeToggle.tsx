import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, isDark, toggleDark } = useTheme();
  const c = theme.colors;
  const fg = isDark ? c.textPrimary.dark : c.textPrimary.light;

  return (
    <button
      onClick={toggleDark}
      style={{
        background: 'transparent',
        border: `${theme.borders.width} ${theme.borders.style} ${isDark ? c.border.dark : c.border.light}`,
        borderRadius: theme.radii.sm,
        padding: '8px 12px',
        cursor: 'pointer',
        color: fg,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        fontFamily: theme.fonts.sans,
        fontSize: theme.id === 'arcadia' ? '0.6rem' : '0.8rem',
        transition: `all ${theme.motion.durationFast} ${theme.motion.timingFunction}`,
      }}
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
      {isDark ? 'Light' : 'Dark'}
    </button>
  );
}
