import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import ThemeToggle from '@/components/mwe/ThemeToggle';
import HeroSection from '@/components/mwe/HeroSection';
import ProjectCard from '@/components/mwe/ProjectCard';
import CharacterSheet from '@/components/mwe/CharacterSheet';
import FooterSection from '@/components/mwe/FooterSection';

function getSectionBg(isDark: boolean, type: 'surface' | 'background', c: any): string {
  if (!isDark) return type === 'surface' ? c.surface.light : c.background.light;
  return type === 'surface'
    ? 'linear-gradient(180deg, #0E1428 0%, #121A38 50%, #0E1428 100%)'
    : 'linear-gradient(180deg, #060A18 0%, #0C1030 50%, #060A18 100%)';
}

function MWEContent() {
  const { theme, isDark } = useTheme();
  const c = theme.colors;
  const mainBg = isDark
    ? 'linear-gradient(180deg, #060A18 0%, #0C1030 50%, #060A18 100%)'
    : c.background.light;
  const fg = isDark ? c.textPrimary.dark : c.textPrimary.light;

  const projectsBg = getSectionBg(isDark, 'surface', c);
  const charBg = getSectionBg(isDark, 'background', c);

  return (
    <div style={{
      background: isDark ? undefined : mainBg,
      backgroundImage: isDark ? mainBg : undefined,
      minHeight: '100vh',
      transition: `background ${theme.motion.durationNormal} ${theme.motion.timingFunction}`,
    }}>
      <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 999 }}>
        <ThemeToggle />
      </div>

      <HeroSection />

      {/* Project Card Section */}
      <section style={{
        padding: '80px 24px',
        background: isDark ? undefined : c.surface.light,
        backgroundImage: isDark ? projectsBg : undefined,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        transition: `all ${theme.motion.durationNormal} ${theme.motion.timingFunction}`,
      }}>
        {isDark && (
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: 6,
            background: '#99CCFF', opacity: 0.6,
          }} />
        )}
        <h2 style={{
          fontFamily: theme.fonts.display,
          fontSize: '1.8rem',
          color: fg,
          marginBottom: 32,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}>
          // Featured Projects
        </h2>
        <ProjectCard />
      </section>

      {/* Character Sheet Section */}
      <section style={{
        padding: '80px 24px',
        background: isDark ? undefined : c.background.light,
        backgroundImage: isDark ? charBg : undefined,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        transition: `all ${theme.motion.durationNormal} ${theme.motion.timingFunction}`,
      }}>
        {isDark && (
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: 6,
            background: '#CC99FF', opacity: 0.6,
          }} />
        )}
        <h2 style={{
          fontFamily: theme.fonts.display,
          fontSize: '1.8rem',
          color: fg,
          marginBottom: 32,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}>
          Personnel Dossier
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
