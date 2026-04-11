import type { Publication } from '@/data/experience';

const MEDIUM_RSS_URL = 'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@espenhk';
const YOUTUBE_RSS_URL = 'https://api.rss2json.com/v1/api.json?rss_url=https://www.youtube.com/feeds/videos.xml?channel_id=UCS4IaI0EFrvHRk45XVYgzjw';

function extractFirstImage(html: string): string | undefined {
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/);
  return match?.[1];
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
}

export async function fetchMediumArticles(): Promise<Publication[]> {
  try {
    const res = await fetch(MEDIUM_RSS_URL);
    const data = await res.json();
    if (data.status !== 'ok' || !data.items) return [];
    return data.items.map((item: any) => ({
      title: item.title,
      url: item.link,
      date: formatDate(item.pubDate),
      description: item.description?.replace(/<[^>]+>/g, '').slice(0, 160) + '…',
      type: 'article' as const,
      heroImage: item.thumbnail || extractFirstImage(item.content || item.description || ''),
    }));
  } catch (e) {
    console.error('Failed to fetch Medium feed:', e);
    return [];
  }
}

export async function fetchYouTubeVideos(): Promise<Publication[]> {
  try {
    const res = await fetch(YOUTUBE_RSS_URL);
    const data = await res.json();
    if (data.status !== 'ok' || !data.items) return [];
    return data.items.map((item: any) => ({
      title: item.title,
      url: item.link,
      date: formatDate(item.pubDate),
      description: item.title,
      type: 'video' as const,
      heroImage: item.thumbnail,
    }));
  } catch (e) {
    console.error('Failed to fetch YouTube feed:', e);
    return [];
  }
}
