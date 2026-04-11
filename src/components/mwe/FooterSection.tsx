import { useTheme } from '@/context/ThemeContext';
import { Github, Linkedin, Instagram } from 'lucide-react';

function MediumIcon({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
    </svg>
  );
}

function BlueskyIcon({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.785 2.627 3.6 3.476 6.178 3.126-4.476.742-8.463 3.058-4.741 8.627 4.476 5.103 7.192-1.386 8.063-3.584.127-.327.18-.49.226-.413.046-.077.099.086.226.413.87 2.198 3.587 8.687 8.063 3.584 3.722-5.569-.265-7.885-4.741-8.627 2.578.35 5.393-.499 6.178-3.126C20.622 9.418 21 4.458 21 3.768c0-.69-.139-1.861-.902-2.203-.659-.3-1.664-.621-4.3 1.24C13.046 4.747 10.087 8.686 9 10.8h3z"/>
    </svg>
  );
}

const socials = [
  { icon: Github, url: 'https://github.com/espenhk' },
  { icon: Linkedin, url: 'https://linkedin.com/in/espen-h-kristensen-4770a525' },
  { icon: MediumIcon, url: 'https://medium.com/@espen-haukeland-kristensen' },
  { icon: BlueskyIcon, url: 'https://bsky.app/profile/bgosl.bsky.social' },
  { icon: Instagram, url: 'https://instagram.com/bgosl' },
];

export default function FooterSection() {
  const { theme, isDark } = useTheme();
  const c = theme.colors;
  const footerBg = isDark
    ? 'linear-gradient(180deg, #0A0E20 0%, #060818 100%)'
    : c.surface.light;
  const fg2 = isDark ? c.textSecondary.dark : c.textSecondary.light;
  const border = isDark ? c.border.dark : c.border.light;

  return (
    <footer
      style={{
        background: isDark ? undefined : footerBg,
        backgroundImage: isDark ? footerBg : undefined,
        borderTop: `1px solid ${isDark ? `${c.accent}15` : border}`,
        padding: '32px 24px',
        textAlign: 'center',
        fontFamily: theme.fonts.sans,
        transition: `all ${theme.motion.durationNormal} ${theme.motion.timingFunction}`,
        position: 'relative',
      }}
    >
      {isDark && (
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
      <p style={{ color: fg2, fontSize: '0.8rem', fontFamily: theme.fonts.mono }}>
        © {new Date().getFullYear()} Espen H. Kristensen. All rights reserved.
      </p>
    </footer>
  );
}
