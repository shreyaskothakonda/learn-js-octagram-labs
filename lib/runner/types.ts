export type CaseResult = {
  index: number;
  passed: boolean;
  expected?: unknown;
  actual?: unknown;
  description?: string;
  error?: string;
  /** The arguments the function was called with (function problems). */
  input?: unknown[];
  /** The driver script that was run (harness problems). */
  run?: string;
  /** The assertion that was evaluated (dom problems). */
  assert?: string;
  /** True when the problem author marked this case hidden. */
  hidden?: boolean;
  /** How long this single case took to execute. */
  durationMs?: number;
};

export type RunResult = {
  caseResults: CaseResult[];
  consoleLogs: string[];
  error?: string;
  runtimeMs: number;
};
