export type CaseResult = {
  index: number;
  passed: boolean;
  expected?: unknown;
  actual?: unknown;
  description?: string;
  error?: string;
};

export type RunResult = {
  caseResults: CaseResult[];
  consoleLogs: string[];
  error?: string;
  runtimeMs: number;
};
