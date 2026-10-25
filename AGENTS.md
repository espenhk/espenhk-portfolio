# AGENTS.md

- Homepage content comes from the CMS document (`cms_documents` row `published`), normalized through `src/cms/resolve.ts`; static `src/data/*` files are only defaults/fallback — so the site still renders if the backend is empty or down.
- Each homepage section type is registered in `src/cms/types.ts`, `src/cms/defaults.ts`, `src/cms/SectionRenderer.tsx` and `src/pages/admin/editors.tsx`; add new types in all four — keeps editor and renderer in sync.
- The CMS is one JSON document (draft + published) plus revisions — keeps content portable via JSON export/import and avoids lock-in.
- Editor access is enforced by RLS via `public.has_role(auth.uid(), 'admin')`; never gate on client state — client checks are UI only.
- `/admin` must never be linked or mentioned from public pages, sitemap or robots.txt — it stays hidden, discoverable only by URL.
