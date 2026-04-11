import { useTheme } from '@/context/ThemeContext';
import { useQuery } from '@tanstack/react-query';
import { fetchGitHubRepos } from '@/lib/github';
import { resolveProjects } from '@/lib/resolveProjects';
import { siteConfig } from '@/data/siteConfig';
import ProjectCard from './ProjectCard';

function ProjectSkeleton() {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      borderRadius: '24px 8px 8px 24px',
      padding: 24,
      height: 180,
      animation: 'pulse 1.5s ease-in-out infinite',
    }}>
      <div style={{ background: 'rgba(255,255,255,0.06)', height: 20, width: '60%', borderRadius: 4, marginBottom: 12 }} />
      <div style={{ background: 'rgba(255,255,255,0.04)', height: 14, width: '90%', borderRadius: 4, marginBottom: 8 }} />
      <div style={{ background: 'rgba(255,255,255,0.04)', height: 14, width: '70%', borderRadius: 4 }} />
    </div>
  );
}

export default function FeaturedProjects() {
  const { theme, isDark } = useTheme();
  const c = theme.colors;
  const fg = isDark ? c.textPrimary.dark : c.textPrimary.light;

  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['github-repos', siteConfig.githubUsername],
    queryFn: async () => {
      const repos = await fetchGitHubRepos(siteConfig.githubUsername);
      return resolveProjects(repos);
    },
    staleTime: 1000 * 60 * 30, // 30 min cache
    retry: 2,
  });

  const featured = projects?.filter(p => p.featured) ?? [];
  const others = projects?.filter(p => !p.featured) ?? [];

  return (
    <section
      id="projects"
      style={{
        padding: '80px 24px',
        background: isDark ? undefined : c.surface.light,
        backgroundImage: isDark
          ? 'linear-gradient(180deg, #0E1428 0%, #121A38 50%, #0E1428 100%)'
          : undefined,
        position: 'relative',
        overflow: 'hidden',
        transition: `all ${theme.motion.durationNormal} ${theme.motion.timingFunction}`,
      }}
    >
      {/* LCARS side bar */}
      {isDark && (
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: 6,
          background: '#99CCFF', opacity: 0.6,
        }} />
      )}

      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{
          fontFamily: theme.fonts.display,
          fontSize: '1.8rem',
          color: fg,
          marginBottom: 40,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          textAlign: 'center',
        }}>
          Featured Projects
        </h2>

        {isLoading && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 20,
          }}>
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

        {/* Featured grid */}
        {featured.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 20,
            marginBottom: others.length > 0 ? 48 : 0,
          }}>
            {featured.map(p => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        )}

        {/* Other projects */}
        {others.length > 0 && (
          <>
            <h3 style={{
              fontFamily: theme.fonts.display,
              fontSize: '1.3rem',
              color: isDark ? c.textSecondary.dark : c.textSecondary.light,
              marginBottom: 20,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              textAlign: 'center',
            }}>
              Other Repos
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 20,
            }}>
              {others.map(p => (
                <ProjectCard key={p.slug} project={p} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
