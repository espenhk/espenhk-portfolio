import { siteConfig } from '@/data/siteConfig';
import { taglines } from '@/data/taglines';
import { characterSheet, categoryLabels, categoryColors, spokenLanguages, offDutyInterests } from '@/data/characterSheet';
import { jobs, education, certifications } from '@/data/experience';
import { currentStatus } from '@/data/currentStatus';
import { projectOverrides } from '@/data/projectOverrides';
import type { CmsDoc, SectionDataMap, SectionType } from './types';

const featured = projectOverrides
  .filter(o => o.featured)
  .sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999))
  .map(o => o.repoName);
const titles: Record<string, string> = {};
projectOverrides.forEach(o => { if (o.titleOverride) titles[o.repoName] = o.titleOverride; });

export const defaultSectionData: SectionDataMap = {
  hero: {
    bio: siteConfig.bio,
    profileImage: siteConfig.profileImage,
    taglines: [...taglines],
    primaryButtonLabel: 'View Projects',
    cvButtonLabel: 'Download CV',
  },
  stats: {
    heading: 'Personnel Dossier',
    categories: ['framework', 'tool', 'soft-skill'].map(k => ({ key: k, label: categoryLabels[k], color: categoryColors[k] })),
    stats: characterSheet.stats.map(s => ({ ...s })),
    languages: spokenLanguages.map(l => ({ ...l })),
    interests: offDutyInterests.map(i => ({ ...i })),
  },
  publications: {
    heading: 'Transmissions',
    linkedInHeading: 'On LinkedIn',
    showMedium: true,
    showYouTube: true,
    showLinkedIn: true,
    maxItems: 20,
    mediumUsername: siteConfig.mediumUsername,
    youtubeChannelId: siteConfig.youtubeChannelId,
  },
  contact: {
    heading: 'Open Frequencies',
    text: 'Interested in data engineering, AI, or just want to talk cocktails?',
    email: 'espenhkristensen@gmail.com',
    buttonLabel: 'Send Transmission',
  },
  projects: {
    heading: 'Repositories',
    githubUsername: siteConfig.githubUsername,
    featured,
    hidden: projectOverrides.filter(o => o.hidden).map(o => o.repoName),
    titles,
    maxShown: 50,
    showGraph: true,
  },
  experience: {
    heading: 'Service Record',
    jobs: jobs.map(j => ({ ...j })),
    education: education.map(e => ({ ...e })),
    certifications: certifications.map(c => ({ ...c })),
  },
  text: { heading: 'New section', body: 'Write something here. **Markdown** is supported.' },
};

export const sectionTypeLabels: Record<SectionType, string> = {
  hero: 'Hero',
  stats: 'Personnel Dossier (stats)',
  publications: 'Transmissions (posts)',
  contact: 'Contact',
  projects: 'Repositories (GitHub)',
  experience: 'Service Record (experience)',
  text: 'Free text',
};

/** Canonical anchor ids used by the nav bar */
export const sectionAnchors: Record<SectionType, string> = {
  hero: 'hero',
  stats: 'character-sheet',
  publications: 'publications',
  contact: 'contact',
  projects: 'projects',
  experience: 'experience',
  text: 'text',
};

const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));

export function makeDefaultDoc(): CmsDoc {
  const order: SectionType[] = ['hero', 'stats', 'publications', 'contact', 'projects', 'experience'];
  return {
    version: 1,
    settings: {
      name: siteConfig.name,
      socials: { ...siteConfig.socials },
      resumeUrl: siteConfig.resumeUrl,
      status: { ...currentStatus },
    },
    sections: order.map(type => ({ id: type, type, visible: true, data: clone(defaultSectionData[type]) })) as CmsDoc['sections'],
  };
}

export function newSectionData<K extends SectionType>(type: K): SectionDataMap[K] {
  return clone(defaultSectionData[type]);
}
