export interface Stat {
  label: string;
  value: number;
  category: 'framework' | 'tool' | 'soft-skill';
}

export const characterSheet = {
  name: 'Espen H. Kristensen',
  title: 'Data Engineer / Manager',
  portraitImage: 'https://avatars.githubusercontent.com/u/9327813?v=4',
  tagline: '"Sports geek · Cocktail nerd · Data wrangler"',
  stats: [
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

    // Tech & Code
    { label: 'Python', value: 75, category: 'soft-skill' as const },
    { label: 'SQL', value: 80, category: 'soft-skill' as const },
    { label: 'Terraform', value: 45, category: 'soft-skill' as const },
    { label: 'Infrastructure as Code', value: 50, category: 'soft-skill' as const },
    { label: 'Java', value: 30, category: 'soft-skill' as const },
  ],
};

export const categoryLabels: Record<string, string> = {
  'framework': 'PLATFORMS',
  'tool': 'SKILLS & DOMAINS',
  'soft-skill': 'TECH & CODE',
};

export const categoryColors: Record<string, string> = {
  'framework': '#99CCFF',
  'tool': '#CC99FF',
  'soft-skill': '#FF9F1C',
};

// Languages spoken — shown as flag icons
export const spokenLanguages = [
  { flag: '🇳🇴', name: 'Norwegian' },
  { flag: '🇬🇧', name: 'English' },
  { flag: '🇩🇪', name: 'German' },
  { flag: '🇮🇹', name: 'Italian' },
];

// Interests shown below stat sheet
export const offDutyInterests = [
  { emoji: '🏈', label: 'Flag Football', detail: 'Tromsø Flaggfotball player', link: 'https://tromsoflaggfotball.lovable.app' },
  { emoji: '🍸', label: 'Cocktail Craft', detail: 'Negroni enthusiast' },
];
