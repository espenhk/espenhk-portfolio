import { defaultSectionData, makeDefaultDoc, sectionAnchors } from './defaults';
import type { CmsDoc, Section, SectionType } from './types';

export const STAT_MIN = 0;
export const STAT_MAX = 100;

export function clampStat(v: number): number {
  if (!Number.isFinite(v)) return STAT_MIN;
  return Math.min(STAT_MAX, Math.max(STAT_MIN, Math.round(v)));
}

const KNOWN = new Set(Object.keys(defaultSectionData));

/** Turns any stored JSON into a safe, complete doc. Falls back to defaults when invalid or empty. */
export function normalizeDoc(raw: unknown): CmsDoc {
  const def = makeDefaultDoc();
  if (!raw || typeof raw !== 'object') return def;
  const r = raw as Partial<CmsDoc>;
  const sections = Array.isArray(r.sections)
    ? r.sections.filter(s => s && KNOWN.has((s as Section).type)).map(s => {
        const type = s.type as SectionType;
        const data = { ...(defaultSectionData[type] as object), ...((s.data as object) ?? {}) } as any;
        if (type === 'stats') data.stats = (data.stats ?? []).map((st: any) => ({ ...st, value: clampStat(Number(st.value)) }));
        return { id: String(s.id || crypto.randomUUID()), type, visible: s.visible !== false, data } as Section;
      })
    : [];
  if (sections.length === 0) return def;
  return {
    version: 1,
    settings: {
      ...def.settings,
      ...(r.settings ?? {}),
      socials: { ...def.settings.socials, ...(r.settings?.socials ?? {}) },
      status: { ...def.settings.status, ...(r.settings?.status ?? {}) },
    },
    sections,
  };
}

/** Visible sections in order, each with a unique DOM anchor (first of a type gets the canonical nav id). */
export function visibleSections(doc: CmsDoc): (Section & { anchorId: string })[] {
  const seen: Record<string, number> = {};
  return doc.sections.filter(s => s.visible).map(s => {
    const n = (seen[s.type] = (seen[s.type] ?? 0) + 1);
    const base = sectionAnchors[s.type];
    return { ...s, anchorId: n === 1 ? base : `${base}-${n}` };
  });
}

export function moveSection(sections: Section[], index: number, dir: -1 | 1): Section[] {
  const to = index + dir;
  if (to < 0 || to >= sections.length) return sections;
  const copy = [...sections];
  [copy[index], copy[to]] = [copy[to], copy[index]];
  return copy;
}
