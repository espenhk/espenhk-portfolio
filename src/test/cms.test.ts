import { describe, it, expect } from "vitest";
import { clampStat, normalizeCategoryColor, normalizeDoc, normalizeHeroParts, visibleSections, moveSection } from "@/cms/resolve";
import { resolveCategoryColor } from "@/design-system/categoryColors";
import { resolvePalette } from "@/design-system/palette";
import { themes } from "@/config/themes";
import { makeDefaultDoc } from "@/cms/defaults";
import { configToOverrides, resolveProjects } from "@/lib/resolveProjects";

describe("cms", () => {
  it("falls back to the default page when stored content is empty or invalid", () => {
    expect(normalizeDoc(null).sections.map(s => s.type)).toEqual(["hero", "stats", "publications", "contact", "projects", "experience"]);
    expect(normalizeDoc({ sections: [] }).sections).toHaveLength(6);
    expect(normalizeDoc({ sections: [{ id: "x", type: "bogus", visible: true, data: {} }] }).sections).toHaveLength(6);
  });

  it("keeps stat values between 0 and 100", () => {
    expect(clampStat(140)).toBe(100);
    expect(clampStat(-5)).toBe(0);
    expect(clampStat(62)).toBe(62);
  });

  it("hides hidden sections and gives duplicates unique anchors", () => {
    const doc = makeDefaultDoc();
    doc.sections[1].visible = false;
    doc.sections.push({ ...doc.sections[3], id: "contact-copy" });
    const v = visibleSections(doc);
    expect(v.find(s => s.type === "stats")).toBeUndefined();
    expect(v.filter(s => s.type === "contact").map(s => s.anchorId)).toEqual(["contact", "contact-2"]);
  });

  it("moves sections up and down", () => {
    const s = makeDefaultDoc().sections;
    expect(moveSection(s, 0, 1).map(x => x.type).slice(0, 2)).toEqual(["stats", "hero"]);
    expect(moveSection(s, 0, -1)).toBe(s);
  });

  it("orders featured repos as listed and hides hidden ones", () => {
    const repo = (name: string) => ({ name, description: `d-${name}`, stargazers_count: 0, forks_count: 0 } as any);
    const out = resolveProjects([repo("a"), repo("b"), repo("c")], configToOverrides({ featured: ["c", "a"], hidden: ["b"] }));
    expect(out.map(p => p.slug)).toEqual(["c", "a"]);
    expect(out[0].title).toBe("c");
    expect(out[0].description).toBe("d-c");
  });

  it("keeps stored hero part order/visibility and fills in missing parts", () => {
    const out = normalizeHeroParts([{ key: "buttons", visible: true }, { key: "nowPlaying", visible: false }, { key: "bogus", visible: true }, { key: "buttons", visible: false }]);
    expect(out.slice(0, 2)).toEqual([{ key: "buttons", visible: true }, { key: "nowPlaying", visible: false }]);
    expect(out.map(p => p.key).sort()).toEqual(["avatar", "bio", "buttons", "name", "nowPlaying", "socials", "tagline"]);
    expect(normalizeHeroParts(undefined).map(p => p.key)).toEqual(["avatar", "name", "tagline", "nowPlaying", "bio", "buttons", "socials"]);
  });

  it("stores stats category colours as design-system token names", () => {
    // legacy hex values (Starfleet v2 at the time) become token names, case-insensitively
    expect(normalizeCategoryColor("#99CCFF")).toBe("tertiary");
    expect(normalizeCategoryColor("#cc99ff")).toBe("secondary");
    expect(normalizeCategoryColor("#FF9F1C")).toBe("accent");
    // token names and custom colours are kept; missing → a sensible default
    expect(normalizeCategoryColor("highlight")).toBe("highlight");
    expect(normalizeCategoryColor("#123456")).toBe("#123456");
    expect(normalizeCategoryColor(undefined)).toBe("tertiary");

    const stored = makeDefaultDoc();
    const stats = stored.sections.find(s => s.type === "stats")!;
    (stats.data as any).categories = [{ key: "a", label: "A", color: "#99CCFF" }, { key: "b", label: "B", color: "#abcdef" }];
    const normalized = normalizeDoc(JSON.parse(JSON.stringify(stored)));
    const cats = (normalized.sections.find(s => s.type === "stats")!.data as any).categories;
    expect(cats.map((c: any) => c.color)).toEqual(["tertiary", "#abcdef"]);
  });

  it("defaults use token names", () => {
    const stats = makeDefaultDoc().sections.find(s => s.type === "stats")!;
    expect((stats.data as any).categories.map((c: any) => c.color)).toEqual(["tertiary", "secondary", "accent"]);
  });

  it("resolves category colours through the active theme", () => {
    const starfleet = resolvePalette(themes.find(t => t.id === "starfleet")!, true);
    const cupertino = resolvePalette(themes.find(t => t.id === "cupertino")!, true);
    expect(resolveCategoryColor("tertiary", starfleet)).toBe("var(--tertiary)");
    expect(resolveCategoryColor("tertiary", cupertino)).toBe(themes.find(t => t.id === "cupertino")!.colors.tertiary);
    expect(resolveCategoryColor("#abcdef", starfleet)).toBe("#abcdef");
  });
});
