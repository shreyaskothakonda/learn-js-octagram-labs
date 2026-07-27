import { describe, it, expect } from "vitest";
import { validateConcept } from "./concepts/validate";
import type { Concept } from "./concepts/types";

const base: Concept = {
  slug: "closures",
  track: "javascript",
  topic: "A Closer Look at Functions",
  title: "Closures",
  oneLiner: "A function remembers the variables it was created with.",
  definition: "A closure is a function bundled with references to its surrounding state.",
  examples: [{ code: "function outer(){}", explanation: "x" }],
  realWorldUseCases: ["Private state in modules"],
  relatedProblemIds: ["js-closures-001"],
  visual: "closures",
};
const problemIds = new Set(["js-closures-001"]);
const visualKeys = new Set(["closures"]);

describe("validateConcept", () => {
  it("accepts a valid concept", () => {
    expect(validateConcept(base, problemIds, visualKeys)).toEqual([]);
  });
  it("rejects a non-kebab slug", () => {
    expect(validateConcept({ ...base, slug: "Closures" }, problemIds, visualKeys))
      .toContain("slug must be kebab-case: Closures");
  });
  it("rejects an empty definition", () => {
    expect(validateConcept({ ...base, definition: "" }, problemIds, visualKeys))
      .toContain("concept closures missing definition");
  });
  it("rejects an unknown related problem id", () => {
    expect(validateConcept({ ...base, relatedProblemIds: ["nope"] }, problemIds, visualKeys))
      .toContain("concept closures references unknown problem: nope");
  });
  it("rejects an unregistered visual", () => {
    expect(validateConcept({ ...base, visual: "ghost" }, problemIds, visualKeys))
      .toContain("concept closures references unknown visual: ghost");
  });
});

import { getAllConcepts } from "./concepts";
import { getAllProblems } from "./index";
import { visualKeys as registryVisualKeys } from "../components/concepts/visuals";

describe("concept registry integrity", () => {
  const problemIds = new Set(getAllProblems().map((p) => p.id));
  const keys = new Set(registryVisualKeys);
  it("every concept passes validation", () => {
    for (const c of getAllConcepts()) {
      expect(validateConcept(c, problemIds, keys), c.slug).toEqual([]);
    }
  });
  it("slugs are unique", () => {
    const slugs = getAllConcepts().map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
