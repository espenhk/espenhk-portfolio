import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { publications } from '@/data/experience';
import { ExternalLink, BookOpen, Video, Layers } from 'lucide-react';

const typeIcon = {
  article: BookOpen,
  video: Video,
  series: Layers,
} as const;

const typeColor: Record<string, string> = {
  article: '#FF9F1C',
  video: '#E8655A',
  series: '#CC99FF',
};

export default function Publications() {
  const { theme, isDark } = useTheme();
  const c = theme.colors;
  const fg = isDark ? c.textPrimary.dark : c.textPrimary.light;
  const fg2 = isDark ? c.textSecondary.dark : c.textSecondary.light;
  const border = isDark ? c.border.dark : c.border.light;
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const panelBg = isDark
    ? 'linear-gradient(145deg, #0C1228 0%, #101A38 50%, #0C1228 100%)'
    : '#FFFFFF';

  return (
    <section
      id="publications"
      ref={ref}
      style={{
        padding: '80px 24px',
        backgroundImage: isDark
          ? 'linear-gradient(180deg, #060A18 0%, #0C1030 50%, #060A18 100%)'
          : undefined,
        background: isDark ? undefined : c.background.light,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {isDark && (
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: 6,
          background: '#E8655A', opacity: 0.6,
        }} />
      )}

      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <h2 style={{
          fontFamily: theme.fonts.display,
          fontSize: '1.8rem',
          color: fg,
          marginBottom: 40,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          textAlign: 'center',
        }}>
          Transmissions
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {publications.map((pub, i) => {
            const Icon = typeIcon[pub.type];
            const color = typeColor[pub.type];

            return (
              <motion.a
                key={pub.title}
                href={pub.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={visible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                style={{
                  textDecoration: 'none',
                  background: isDark ? undefined : panelBg,
                  backgroundImage: isDark ? panelBg : undefined,
                  borderRadius: theme.radii.md,
                  padding: '20px 22px',
                  border: `1px solid ${isDark ? `${color}15` : border}`,
                  boxShadow: isDark ? theme.shadows.card : '0 1px 4px rgba(0,0,0,0.06)',
                  display: 'block',
                  transition: `all ${theme.motion.durationFast} ease`,
                }}
                whileHover={{
                  scale: 1.01,
                  boxShadow: isDark
                    ? `0 0 20px ${color}15, ${theme.shadows.cardHover}`
                    : theme.shadows.cardHover,
                }}
              >
                <div style={{
                  display: 'flex', alignItems: 'flex-start', gap: 14,
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: theme.radii.sm,
                    background: `${color}12`,
                    border: `1px solid ${color}25`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: 2,
                  }}>
                    <Icon size={16} color={color} />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                      gap: 8, marginBottom: 4, flexWrap: 'wrap',
                    }}>
                      <h3 style={{
                        fontFamily: theme.fonts.sans,
                        fontSize: '0.92rem',
                        fontWeight: 600,
                        color: fg,
                        lineHeight: 1.35,
                      }}>
                        {pub.title}
                      </h3>
                      <span style={{
                        fontFamily: theme.fonts.mono,
                        fontSize: '0.68rem',
                        color,
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                      }}>
                        {pub.date}
                      </span>
                    </div>
                    <p style={{
                      fontFamily: theme.fonts.sans,
                      fontSize: '0.82rem',
                      color: fg2,
                      lineHeight: 1.5,
                      marginBottom: 6,
                    }}>
                      {pub.description}
                    </p>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                    }}>
                      <span style={{
                        fontFamily: theme.fonts.mono,
                        fontSize: '0.68rem',
                        color,
                        textTransform: 'uppercase',
                      }}>
                        {pub.type}
                      </span>
                      <ExternalLink size={12} color={fg2} style={{ opacity: 0.5 }} />
                    </div>
                  </div>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
