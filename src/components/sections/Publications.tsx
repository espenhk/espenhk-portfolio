import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { publications } from '@/data/experience';
import { ExternalLink, BookOpen, Layers } from 'lucide-react';

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  return match ? match[1] : null;
}

function getMediumPreviewImage(url: string): string {
  // Use a gradient placeholder — Medium doesn't expose OG images easily
  return '';
}

const typeColor: Record<string, string> = {
  article: '#FF9F1C',
  video: '#E8655A',
  series: '#CC99FF',
};

const SCROLL_HIDE_CSS = `
.transmissions-scroll::-webkit-scrollbar { display: none; }
@media (min-width: 768px) {
  .transmissions-scroll > div { min-width: 38vw !important; max-width: 38vw !important; }
}
`;

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
      ref={ref}>
      <style>{SCROLL_HIDE_CSS}</style>
      <div style={{
        padding: '60px 24px',
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
          marginBottom: 24,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          textAlign: 'center',
        }}>
          Transmissions
        </h2>

        <div style={{
          display: 'flex',
          gap: 16,
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          paddingBottom: 8,
          marginLeft: -24,
          marginRight: -24,
          paddingLeft: 24,
          paddingRight: 24,
          WebkitOverflowScrolling: 'touch',
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        }}>
          {publications.map((pub, i) => {
            const color = typeColor[pub.type];
            const ytId = pub.type === 'video' ? getYouTubeId(pub.url) : null;
            const isVideo = !!ytId;

            return (
              <motion.div
                key={pub.title}
                initial={{ opacity: 0, x: 30 }}
                animate={visible ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                style={{
                  background: isDark ? undefined : panelBg,
                  backgroundImage: isDark ? panelBg : undefined,
                  borderRadius: theme.radii.md,
                  border: `1px solid ${isDark ? `${color}15` : border}`,
                  boxShadow: isDark ? theme.shadows.card : '0 1px 4px rgba(0,0,0,0.06)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  minWidth: '80vw',
                  maxWidth: '80vw',
                  scrollSnapAlign: 'start',
                  flexShrink: 0,
                }}
              >
                {/* Preview area */}
                {isVideo ? (
                  <div style={{
                    position: 'relative',
                    width: '100%',
                    paddingBottom: '56.25%',
                  }}>
                    <iframe
                      src={`https://www.youtube.com/embed/${ytId}`}
                      title={pub.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{
                        position: 'absolute',
                        top: 0, left: 0,
                        width: '100%',
                        height: '100%',
                        border: 'none',
                      }}
                    />
                  </div>
                ) : (
                  <a
                    href={pub.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'block',
                      height: 120,
                      background: isDark
                        ? `linear-gradient(135deg, ${color}15, ${color}08)`
                        : `linear-gradient(135deg, ${color}10, ${color}05)`,
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      {pub.type === 'series' ? (
                        <Layers size={32} color={color} style={{ opacity: 0.4 }} />
                      ) : (
                        <BookOpen size={32} color={color} style={{ opacity: 0.4 }} />
                      )}
                    </div>
                    <div style={{
                      position: 'absolute',
                      top: 8, right: 8,
                      width: 24, height: 24,
                      borderRadius: '50%',
                      background: 'rgba(0,0,0,0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <ExternalLink size={12} color="#fff" />
                    </div>
                  </a>
                )}

                {/* Info */}
                <div style={{ padding: '12px 14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6,
                  }}>
                    <span style={{
                      fontFamily: theme.fonts.mono, fontSize: '0.6rem',
                      color, textTransform: 'uppercase', letterSpacing: '0.05em',
                      background: `${color}12`,
                      padding: '2px 6px',
                      borderRadius: theme.radii.sm,
                    }}>
                      {pub.type}
                    </span>
                    <span style={{
                      fontFamily: theme.fonts.mono, fontSize: '0.6rem', color: fg2,
                    }}>
                      {pub.date}
                    </span>
                  </div>

                  <a
                    href={pub.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none' }}
                  >
                    <h3 style={{
                      fontFamily: theme.fonts.sans,
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: fg,
                      lineHeight: 1.35,
                      marginBottom: 4,
                    }}>
                      {pub.title}
                    </h3>
                  </a>

                  <p style={{
                    fontFamily: theme.fonts.sans,
                    fontSize: '0.72rem',
                    color: fg2,
                    lineHeight: 1.45,
                    flex: 1,
                  }}>
                    {pub.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
