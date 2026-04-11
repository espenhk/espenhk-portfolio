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
    repoName: 'myfootballflags',
    featured: true,
    sortOrder: 1,
    titleOverride: 'MyFootballFlags',
    subtitleOverride: 'Live NFL play-by-play CLI for fantasy football nerds',
  },
  {
    repoName: 'python-ODESolver',
    featured: true,
    sortOrder: 2,
    titleOverride: 'Python ODE Solver',
    subtitleOverride: 'Runge-Kutta & Euler methods for ordinary differential equations',
  },
  {
    repoName: 'python-war-on-zombies',
    featured: true,
    sortOrder: 3,
    titleOverride: 'War on Zombies',
    subtitleOverride: 'Epidemiology simulation: pandemic spread, vaccines, and the undead',
  },
  {
    repoName: 'advent-of-code-2022',
    featured: false,
    sortOrder: 4,
    titleOverride: 'Advent of Code 2022',
    subtitleOverride: 'Daily coding puzzles solved in Python',
  },
  {
    repoName: 'gameoflife',
    featured: false,
    sortOrder: 5,
    titleOverride: "Conway's Game of Life",
    subtitleOverride: 'Classic cellular automaton in Java',
  },
  // === HIDDEN ===
  { repoName: 'bicep-training', hidden: true },
  { repoName: 'github-actions-training', hidden: true },
  { repoName: 'github-actions-tutorial001', hidden: true },
  { repoName: 'github-actions-tutorial002', hidden: true },
  { repoName: 'tomatoes', hidden: true },
  { repoName: 'ml-society-science', hidden: true },
];
