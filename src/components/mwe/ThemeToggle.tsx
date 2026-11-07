import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, isDark, toggleDark, palette: p } = useTheme();

  return (
    <button
      onClick={toggleDark}
      style={{
        background: 'transparent',
        border: `${theme.borders.width} ${theme.borders.style} ${p.border}`,
        borderRadius: theme.radii.sm,
        padding: '8px 12px',
        cursor: 'pointer',
        color: p.isStarfleet ? p.navInk : p.fg,
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
