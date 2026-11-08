export interface GitHubRepo {
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  fork: boolean;
  archived: boolean;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  homepage: string | null;
  has_pages?: boolean;
}

/** Root of the project-site index; also the base of every repo's default Pages URL. */
export const PAGES_INDEX_URL = 'https://espenhk.github.io/';

/**
 * Where a repo's live page is: its Website field if set, otherwise its GitHub Pages URL.
 * Same rule as the espenhk.github.io index, so both sites agree.
 */
export function liveUrl(repo: Pick<GitHubRepo, 'name' | 'homepage' | 'has_pages'>): string | null {
  const homepage = repo.homepage?.trim() || null;
  if (homepage) return homepage;
  return repo.has_pages ? `${PAGES_INDEX_URL}${repo.name}/` : null;
}

export async function fetchGitHubRepos(username: string): Promise<GitHubRepo[]> {
  const allRepos: GitHubRepo[] = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const url = `https://api.github.com/users/${username}/repos?per_page=${perPage}&page=${page}&sort=pushed`;
    const res = await fetch(url);

    if (!res.ok) {
      if (res.status === 403) {
        console.warn('GitHub API rate limit reached, returning partial results');
        break;
      }
      throw new Error(`GitHub API error: ${res.status}`);
    }

    const repos: GitHubRepo[] = await res.json();
    if (repos.length === 0) break;

    allRepos.push(...repos);
    if (repos.length < perPage) break;
    page++;
  }

  return allRepos.filter(r => !r.fork && !r.archived);
}
