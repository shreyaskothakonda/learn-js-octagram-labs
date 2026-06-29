import type { RunResult } from "./types";
import type { TestCase } from "@/content/types";

export function runInWorker(
  code: string,
  functionName: string,
  testCases: TestCase[],
  timeoutMs = 3000,
): Promise<RunResult> {
  return new Promise((resolve) => {
    const worker = new Worker("/runner-worker.js");
    const timer = setTimeout(() => {
      worker.terminate();
      resolve({ caseResults: [], consoleLogs: [], error: "Execution timed out", runtimeMs: timeoutMs });
    }, timeoutMs);

    worker.onmessage = (e: MessageEvent<RunResult>) => {
      clearTimeout(timer);
      worker.terminate();
      resolve(e.data);
    };
    worker.onerror = (e) => {
      clearTimeout(timer);
      worker.terminate();
      resolve({ caseResults: [], consoleLogs: [], error: e.message, runtimeMs: 0 });
    };
    worker.postMessage({ code, functionName, testCases });
  });
}
