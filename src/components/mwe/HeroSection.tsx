import { useTheme } from '@/context/ThemeContext';
import { Github, Linkedin, Instagram, Facebook } from 'lucide-react';

function MediumIcon({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
    </svg>
  );
}

const socials = [
  { icon: Github, url: 'https://github.com/espenhk', label: 'GitHub' },
  { icon: Linkedin, url: 'https://linkedin.com/in/espen-h-kristensen-4770a525', label: 'LinkedIn' },
  { icon: MediumIcon, url: 'https://medium.com/@espen-haukeland-kristensen', label: 'Medium' },
  { icon: Instagram, url: 'https://instagram.com/bgosl', label: 'Instagram' },
  { icon: Facebook, url: 'https://facebook.com/espenhk', label: 'Facebook' },
];

export default function HeroSection() {
  const { theme, isDark } = useTheme();
  const c = theme.colors;
  const bg = isDark
    ? `linear-gradient(180deg, #060A18 0%, #0C1230 30%, #14102A 55%, #0A0E20 80%, #060A18 100%)`
    : c.background.light;
  const fg = isDark ? c.textPrimary.dark : c.textPrimary.light;
  const fg2 = isDark ? c.textSecondary.dark : c.textSecondary.light;

  return (
    <section
      style={{
        background: isDark ? undefined : bg,
        backgroundImage: isDark ? bg : undefined,
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
      {/* Star field */}
      {isDark && (
        <>
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
          {/* Amber glow */}
          <div style={{
            position: 'absolute', top: '-10%', right: '20%', width: 300, height: 300,
            background: 'radial-gradient(circle, rgba(255,159,28,0.08) 0%, transparent 70%)',
            borderRadius: '50%', filter: 'blur(50px)', zIndex: 0, pointerEvents: 'none',
          }} />
          {/* Lavender glow */}
          <div style={{
            position: 'absolute', bottom: '5%', left: '15%', width: 250, height: 250,
            background: 'radial-gradient(circle, rgba(204,153,255,0.08) 0%, transparent 70%)',
            borderRadius: '50%', filter: 'blur(40px)', zIndex: 0, pointerEvents: 'none',
          }} />
        </>
      )}

      <div style={{ maxWidth: 720, textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <img
          src="https://avatars.githubusercontent.com/u/9327813?v=4"
          alt="Espen H. Kristensen"
          style={{
            width: 140, height: 140,
            borderRadius: theme.radii.full,
            objectFit: 'cover',
            margin: '0 auto 24px',
            border: `2px solid ${c.accent}`,
            boxShadow: isDark ? `0 0 20px rgba(255,159,28,0.2)` : theme.shadows.card,
          }}
        />
        <h1 style={{
          fontFamily: theme.fonts.display,
          fontSize: '2.8rem',
          fontWeight: 400,
          marginBottom: 12,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          textShadow: isDark ? '0 0 20px rgba(255,159,28,0.15)' : undefined,
        }}>
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
              background: isDark ? `linear-gradient(135deg, ${c.accent}, #E08A0C)` : c.accent,
              color: isDark ? '#000' : '#fff',
              padding: '12px 28px',
              borderRadius: theme.radii.sm,
              fontFamily: theme.fonts.sans,
              fontWeight: 600,
              fontSize: '0.95rem',
              textDecoration: 'none',
              boxShadow: isDark ? `0 0 15px rgba(255,159,28,0.3)` : theme.shadows.card,
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
              fontSize: '0.95rem',
              textDecoration: 'none',
              border: `1px solid ${c.accent}`,
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
