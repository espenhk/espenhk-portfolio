export interface ProjectOverride {
  repoName: string;
  featured?: boolean;
  hidden?: boolean;
  sortOrder?: number;
  titleOverride?: string;
}

// Descriptions always come live from GitHub — no subtitle overrides.
export const projectOverrides: ProjectOverride[] = [
  // === FEATURED ===
  { repoName: "espenhk-portfolio", featured: true, sortOrder: 1, titleOverride: "My Portfolio: espenhk" },
  { repoName: "gamer-ai", featured: true, sortOrder: 2 },
  { repoName: "tromsoflaggfotball", featured: true, sortOrder: 3 },
  { repoName: "espenhk-hobby-projects", featured: true, sortOrder: 4 },
  { repoName: "random-twitch-clip", featured: true, sortOrder: 5 },
  // === HIDDEN ===
  { repoName: "bicep-training", hidden: true },
  { repoName: "espenhk", hidden: true },
  { repoName: "UF1-Viewer-with-F1MV", hidden: true },
  { repoName: "github-actions-training", hidden: true },
  { repoName: "github-actions-tutorial001", hidden: true },
  { repoName: "github-actions-tutorial002", hidden: true },
  { repoName: "tomatoes", hidden: true },
  { repoName: "ml-society-science", hidden: true },
  { repoName: "myfootballflags", hidden: true },
  { repoName: "java-pharmacy", hidden: true },
  { repoName: "advent-of-code-2022", hidden: true },
];
