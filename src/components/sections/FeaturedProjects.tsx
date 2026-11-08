import { useTheme } from '@/context/ThemeContext';
import { useQuery } from '@tanstack/react-query';
import { fetchGitHubRepos, PAGES_INDEX_URL } from '@/lib/github';
import { resolveProjects, configToOverrides, type Project } from '@/lib/resolveProjects';
import { defaultSectionData } from '@/cms/defaults';
import type { ProjectsData } from '@/cms/types';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Github, ExternalLink, Star, GitFork, Radio } from 'lucide-react';
import GitHubGraph from './GitHubGraph';
import { languageColors } from '@/data/languageColors';
import { tint } from '@/design-system/palette';


function CompactProject({ project, index, visible, theme, isDark }: {
  project: Project; index: number; visible: boolean;
  theme: ReturnType<typeof useTheme>['theme']; isDark: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const { palette: p } = useTheme();
  const fg = p.fg;
  const fg2 = p.fg2;
  const panelBg = p.panelBg;
  const langColor = (project.language && languageColors[project.language]) || fg2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      onClick={() => setExpanded(!expanded)}
      style={{
        background: p.flourish ? undefined : panelBg,
        backgroundImage: p.flourish ? panelBg : undefined,
        borderRadius: theme.radii.md,
        padding: '14px 18px',
        border: `1px solid ${p.flourish ? tint(p.tertiary, 8) : p.jobEdge}`,
        boxShadow: p.shadowJob,
        cursor: 'pointer',
        transition: 'border-color 0.2s ease',
      }}
      whileHover={{
        borderColor: p.tertiaryEdgeHover,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Language dot bullet */}
        <div style={{
          width: 10, height: 10, borderRadius: '50%',
          background: langColor,
          boxShadow: p.flourish ? `0 0 6px ${tint(langColor, 38)}` : undefined,
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
                color: p.accentInk, textTransform: 'uppercase', letterSpacing: '0.08em',
              }}>
                ★ Featured
              </span>
            )}
            {project.hasPages && project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                title="Open the live page"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  fontFamily: theme.fonts.mono, fontSize: '0.6rem',
                  textTransform: 'uppercase', letterSpacing: '0.08em', textDecoration: 'none',
                  color: p.tertiaryInk, background: tint(p.tertiary, 12),
                  border: `1px solid ${tint(p.tertiary, 35)}`,
                  padding: '1px 7px', borderRadius: theme.radii.sm,
                }}
              >
                <Radio size={10} /> Live
              </a>
            )}
          </div>
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
              {project.description && (
                <p style={{
                  fontFamily: theme.fonts.sans, fontSize: '0.82rem',
                  color: fg2, lineHeight: 1.5, marginBottom: 10,
                }}>
                  {project.description}
                </p>
              )}
              {project.topics.length > 0 && (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                  {project.topics.slice(0, 5).map(t => (
                    <span key={t} style={{
                      fontFamily: theme.fonts.mono, fontSize: '0.65rem',
                      color: p.jobTagInk,
                      background: p.jobTagBg,
                      padding: '2px 8px', borderRadius: theme.radii.sm,
                      border: `1px solid ${p.jobTagEdge}`,
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
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
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
  const { theme, palette: p } = useTheme();
  return (
    <div style={{
      background: tint(p.fg, 3),
      borderRadius: theme.radii.md,
      padding: '14px 18px',
      height: 56,
      animation: 'pulse 1.5s ease-in-out infinite',
    }}>
      <div style={{ background: p.hairline, height: 16, width: '50%', borderRadius: theme.radii.sm }} />
    </div>
  );
}

export default function FeaturedProjects({ data = defaultSectionData.projects, anchorId = 'projects' }: { data?: ProjectsData; anchorId?: string }) {
  const { theme, isDark, palette: p } = useTheme();
  const fg = p.fg;
  const [visible, setVisible] = useState(false);
  const [liveOnly, setLiveOnly] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const { data: repos, isLoading, error } = useQuery({
    queryKey: ['github-repos', data.githubUsername],
    queryFn: () => fetchGitHubRepos(data.githubUsername),
    staleTime: 1000 * 60 * 30,
    retry: 2,
  });

  const resolved = repos ? resolveProjects(repos, configToOverrides(data)) : undefined;
  const liveCount = resolved?.filter(pr => pr.hasPages).length ?? 0;
  const projects = resolved
    ?.filter(pr => !liveOnly || pr.hasPages)
    .slice(0, Math.max(1, data.maxShown || 50));

  return (
    <section
      id={anchorId}
      ref={ref}
      style={{
        padding: '60px 24px',
        background: p.flourish ? undefined : p.altSectionBg,
        backgroundImage: p.flourish ? p.altSectionBg : undefined,
        position: 'relative',
        overflow: 'hidden',
        transition: `all ${theme.motion.durationNormal} ${theme.motion.timingFunction}`,
      }}
    >
      {p.flourish && <div style={p.rail(p.tertiary)} />}

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

        {data.showGraph && <GitHubGraph username={data.githubUsername} />}

        {liveCount > 0 && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: 12, flexWrap: 'wrap', marginBottom: 12,
            fontFamily: theme.fonts.mono, fontSize: '0.72rem',
          }}>
            <button
              type="button"
              aria-pressed={liveOnly}
              onClick={() => setLiveOnly(v => !v)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer',
                fontFamily: 'inherit', fontSize: 'inherit',
                textTransform: 'uppercase', letterSpacing: '0.06em',
                padding: '4px 12px', borderRadius: theme.radii.sm,
                color: liveOnly ? p.tertiaryInk : p.fg2,
                background: liveOnly ? tint(p.tertiary, 14) : 'transparent',
                border: `1px solid ${liveOnly ? tint(p.tertiary, 45) : p.controlEdge}`,
              }}
            >
              <Radio size={12} /> Live demos ({liveCount})
            </button>
            <a
              href={PAGES_INDEX_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: p.tertiaryInk, textDecoration: 'none' }}
            >
              All live project pages →
            </a>
          </div>
        )}

        {isLoading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[1, 2, 3].map(i => <ProjectSkeleton key={i} />)}
          </div>
        )}

        {error && (
          <p style={{
            textAlign: 'center',
            color: p.error,
            fontFamily: theme.fonts.mono,
            fontSize: '0.85rem',
          }}>
            Failed to load projects. GitHub API may be rate-limited.
          </p>
        )}

        {projects && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {projects.map((proj, i) => (
              <CompactProject key={proj.slug} project={proj} index={i} visible={visible} theme={theme} isDark={isDark} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
