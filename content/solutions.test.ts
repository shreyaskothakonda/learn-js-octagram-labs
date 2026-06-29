import { describe, it, expect } from "vitest";
import { getAllProblems } from "./index";

// Runs a function problem's reference solution against its own test cases in-process.
function runSolution(code: string, fnName: string, input: unknown[]): unknown {
  const factory = new Function(`${code}; return ${fnName};`);
  const fn = factory() as (...a: unknown[]) => unknown;
  return fn(...input);
}

function deepEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

describe("reference solutions pass their own tests", () => {
  for (const p of getAllProblems().filter((p) => p.kind === "function")) {
    it(`${p.id} solution passes`, () => {
      for (const tc of p.testCases) {
        const out = runSolution(p.solution, p.functionName!, tc.input!);
        expect(deepEqual(out, tc.expected), `${p.id} case ${JSON.stringify(tc.input)}`).toBe(true);
      }
    });
  }
});
