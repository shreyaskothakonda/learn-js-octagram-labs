import type { CaseResult, RunResult } from "@/lib/runner/types";
import type { Problem } from "@/content/types";
import { formatCall, formatDuration, formatValue } from "@/lib/runner/format-case";

function DetailRow({ label, value, tone }: { label: string; value: string; tone?: "pass" | "fail" }) {
  const toneClass = tone === "fail" ? "text-red-500" : tone === "pass" ? "text-green-600" : "text-foreground";
  return (
    <div className="grid grid-cols-[76px_minmax(0,1fr)] items-baseline gap-2">
      <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</span>
      <code className={`font-mono text-xs break-all whitespace-pre-wrap ${toneClass}`}>{value}</code>
    </div>
  );
}

/** What the case actually exercised, labelled for the problem kind. */
function caseDetail(c: CaseResult, problem: Problem): { label: string; value: string } | null {
  if (c.input) return { label: "Input", value: formatCall(problem.functionName ?? "fn", c.input) };
  if (c.run) return { label: "Ran", value: c.run };
  if (c.assert) return { label: "Checked", value: c.assert };
  return null;
}

function CaseRow({ c, problem }: { c: CaseResult; problem: Problem }) {
  const detail = caseDetail(c, problem);
  const shell = c.passed
    ? "border-green-500/30 bg-green-500/5"
    : "border-red-500/30 bg-red-500/5";

  return (
    <li className={`rounded-lg border px-3 py-2 ${shell}`}>
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className={c.passed ? "text-green-600" : "text-red-500"}>{c.passed ? "✓" : "✗"}</span>
        <span className="font-medium">Case {c.index + 1}</span>
        {c.description && <span className="text-muted-foreground">{c.description}</span>}
        {c.hidden && (
          <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
            Hidden
          </span>
        )}
        {typeof c.durationMs === "number" && (
          <span className="ml-auto text-[11px] tabular-nums text-muted-foreground">
            {formatDuration(c.durationMs)}
          </span>
        )}
      </div>

      {/* Hidden cases stay summarized so they cannot be answered by hardcoding. */}
      {c.hidden ? (
        c.error ? <div className="mt-1 text-xs text-red-500">{c.error}</div> : null
      ) : (
        <div className="mt-2 space-y-1">
          {detail && <DetailRow label={detail.label} value={detail.value} />}
          {"expected" in c && <DetailRow label="Expected" value={formatValue(c.expected)} />}
          {c.error ? (
            <DetailRow label="Error" value={c.error} tone="fail" />
          ) : (
            "actual" in c && (
              <DetailRow label="Received" value={formatValue(c.actual)} tone={c.passed ? "pass" : "fail"} />
            )
          )}
        </div>
      )}
    </li>
  );
}

export function TestResults({ result, problem }: { result: RunResult | null; problem: Problem }) {
  if (!result) return <p className="p-4 text-sm text-muted-foreground">Run your code to see results.</p>;
  if (result.error) return <pre className="p-4 text-sm text-red-500 whitespace-pre-wrap">{result.error}</pre>;

  const cases = result.caseResults;
  const passed = cases.filter((c) => c.passed).length;
  const hiddenCount = cases.filter((c) => c.hidden).length;
  const allPassed = cases.length > 0 && passed === cases.length;

  return (
    <div className="space-y-3 p-4">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b pb-2 text-sm">
        <span className={`font-semibold ${allPassed ? "text-green-600" : "text-red-500"}`}>
          {passed} of {cases.length} passed
        </span>
        {hiddenCount > 0 && (
          <span className="text-xs text-muted-foreground">
            {hiddenCount} hidden
          </span>
        )}
        <span className="ml-auto text-xs tabular-nums text-muted-foreground">
          {formatDuration(result.runtimeMs)} total
        </span>
      </div>
      <ul className="space-y-2">
        {cases.map((c) => (
          <CaseRow key={c.index} c={c} problem={problem} />
        ))}
      </ul>
    </div>
  );
}
