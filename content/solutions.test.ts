import { describe, it, expect } from "vitest";
import { getAllProblems } from "./index";

// Runs a function problem's reference solution against one input. Awaiting the
// result supports both synchronous solutions and async/Promise-returning ones.
async function runSolution(code: string, fnName: string, input: unknown[]): Promise<unknown> {
  const factory = new Function(`${code}; return ${fnName};`);
  const fn = factory() as (...a: unknown[]) => unknown;
  return await fn(...input);
}

function deepEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

describe("reference solutions pass their own tests", () => {
  for (const p of getAllProblems().filter((p) => p.kind === "function")) {
    it(`${p.id} solution passes`, async () => {
      for (const tc of p.testCases) {
        const out = await runSolution(p.solution, p.functionName!, tc.input!);
        expect(deepEqual(out, tc.expected), `${p.id} case ${JSON.stringify(tc.input)}`).toBe(true);
      }
    });
  }
  for (const p of getAllProblems().filter((p) => p.kind === "harness")) {
    it(`${p.id} harness solution passes`, () => {
      for (const tc of p.testCases) {
        const out = new Function(`${p.solution}\n${tc.run}`)();
        expect(deepEqual(out, tc.expected), `${p.id} run ${tc.run}`).toBe(true);
      }
    });
  }
});
