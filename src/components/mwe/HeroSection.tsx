import { useTheme } from '@/context/ThemeContext';
import { Github, Linkedin, BookOpen, Instagram, Facebook } from 'lucide-react';

const socials = [
  { icon: Github, url: 'https://github.com/espenhk', label: 'GitHub' },
  { icon: Linkedin, url: 'https://linkedin.com/in/espen-h-kristensen-4770a525', label: 'LinkedIn' },
  { icon: BookOpen, url: 'https://medium.com/@espen-haukeland-kristensen', label: 'Medium' },
  { icon: Instagram, url: 'https://instagram.com/bgosl', label: 'Instagram' },
  { icon: Facebook, url: 'https://facebook.com/espenhk', label: 'Facebook' },
];

export default function HeroSection() {
  const { theme, isDark } = useTheme();
  const c = theme.colors;
  const bg = isDark ? c.background.dark : c.background.light;
  const fg = isDark ? c.textPrimary.dark : c.textPrimary.light;
  const fg2 = isDark ? c.textSecondary.dark : c.textSecondary.light;
  const surface = isDark ? c.surface.dark : c.surface.light;

  return (
    <section
      style={{
        background: bg,
        color: fg,
        fontFamily: theme.fonts.sans,
        padding: '80px 24px',
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: `all ${theme.motion.durationNormal} ${theme.motion.timingFunction}`,
      }}
    >
      <div style={{ maxWidth: 720, textAlign: 'center' }}>
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
            boxShadow: theme.shadows.card,
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
              background: c.accent,
              color: isDark ? '#000' : '#fff',
              padding: '12px 28px',
              borderRadius: theme.radii.sm,
              fontFamily: theme.fonts.sans,
              fontWeight: 600,
              fontSize: theme.id === 'arcadia' ? '0.7rem' : '0.95rem',
              textDecoration: 'none',
              border: `${theme.borders.width} ${theme.borders.style} ${c.accent}`,
              boxShadow: theme.shadows.card,
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
