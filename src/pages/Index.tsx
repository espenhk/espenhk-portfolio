import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import ThemeSelector from '@/components/mwe/ThemeSelector';
import ThemeToggle from '@/components/mwe/ThemeToggle';
import HeroSection from '@/components/mwe/HeroSection';
import ProjectCard from '@/components/mwe/ProjectCard';
import CharacterSheet from '@/components/mwe/CharacterSheet';
import FooterSection from '@/components/mwe/FooterSection';

function MWEContent() {
  const { theme, isDark } = useTheme();
  const c = theme.colors;
  const bg = isDark ? c.background.dark : c.background.light;
  const fg = isDark ? c.textPrimary.dark : c.textPrimary.light;
  const fg2 = isDark ? c.textSecondary.dark : c.textSecondary.light;

  return (
    <div style={{ background: bg, minHeight: '100vh', transition: `background ${theme.motion.durationNormal} ${theme.motion.timingFunction}` }}>
      <ThemeSelector />

      {/* Dark/Light toggle - top right */}
      <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 999 }}>
        <ThemeToggle />
      </div>

      <HeroSection />

      {/* Project Card Section */}
      <section style={{
        padding: '80px 24px',
        background: isDark ? c.surface.dark : c.surface.light,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transition: `all ${theme.motion.durationNormal} ${theme.motion.timingFunction}`,
      }}>
        <h2 style={{
          fontFamily: theme.fonts.display,
          fontSize: theme.id === 'arcadia' ? '0.85rem' : '1.5rem',
          color: fg,
          marginBottom: 32,
          textTransform: theme.id === 'nightcity' || theme.id === 'starfleet' ? 'uppercase' : undefined,
          letterSpacing: theme.id === 'nightcity' ? '0.1em' : undefined,
        }}>
          {theme.id === 'starfleet' ? '// FEATURED PROJECTS' : theme.id === 'arcadia' ? '>> PROJECTS <<' : 'Featured Projects'}
        </h2>
        <ProjectCard />
      </section>

      {/* Character Sheet Section */}
      <section style={{
        padding: '80px 24px',
        background: bg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transition: `all ${theme.motion.durationNormal} ${theme.motion.timingFunction}`,
      }}>
        <h2 style={{
          fontFamily: theme.fonts.display,
          fontSize: theme.id === 'arcadia' ? '0.85rem' : '1.5rem',
          color: fg,
          marginBottom: 32,
          textTransform: theme.id === 'nightcity' || theme.id === 'starfleet' ? 'uppercase' : undefined,
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
