export type ProgressStatus = "attempted" | "solved";

export type RecordAttemptInput = {
  problemId: string;
  code: string;
  passed: boolean;
  testsPassed: number;
  testsTotal: number;
  runtimeMs: number;
};

export type AttemptRow = {
  id: string;
  problem_id: string;
  passed: boolean;
  tests_passed: number;
  tests_total: number;
  created_at: string;
};
