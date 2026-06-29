import { deepEqual } from "./deep-equal";
import type { CaseResult, RunResult } from "./types";
import type { TestCase } from "@/content/types";

export function runFunctionCode(
  code: string,
  functionName: string,
  testCases: TestCase[],
): RunResult {
  const start = Date.now();
  const consoleLogs: string[] = [];
  const fakeConsole = {
    log: (...args: unknown[]) =>
      consoleLogs.push(args.map((a) => (typeof a === "string" ? a : JSON.stringify(a))).join(" ")),
  };

  let fn: (...a: unknown[]) => unknown;
  try {
    const factory = new Function("console", `${code}; return ${functionName};`);
    fn = factory(fakeConsole) as (...a: unknown[]) => unknown;
    if (typeof fn !== "function") {
      return { caseResults: [], consoleLogs, error: `${functionName} is not defined`, runtimeMs: Date.now() - start };
    }
  } catch (e) {
    return { caseResults: [], consoleLogs, error: (e as Error).message, runtimeMs: Date.now() - start };
  }

  const caseResults: CaseResult[] = testCases.map((tc, index) => {
    try {
      const actual = fn(...(tc.input ?? []));
      return { index, passed: deepEqual(actual, tc.expected), expected: tc.expected, actual };
    } catch (e) {
      return { index, passed: false, expected: tc.expected, error: (e as Error).message };
    }
  });

  return { caseResults, consoleLogs, runtimeMs: Date.now() - start };
}
