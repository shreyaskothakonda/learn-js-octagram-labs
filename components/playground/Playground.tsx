"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Editor from "@monaco-editor/react";
import type { Problem } from "@/content/types";
import type { RunResult } from "@/lib/runner/types";
import { runInWorker } from "@/lib/runner/run-in-worker";
import { runInIframe } from "@/lib/runner/run-in-iframe";
import { recordAttempt } from "@/lib/progress/store";
import { createClient } from "@/lib/supabase/client";
import { PromptPanel } from "./PromptPanel";
import { ResultsTabs } from "./ResultsTabs";

export function Playground({ problem }: { problem: Problem }) {
  const router = useRouter();
  const [code, setCode] = useState(problem.starterCode);
  const [result, setResult] = useState<RunResult | null>(null);
  const [srcdoc, setSrcdoc] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [solved, setSolved] = useState(false);

  async function execute(onlyVisible: boolean): Promise<RunResult> {
    const cases = onlyVisible ? problem.testCases.filter((t) => !t.hidden) : problem.testCases;
    if (problem.kind === "dom") {
      const { result, srcdoc } = await runInIframe(problem.html!, code, cases);
      setSrcdoc(srcdoc);
      return result;
    }
    return runInWorker(code, problem.functionName!, cases);
  }

  async function onRun() {
    setBusy(true);
    try {
      setResult(await execute(true));
    } finally {
      setBusy(false);
    }
  }

  async function onSubmit() {
    setBusy(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      const r = await execute(false);
      setResult(r);
      const passedCount = r.caseResults.filter((c) => c.passed).length;
      const total = r.caseResults.length;
      const passed = total > 0 && passedCount === total && !r.error;
      if (passed) setSolved(true);
      try {
        await recordAttempt({
          problemId: problem.id, code,
          passed,
          testsPassed: passedCount, testsTotal: total, runtimeMs: r.runtimeMs,
        });
      } catch { /* non-blocking: results stay visible */ }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr_1fr] h-[calc(100vh-3rem)]">
      <div className="border-r overflow-auto"><PromptPanel problem={problem} solved={solved} /></div>
      <div className="flex flex-col">
        <div className="flex-1 min-h-0">
          <Editor height="100%" defaultLanguage="javascript" theme="vs-dark"
            value={code} onChange={(v) => setCode(v ?? "")} options={{ minimap: { enabled: false }, fontSize: 14 }} />
        </div>
        <div className="flex gap-2 p-2 border-t">
          <button disabled={busy} onClick={onRun} className="rounded border px-4 py-1.5 text-sm">Run</button>
          <button disabled={busy} onClick={onSubmit} className="rounded bg-blue-600 text-white px-4 py-1.5 text-sm">Submit</button>
          <button disabled={busy} onClick={() => setCode(problem.starterCode)} className="rounded border px-4 py-1.5 text-sm">Reset</button>
          <button disabled={busy} onClick={() => setCode(problem.solution)} className="ml-auto rounded border px-4 py-1.5 text-sm">Show Solution</button>
        </div>
      </div>
      <ResultsTabs problem={problem} result={result} srcdoc={srcdoc} />
    </div>
  );
}
