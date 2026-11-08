import { Fragment, useMemo, type ReactNode } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { buildSocialLinks } from '@/data/siteConfig';
import { defaultSectionData } from '@/cms/defaults';
import { useSiteSettings, useResumeUrl } from '@/cms/api';
import type { HeroData, HeroPartKey } from '@/cms/types';
import { normalizeHeroParts } from '@/cms/resolve';
import NowPlaying from './NowPlaying';
import { tint } from '@/design-system/palette';

// Starfield star positions/sizes are layout data, not design tokens (see design system README,
// "Ikke synkronisert"); the colours come from tokens. `--stat-label` is the near-white star colour.
const STARS: [size: number, x: number, y: number, color: string, alpha: number][] = [
  [1, 10, 20, 'var(--stat-label)', 60], [1, 30, 60, 'var(--stat-label)', 40], [1, 50, 10, 'var(--stat-label)', 30],
  [1, 70, 80, 'var(--stat-label)', 50], [1, 90, 40, 'var(--stat-label)', 40], [2, 20, 90, 'var(--accent)', 50],
  [2, 80, 15, 'var(--tertiary)', 50], [1.5, 45, 45, 'var(--secondary)', 40], [1, 65, 25, 'var(--stat-label)', 40],
  [1.5, 15, 75, 'var(--highlight)', 40],
];
const starfield = STARS
  .map(([s, x, y, color, a]) => `radial-gradient(${s}px ${s}px at ${x}% ${y}%, ${tint(color, a)} 0%, transparent 100%)`)
  .join(', ');

export default function HeroSection({ data = defaultSectionData.hero, anchorId = 'hero' }: { data?: HeroData; anchorId?: string }) {
  const { theme, isDark, palette: p } = useTheme();
  const settings = useSiteSettings();
  const resumeUrl = useResumeUrl();
  const socialLinks = useMemo(() => buildSocialLinks(settings.socials), [settings.socials]);
  const tagline = useMemo(() => {
    const t = data.taglines.filter(Boolean);
    return t.length ? t[Math.floor(Math.random() * t.length)] : '';
  }, [data.taglines]);
  const bg = p.heroBg;
  const fg = p.fg;
  const fg2 = p.fg2;

  const visibleParts = normalizeHeroParts(data.parts).filter(p => p.visible).map(p => p.key);
  const renderPart = (key: HeroPartKey, isLast: boolean): ReactNode => {
    switch (key) {
      case 'avatar': return (
        <img
          src={data.profileImage}
          alt={settings.name}
          width={140}
          height={140}
          fetchPriority="high"
          decoding="async"
          style={{
            width: 140, height: 140,
            borderRadius: theme.radii.full,
            objectFit: 'cover',
            objectPosition: 'center 25%',
            margin: '0 auto 24px',
            border: `2px solid ${p.accent}`,
            boxShadow: p.shadowAvatar,
          }}
        />
      );
      case 'name': return (
        <h1 style={{
          fontFamily: theme.fonts.display,
          fontSize: '2.8rem',
          fontWeight: 400,
          marginBottom: 12,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          textShadow: p.flourish ? `0 0 20px ${tint(p.accent, 15)}` : undefined,
        }}>
          {settings.name}
        </h1>
      );
      case 'tagline': return tagline ? (
        <p style={{ color: fg2, fontSize: '1.1rem', marginBottom: 8, fontFamily: theme.fonts.sans }}>
          {tagline}
        </p>
      ) : null;
      case 'nowPlaying': return (
        <div style={{ margin: '12px 0 20px' }}>
          <NowPlaying />
        </div>
      );
      case 'bio': return (
        <p style={{ color: fg2, fontSize: '0.95rem', marginBottom: 32, maxWidth: 520, margin: '0 auto 32px', lineHeight: 1.6 }}>
          {data.bio}
        </p>
      );
      case 'buttons': return (
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
          <a
            href="#projects"
            style={{
              background: isDark ? `linear-gradient(135deg, ${p.accent}, ${p.accentHover})` : p.accent,
              color: p.onAccent,
              padding: '12px 28px',
              borderRadius: theme.radii.sm,
              fontFamily: theme.fonts.sans,
              fontWeight: 600,
              fontSize: '0.95rem',
              textDecoration: 'none',
              boxShadow: p.shadowButton,
              transition: `all ${theme.motion.durationFast} ${theme.motion.timingFunction}`,
            }}
          >
            {data.primaryButtonLabel}
          </a>
          <a
            href={resumeUrl}
            style={{
              background: 'transparent',
              color: p.accentInk,
              padding: '12px 28px',
              borderRadius: theme.radii.sm,
              fontFamily: theme.fonts.sans,
              fontWeight: 600,
              fontSize: '0.95rem',
              textDecoration: 'none',
              border: `1px solid ${p.accentInk}`,
              transition: `all ${theme.motion.durationFast} ${theme.motion.timingFunction}`,
            }}
          >
            {data.cvButtonLabel}
          </a>
        </div>
      );
      case 'socials': return (
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginBottom: isLast ? 0 : 24 }}>
          {socialLinks.map(s => (
            <a
              key={s.label}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: fg2, transition: `color ${theme.motion.durationFast}` }}
              onMouseEnter={e => (e.currentTarget.style.color = p.accentInk)}
              onMouseLeave={e => (e.currentTarget.style.color = fg2)}
            >
              <s.icon size={20} />
            </a>
          ))}
        </div>
      );
    }
  };

  return (
    <section
      id={anchorId}
      style={{
        background: p.flourish ? undefined : bg,
        backgroundImage: p.flourish ? bg : undefined,
        color: fg,
        fontFamily: theme.fonts.sans,
        padding: '80px 24px',
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        transition: `all ${theme.motion.durationNormal} ${theme.motion.timingFunction}`,
      }}
    >
      {p.flourish && (
        <>
          <div style={{
            position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.6,
            backgroundImage: starfield,
          }} />
          <div style={{
            ...p.rail(`linear-gradient(180deg, ${p.accent} 0%, ${p.secondary} 40%, ${p.tertiary} 70%, ${p.highlight} 100%)`, true),
          }} />
          <div style={{
            position: 'absolute', top: '-10%', right: '20%', width: 300, height: 300,
            background: `radial-gradient(circle, ${tint(p.accent, 8)} 0%, transparent 70%)`,
            borderRadius: '50%', filter: 'blur(50px)', zIndex: 0, pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', bottom: '5%', left: '15%', width: 250, height: 250,
            background: `radial-gradient(circle, ${tint(p.secondary, 8)} 0%, transparent 70%)`,
            borderRadius: '50%', filter: 'blur(40px)', zIndex: 0, pointerEvents: 'none',
          }} />
        </>
      )}

      <div style={{ maxWidth: 720, textAlign: 'center', position: 'relative', zIndex: 10 }}>
        {visibleParts.map((key, i) => <Fragment key={key}>{renderPart(key, i === visibleParts.length - 1)}</Fragment>)}
      </div>
    </section>
  );
}
