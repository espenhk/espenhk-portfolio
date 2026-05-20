import { Helmet } from 'react-helmet-async';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { useKonamiCode } from '@/hooks/useKonamiCode';
import KonamiOverlay from '@/components/KonamiOverlay';
import HeroSection from '@/components/mwe/HeroSection';
import FeaturedProjects from '@/components/sections/FeaturedProjects';
import CharacterSheetFull from '@/components/sections/CharacterSheet';
import ContactCTA from '@/components/sections/ContactCTA';
import ExperienceTimeline from '@/components/sections/ExperienceTimeline';
import Publications from '@/components/sections/Publications';
import FooterSection from '@/components/mwe/FooterSection';
import NavBar from '@/components/sections/NavBar';

function PageContent() {
  const { theme, isDark } = useTheme();
  const { activated } = useKonamiCode();
  const c = theme.colors;
  const mainBg = isDark
    ? 'linear-gradient(180deg, #060A18 0%, #0C1030 50%, #060A18 100%)'
    : c.background.light;

  return (
    <div style={{
      background: isDark ? undefined : mainBg,
      backgroundImage: isDark ? mainBg : undefined,
      minHeight: '100vh',
      transition: `background ${theme.motion.durationNormal} ${theme.motion.timingFunction}`,
    }}>
      <Helmet>
        <title>Espen H. Kristensen — Data Engineer Portfolio</title>
        <meta name="description" content="Portfolio of Espen H. Kristensen, Data Engineer & Manager at PwC Norway. Data engineering, LLMs, responsible AI, projects, and writing." />
        <link rel="canonical" href="https://espenhk.lovable.app/" />
        <meta property="og:title" content="Espen H. Kristensen — Data Engineer Portfolio" />
        <meta property="og:description" content="Data engineering, LLMs and responsible AI — projects, writing, and experience from a Manager at PwC Norway." />
        <meta property="og:url" content="https://espenhk.lovable.app/" />
      </Helmet>
      <KonamiOverlay active={activated} />
      <NavBar />
      <main>
        <HeroSection />
        <CharacterSheetFull />
        <Publications />
        <ContactCTA />
        <FeaturedProjects />
        <ExperienceTimeline />
      </main>
      <FooterSection />
    </div>
  );
}

export default function Index() {
  return (
    <ThemeProvider>
      <PageContent />
    </ThemeProvider>
  );
}
