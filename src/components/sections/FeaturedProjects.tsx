import { useTheme } from '@/context/ThemeContext';
import { useQuery } from '@tanstack/react-query';
import { fetchGitHubRepos } from '@/lib/github';
import { resolveProjects, type Project } from '@/lib/resolveProjects';
import { siteConfig } from '@/data/siteConfig';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Github, ExternalLink, Star, GitFork } from 'lucide-react';

const langColors: Record<string, string> = {
  Python: '#3572A5',
  Java: '#B07219',
  JavaScript: '#F1E05A',
  TypeScript: '#3178C6',
  HTML: '#E34C26',
  CSS: '#563D7C',
  Shell: '#89E051',
  'Jupyter Notebook': '#DA5B0B',
  HCL: '#844FBA',
};

function CompactProject({ project, index, visible, theme, isDark }: {
  project: Project; index: number; visible: boolean;
  theme: ReturnType<typeof useTheme>['theme']; isDark: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const c = theme.colors;
  const fg = isDark ? c.textPrimary.dark : c.textPrimary.light;
  const fg2 = isDark ? c.textSecondary.dark : c.textSecondary.light;
  const border = isDark ? c.border.dark : c.border.light;
  const panelBg = isDark
    ? 'linear-gradient(145deg, #0C1228 0%, #101A38 50%, #0C1228 100%)'
    : '#FFFFFF';
  const langColor = project.language ? (langColors[project.language] ?? '#888') : '#888';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      onClick={() => setExpanded(!expanded)}
      style={{
        background: isDark ? undefined : panelBg,
        backgroundImage: isDark ? panelBg : undefined,
        borderRadius: theme.radii.md,
        padding: '14px 18px',
        border: `1px solid ${isDark ? 'rgba(153,204,255,0.08)' : border}`,
        boxShadow: isDark ? theme.shadows.card : '0 1px 4px rgba(0,0,0,0.06)',
        cursor: 'pointer',
        transition: 'border-color 0.2s ease',
      }}
      whileHover={{
        borderColor: isDark ? 'rgba(153,204,255,0.2)' : 'rgba(0,0,0,0.15)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Language dot bullet */}
        <div style={{
          width: 10, height: 10, borderRadius: '50%',
          background: langColor,
          boxShadow: isDark ? `0 0 6px ${langColor}60` : undefined,
          flexShrink: 0,
        }} />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
            <h3 style={{
              fontFamily: theme.fonts.sans, fontSize: '0.92rem',
              fontWeight: 600, color: fg,
            }}>
              {project.title}
            </h3>
            {project.featured && (
              <span style={{
                fontFamily: theme.fonts.mono, fontSize: '0.6rem',
                color: c.accent, textTransform: 'uppercase', letterSpacing: '0.08em',
              }}>
                ★ Featured
              </span>
            )}
          </div>
          <span style={{
            fontFamily: theme.fonts.sans, fontSize: '0.78rem',
            color: fg2, lineHeight: 1.4,
          }}>
            {project.subtitle}
          </span>
        </div>

        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ flexShrink: 0 }}
        >
          <ChevronDown size={16} color={fg2} />
        </motion.div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ marginTop: 12, paddingLeft: 22 }}>
              {project.topics.length > 0 && (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                  {project.topics.slice(0, 5).map(t => (
                    <span key={t} style={{
                      fontFamily: theme.fonts.mono, fontSize: '0.65rem',
                      color: isDark ? '#CC99FF' : c.accent,
                      background: isDark ? 'rgba(204,153,255,0.08)' : 'rgba(255,159,28,0.08)',
                      padding: '2px 8px', borderRadius: theme.radii.sm,
                      border: `1px solid ${isDark ? 'rgba(204,153,255,0.15)' : 'rgba(255,159,28,0.15)'}`,
                    }}>
                      {t}
                    </span>
                  ))}
                </div>
              )}

              <div style={{
                display: 'flex', gap: 14, alignItems: 'center',
                color: fg2, fontSize: '0.75rem', fontFamily: theme.fonts.mono,
              }}>
                {project.language && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: langColor, display: 'inline-block',
                    }} />
                    {project.language}
                  </span>
                )}
                {project.stars > 0 && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Star size={12} /> {project.stars}
                  </span>
                )}
                {project.forks > 0 && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <GitFork size={12} /> {project.forks}
                  </span>
                )}
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: fg2, display: 'flex', alignItems: 'center', gap: 3 }}
                  onClick={e => e.stopPropagation()}
                >
                  <Github size={14} />
                </a>
                {project.homepage && (
                  <a
                    href={project.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: fg2, display: 'flex', alignItems: 'center', gap: 3 }}
                    onClick={e => e.stopPropagation()}
                  >
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ProjectSkeleton() {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      borderRadius: 8,
      padding: '14px 18px',
      height: 56,
      animation: 'pulse 1.5s ease-in-out infinite',
    }}>
      <div style={{ background: 'rgba(255,255,255,0.06)', height: 16, width: '50%', borderRadius: 4 }} />
    </div>
  );
}

export default function FeaturedProjects() {
  const { theme, isDark } = useTheme();
  const c = theme.colors;
  const fg = isDark ? c.textPrimary.dark : c.textPrimary.light;
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

  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['github-repos', siteConfig.githubUsername],
    queryFn: async () => {
      const repos = await fetchGitHubRepos(siteConfig.githubUsername);
      return resolveProjects(repos);
    },
    staleTime: 1000 * 60 * 30,
    retry: 2,
  });

  return (
    <section
      id="projects"
      ref={ref}
      style={{
        padding: '60px 24px',
        background: isDark ? undefined : c.surface.light,
        backgroundImage: isDark
          ? 'linear-gradient(180deg, #0E1428 0%, #121A38 50%, #0E1428 100%)'
          : undefined,
        position: 'relative',
        overflow: 'hidden',
        transition: `all ${theme.motion.durationNormal} ${theme.motion.timingFunction}`,
      }}
    >
      {isDark && (
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: 6,
          background: '#99CCFF', opacity: 0.6,
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
          Repositories
        </h2>

        {isLoading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[1, 2, 3].map(i => <ProjectSkeleton key={i} />)}
          </div>
        )}

        {error && (
          <p style={{
            textAlign: 'center',
            color: c.error,
            fontFamily: theme.fonts.mono,
            fontSize: '0.85rem',
          }}>
            Failed to load projects. GitHub API may be rate-limited.
          </p>
        )}

        {projects && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {projects.map((p, i) => (
              <CompactProject key={p.slug} project={p} index={i} visible={visible} theme={theme} isDark={isDark} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
