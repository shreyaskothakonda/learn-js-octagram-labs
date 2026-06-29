import type { RunResult } from "@/lib/runner/types";

export function TestResults({ result }: { result: RunResult | null }) {
  if (!result) return <p className="p-4 text-sm text-gray-400">Run your code to see results.</p>;
  if (result.error) return <pre className="p-4 text-sm text-red-500 whitespace-pre-wrap">{result.error}</pre>;
  return (
    <ul className="p-4 space-y-2">
      {result.caseResults.map((c) => (
        <li key={c.index} className={`text-sm rounded px-3 py-2 ${c.passed ? "bg-green-500/10" : "bg-red-500/10"}`}>
          <span className="font-medium">{c.passed ? "✓" : "✗"} Case {c.index + 1}</span>
          {c.description && <span className="ml-2 text-gray-400">{c.description}</span>}
          {!c.passed && c.error && <div className="text-red-500 mt-1">{c.error}</div>}
          {!c.passed && !c.error && "expected" in c && (
            <div className="text-gray-400 mt-1">expected {JSON.stringify(c.expected)}, got {JSON.stringify(c.actual)}</div>
          )}
        </li>
      ))}
    </ul>
  );
}
