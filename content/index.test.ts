import { describe, it, expect } from "vitest";
import { getAllProblems, getProblem, getProblemsByTrack } from "./index";
import { validateProblem } from "./validate";

describe("content loader", () => {
  it("loads problems", () => {
    expect(getAllProblems().length).toBeGreaterThan(0);
  });
  it("every problem is schema-valid", () => {
    for (const p of getAllProblems()) {
      expect(validateProblem(p), `${p.id} invalid`).toEqual([]);
    }
  });
  it("has unique ids", () => {
    const ids = getAllProblems().map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it("finds a problem by id", () => {
    const first = getAllProblems()[0];
    expect(getProblem(first.id)?.id).toBe(first.id);
  });
  it("filters by track", () => {
    expect(getProblemsByTrack("javascript").every((p) => p.track === "javascript")).toBe(true);
  });
});
