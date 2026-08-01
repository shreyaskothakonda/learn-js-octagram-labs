import { describe, it, expect } from "vitest";
import { mapWorkerResult } from "./run-script";

// runScript itself spawns a browser Worker, which vitest's environment cannot do.
// We only unit test the pure mapWorkerResult function here; actual Worker
// execution is not covered by this test file.
describe("mapWorkerResult", () => {
  it("maps consoleLogs to logs with no error", () => {
    expect(mapWorkerResult({ consoleLogs: ["1", "2"] })).toEqual({ logs: ["1", "2"], error: undefined });
  });
  it("maps an empty consoleLogs with an error", () => {
    expect(mapWorkerResult({ consoleLogs: [], error: "boom" })).toEqual({ logs: [], error: "boom" });
  });
  it("defaults to empty logs and no error when data is empty", () => {
    expect(mapWorkerResult({})).toEqual({ logs: [], error: undefined });
  });
});
