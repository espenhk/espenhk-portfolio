import { useTheme } from '@/context/ThemeContext';
import { Github, Linkedin, BookOpen, Instagram, Facebook } from 'lucide-react';

const socials = [
  { icon: Github, url: 'https://github.com/espenhk' },
  { icon: Linkedin, url: 'https://linkedin.com/in/espen-h-kristensen-4770a525' },
  { icon: BookOpen, url: 'https://medium.com/@espen-haukeland-kristensen' },
  { icon: Instagram, url: 'https://instagram.com/bgosl' },
  { icon: Facebook, url: 'https://facebook.com/espenhk' },
];

export default function FooterSection() {
  const { theme, isDark } = useTheme();
  const c = theme.colors;
  const bg = isDark ? c.surface.dark : c.surface.light;
  const fg2 = isDark ? c.textSecondary.dark : c.textSecondary.light;
  const border = isDark ? c.border.dark : c.border.light;

  return (
    <footer
      style={{
        background: bg,
        borderTop: `1px solid ${border}`,
        padding: '32px 24px',
        textAlign: 'center',
        fontFamily: theme.fonts.sans,
        transition: `all ${theme.motion.durationNormal} ${theme.motion.timingFunction}`,
      }}
    >
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginBottom: 16 }}>
        {socials.map((s, i) => (
          <a
            key={i}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: fg2 }}
            onMouseEnter={e => (e.currentTarget.style.color = c.accent)}
            onMouseLeave={e => (e.currentTarget.style.color = fg2)}
          >
            <s.icon size={18} />
          </a>
        ))}
      </div>
      <p style={{
        color: fg2,
        fontSize: theme.id === 'arcadia' ? '0.55rem' : '0.8rem',
        fontFamily: theme.fonts.mono,
      }}>
        © {new Date().getFullYear()} Espen H. Kristensen. All rights reserved.
      </p>
    </footer>
  );
}
