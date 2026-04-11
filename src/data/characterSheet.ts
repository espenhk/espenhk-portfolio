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
    // Languages
    { label: 'Python', value: 75, category: 'language' as const },
    { label: 'SQL', value: 80, category: 'language' as const },
    { label: 'Terraform', value: 45, category: 'language' as const },
    { label: 'Java', value: 30, category: 'language' as const },
    { label: 'Infrastructure as Code', value: 50, category: 'language' as const },

    // Platforms
    { label: 'Azure Databricks', value: 80, category: 'framework' as const },
    { label: 'Power BI', value: 60, category: 'framework' as const },
    { label: 'Kafka / Confluent', value: 35, category: 'framework' as const },
    { label: 'AI Foundry', value: 45, category: 'framework' as const },
    { label: 'Azure DevOps', value: 55, category: 'framework' as const },

    // Skills & Domains
    { label: 'Data Engineering', value: 85, category: 'tool' as const },
    { label: 'Integration', value: 60, category: 'tool' as const },
    { label: 'GenAI / LLMs', value: 50, category: 'tool' as const },
    { label: 'Machine Learning', value: 40, category: 'tool' as const },
    { label: 'CI/CD', value: 40, category: 'tool' as const },

    // Life & Interests
    { label: 'Communication', value: 75, category: 'soft-skill' as const },
    { label: 'Technical Writing', value: 65, category: 'soft-skill' as const },
    { label: 'Cocktail Mixing', value: 80, category: 'soft-skill' as const },
    { label: 'American Football', value: 70, category: 'soft-skill' as const },
    { label: 'Team Leadership', value: 70, category: 'soft-skill' as const },
  ],
};

export const categoryLabels: Record<string, string> = {
  'language': 'LANGUAGES',
  'framework': 'PLATFORMS',
  'tool': 'SKILLS & DOMAINS',
  'soft-skill': 'LIFE & INTERESTS',
};

export const categoryColors: Record<string, string> = {
  'language': '#FF9F1C',
  'framework': '#99CCFF',
  'tool': '#CC99FF',
  'soft-skill': '#E8655A',
};
