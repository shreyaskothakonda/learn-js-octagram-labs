import type { Problem } from "./types";

export function validateProblem(p: Problem): string[] {
  const errors: string[] = [];
  if (!p.id) errors.push("problem missing id");
  if (!p.title) errors.push("problem missing title");
  if (!p.testCases || p.testCases.length === 0) errors.push("problem has no test cases");

  if (p.kind === "function") {
    if (!p.functionName) errors.push("function problem missing functionName");
    for (const tc of p.testCases ?? []) {
      if (tc.input === undefined) errors.push("function test case missing input");
    }
  }
  if (p.kind === "dom") {
    if (!p.html) errors.push("dom problem missing html");
    for (const tc of p.testCases ?? []) {
      if (!tc.assert) errors.push("dom test case missing assert");
    }
  }
  return errors;
}
