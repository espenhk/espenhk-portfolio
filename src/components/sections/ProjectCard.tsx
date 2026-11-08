import { useTheme } from '@/context/ThemeContext';
import { ExternalLink, Github, Star, GitFork } from 'lucide-react';
import type { Project } from '@/lib/resolveProjects';
import { languageColors } from '@/data/languageColors';


export default function ProjectCard({ project }: { project: Project }) {
  const { theme, palette: p } = useTheme();
  const cardBg = p.cardBg;
  const fg = p.fg;
  const fg2 = p.fg2;

  const tags = project.topics.length > 0
    ? project.topics.slice(0, 4)
    : project.language
    ? [project.language]
    : [];

  return (
    <div
      style={{
        background: p.flourish ? undefined : cardBg,
        backgroundImage: p.flourish ? cardBg : undefined,
        border: `1px solid ${p.cardEdge}`,
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
          background: p.accentTintStrong,
          color: p.accentInk,
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
          {project.description}
        </p>

        {tags.length > 0 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
            {tags.map(t => (
              <span
                key={t}
                style={{
                  background: p.accentTint,
                  color: p.accentInk,
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
        borderTop: `1px solid ${p.hairline}`,
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
                background: languageColors[project.language] ?? fg2,
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
