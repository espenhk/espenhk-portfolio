import { useTheme } from '@/context/ThemeContext';
import { siteConfig, socialLinks } from '@/data/siteConfig';

const brandColors: Record<string, string> = {
  GitHub: '#333333',
  LinkedIn: '#0A66C2',
  Medium: '#000000',
  Bluesky: '#0085FF',
  Instagram: '#E1306C',
};

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
        {socialLinks.map((s) => (
          <a
            key={s.label}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: fg2, transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = brandColors[s.label] || c.accent)}
            onMouseLeave={e => (e.currentTarget.style.color = fg2)}
          >
            <s.icon size={18} />
          </a>
        ))}
      </div>
      <p style={{ color: fg2, fontSize: '0.8rem', fontFamily: theme.fonts.mono }}>
        © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
      </p>
    </footer>
  );
}
