import type { GitHubRepo } from './github';
import { projectOverrides, type ProjectOverride } from '@/data/projectOverrides';

export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  topics: string[];
  url: string;
  homepage: string | null;
  featured: boolean;
  sortOrder: number;
  pushedAt: string;
  createdAt: string;
}

export interface ProjectsConfig {
  featured: string[];
  hidden: string[];
  titles: Record<string, string>;
}

/** Converts a CMS projects config into override entries (featured order = list order). */
export function configToOverrides(cfg: ProjectsConfig): ProjectOverride[] {
  const map = new Map<string, ProjectOverride>();
  const get = (n: string) => {
    const k = n.trim().toLowerCase();
    if (!map.has(k)) map.set(k, { repoName: n.trim() });
    return map.get(k)!;
  };
  cfg.featured.filter(Boolean).forEach((n, i) => Object.assign(get(n), { featured: true, sortOrder: i + 1 }));
  cfg.hidden.filter(Boolean).forEach(n => { get(n).hidden = true; });
  Object.entries(cfg.titles ?? {}).forEach(([n, t]) => { if (t) get(n).titleOverride = t; });
  return [...map.values()];
}

export function resolveProjects(repos: GitHubRepo[], overrides: ProjectOverride[] = projectOverrides): Project[] {
  const overrideMap = new Map<string, ProjectOverride>();
  for (const o of overrides) {
    overrideMap.set(o.repoName.toLowerCase(), o);
  }

  const projects: Project[] = [];

  for (const repo of repos) {
    const override = overrideMap.get(repo.name.toLowerCase());

    // Skip hidden repos
    if (override?.hidden) continue;

    projects.push({
      slug: repo.name,
      title: override?.titleOverride ?? formatRepoName(repo.name),
      subtitle: repo.description ?? '',
      description: repo.description,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      topics: repo.topics ?? [],
      url: repo.html_url,
      homepage: repo.homepage,
      featured: override?.featured ?? false,
      sortOrder: override?.sortOrder ?? 999,
      pushedAt: repo.pushed_at,
      createdAt: repo.created_at,
    });
  }

  // Sort: featured first by sortOrder, then non-featured by sortOrder then stars
  return projects.sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
    return b.stars - a.stars;
  });
}

function formatRepoName(name: string): string {
  return name
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}
