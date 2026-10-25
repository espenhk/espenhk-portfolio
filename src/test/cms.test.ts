import { describe, it, expect } from "vitest";
import { clampStat, normalizeDoc, visibleSections, moveSection } from "@/cms/resolve";
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
    const out = resolveProjects([repo("a"), repo("b"), repo("c")], configToOverrides({ featured: ["c", "a"], hidden: ["b"], titles: {} }));
    expect(out.map(p => p.slug)).toEqual(["c", "a"]);
    expect(out[0].subtitle).toBe("d-c");
  });
});
