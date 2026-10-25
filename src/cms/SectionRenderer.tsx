import HeroSection from '@/components/mwe/HeroSection';
import FeaturedProjects from '@/components/sections/FeaturedProjects';
import CharacterSheetFull from '@/components/sections/CharacterSheet';
import ContactCTA from '@/components/sections/ContactCTA';
import ExperienceTimeline from '@/components/sections/ExperienceTimeline';
import Publications from '@/components/sections/Publications';
import TextSection from '@/components/sections/TextSection';
import type { Section } from './types';

export default function SectionRenderer({ section, anchorId }: { section: Section; anchorId: string }) {
  switch (section.type) {
    case 'hero': return <HeroSection data={section.data} anchorId={anchorId} />;
    case 'stats': return <CharacterSheetFull data={section.data} anchorId={anchorId} />;
    case 'publications': return <Publications data={section.data} anchorId={anchorId} />;
    case 'contact': return <ContactCTA data={section.data} anchorId={anchorId} />;
    case 'projects': return <FeaturedProjects data={section.data} anchorId={anchorId} />;
    case 'experience': return <ExperienceTimeline data={section.data} anchorId={anchorId} />;
    case 'text': return <TextSection data={section.data} anchorId={anchorId} />;
    default: return null;
  }
}
