/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach } from "vitest";
import { getAllProblems } from "./index";

describe("dom reference solutions pass their own asserts", () => {
  for (const problem of getAllProblems().filter((p) => p.kind === "dom")) {
    it(`${problem.id} solution passes all asserts`, () => {
      // Set up the DOM with the problem's HTML
      document.body.innerHTML = problem.html ?? "";

      // Execute the solution code
      // eslint-disable-next-line no-new-func
      new Function(problem.solution)();

      // Evaluate each assertion
      for (const tc of problem.testCases) {
        if (!tc.assert) continue;
        // eslint-disable-next-line no-new-func
        const result = new Function(`return !!(${tc.assert})`)();
        expect(result, `${problem.id}: assert "${tc.assert}" should be true`).toBe(true);
      }
    });

    // Reset DOM between sub-tests by re-running beforeEach at describe level
    beforeEach(() => {
      document.body.innerHTML = "";
    });
  }
});
