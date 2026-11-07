import { useTheme } from '@/context/ThemeContext';
import { buildSocialLinks } from '@/data/siteConfig';
import { useSiteSettings } from '@/cms/api';
import { brandColors } from '@/data/brandColors';
import { tint } from '@/design-system/palette';

export default function FooterSection() {
  const { theme, palette: p } = useTheme();
  const settings = useSiteSettings();
  const socialLinks = buildSocialLinks(settings.socials);
  const footerBg = p.footerBg;
  const fg2 = p.fg2;
  const hoverColor = (label: string) => (label === 'LinkedIn' ? p.linkedin : brandColors[label] || p.accentInk);

  return (
    <footer
      style={{
        background: p.flourish ? undefined : footerBg,
        backgroundImage: p.flourish ? footerBg : undefined,
        borderTop: `1px solid ${p.flourish ? tint(p.accent, 8) : p.border}`,
        padding: '32px 24px',
        textAlign: 'center',
        fontFamily: theme.fonts.sans,
        transition: `all ${theme.motion.durationNormal} ${theme.motion.timingFunction}`,
        position: 'relative',
      }}
    >
      {p.flourish && <div style={p.rail(`linear-gradient(180deg, ${p.success}, ${p.tertiary})`)} />}
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginBottom: 16 }}>
        {socialLinks.map((s) => (
          <a
            key={s.label}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: fg2, transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = hoverColor(s.label))}
            onMouseLeave={e => (e.currentTarget.style.color = fg2)}
          >
            <s.icon size={18} />
          </a>
        ))}
      </div>
      <p style={{ color: fg2, fontSize: '0.8rem', fontFamily: theme.fonts.mono }}>
        © {new Date().getFullYear()} {settings.name}. All rights reserved.
      </p>
    </footer>
  );
}
