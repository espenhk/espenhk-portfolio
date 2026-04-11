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
        ? 'linear-gradient(180deg, #0C1222 0%, #0E1830 50%, #0C1222 100%)'
        : 'linear-gradient(180deg, #060A14 0%, #0A1428 50%, #060A14 100%)';
    case 'arcadia':
      return type === 'surface'
        ? 'linear-gradient(180deg, #18102A 0%, #1A1230 30%, #1A1008 60%, #18102A 100%)'
        : 'linear-gradient(180deg, #0A0818 0%, #120C18 30%, #140E08 55%, #0A0818 100%)';
    case 'nightcity':
      return type === 'surface'
        ? 'linear-gradient(180deg, #10081E 0%, #180C30 50%, #0D1218 100%)'
        : 'linear-gradient(135deg, #0A0010 0%, #0D0820 50%, #0A0010 100%)';
    case 'starfleet':
      return type === 'surface'
        ? 'linear-gradient(180deg, #0E1428 0%, #121A38 50%, #0E1428 100%)'
        : 'linear-gradient(180deg, #060A18 0%, #0C1030 50%, #060A18 100%)';
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
            position: 'absolute', top: 0, left: '5%', right: '5%', height: 1,
            background: `linear-gradient(90deg, transparent, ${c.accent}60, transparent)`,
          }} />
        )}
        {/* Starfleet side accent */}
        {theme.id === 'starfleet' && isDark && (
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: 6,
            background: '#99CCFF', opacity: 0.6,
          }} />
        )}
        {/* Cupertino subtle glow */}
        {theme.id === 'cupertino' && isDark && (
          <div style={{
            position: 'absolute', top: '20%', left: '50%', width: 400, height: 400,
            transform: 'translateX(-50%)',
            background: 'radial-gradient(circle, rgba(0,113,227,0.06) 0%, transparent 70%)',
            borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none',
          }} />
        )}
        {/* Arcadia corner glow */}
        {theme.id === 'arcadia' && isDark && (
          <>
            <div style={{
              position: 'absolute', top: 0, right: 0, width: 200, height: 200,
              background: 'radial-gradient(circle at 100% 0%, rgba(231,110,85,0.1) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />
            <div style={{
              position: 'absolute', bottom: 0, left: 0, width: 200, height: 200,
              background: 'radial-gradient(circle at 0% 100%, rgba(247,213,29,0.06) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />
          </>
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
            position: 'absolute', top: 0, left: '5%', right: '5%', height: 1,
            background: `linear-gradient(90deg, transparent, ${c.secondary}60, transparent)`,
          }} />
        )}
        {theme.id === 'starfleet' && isDark && (
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: 6,
            background: '#CC99FF', opacity: 0.6,
          }} />
        )}
        {theme.id === 'cupertino' && isDark && (
          <div style={{
            position: 'absolute', bottom: '10%', right: '20%', width: 300, height: 300,
            background: 'radial-gradient(circle, rgba(88,86,214,0.05) 0%, transparent 70%)',
            borderRadius: '50%', filter: 'blur(50px)', pointerEvents: 'none',
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
