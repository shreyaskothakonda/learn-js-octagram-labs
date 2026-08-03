/**
 * Formats a value for display in test results. JSON.stringify is not enough on
 * its own: it returns the value `undefined` (not a string) for `undefined`, and
 * it turns NaN and Infinity into "null", which would read as a wrong answer.
 */
export function formatValue(value: unknown): string {
  if (value === undefined) return "undefined";
  if (typeof value === "number" && !Number.isFinite(value)) return String(value);
  const json = JSON.stringify(value);
  return json === undefined ? String(value) : json;
}

/**
 * Formats an execution time. Browsers clamp performance.now() for security, so
 * a fast case often measures as 0. Report that as "under 0.1 ms" rather than
 * "0 ms", which would read as if nothing ran.
 */
export function formatDuration(ms: number): string {
  if (ms >= 1) return `${Math.round(ms)} ms`;
  if (ms > 0) return `${ms} ms`;
  return "under 0.1 ms";
}

/** Formats a function problem's test case as the call that was made, e.g. sum([1,2,3]). */
export function formatCall(functionName: string, input: unknown[] | undefined): string {
  const args = (input ?? []).map(formatValue).join(", ");
  return `${functionName}(${args})`;
}
