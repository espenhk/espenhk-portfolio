import { useTheme } from '@/context/ThemeContext';
import { Github, Linkedin, BookOpen, Instagram, Facebook } from 'lucide-react';

const socials = [
  { icon: Github, url: 'https://github.com/espenhk' },
  { icon: Linkedin, url: 'https://linkedin.com/in/espen-h-kristensen-4770a525' },
  { icon: BookOpen, url: 'https://medium.com/@espen-haukeland-kristensen' },
  { icon: Instagram, url: 'https://instagram.com/bgosl' },
  { icon: Facebook, url: 'https://facebook.com/espenhk' },
];

function getFooterBg(themeId: string, isDark: boolean, c: any): string {
  if (!isDark) return c.surface.light;
  switch (themeId) {
    case 'cupertino':
      return 'linear-gradient(180deg, #0A1220 0%, #060A14 100%)';
    case 'arcadia':
      return 'linear-gradient(180deg, #0C0A1E 0%, #080618 100%)';
    case 'nightcity':
      return 'linear-gradient(180deg, #0A0818 0%, #06040E 100%)';
    case 'starfleet':
      return 'linear-gradient(180deg, #0A0E20 0%, #060818 100%)';
    default:
      return c.surface.dark;
  }
}

export default function FooterSection() {
  const { theme, isDark } = useTheme();
  const c = theme.colors;
  const footerBg = getFooterBg(theme.id, isDark, c);
  const isGradient = isDark && footerBg.includes('gradient');
  const fg2 = isDark ? c.textSecondary.dark : c.textSecondary.light;
  const border = isDark ? c.border.dark : c.border.light;

  return (
    <footer
      style={{
        background: isGradient ? undefined : footerBg,
        backgroundImage: isGradient ? footerBg : undefined,
        borderTop: `1px solid ${
          theme.id === 'nightcity' && isDark ? `${c.accent}20` :
          theme.id === 'starfleet' && isDark ? `${c.accent}15` :
          border
        }`,
        padding: '32px 24px',
        textAlign: 'center',
        fontFamily: theme.fonts.sans,
        transition: `all ${theme.motion.durationNormal} ${theme.motion.timingFunction}`,
        position: 'relative',
      }}
    >
      {/* Starfleet LCARS bar */}
      {theme.id === 'starfleet' && isDark && (
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: 6,
          background: `linear-gradient(180deg, #66CC99, #99CCFF)`,
          opacity: 0.5,
        }} />
      )}
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
