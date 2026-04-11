import { useTheme } from '@/context/ThemeContext';
import { Github, Linkedin, BookOpen, Instagram, Facebook } from 'lucide-react';
import { Suspense, lazy } from 'react';

const FoxglenScene = lazy(() => import('./FoxglenScene'));

const socials = [
  { icon: Github, url: 'https://github.com/espenhk', label: 'GitHub' },
  { icon: Linkedin, url: 'https://linkedin.com/in/espen-h-kristensen-4770a525', label: 'LinkedIn' },
  { icon: BookOpen, url: 'https://medium.com/@espen-haukeland-kristensen', label: 'Medium' },
  { icon: Instagram, url: 'https://instagram.com/bgosl', label: 'Instagram' },
  { icon: Facebook, url: 'https://facebook.com/espenhk', label: 'Facebook' },
];

function getHeroBg(themeId: string, isDark: boolean, c: any): string {
  if (!isDark) return c.background.light;

  switch (themeId) {
    case 'cupertino':
      return `linear-gradient(180deg, #0A0A0A 0%, #0D1117 50%, #101820 100%)`;
    case 'arcadia':
      return `linear-gradient(180deg, #0F0F1B 0%, #1A1030 40%, #0F0F1B 100%)`;
    case 'nightcity':
      return `linear-gradient(135deg, #0D0E14 0%, #1A0A2E 30%, #0D1A1A 60%, #0D0E14 100%)`;
    case 'starfleet':
      return `linear-gradient(180deg, #0A0E1A 0%, #0E1830 50%, #0A0E1A 100%)`;
    case 'foxglen':
      return `linear-gradient(180deg, #1E1B17 0%, #2A2218 50%, #1E1B17 100%)`;
    default:
      return c.background.dark;
  }
}

function getThemeOverlay(themeId: string, isDark: boolean): React.ReactNode {
  if (!isDark) return null;

  switch (themeId) {
    case 'nightcity':
      return (
        <>
          {/* Scanlines */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,240,255,0.015) 2px, rgba(0,240,255,0.015) 4px)',
          }} />
          {/* Neon glow orbs */}
          <div style={{
            position: 'absolute', top: '10%', left: '15%', width: 300, height: 300,
            background: 'radial-gradient(circle, rgba(0,240,255,0.08) 0%, transparent 70%)',
            borderRadius: '50%', filter: 'blur(60px)', zIndex: 0, pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', bottom: '10%', right: '10%', width: 250, height: 250,
            background: 'radial-gradient(circle, rgba(255,42,109,0.08) 0%, transparent 70%)',
            borderRadius: '50%', filter: 'blur(60px)', zIndex: 0, pointerEvents: 'none',
          }} />
        </>
      );
    case 'arcadia':
      return (
        <>
          {/* CRT vignette */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
            background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)',
          }} />
          {/* Pixel grid */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', opacity: 0.04,
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '4px 4px',
          }} />
        </>
      );
    case 'starfleet':
      return (
        <>
          {/* Star field dots */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.5,
            backgroundImage: `radial-gradient(1px 1px at 10% 20%, rgba(255,255,255,0.5) 0%, transparent 100%),
              radial-gradient(1px 1px at 30% 60%, rgba(255,255,255,0.4) 0%, transparent 100%),
              radial-gradient(1px 1px at 50% 10%, rgba(255,255,255,0.3) 0%, transparent 100%),
              radial-gradient(1px 1px at 70% 80%, rgba(255,255,255,0.5) 0%, transparent 100%),
              radial-gradient(1px 1px at 90% 40%, rgba(255,255,255,0.4) 0%, transparent 100%),
              radial-gradient(1.5px 1.5px at 20% 90%, rgba(255,159,28,0.4) 0%, transparent 100%),
              radial-gradient(1.5px 1.5px at 80% 15%, rgba(153,204,255,0.4) 0%, transparent 100%),
              radial-gradient(1px 1px at 45% 45%, rgba(255,255,255,0.3) 0%, transparent 100%),
              radial-gradient(1px 1px at 65% 25%, rgba(255,255,255,0.4) 0%, transparent 100%),
              radial-gradient(1px 1px at 15% 75%, rgba(255,255,255,0.3) 0%, transparent 100%)`,
          }} />
          {/* LCARS accent bar */}
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: 6, zIndex: 2,
            background: `linear-gradient(180deg, #FF9F1C 0%, #CC99FF 40%, #99CCFF 70%, #E8655A 100%)`,
            opacity: 0.7,
          }} />
        </>
      );
    case 'cupertino':
      return (
        <div style={{
          position: 'absolute', top: '-20%', right: '-10%', width: 500, height: 500,
          background: 'radial-gradient(circle, rgba(0,113,227,0.06) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(80px)', zIndex: 0, pointerEvents: 'none',
        }} />
      );
    default:
      return null;
  }
}

