import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { createContext, useContext } from 'react';
import { makeDefaultDoc } from './defaults';
import { normalizeDoc } from './resolve';
import type { CmsDoc, SiteSettings } from './types';

export const CMS_BUCKET = 'cms-files';

export async function fetchDoc(id: 'draft' | 'published'): Promise<CmsDoc | null> {
  const { data, error } = await supabase.from('cms_documents').select('doc').eq('id', id).maybeSingle();
  if (error || !data) return null;
  return normalizeDoc(data.doc);
}

export async function saveDoc(id: 'draft' | 'published', doc: CmsDoc) {
  const { error } = await supabase.from('cms_documents')
    .upsert({ id, doc: doc as any, updated_at: new Date().toISOString() });
  if (error) throw error;
}

export function usePublishedDoc() {
  return useQuery({
    queryKey: ['cms', 'published'],
    queryFn: async () => (await fetchDoc('published')) ?? makeDefaultDoc(),
    staleTime: 60_000,
    retry: 1,
  });
}

/** Signed URL for an uploaded file (bucket is private; anyone may read via policy). */
export function useFileUrl(path?: string) {
  return useQuery({
    queryKey: ['cms-file', path],
    enabled: !!path,
    queryFn: async () => {
      const { data } = await supabase.storage.from(CMS_BUCKET).createSignedUrl(path!, 60 * 60 * 24 * 7);
      return data?.signedUrl ?? null;
    },
    staleTime: 1000 * 60 * 60,
  });
}

export const SettingsContext = createContext<SiteSettings>(makeDefaultDoc().settings);
export const useSiteSettings = () => useContext(SettingsContext);

export function useResumeUrl() {
  const s = useSiteSettings();
  const { data } = useFileUrl(s.resumePath);
  return data ?? s.resumeUrl;
}
