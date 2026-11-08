import { describe, expect, it } from 'vitest';
import { liveUrl, type GitHubRepo } from '@/lib/github';
import { resolveProjects } from '@/lib/resolveProjects';

const repo = (over: Partial<GitHubRepo>): GitHubRepo => ({
  name: 'r', full_name: 'espenhk/r', html_url: 'https://github.com/espenhk/r', description: null,
  language: null, stargazers_count: 0, forks_count: 0, topics: [], fork: false, archived: false,
  created_at: '2026-01-01', updated_at: '2026-01-01', pushed_at: '2026-01-01', homepage: null,
  ...over,
});

describe('liveUrl', () => {
  it('prefers the Website field', () => {
    expect(liveUrl(repo({ has_pages: true, homepage: 'https://espen.hk' }))).toBe('https://espen.hk');
  });
  it('falls back to the GitHub Pages URL', () => {
    expect(liveUrl(repo({ name: 'brann-away', has_pages: true, homepage: '' })))
      .toBe('https://espenhk.github.io/brann-away/');
  });
  it('is the Website field without Pages', () => {
    expect(liveUrl(repo({ homepage: 'https://example.org' }))).toBe('https://example.org');
  });
  it('is null with neither', () => {
    expect(liveUrl(repo({}))).toBeNull();
  });
});

describe('resolveProjects live pages', () => {
  it('marks Pages repos and hides unlisted ones', () => {
    const out = resolveProjects([
      repo({ name: 'with-pages', has_pages: true }),
      repo({ name: 'plain' }),
      repo({ name: 'secret', has_pages: true, topics: ['unlisted'] }),
    ], []);
    expect(out.map(p => p.slug).sort()).toEqual(['plain', 'with-pages']);
    const live = out.find(p => p.slug === 'with-pages')!;
    expect(live.hasPages).toBe(true);
    expect(live.liveUrl).toBe('https://espenhk.github.io/with-pages/');
    expect(out.find(p => p.slug === 'plain')!.liveUrl).toBeNull();
  });
});