export default function HeroSection() {
  const { theme, isDark } = useTheme();
  const c = theme.colors;
  const bg = getHeroBg(theme.id, isDark, c);
  const fg = isDark ? c.textPrimary.dark : c.textPrimary.light;
  const fg2 = isDark ? c.textSecondary.dark : c.textSecondary.light;

  const isGradient = isDark && bg.includes('gradient');

  return (
    <section
      style={{
        background: isGradient ? undefined : bg,
        backgroundImage: isGradient ? bg : undefined,
        color: fg,
        fontFamily: theme.fonts.sans,
        padding: theme.id === 'foxglen' ? '40px 24px 0' : '80px 24px',
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
      {getThemeOverlay(theme.id, isDark)}

      {/* Foxglen 3D scene */}
      {theme.id === 'foxglen' && (
        <Suspense fallback={null}>
          <div style={{ width: '100%', maxWidth: 600, position: 'relative', zIndex: 2 }}>
            <FoxglenScene height={220} />
          </div>
        </Suspense>
      )}

      <div style={{ maxWidth: 720, textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <img
          src="https://avatars.githubusercontent.com/u/9327813?v=4"
          alt="Espen H. Kristensen"
          style={{
            width: 140,
            height: 140,
            borderRadius: theme.radii.full,
            objectFit: 'cover',
            margin: '0 auto 24px',
            border: `${theme.borders.width} ${theme.borders.style} ${c.accent}`,
            boxShadow: theme.id === 'nightcity' && isDark
              ? `0 0 20px rgba(0,240,255,0.2), 0 0 40px rgba(0,240,255,0.05)`
              : theme.id === 'foxglen' && isDark
              ? `0 0 15px rgba(212,184,123,0.2)`
              : theme.shadows.card,
          }}
        />
        <h1
          style={{
            fontFamily: theme.fonts.display,
            fontSize: theme.id === 'arcadia' ? '1.25rem' : '2.5rem',
            fontWeight: 700,
            marginBottom: 12,
            letterSpacing: theme.id === 'nightcity' ? '0.1em' : undefined,
            textTransform: theme.id === 'nightcity' || theme.id === 'starfleet' ? 'uppercase' : undefined,
            textShadow: theme.id === 'nightcity' && isDark ? '0 0 30px rgba(0,240,255,0.3)' : undefined,
          }}
        >
          Espen H. Kristensen
        </h1>
        <p style={{ color: fg2, fontSize: '1.1rem', marginBottom: 8, fontFamily: theme.fonts.sans }}>
          Data Engineer · Manager @ PwC Norway
        </p>
        <p style={{ color: fg2, fontSize: '0.95rem', marginBottom: 32, maxWidth: 520, margin: '0 auto 32px', lineHeight: 1.6 }}>
          Passionate about data engineering, LLMs and responsible AI. Mathematical background, sports geek, cocktail nerd.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
          <a
            href="#projects"
            style={{
              background: theme.id === 'nightcity' && isDark
                ? `linear-gradient(135deg, ${c.accent}, ${c.accentHover})`
                : c.accent,
              color: isDark ? '#000' : '#fff',
              padding: '12px 28px',
              borderRadius: theme.radii.sm,
              fontFamily: theme.fonts.sans,
              fontWeight: 600,
              fontSize: theme.id === 'arcadia' ? '0.7rem' : '0.95rem',
              textDecoration: 'none',
              border: `${theme.borders.width} ${theme.borders.style} ${c.accent}`,
              boxShadow: theme.id === 'nightcity' && isDark
                ? `0 0 15px ${c.accent}40`
                : theme.shadows.card,
              transition: `all ${theme.motion.durationFast} ${theme.motion.timingFunction}`,
            }}
          >
            View Projects
          </a>
          <a
            href="#"
            style={{
              background: 'transparent',
              color: c.accent,
              padding: '12px 28px',
              borderRadius: theme.radii.sm,
              fontFamily: theme.fonts.sans,
              fontWeight: 600,
              fontSize: theme.id === 'arcadia' ? '0.7rem' : '0.95rem',
              textDecoration: 'none',
              border: `${theme.borders.width} ${theme.borders.style} ${c.accent}`,
              transition: `all ${theme.motion.durationFast} ${theme.motion.timingFunction}`,
            }}
          >
            Download CV
          </a>
        </div>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
          {socials.map(s => (
            <a
              key={s.label}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: fg2, transition: `color ${theme.motion.durationFast}` }}
              onMouseEnter={e => (e.currentTarget.style.color = c.accent)}
              onMouseLeave={e => (e.currentTarget.style.color = fg2)}
            >
              <s.icon size={20} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
