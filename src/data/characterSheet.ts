export interface Stat {
  label: string;
  value: number;
  category: 'language' | 'framework' | 'tool' | 'soft-skill';
}

export const characterSheet = {
  name: 'Espen H. Kristensen',
  title: 'Data Engineer / Manager',
  portraitImage: 'https://avatars.githubusercontent.com/u/9327813?v=4',
  tagline: '"Sports geek · Cocktail nerd · Data wrangler"',
  stats: [
    { label: 'Python', value: 90, category: 'language' as const },
    { label: 'SQL', value: 88, category: 'language' as const },
    { label: 'Java', value: 65, category: 'language' as const },
    { label: 'Bicep / IaC', value: 60, category: 'language' as const },
    { label: 'Azure Data', value: 85, category: 'framework' as const },
    { label: 'Power BI', value: 80, category: 'framework' as const },
    { label: 'Kafka / Confluent', value: 75, category: 'framework' as const },
    { label: 'GitHub Actions', value: 70, category: 'framework' as const },
    { label: 'Data Engineering', value: 92, category: 'tool' as const },
    { label: 'Machine Learning', value: 78, category: 'tool' as const },
    { label: 'NLP', value: 72, category: 'tool' as const },
    { label: 'Data Anonymisation', value: 80, category: 'tool' as const },
    { label: 'Integration', value: 75, category: 'tool' as const },
    { label: 'Responsible AI', value: 77, category: 'tool' as const },
    { label: 'Communication', value: 90, category: 'soft-skill' as const },
    { label: 'Technical Writing', value: 85, category: 'soft-skill' as const },
    { label: 'Cocktail Mixing', value: 88, category: 'soft-skill' as const },
  ],
};

export const categoryLabels: Record<string, string> = {
  'language': 'LANGUAGES',
  'framework': 'FRAMEWORKS & PLATFORMS',
  'tool': 'SKILLS & DOMAINS',
  'soft-skill': 'SOFT SKILLS',
};

export const categoryColors: Record<string, string> = {
  'language': '#FF9F1C',
  'framework': '#99CCFF',
  'tool': '#CC99FF',
  'soft-skill': '#E8655A',
};
