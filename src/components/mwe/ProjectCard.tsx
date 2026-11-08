import { useTheme } from '@/context/ThemeContext';
import { ExternalLink, Github } from 'lucide-react';
import { languageColors } from '@/data/languageColors';

export default function ProjectCard() {
  const { theme, palette: p } = useTheme();
  const cardBg = p.cardBg;
  const fg = p.fg;
  const fg2 = p.fg2;

  const tags = ['Python', 'CLI', 'NFL', 'Fantasy'];

  return (
    <div
      style={{
        background: p.flourish ? undefined : cardBg,
        backgroundImage: p.flourish ? cardBg : undefined,
        border: `${theme.borders.width} ${theme.borders.style} ${p.cardEdge}`,
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
        e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = theme.shadows.card;
        e.currentTarget.style.transform = 'none';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <h3 style={{
            fontFamily: theme.fonts.display,
            fontSize: '1.4rem',
            fontWeight: 400,
            color: fg,
            marginBottom: 4,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}>
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
              background: p.accentTint,
              color: p.accentInk,
              padding: '3px 10px',
              borderRadius: theme.radii.sm,
              fontSize: '0.75rem',
              fontFamily: theme.fonts.mono,
              fontWeight: 500,
            }}
          >
            {t}
          </span>
        ))}
      </div>
      <div style={{ marginTop: 16, display: 'flex', gap: 16, color: fg2, fontSize: '0.8rem', fontFamily: theme.fonts.mono }}>
        <span>⭐ 3</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: languageColors.Python, display: 'inline-block' }} />
          Python
        </span>
      </div>
    </div>
  );
}
