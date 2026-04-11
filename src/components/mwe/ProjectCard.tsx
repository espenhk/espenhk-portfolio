import { useTheme } from '@/context/ThemeContext';
import { ExternalLink, Github } from 'lucide-react';

export default function ProjectCard() {
  const { theme, isDark } = useTheme();
  const c = theme.colors;
  const surface = isDark ? c.surface.dark : c.surface.light;
  const fg = isDark ? c.textPrimary.dark : c.textPrimary.light;
  const fg2 = isDark ? c.textSecondary.dark : c.textSecondary.light;
  const border = isDark ? c.border.dark : c.border.light;

  const tags = ['Python', 'CLI', 'NFL', 'Fantasy'];

  return (
    <div
      style={{
        background: surface,
        border: `${theme.borders.width} ${theme.borders.style} ${border}`,
        borderRadius: theme.radii.lg,
        padding: 24,
        boxShadow: theme.shadows.card,
        transition: `all ${theme.motion.durationNormal} ${theme.motion.timingFunction}`,
        maxWidth: 400,
        cursor: 'pointer',
        fontFamily: theme.fonts.sans,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = theme.shadows.cardHover;
        e.currentTarget.style.transform = theme.id === 'arcadia' ? 'translate(-2px, -2px)' : 'translateY(-4px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = theme.shadows.card;
        e.currentTarget.style.transform = 'none';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <h3
            style={{
              fontFamily: theme.fonts.display,
              fontSize: theme.id === 'arcadia' ? '0.75rem' : '1.2rem',
              fontWeight: 700,
              color: fg,
              marginBottom: 4,
              textTransform: theme.id === 'nightcity' ? 'uppercase' : undefined,
              letterSpacing: theme.id === 'nightcity' ? '0.05em' : undefined,
            }}
          >
            MyFootballFlags
          </h3>
          <p style={{ color: fg2, fontSize: '0.85rem', lineHeight: 1.5 }}>
            Live NFL play-by-play CLI for fantasy football nerds
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <a href="#" style={{ color: fg2 }}><Github size={18} /></a>
          <a href="#" style={{ color: fg2 }}><ExternalLink size={18} /></a>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 12 }}>
        {tags.map(t => (
          <span
            key={t}
            style={{
              background: `${c.accent}22`,
              color: c.accent,
              padding: '3px 10px',
              borderRadius: theme.radii.sm,
              fontSize: theme.id === 'arcadia' ? '0.55rem' : '0.75rem',
              fontFamily: theme.fonts.mono,
              fontWeight: 500,
              border: theme.id === 'arcadia' ? `2px solid ${c.accent}` : 'none',
            }}
          >
            {t}
          </span>
        ))}
      </div>
      <div style={{ marginTop: 16, display: 'flex', gap: 16, color: fg2, fontSize: '0.8rem', fontFamily: theme.fonts.mono }}>
        <span>⭐ 3</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#3572A5', display: 'inline-block' }} />
          Python
        </span>
      </div>
    </div>
  );
}
