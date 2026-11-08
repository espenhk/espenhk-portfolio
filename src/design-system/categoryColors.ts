import type { Palette } from './palette';

/**
 * Colours a CMS stats category can use, stored by token name (e.g. "tertiary") so a change in the
 * «Starfleet» design system reaches published content without re-saving it. Resolved at render time
 * through the palette, so on the other site themes a category follows that theme's colours.
 * Any other stored value is treated as a custom CSS colour and used as-is.
 */
export const CATEGORY_TOKENS = ['accent', 'secondary', 'tertiary', 'highlight', 'warm', 'success'] as const;
export type CategoryToken = (typeof CATEGORY_TOKENS)[number];

export const isCategoryToken = (value: string): value is CategoryToken =>
  (CATEGORY_TOKENS as readonly string[]).includes(value);

/** Flat (surface) colour for a category: `palette[token]` for token names, the value itself otherwise. */
export function resolveCategoryColor(value: string, palette: Palette): string {
  return isCategoryToken(value) ? palette[value] : value;
}
