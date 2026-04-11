import { ThemeProvider, useTheme } from '@/context/ThemeContext';

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
      <NavBar />
      <HeroSection />
      <CharacterSheetFull />
      <Publications />
      <ContactCTA />
      <FeaturedProjects />
      <ExperienceTimeline />
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
