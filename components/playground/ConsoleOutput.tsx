import type { RunResult } from "@/lib/runner/types";

export function ConsoleOutput({ result }: { result: RunResult | null }) {
  const logs = result?.consoleLogs ?? [];
  if (logs.length === 0) return <p className="p-4 text-sm text-gray-400">No console output.</p>;
  return (
    <pre className="p-4 text-sm font-mono whitespace-pre-wrap">{logs.join("\n")}</pre>
  );
}
