import { useEffect, useState, useCallback } from 'react';
import SectionAvatar, { type AvatarSectionId, avatarConfigs } from './SectionAvatar';

const sectionOrder: AvatarSectionId[] = [
  'publications',
  'character-sheet',
  'projects',
  'experience',
  'contact',
];

export default function StickyAvatarManager() {
  const [activeSection, setActiveSection] = useState<AvatarSectionId | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [avatarTop, setAvatarTop] = useState(70);

  const updateScroll = useCallback(() => {
    let currentSection: AvatarSectionId | null = null;
    let progress = 0;
    let topPos = 70;

    for (let i = 0; i < sectionOrder.length; i++) {
      const id = sectionOrder[i];
      const el = document.getElementById(id);
      if (!el) continue;

      const rect = el.getBoundingClientRect();
      const sectionTop = rect.top;
      const sectionBottom = rect.bottom;
      const viewH = window.innerHeight;

      // Section is visible if its top is above viewport bottom and bottom is below viewport top
      if (sectionTop < viewH && sectionBottom > 0) {
        currentSection = id;

        // Progress: 0 when section top enters viewport, 1 when section bottom leaves
        const totalScroll = rect.height;
        const scrolled = Math.max(0, -sectionTop);
        progress = Math.min(1, scrolled / Math.max(totalScroll - viewH, 1));

        // Avatar sticks at top of section or top of viewport
        if (sectionTop > 70) {
          topPos = sectionTop;
        } else {
          topPos = 70;
        }

        // If we're nearing the bottom of the section, push avatar up
        const remainingBelow = sectionBottom - 170; // avatar height ~100 + padding
        if (remainingBelow < 70) {
          topPos = Math.max(0, sectionBottom - 170);
        }

        break; // take the first visible section
      }
    }

    setActiveSection(currentSection);
    setScrollProgress(progress);
    setAvatarTop(topPos);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', updateScroll, { passive: true });
    updateScroll();
    return () => window.removeEventListener('scroll', updateScroll);
  }, [updateScroll]);

  if (!activeSection) return null;

  return (
    <div
      style={{
        position: 'fixed',
        left: 12,
        top: avatarTop,
        zIndex: 50,
        transition: 'top 0.15s ease-out',
        pointerEvents: 'none',
      }}
    >
      <SectionAvatar sectionId={activeSection} scrollProgress={scrollProgress} />
    </div>
  );
}
