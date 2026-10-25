import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { publications as fallbackPubs, type Publication } from '@/data/experience';
import { linkedInPosts } from '@/data/linkedInPosts';
import { fetchMediumArticles, fetchYouTubeVideos } from '@/lib/feeds';
import { defaultSectionData } from '@/cms/defaults';
import type { PublicationsData } from '@/cms/types';
import { ExternalLink, BookOpen, Layers, ThumbsUp, MessageCircle } from 'lucide-react';

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  return match ? match[1] : null;
}

const typeColor: Record<string, string> = {
  article: '#FF9F1C',
  video: '#E8655A',
  series: '#CC99FF',
};

const liTypeColor: Record<string, string> = {
  post: '#0A66C2',
  comment: '#57A773',
  article: '#E7A33E',
};

function LinkedInIcon({ size = 14, color = '#0A66C2' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

const SCROLL_HIDE_CSS = `
.transmissions-scroll::-webkit-scrollbar { display: none; }
.li-scroll::-webkit-scrollbar { display: none; }
@media (min-width: 768px) {
  .transmissions-scroll > div { min-width: 38vw !important; max-width: 38vw !important; }
  .scroll-arrow { display: flex !important; }
  .li-arrow { display: flex !important; }
}
`;

export default function Publications({ data = defaultSectionData.publications, anchorId = 'publications' }: { data?: PublicationsData; anchorId?: string }) {
  const { theme, isDark } = useTheme();
  const c = theme.colors;
  const fg = isDark ? c.textPrimary.dark : c.textPrimary.light;
  const fg2 = isDark ? c.textSecondary.dark : c.textSecondary.light;
  const border = isDark ? c.border.dark : c.border.light;
  const [visible, setVisible] = useState(false);
  const [publications, setPublications] = useState<Publication[]>(fallbackPubs);
  const ref = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const liScrollRef = useRef<HTMLDivElement>(null);
  const [transScrolled, setTransScrolled] = useState(false);
  const [liScrolled, setLiScrolled] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setTransScrolled(el.scrollLeft > 10);
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const el = liScrollRef.current;
    if (!el) return;
    const onScroll = () => setLiScrolled(el.scrollLeft > 10);
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    (async () => {
      const [medium, youtube] = await Promise.all([
        data.showMedium ? fetchMediumArticles(data.mediumUsername) : Promise.resolve([]),
        data.showYouTube ? fetchYouTubeVideos(data.youtubeChannelId) : Promise.resolve([]),
      ]);
      const live = [...medium, ...youtube];
      if (live.length > 0) {
        const stripQs = (u: string) => u.split('?')[0];
        const seen = new Set(live.map(p => stripQs(p.url)));
        const extra = fallbackPubs.filter(p => !seen.has(stripQs(p.url)));
        const all = [...live, ...extra];
        all.sort((a, b) => {
          const parse = (d: string) => {
            const [m, y] = d.split('.');
            return new Date(`${y}-${m}-01`).getTime();
          };
          return parse(b.date) - parse(a.date);
        });
        setPublications(all);
      }
    })();
  }, [data.showMedium, data.showYouTube, data.mediumUsername, data.youtubeChannelId]);

  const shownPubs = publications
    .filter(p => (p.type === 'video' ? data.showYouTube : data.showMedium))
    .slice(0, Math.max(1, data.maxItems || 20));

  const panelBg = isDark
    ? 'linear-gradient(145deg, #0C1228 0%, #101A38 50%, #0C1228 100%)'
    : '#FFFFFF';

  return (
    <>
      <style>{SCROLL_HIDE_CSS}</style>
      <section
        id={anchorId}
        ref={ref}
        style={{
          padding: '60px 24px',
          backgroundImage: isDark
            ? 'linear-gradient(180deg, #060A18 0%, #0C1030 50%, #060A18 100%)'
            : undefined,
          background: isDark ? undefined : c.background.light,
          position: 'relative',
          overflow: 'visible',
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
          {data.heading}
        </h2>

        {/* === Medium / YouTube carousel — fixed offset === */}
        <div style={{ position: 'relative' }}>
        <div ref={scrollRef} className="transmissions-scroll" style={{
          display: 'flex',
          gap: 16,
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollPaddingLeft: 32,
          scrollPaddingRight: 24,
          paddingBottom: 8,
          marginLeft: -24,
          marginRight: -24,
          paddingLeft: 32,
          paddingRight: 24,
          WebkitOverflowScrolling: 'touch',
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        }}>
          {shownPubs.map((pub, i) => {
            const color = typeColor[pub.type];
            const ytId = pub.type === 'video' ? getYouTubeId(pub.url) : null;
            const isVideo = !!ytId;
            const hasHero = !!pub.heroImage;

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
                  minWidth: '78vw',
                  maxWidth: '78vw',
                  scrollSnapAlign: 'start',
                  flexShrink: 0,
                }}
              >
                {/* Preview area */}
                {isVideo ? (
                  <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%' }}>
                    <iframe
                      src={`https://www.youtube.com/embed/${ytId}`}
                      title={pub.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                    />
                  </div>
                ) : hasHero ? (
                  <a
                    href={pub.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'block',
                      height: 160,
                      overflow: 'hidden',
                      position: 'relative',
                    }}
                  >
                    <img
                      src={pub.heroImage}
                      alt={pub.title}
                      loading="lazy"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'top center',
                      }}
                    />
                    {/* Gradient overlay at bottom */}
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 40,
                      background: isDark
                        ? 'linear-gradient(transparent, #0C1228)'
                        : 'linear-gradient(transparent, #FFFFFF)',
                    }} />
                    <div style={{
                      position: 'absolute',
                      top: 8, right: 8,
                      width: 24, height: 24,
                      borderRadius: '50%',
                      background: 'rgba(0,0,0,0.4)',
                      backdropFilter: 'blur(4px)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <ExternalLink size={12} color="#fff" />
                    </div>
                  </a>
                ) : (
                  <a
                    href={pub.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'block', height: 120,
                      background: isDark
                        ? `linear-gradient(135deg, ${color}15, ${color}08)`
                        : `linear-gradient(135deg, ${color}10, ${color}05)`,
                      position: 'relative', overflow: 'hidden',
                    }}
                  >
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {pub.type === 'series' ? <Layers size={32} color={color} style={{ opacity: 0.4 }} /> : <BookOpen size={32} color={color} style={{ opacity: 0.4 }} />}
                    </div>
                    <div style={{ position: 'absolute', top: 8, right: 8, width: 24, height: 24, borderRadius: '50%', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ExternalLink size={12} color="#fff" />
                    </div>
                  </a>
                )}

                {/* Info */}
                <div style={{ padding: '12px 14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                    <span style={{ fontFamily: theme.fonts.mono, fontSize: '0.6rem', color, textTransform: 'uppercase', letterSpacing: '0.05em', background: `${color}12`, padding: '2px 6px', borderRadius: theme.radii.sm }}>{pub.type}</span>
                    <span style={{ fontFamily: theme.fonts.mono, fontSize: '0.6rem', color: fg2 }}>{pub.date}</span>
                    {pub.readTimeMin && <span style={{ fontFamily: theme.fonts.mono, fontSize: '0.6rem', color: fg2 }}>· {pub.readTimeMin} min read</span>}
                    {pub.durationSec && <span style={{ fontFamily: theme.fonts.mono, fontSize: '0.6rem', color: fg2 }}>· {Math.floor(pub.durationSec / 60)}:{String(pub.durationSec % 60).padStart(2, '0')}</span>}
                  </div>
                  <a href={pub.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                    <h3 style={{ fontFamily: theme.fonts.sans, fontSize: '0.82rem', fontWeight: 600, color: fg, lineHeight: 1.35, marginBottom: 4 }}>{pub.title}</h3>
                  </a>
                  <p style={{ fontFamily: theme.fonts.sans, fontSize: '0.72rem', color: fg2, lineHeight: 1.45, flex: 1 }}>{pub.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Scroll arrows */}
        {transScrolled && (
        <button
          onClick={() => scrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' })}
          style={{
            position: 'absolute', left: -4, top: '50%', transform: 'translateY(-50%)',
            width: 36, height: 36, borderRadius: '50%',
            background: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)',
            border: 'none', cursor: 'pointer', display: 'none',
            alignItems: 'center', justifyContent: 'center',
            color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.6)', transition: 'opacity 0.2s',
          }}
          className="scroll-arrow"
          onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '0.8')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        )}
        <button
          onClick={() => scrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' })}
          style={{
            position: 'absolute', right: -4, top: '50%', transform: 'translateY(-50%)',
            width: 36, height: 36, borderRadius: '50%',
            background: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)',
            border: 'none', cursor: 'pointer', display: 'none',
            alignItems: 'center', justifyContent: 'center',
            color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.6)', transition: 'opacity 0.2s',
          }}
          className="scroll-arrow"
          onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '0.8')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
        </button>
        </div>

        {/* === LinkedIn subsection === */}
        {data.showLinkedIn && (<>
        <div style={{ marginTop: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, justifyContent: 'center' }}>
            <LinkedInIcon size={18} color={isDark ? '#5B9BD5' : '#0A66C2'} />
            <h3 style={{
              fontFamily: theme.fonts.display,
              fontSize: '1.1rem',
              color: isDark ? '#5B9BD5' : '#0A66C2',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}>
              {data.linkedInHeading}
            </h3>
          </div>

          <div style={{ position: 'relative' }}>
          <div ref={liScrollRef} className="li-scroll" style={{
            display: 'flex',
            gap: 10,
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            scrollPaddingLeft: 32,
            scrollPaddingRight: 24,
            paddingBottom: 6,
            marginLeft: -24,
            marginRight: -24,
            paddingLeft: 32,
            paddingRight: 24,
            WebkitOverflowScrolling: 'touch',
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          }}>
            {linkedInPosts.map((post, i) => {
              const typeCol = liTypeColor[post.type];
              return (
                <motion.a
                  key={i}
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: 20 }}
                  animate={visible ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.3, delay: 0.3 + i * 0.06 }}
                  whileHover={{ y: -2 }}
                  style={{
                    background: isDark ? undefined : panelBg,
                    backgroundImage: isDark ? panelBg : undefined,
                    borderRadius: theme.radii.md,
                    border: `1px solid ${isDark ? `${typeCol}18` : border}`,
                    boxShadow: isDark ? theme.shadows.card : '0 1px 3px rgba(0,0,0,0.05)',
                    padding: '12px 14px',
                    minWidth: 180,
                    maxWidth: 180,
                    scrollSnapAlign: 'start',
                    flexShrink: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    textDecoration: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{
                      fontFamily: theme.fonts.mono, fontSize: '0.55rem', color: typeCol,
                      textTransform: 'uppercase', letterSpacing: '0.06em',
                      background: `${typeCol}12`, padding: '1px 5px', borderRadius: theme.radii.sm,
                    }}>
                      {post.type === 'comment' ? '💬 comment' : post.type === 'article' ? '📝 article' : '📣 post'}
                    </span>
                    <span style={{ fontFamily: theme.fonts.mono, fontSize: '0.52rem', color: fg2 }}>{post.date}</span>
                  </div>

                  <p style={{
                    fontFamily: theme.fonts.sans, fontSize: '0.68rem', color: fg,
                    lineHeight: 1.4, flex: 1, overflow: 'hidden',
                    display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical',
                  }}>
                    {post.text}
                  </p>

                  <div style={{
                    display: 'flex', gap: 10, alignItems: 'center',
                    borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                    paddingTop: 6,
                  }}>
                    {post.likes != null && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontFamily: theme.fonts.mono, fontSize: '0.58rem', color: fg2 }}>
                        <ThumbsUp size={10} /> {post.likes}
                      </span>
                    )}
                    {post.comments != null && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontFamily: theme.fonts.mono, fontSize: '0.58rem', color: fg2 }}>
                        <MessageCircle size={10} /> {post.comments}
                      </span>
                    )}
                  </div>
                </motion.a>
              );
            })}
          </div>

          {/* LinkedIn scroll arrows */}
          {liScrolled && (
          <button
            onClick={() => liScrollRef.current?.scrollBy({ left: -200, behavior: 'smooth' })}
            style={{
              position: 'absolute', left: -4, top: '50%', transform: 'translateY(-50%)',
              width: 28, height: 28, borderRadius: '50%',
              background: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)',
              border: 'none', cursor: 'pointer', display: 'none',
              alignItems: 'center', justifyContent: 'center',
              color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.6)', transition: 'opacity 0.2s',
            }}
            className="li-arrow"
            onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '0.8')}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          )}
          <button
            onClick={() => liScrollRef.current?.scrollBy({ left: 200, behavior: 'smooth' })}
            style={{
              position: 'absolute', right: -4, top: '50%', transform: 'translateY(-50%)',
              width: 28, height: 28, borderRadius: '50%',
              background: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)',
              border: 'none', cursor: 'pointer', display: 'none',
              alignItems: 'center', justifyContent: 'center',
              color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.6)', transition: 'opacity 0.2s',
            }}
            className="li-arrow"
            onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '0.8')}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
          </button>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
