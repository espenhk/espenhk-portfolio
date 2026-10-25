# Portfolio CMS

A private editor at `/admin` (hidden: no links, buttons, menu entries, sitemap entries or hints anywhere on the portfolio; marked noindex and disallowed in robots.txt; reachable only by typing the URL) where you sign in with a real account and reorder, show/hide, edit and duplicate every section of the homepage. Content lives in standard Postgres tables, so you can export it and move it anywhere.

## Why this beats the Tromsø approach
- Tromsø: one shared password, checked by a server function, with a token in the browser. Hard to revoke, and it depends on custom function code.
- This plan: a normal account sign-in plus an admin role stored in the database. Security rules in the database itself only allow the admin to write. Visitors can only read published content. There are no server functions (which also keeps your rule "no edge functions").
- No lock-in: plain Postgres tables and the standard open-source client library. A built-in JSON export/import means you can rebuild the content on any host.
- Safe fallback: if the database can't be reached or is empty, the site renders today's built-in content. Your homepage never breaks.

## Section types (one per existing section)
| Type | Editable fields |
|---|---|
| Hero | name, title, intro text, avatar, tagline pool (random on refresh) |
| Personnel Dossier (stats) | 3 category names and colors, stat list (label + value 25-95), languages, off-duty interests |
| Transmissions (publications) | heading, Medium/YouTube feed settings, max items, LinkedIn posts on/off |
| Contact | heading, text, button labels |
| Projects (GitHub) | heading, GitHub user, featured repos and order, hidden repos, custom titles, max shown. Descriptions always come live from GitHub |
| Experience | jobs, education, certifications (add, edit, delete, reorder) |
| Free text (new) | heading + markdown body, for extra blocks |

Every section can be reordered (drag, or up/down buttons on mobile), hidden, duplicated or deleted. You can add new sections of any type.

Global settings: social links, CV upload (replaces the PDF file, stored as an uploaded file), and the footer "listening to" status.

## Three suggested extras (included)
1. **Draft and publish:** edits save as drafts. Clicking "Publish" makes them live, and the editor has a preview of the draft.
2. **Revision history:** every publish keeps a snapshot, and you can restore any earlier version in one click.
3. **Export/import JSON:** download or upload all content. This is your backup and your exit path.

## Admin UX
- `/admin/login`: email and password sign-in (no public sign-up; only your account gets the admin role).
- `/admin`: a section list on the left (stacked on mobile) and an edit form for the selected section, with a Publish button and history.
- Same Starfleet look, with simple forms. The page is hidden from search engines and robots.txt.

## Technical details
- Tables: `user_roles` (+ `has_role` function), `cms_sections` (id, type, sort_order, visible, data jsonb, status draft/published), `cms_settings` (single row jsonb), `cms_revisions` (snapshot jsonb, created_at). GRANTs + RLS: anon/authenticated can read only published rows, and only admins can write.
- Storage bucket `cms-files` (public read, admin write) for the CV and images.
- `src/cms/registry.ts`: maps each type to its default data (seeded from the current `src/data/*` files), a zod schema, the editor form and the renderer. Existing section components get a `data` prop that falls back to today's static data.
- `Index.tsx` loads published sections with react-query and renders them in order. If loading fails or returns nothing, it uses the default order.
- Auth: enable email sign-in. Sign-up is disabled in the UI, and I'll give your account the admin role after you create it (I'll ask for your email).
- Tests: the order/visibility resolver and the fallback behaviour, plus a check that stat values stay between 25 and 95.
- AGENTS.md: note that content comes from the CMS, with static data as the fallback.
