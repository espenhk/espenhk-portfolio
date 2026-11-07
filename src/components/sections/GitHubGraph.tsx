import { useTheme } from '@/context/ThemeContext';
import { GitHubCalendar } from 'react-github-calendar';
import { siteConfig } from '@/data/siteConfig';

export default function GitHubGraph({ username = siteConfig.githubUsername }: { username?: string }) {
  const { theme, isDark, palette: p } = useTheme();
  const fg2 = p.fg2;

  const colorScheme = isDark ? 'dark' : 'light';

  // The calendar interpolates the levels between these two concrete colours.
  const explicitTheme = { dark: p.calendarScale, light: p.calendarScale };

  return (
    <div
      style={{
        padding: '0 0 32px',
        textAlign: 'center',
      }}
    >

      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <h2 style={{
          fontFamily: theme.fonts.display,
          fontSize: '1.4rem',
          color: p.fg,
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
