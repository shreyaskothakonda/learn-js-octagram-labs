import { describe, it, expect } from "vitest";
import { runFunctionCode } from "./run-function";

describe("runFunctionCode", () => {
  it("passes a correct solution", () => {
    const r = runFunctionCode("function add(a,b){return a+b}", "add", [
      { input: [1, 2], expected: 3 },
      { input: [0, 0], expected: 0 },
    ]);
    expect(r.caseResults.every((c) => c.passed)).toBe(true);
    expect(r.error).toBeUndefined();
  });
  it("fails an incorrect solution and records actual", () => {
    const r = runFunctionCode("function add(a,b){return a-b}", "add", [
      { input: [1, 2], expected: 3 },
    ]);
    expect(r.caseResults[0].passed).toBe(false);
    expect(r.caseResults[0].actual).toBe(-1);
  });
  it("captures console.log output", () => {
    const r = runFunctionCode("function f(){console.log('hi');return 1}", "f", [
      { input: [], expected: 1 },
    ]);
    expect(r.consoleLogs).toContain("hi");
  });
  it("reports a syntax error without throwing", () => {
    const r = runFunctionCode("function f({", "f", [{ input: [], expected: 1 }]);
    expect(r.error).toBeTruthy();
  });
  it("records a runtime error per case", () => {
    const r = runFunctionCode("function f(){throw new Error('boom')}", "f", [
      { input: [], expected: 1 },
    ]);
    expect(r.caseResults[0].passed).toBe(false);
    expect(r.caseResults[0].error).toContain("boom");
  });
});
