export interface ProjectOverride {
  repoName: string;
  featured?: boolean;
  hidden?: boolean;
  sortOrder?: number;
  titleOverride?: string;
  subtitleOverride?: string;
}

export const projectOverrides: ProjectOverride[] = [
  // === FEATURED ===
  {
    repoName: "espenhk-portfolio",
    featured: true,
    sortOrder: 1,
    titleOverride: "My Portfolio: espenhk",
    subtitleOverride: "Portfolio for my work, built with Lovable",
  },
  {
    repoName: "tmnf-ai",
    featured: true,
    sortOrder: 2,
    titleOverride: "TrackMania RL training",
    subtitleOverride:
      "TrackMania Nations Forever AI using machine learning, mostly reinforcement learning. Inspired by Yosh, in parallel this is a repo for testing agentic tools as much as possible.",
  },
  {
    repoName: "travelling-salesman-genetic",
    featured: true,
    sortOrder: 3,
    titleOverride: "Genetic algorithm + travelling salesman problem",
    subtitleOverride:
      "Travelling salesman problem solved using genetic and hybrid algorithms, with an exhaustive search as the baseline. Accompanying text answers to analyse the results - see the main PDF for all details.",
  },
  {
    repoName: "random-twitch-clip",
    featured: true,
    sortOrder: 4,
    titleOverride: "Play random clip from a user on Twitch stream.",
    subtitleOverride:
      "Twitch extension to fetch a random twitch clip from a given user, and optionally to play it to your stream",
  },
  // === HIDDEN ===
  { repoName: "bicep-training", hidden: true },
  { repoName: "espenhk", hidden: true },
  { repoName: "UF1-Viewer-with-F1MV", hidden: true },
  { repoName: "github-actions-training", hidden: true },
  { repoName: "github-actions-tutorial001", hidden: true },
  { repoName: "github-actions-tutorial002", hidden: true },
  { repoName: "tomatoes", hidden: true },
  { repoName: "ml-society-science", hidden: true },
];
