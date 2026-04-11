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
    { label: 'Python', value: 78, category: 'language' as const },
    { label: 'SQL', value: 80, category: 'language' as const },
    { label: 'Java', value: 42, category: 'language' as const },
    { label: 'Bicep / IaC', value: 55, category: 'language' as const },

    // Frameworks — Azure is the bread and butter, Power BI certified, Confluent cert but limited use, GH Actions in one project
    { label: 'Azure Data', value: 85, category: 'framework' as const },
    { label: 'Power BI', value: 70, category: 'framework' as const },
    { label: 'Kafka / Confluent', value: 45, category: 'framework' as const },
    { label: 'GitHub Actions', value: 38, category: 'framework' as const },

    // Skills — DE is primary identity, integration was a full role, RAG/GenAI is recent, ML & NLP from courses + limited prod
    { label: 'Data Engineering', value: 88, category: 'tool' as const },
    { label: 'Integration', value: 72, category: 'tool' as const },
    { label: 'RAG / GenAI', value: 62, category: 'tool' as const },
    { label: 'Machine Learning', value: 52, category: 'tool' as const },
    { label: 'NLP', value: 48, category: 'tool' as const },
    { label: 'Data Anonymisation', value: 65, category: 'tool' as const },
    { label: 'Responsible AI', value: 55, category: 'tool' as const },

    // Soft skills — Manager title, publications, consultant school, but English listed as "Basic" on CV
    { label: 'Communication', value: 78, category: 'soft-skill' as const },
    { label: 'Technical Writing', value: 72, category: 'soft-skill' as const },
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
