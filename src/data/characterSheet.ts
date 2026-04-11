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
    // Languages — Python & SQL are core tools, Java only used in integration roles, Bicep in a few projects
    { label: 'Python', value: 80, category: 'language' as const },
    { label: 'SQL', value: 80, category: 'language' as const },
    { label: 'Java', value: 40, category: 'language' as const },
    { label: 'Bicep / IaC', value: 55, category: 'language' as const },

    { label: 'Azure Databricks', value: 85, category: 'framework' as const },
    { label: 'Power BI', value: 70, category: 'framework' as const },
    { label: 'Kafka / Confluent', value: 45, category: 'framework' as const },
    { label: 'GitHub Actions', value: 40, category: 'framework' as const },

    { label: 'Data Engineering', value: 90, category: 'tool' as const },
    { label: 'Integration', value: 70, category: 'tool' as const },
    { label: 'RAG / GenAI', value: 60, category: 'tool' as const },
    { label: 'Machine Learning', value: 50, category: 'tool' as const },
    { label: 'NLP', value: 50, category: 'tool' as const },
    { label: 'Data Anonymisation', value: 65, category: 'tool' as const },
    { label: 'Responsible AI', value: 55, category: 'tool' as const },

    { label: 'Communication', value: 80, category: 'soft-skill' as const },
    { label: 'Technical Writing', value: 70, category: 'soft-skill' as const },
    { label: 'Cocktail Mixing', value: 85, category: 'soft-skill' as const },
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
