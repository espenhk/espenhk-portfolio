import type { Job, Education, Certification } from '@/data/experience';

export interface HeroData {
  bio: string;
  profileImage: string;
  taglines: string[];
  primaryButtonLabel: string;
  cvButtonLabel: string;
}

export interface StatsCategory { key: string; label: string; color: string }
export interface StatsData {
  heading: string;
  categories: StatsCategory[];
  stats: { label: string; value: number; category: string }[];
  languages: { flag: string; name: string }[];
  interests: { emoji: string; label: string; detail: string; link?: string }[];
}

export interface PublicationsData {
  heading: string;
  linkedInHeading: string;
  showMedium: boolean;
  showYouTube: boolean;
  showLinkedIn: boolean;
  maxItems: number;
  mediumUsername: string;
  youtubeChannelId: string;
}

export interface ContactData {
  heading: string;
  text: string;
  email: string;
  buttonLabel: string;
}

export interface ProjectsData {
  heading: string;
  githubUsername: string;
  featured: string[];
  hidden: string[];
  titles: Record<string, string>;
  maxShown: number;
  showGraph: boolean;
}

export interface ExperienceData {
  heading: string;
  jobs: Job[];
  education: Education[];
  certifications: Certification[];
}

export interface TextData { heading: string; body: string }

export interface SectionDataMap {
  hero: HeroData;
  stats: StatsData;
  publications: PublicationsData;
  contact: ContactData;
  projects: ProjectsData;
  experience: ExperienceData;
  text: TextData;
}

export type SectionType = keyof SectionDataMap;

export type Section = {
  [K in SectionType]: { id: string; type: K; visible: boolean; data: SectionDataMap[K] };
}[SectionType];

export interface SiteSettings {
  name: string;
  socials: Record<string, string>;
  resumeUrl: string;
  /** Storage path of an uploaded CV (overrides resumeUrl when set) */
  resumePath?: string;
  status: { emoji: string; label: string; value: string; url?: string };
  lastfmUser?: string;
}

export interface CmsDoc {
  version: 1;
  settings: SiteSettings;
  sections: Section[];
}
