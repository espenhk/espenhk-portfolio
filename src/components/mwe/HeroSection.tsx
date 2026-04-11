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
      return `linear-gradient(160deg, #06090F 0%, #0A1628 35%, #0D1F3D 55%, #081428 75%, #050A14 100%)`;
    case 'arcadia':
      return `linear-gradient(180deg, #0A0818 0%, #1A0C30 25%, #0D1A0D 50%, #0A0818 100%)`;
    case 'nightcity':
      return `linear-gradient(135deg, #0A0010 0%, #1A0030 20%, #001A1A 45%, #0D0020 70%, #0A0010 100%)`;
    case 'starfleet':
      return `linear-gradient(180deg, #060A18 0%, #0C1230 30%, #14102A 55%, #0A0E20 80%, #060A18 100%)`;
    case 'foxglen':
      return `linear-gradient(180deg, #1E1B17 0%, #2A2218 50%, #1E1B17 100%)`;
    default:
      return c.background.dark;
  }
}

function getThemeOverlay(themeId: string, isDark: boolean, c: any): React.ReactNode {
  if (!isDark) return null;

  switch (themeId) {
    case 'nightcity':
      return (
        <>
          {/* Scanlines */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,240,255,0.02) 2px, rgba(0,240,255,0.02) 4px)',
          }} />
          {/* Cyan glow — top left */}
          <div style={{
            position: 'absolute', top: '-5%', left: '5%', width: 400, height: 400,
            background: 'radial-gradient(circle, rgba(0,240,255,0.12) 0%, rgba(0,240,255,0.04) 40%, transparent 70%)',
            borderRadius: '50%', filter: 'blur(60px)', zIndex: 0, pointerEvents: 'none',
          }} />
          {/* Magenta glow — bottom right */}
          <div style={{
            position: 'absolute', bottom: '0%', right: '5%', width: 350, height: 350,
            background: 'radial-gradient(circle, rgba(255,42,109,0.12) 0%, rgba(255,42,109,0.04) 40%, transparent 70%)',
            borderRadius: '50%', filter: 'blur(50px)', zIndex: 0, pointerEvents: 'none',
          }} />
          {/* Yellow accent — center */}
          <div style={{
            position: 'absolute', top: '40%', left: '50%', width: 200, height: 200,
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(252,238,10,0.05) 0%, transparent 70%)',
            borderRadius: '50%', filter: 'blur(40px)', zIndex: 0, pointerEvents: 'none',
          }} />
          {/* Grid lines */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.03,
            backgroundImage: 'linear-gradient(rgba(0,240,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }} />
        </>
      );
    case 'arcadia':
      return (
        <>
          {/* CRT vignette */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)',
          }} />
          {/* Pixel grid */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', opacity: 0.06,
            backgroundImage: 'linear-gradient(rgba(247,213,29,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(247,213,29,0.3) 1px, transparent 1px)',
            backgroundSize: '4px 4px',
          }} />
          {/* Orange/amber central glow */}
          <div style={{
            position: 'absolute', top: '25%', left: '50%', width: 500, height: 400,
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(ellipse, rgba(231,110,85,0.1) 0%, rgba(247,213,29,0.04) 40%, transparent 70%)',
            borderRadius: '50%', zIndex: 0, pointerEvents: 'none',
          }} />
          {/* Blue accent — top left */}
          <div style={{
            position: 'absolute', top: 0, left: 0, width: 250, height: 250,
            background: 'radial-gradient(circle at 0% 0%, rgba(32,156,238,0.1) 0%, transparent 70%)',
            zIndex: 0, pointerEvents: 'none',
          }} />
          {/* Orange accent — bottom right */}
          <div style={{
            position: 'absolute', bottom: 0, right: 0, width: 300, height: 300,
            background: 'radial-gradient(circle at 100% 100%, rgba(231,110,85,0.12) 0%, rgba(247,213,29,0.05) 40%, transparent 70%)',
            zIndex: 0, pointerEvents: 'none',
          }} />
          {/* Horizontal scanline band */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', opacity: 0.03,
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(231,110,85,0.4) 3px, rgba(231,110,85,0.4) 4px)',
          }} />
        </>
      );
    case 'starfleet':
      return (
        <>
          {/* Star field dots */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.6,
            backgroundImage: `radial-gradient(1px 1px at 10% 20%, rgba(255,255,255,0.6) 0%, transparent 100%),
              radial-gradient(1px 1px at 30% 60%, rgba(255,255,255,0.4) 0%, transparent 100%),
              radial-gradient(1px 1px at 50% 10%, rgba(255,255,255,0.3) 0%, transparent 100%),
              radial-gradient(1px 1px at 70% 80%, rgba(255,255,255,0.5) 0%, transparent 100%),
              radial-gradient(1px 1px at 90% 40%, rgba(255,255,255,0.4) 0%, transparent 100%),
              radial-gradient(2px 2px at 20% 90%, rgba(255,159,28,0.5) 0%, transparent 100%),
              radial-gradient(2px 2px at 80% 15%, rgba(153,204,255,0.5) 0%, transparent 100%),
              radial-gradient(1.5px 1.5px at 45% 45%, rgba(204,153,255,0.4) 0%, transparent 100%),
              radial-gradient(1px 1px at 65% 25%, rgba(255,255,255,0.4) 0%, transparent 100%),
              radial-gradient(1.5px 1.5px at 15% 75%, rgba(232,101,90,0.4) 0%, transparent 100%)`,
          }} />
          {/* LCARS accent bar */}
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: 6, zIndex: 2,
            background: `linear-gradient(180deg, #FF9F1C 0%, #CC99FF 40%, #99CCFF 70%, #E8655A 100%)`,
            opacity: 0.8,
          }} />
          {/* Amber glow — top */}
          <div style={{
            position: 'absolute', top: '-10%', right: '20%', width: 300, height: 300,
            background: 'radial-gradient(circle, rgba(255,159,28,0.08) 0%, transparent 70%)',
            borderRadius: '50%', filter: 'blur(50px)', zIndex: 0, pointerEvents: 'none',
          }} />
          {/* Lavender glow — bottom */}
          <div style={{
            position: 'absolute', bottom: '5%', left: '15%', width: 250, height: 250,
            background: 'radial-gradient(circle, rgba(204,153,255,0.08) 0%, transparent 70%)',
            borderRadius: '50%', filter: 'blur(40px)', zIndex: 0, pointerEvents: 'none',
          }} />
        </>
      );
    case 'cupertino':
      return (
        <>
          {/* Large blue radial */}
          <div style={{
            position: 'absolute', top: '-30%', right: '-15%', width: 600, height: 600,
            background: 'radial-gradient(circle, rgba(0,113,227,0.1) 0%, rgba(0,113,227,0.03) 50%, transparent 70%)',
            borderRadius: '50%', filter: 'blur(80px)', zIndex: 0, pointerEvents: 'none',
          }} />
          {/* Subtle violet accent */}
          <div style={{
            position: 'absolute', bottom: '-10%', left: '10%', width: 400, height: 400,
            background: 'radial-gradient(circle, rgba(88,86,214,0.06) 0%, transparent 70%)',
            borderRadius: '50%', filter: 'blur(60px)', zIndex: 0, pointerEvents: 'none',
          }} />
        </>
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
      {getThemeOverlay(theme.id, isDark, c)}

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
              ? `0 0 25px ${c.accent}40, 0 0 50px ${c.accent}15`
              : theme.id === 'starfleet' && isDark
              ? `0 0 20px rgba(255,159,28,0.2)`
              : theme.id === 'arcadia' && isDark
              ? `0 0 0 4px ${c.accent}, 4px 4px 0 4px rgba(0,0,0,0.3)`
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
            letterSpacing: theme.id === 'nightcity' ? '0.1em' : theme.id === 'starfleet' ? '0.05em' : undefined,
            textTransform: theme.id === 'nightcity' || theme.id === 'starfleet' ? 'uppercase' : undefined,
            textShadow: theme.id === 'nightcity' && isDark
              ? `0 0 30px ${c.accent}50, 0 0 60px ${c.accent}20`
              : theme.id === 'starfleet' && isDark
              ? '0 0 20px rgba(255,159,28,0.15)'
              : theme.id === 'arcadia' && isDark
              ? `2px 2px 0 ${c.accent}40`
              : undefined,
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
                : theme.id === 'starfleet' && isDark
                ? `linear-gradient(135deg, ${c.accent}, #E08A0C)`
                : c.accent,
              color: isDark && theme.id !== 'foxglen' ? '#000' : '#fff',
              padding: '12px 28px',
              borderRadius: theme.radii.sm,
              fontFamily: theme.fonts.sans,
              fontWeight: 600,
              fontSize: theme.id === 'arcadia' ? '0.7rem' : '0.95rem',
              textDecoration: 'none',
              border: `${theme.borders.width} ${theme.borders.style} ${c.accent}`,
              boxShadow: theme.id === 'nightcity' && isDark
                ? `0 0 20px ${c.accent}50, 0 4px 15px rgba(0,0,0,0.3)`
                : theme.id === 'starfleet' && isDark
                ? `0 0 15px rgba(255,159,28,0.3)`
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
