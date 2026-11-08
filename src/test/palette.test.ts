import { describe, expect, it } from 'vitest';
import { hexAlpha, inkFor, resolvePalette, tint } from '@/design-system/palette';
import { themes } from '@/config/themes';

describe('palette helpers', () => {
  it('hexAlpha builds rgba from hex and rgb() values', () => {
    expect(hexAlpha('#ff9f1c', 0.2)).toBe('rgba(255,159,28,0.2)');
    expect(hexAlpha('#fff', 0.5)).toBe('rgba(255,255,255,0.5)');
    expect(hexAlpha('#ff9f1c80', 0.2)).toBe('rgba(255,159,28,0.2)');
    expect(hexAlpha('rgb(1, 2, 3)', 0.4)).toBe('rgba(1,2,3,0.4)');
    expect(hexAlpha('rgba(10,20,30,0.9)', 0.1)).toBe('rgba(10,20,30,0.1)');
  });

  it('hexAlpha returns anything else unchanged instead of rgba(NaN…)', () => {
    expect(hexAlpha('var(--accent)', 0.2)).toBe('var(--accent)');
    expect(hexAlpha('oklch(70% 0.1 50)', 0.2)).toBe('oklch(70% 0.1 50)');
  });

  it('tint and inkFor', () => {
    expect(tint('var(--accent)', 10)).toBe('color-mix(in srgb, var(--accent) 10%, transparent)');
    expect(inkFor('var(--secondary)')).toBe('var(--secondary-ink)');
    expect(inkFor('#123456')).toBe('#123456');
  });

  it('jobEdgeHover is a concrete colour for every theme and mode (framer-motion target)', () => {
    for (const theme of themes) for (const dark of [false, true]) {
      expect(resolvePalette(theme, dark).jobEdgeHover).not.toMatch(/NaN|var\(/);
    }
  });
});
