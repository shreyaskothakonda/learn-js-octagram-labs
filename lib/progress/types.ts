export type ProgressStatus = "attempted" | "solved";

export type RecordAttemptInput = {
  problemId: string;
  code: string;
  passed: boolean;
  testsPassed: number;
  testsTotal: number;
  runtimeMs: number;
};
