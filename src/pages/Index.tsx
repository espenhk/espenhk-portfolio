import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import ThemeSelector from '@/components/mwe/ThemeSelector';
import ThemeToggle from '@/components/mwe/ThemeToggle';
import HeroSection from '@/components/mwe/HeroSection';
import ProjectCard from '@/components/mwe/ProjectCard';
import CharacterSheet from '@/components/mwe/CharacterSheet';
import FooterSection from '@/components/mwe/FooterSection';

function getSectionBg(themeId: string, isDark: boolean, type: 'surface' | 'background', c: any): string {
  if (!isDark) {
    return type === 'surface' ? c.surface.light : c.background.light;
  }

  switch (themeId) {
    case 'cupertino':
      return type === 'surface'
        ? 'linear-gradient(180deg, #1C1C1E 0%, #161618 100%)'
        : 'linear-gradient(180deg, #0D1117 0%, #0A0A0A 100%)';
    case 'arcadia':
      return type === 'surface'
        ? 'linear-gradient(180deg, #1A1A2E 0%, #151530 100%)'
        : 'linear-gradient(180deg, #0F0F1B 0%, #12102A 100%)';
    case 'nightcity':
      return type === 'surface'
        ? 'linear-gradient(180deg, #1A1A2E 0%, #141428 50%, #1A1020 100%)'
        : 'linear-gradient(135deg, #0D0E14 0%, #0F1520 50%, #0D0E14 100%)';
    case 'starfleet':
      return type === 'surface'
        ? 'linear-gradient(180deg, #131A2E 0%, #0F1628 100%)'
        : 'linear-gradient(180deg, #0A0E1A 0%, #0C1020 100%)';
    case 'foxglen':
      return type === 'surface'
        ? 'linear-gradient(180deg, #2A2520 0%, #252018 100%)'
        : 'linear-gradient(180deg, #1E1B17 0%, #221E18 100%)';
    default:
      return type === 'surface' ? c.surface.dark : c.background.dark;
  }
}

function MWEContent() {
  const { theme, isDark } = useTheme();
  const c = theme.colors;
  const mainBg = isDark
    ? getSectionBg(theme.id, true, 'background', c)
    : c.background.light;
  const fg = isDark ? c.textPrimary.dark : c.textPrimary.light;

  const isGradient = (bg: string) => bg.includes('gradient');

  const projectsBg = getSectionBg(theme.id, isDark, 'surface', c);
  const charBg = getSectionBg(theme.id, isDark, 'background', c);

  return (
    <div style={{
      background: isGradient(mainBg) ? undefined : mainBg,
      backgroundImage: isGradient(mainBg) ? mainBg : undefined,
      minHeight: '100vh',
      transition: `background ${theme.motion.durationNormal} ${theme.motion.timingFunction}`,
    }}>
      <ThemeSelector />

      <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 999 }}>
        <ThemeToggle />
      </div>

      <HeroSection />

      {/* Project Card Section */}
      <section style={{
        padding: '80px 24px',
        background: isGradient(projectsBg) ? undefined : projectsBg,
        backgroundImage: isGradient(projectsBg) ? projectsBg : undefined,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        transition: `all ${theme.motion.durationNormal} ${theme.motion.timingFunction}`,
      }}>
        {/* Nightcity accent line */}
        {theme.id === 'nightcity' && isDark && (
          <div style={{
            position: 'absolute', top: 0, left: '10%', right: '10%', height: 1,
            background: `linear-gradient(90deg, transparent, ${c.accent}40, transparent)`,
          }} />
        )}
        {/* Starfleet side accent */}
        {theme.id === 'starfleet' && isDark && (
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: 6,
            background: '#99CCFF', opacity: 0.5,
          }} />
        )}
        <h2 style={{
          fontFamily: theme.fonts.display,
          fontSize: theme.id === 'arcadia' ? '0.85rem' : '1.5rem',
          color: fg,
          marginBottom: 32,
          textTransform: theme.id === 'nightcity' || theme.id === 'starfleet' ? 'uppercase' : undefined,
          letterSpacing: theme.id === 'nightcity' ? '0.1em' : undefined,
          textShadow: theme.id === 'nightcity' && isDark ? `0 0 20px ${c.accent}40` : undefined,
        }}>
          {theme.id === 'starfleet' ? '// FEATURED PROJECTS' : theme.id === 'arcadia' ? '>> PROJECTS <<' : 'Featured Projects'}
        </h2>
        <ProjectCard />
      </section>

      {/* Character Sheet Section */}
      <section style={{
        padding: '80px 24px',
        background: isGradient(charBg) ? undefined : charBg,
        backgroundImage: isGradient(charBg) ? charBg : undefined,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        transition: `all ${theme.motion.durationNormal} ${theme.motion.timingFunction}`,
      }}>
        {theme.id === 'nightcity' && isDark && (
          <div style={{
            position: 'absolute', top: 0, left: '10%', right: '10%', height: 1,
            background: `linear-gradient(90deg, transparent, ${c.secondary}40, transparent)`,
          }} />
        )}
        {theme.id === 'starfleet' && isDark && (
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: 6,
            background: '#CC99FF', opacity: 0.5,
          }} />
        )}
        <h2 style={{
          fontFamily: theme.fonts.display,
          fontSize: theme.id === 'arcadia' ? '0.85rem' : '1.5rem',
          color: fg,
          marginBottom: 32,
          textTransform: theme.id === 'nightcity' || theme.id === 'starfleet' ? 'uppercase' : undefined,
          textShadow: theme.id === 'nightcity' && isDark ? `0 0 20px ${c.secondary}40` : undefined,
        }}>
          {theme.id === 'foxglen' ? "The Hero's Page" : theme.id === 'starfleet' ? 'PERSONNEL DOSSIER' : theme.id === 'arcadia' ? '>> STATS <<' : theme.id === 'nightcity' ? 'SYSTEM::STATS' : 'Character Sheet'}
        </h2>
        <CharacterSheet />
      </section>

      <FooterSection />
    </div>
  );
}

export default function Index() {
  return (
    <ThemeProvider>
      <MWEContent />
    </ThemeProvider>
  );
}
