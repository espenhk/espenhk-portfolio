import { useTheme } from '@/context/ThemeContext';
import { themes } from '@/config/themes';

export default function ThemeSelector() {
  const { theme, setThemeById, isDark } = useTheme();
  const c = theme.colors;
  const border = isDark ? c.border.dark : c.border.light;

  const descriptions: Record<string, string> = {
    cupertino: 'Apple-Flat Minimalism',
    arcadia: '8-Bit Retro Pixel Art',
    nightcity: 'Cyberpunk Neon Terminal',
    starfleet: 'Sci-Fi Command Console',
    foxglen: 'Tunic-Inspired Mythical Manual',
  };

  return (
    <div style={{
      position: 'fixed',
      top: 16,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 999,
      display: 'flex',
      gap: 4,
      background: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)',
      backdropFilter: 'blur(12px)',
      padding: '6px',
      borderRadius: '12px',
      border: `1px solid ${border}`,
      boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
    }}>
      {themes.map(t => {
        const active = t.id === theme.id;
        return (
          <button
            key={t.id}
            onClick={() => setThemeById(t.id)}
            title={descriptions[t.id]}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.7rem',
              fontWeight: 600,
              fontFamily: 'system-ui',
              background: active ? t.colors.accent : 'transparent',
              color: active ? (isDark ? '#000' : '#fff') : (isDark ? '#ccc' : '#555'),
              transition: 'all 150ms ease-out',
              whiteSpace: 'nowrap',
            }}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
