import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';
import { siteConfig } from '@/data/siteConfig';
import { Mail, Linkedin, Github, ExternalLink } from 'lucide-react';

const links = [
  { icon: Linkedin, label: 'LinkedIn', href: siteConfig.socials.linkedin, color: '#99CCFF' },
  { icon: Github, label: 'GitHub', href: siteConfig.socials.github, color: '#CC99FF' },
  { icon: ExternalLink, label: 'Medium', href: siteConfig.socials.medium, color: '#FF9F1C' },
];

export default function ContactCTA() {
  const { theme, isDark } = useTheme();
  const c = theme.colors;
  const fg = isDark ? c.textPrimary.dark : c.textPrimary.light;
  const fg2 = isDark ? c.textSecondary.dark : c.textSecondary.light;

  return (
    <section
      id="contact"
      style={{
        padding: '80px 24px',
        backgroundImage: isDark
          ? 'linear-gradient(180deg, #060A18 0%, #0C1030 50%, #060A18 100%)'
          : undefined,
        background: isDark ? undefined : c.background.light,
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',
      }}
    >
      {isDark && (
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: 6,
          background: '#FF9F1C', opacity: 0.6,
        }} />
      )}

      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            fontFamily: theme.fonts.display,
            fontSize: '1.8rem',
            color: fg,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: 12,
          }}
        >
          Open Frequencies
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            fontFamily: theme.fonts.sans,
            fontSize: '0.95rem',
            color: fg2,
            lineHeight: 1.6,
            marginBottom: 32,
          }}
        >
          Interested in data engineering, AI, or just want to talk cocktails?
          <br />Hailing frequencies are always open.
        </motion.p>

        <motion.a
          href={`mailto:espen@kristensen.tech`}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            padding: '12px 28px',
            borderRadius: theme.radii.md,
            background: isDark
              ? 'linear-gradient(135deg, #FF9F1C, #E08A0C)'
              : '#1A1A2E',
            color: isDark ? '#0A0E1A' : '#F0EDDF',
            fontFamily: theme.fonts.sans,
            fontWeight: 600,
            fontSize: '0.9rem',
            textDecoration: 'none',
            boxShadow: isDark
              ? '0 0 20px rgba(255,159,28,0.3)'
              : '0 2px 8px rgba(0,0,0,0.15)',
            cursor: 'pointer',
          }}
        >
          <Mail size={18} />
          Send Transmission
        </motion.a>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.35 }}
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 20,
            marginTop: 28,
          }}
        >
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <motion.a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.15, y: -2 }}
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: theme.radii.md,
                  background: isDark ? `${link.color}10` : `${link.color}15`,
                  border: `1px solid ${isDark ? `${link.color}25` : `${link.color}30`}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                  cursor: 'pointer',
                }}
              >
                <Icon size={18} color={link.color} />
              </motion.a>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
