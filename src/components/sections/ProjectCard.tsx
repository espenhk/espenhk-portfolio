import { useTheme } from '@/context/ThemeContext';
import { ExternalLink, Github, Star, GitFork } from 'lucide-react';
import type { Project } from '@/lib/resolveProjects';

const langColors: Record<string, string> = {
  Python: '#3572A5',
  Java: '#B07219',
  JavaScript: '#F1E05A',
  TypeScript: '#3178C6',
  HTML: '#E34C26',
  CSS: '#563D7C',
  Shell: '#89E051',
  Jupyter: '#DA5B0B',
  'Jupyter Notebook': '#DA5B0B',
  HCL: '#844FBA',
};

export default function ProjectCard({ project }: { project: Project }) {
  const { theme, isDark } = useTheme();
  const c = theme.colors;
  const cardBg = isDark
    ? 'linear-gradient(145deg, #101830 0%, #141E3A 100%)'
    : c.surface.light;
  const fg = isDark ? c.textPrimary.dark : c.textPrimary.light;
  const fg2 = isDark ? c.textSecondary.dark : c.textSecondary.light;
  const border = isDark ? c.border.dark : c.border.light;

  const tags = project.topics.length > 0
    ? project.topics.slice(0, 4)
    : project.language
    ? [project.language]
    : [];

  return (
    <div
      style={{
        background: isDark ? undefined : cardBg,
        backgroundImage: isDark ? cardBg : undefined,
        border: `1px solid ${isDark ? 'rgba(255,159,28,0.1)' : border}`,
        borderRadius: theme.radii.lg,
        padding: 24,
        boxShadow: theme.shadows.card,
        transition: `all ${theme.motion.durationNormal} ${theme.motion.timingFunction}`,
        cursor: 'pointer',
        fontFamily: theme.fonts.sans,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = theme.shadows.cardHover;
        e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = theme.shadows.card;
        e.currentTarget.style.transform = 'none';
      }}
      onClick={() => window.open(project.url, '_blank')}
    >
      {/* Featured badge */}
      {project.featured && (
        <div style={{
          position: 'absolute',
          top: 12,
          right: 12,
          background: `${c.accent}25`,
          color: c.accent,
          fontSize: '0.65rem',
          fontFamily: theme.fonts.mono,
          padding: '2px 8px',
          borderRadius: theme.radii.sm,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          fontWeight: 600,
        }}>
          ★ Featured
        </div>
      )}

      <div style={{ flex: 1 }}>
        <h3 style={{
          fontFamily: theme.fonts.display,
          fontSize: '1.4rem',
          fontWeight: 400,
          color: fg,
          marginBottom: 6,
          textTransform: 'uppercase',
          letterSpacing: '0.03em',
          paddingRight: project.featured ? 80 : 0,
        }}>
          {project.title}
        </h3>
        <p style={{
          color: fg2,
          fontSize: '0.85rem',
          lineHeight: 1.5,
          marginBottom: 12,
        }}>
          {project.subtitle}
        </p>

        {tags.length > 0 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
            {tags.map(t => (
              <span
                key={t}
                style={{
                  background: `${c.accent}18`,
                  color: c.accent,
                  padding: '2px 8px',
                  borderRadius: theme.radii.sm,
                  fontSize: '0.7rem',
                  fontFamily: theme.fonts.mono,
                  fontWeight: 500,
                }}
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
        paddingTop: 12,
        borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
      }}>
        <div style={{ display: 'flex', gap: 14, color: fg2, fontSize: '0.78rem', fontFamily: theme.fonts.mono }}>
          {project.stars > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Star size={13} /> {project.stars}
            </span>
          )}
          {project.forks > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <GitFork size={13} /> {project.forks}
            </span>
          )}
          {project.language && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{
                width: 10, height: 10, borderRadius: '50%',
                background: langColors[project.language] ?? '#888',
                display: 'inline-block',
              }} />
              {project.language}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: fg2 }}
            onClick={e => e.stopPropagation()}
          >
            <Github size={16} />
          </a>
          {project.homepage && (
            <a
              href={project.homepage}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: fg2 }}
              onClick={e => e.stopPropagation()}
            >
              <ExternalLink size={16} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
