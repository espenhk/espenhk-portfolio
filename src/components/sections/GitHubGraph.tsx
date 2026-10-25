import { useTheme } from '@/context/ThemeContext';
import { GitHubCalendar } from 'react-github-calendar';
import { siteConfig } from '@/data/siteConfig';

export default function GitHubGraph({ username = siteConfig.githubUsername }: { username?: string }) {
  const { theme, isDark } = useTheme();
  const c = theme.colors;
  const fg2 = isDark ? c.textSecondary.dark : c.textSecondary.light;

  const colorScheme = isDark ? 'dark' : 'light';

  const explicitTheme = {
    dark: ['#161B22', '#4A2E00', '#7A4D00', '#CC8400', '#FF9F1C'],
    light: ['#EBEDF0', '#FFE4B5', '#FFCC80', '#FFB347', '#FF9F1C'],
  };

  return (
    <div
      style={{
        padding: '32px 0 40px',
        textAlign: 'center',
      }}
    >

      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <h2 style={{
          fontFamily: theme.fonts.display,
          fontSize: '1.4rem',
          color: isDark ? c.textPrimary.dark : c.textPrimary.light,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          marginBottom: 16,
        }}>
          Activity Log
        </h2>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          overflowX: 'auto',
          paddingBottom: 4,
        }}>
          <GitHubCalendar
            username={username}
            colorScheme={colorScheme}
            theme={explicitTheme}
            fontSize={11}
            blockSize={10}
            blockMargin={3}
            labels={{
              totalCount: '{{count}} contributions in the last year',
            }}
            style={{
              color: fg2,
              fontFamily: theme.fonts.mono,
            }}
          />
        </div>
      </div>
    </div>
  );
}
