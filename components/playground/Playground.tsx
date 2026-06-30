"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
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
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type MobileTab = "prompt" | "code" | "results";

export function Playground({
  problem,
  nextId,
  backHref,
}: {
  problem: Problem;
  nextId: string | null;
  backHref: string;
}) {
  const router = useRouter();
  const storageKey = `code:${problem.id}`;
  const [code, setCode] = useState(() => {
    // Seed from a previously saved draft on the client; on the server (and if
    // storage is unavailable) fall back to the starter code.
    if (typeof window === "undefined") return problem.starterCode;
    try {
      return localStorage.getItem(storageKey) ?? problem.starterCode;
    } catch {
      return problem.starterCode;
    }
  });
  const [result, setResult] = useState<RunResult | null>(null);
  const [srcdoc, setSrcdoc] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [solved, setSolved] = useState(false);
  const [editorTheme, setEditorTheme] = useState("vs-dark");
  const [tab, setTab] = useState<MobileTab>("prompt");

  useEffect(() => {
    const sync = () =>
      setEditorTheme(
        document.documentElement.classList.contains("dark") ? "vs-dark" : "vs",
      );
    sync();
    window.addEventListener("themechange", sync);
    return () => window.removeEventListener("themechange", sync);
  }, []);

  function updateCode(val: string) {
    setCode(val);
    try {
      localStorage.setItem(storageKey, val);
    } catch {}
  }

  function showResults() {
    if (typeof window !== "undefined" && window.innerWidth < 1024)
      setTab("results");
  }

  async function execute(onlyVisible: boolean): Promise<RunResult> {
    const cases = onlyVisible
      ? problem.testCases.filter((t) => !t.hidden)
      : problem.testCases;
    if (problem.kind === "dom") {
      const { result, srcdoc } = await runInIframe(problem.html!, code, cases);
      setSrcdoc(srcdoc);
      return result;
    }
    if (problem.kind === "harness")
      return runInWorker(code, "", cases, 3000, "harness");
    return runInWorker(code, problem.functionName!, cases);
  }

  async function onRun() {
    if (busy) return;
    setBusy(true);
    try {
      setResult(await execute(true));
      showResults();
    } finally {
      setBusy(false);
    }
  }

  async function onSubmit() {
    if (busy) return;
    setBusy(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      const r = await execute(false);
      setResult(r);
      showResults();
      const passedCount = r.caseResults.filter((c) => c.passed).length;
      const total = r.caseResults.length;
      const passed = total > 0 && passedCount === total && !r.error;
      setSolved(passed);
      try {
        await recordAttempt({
          problemId: problem.id,
          code,
          passed,
          testsPassed: passedCount,
          testsTotal: total,
          runtimeMs: r.runtimeMs,
        });
        if (passed) toast.success("Solved! Progress saved.");
        else toast("Attempt saved.");
      } catch {
        toast.error("Could not save your progress.");
      }
    } finally {
      setBusy(false);
    }
  }

  const handlers = useRef({ run: onRun, submit: onSubmit });
  useEffect(() => {
    handlers.current = { run: onRun, submit: onSubmit };
  });
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        if (e.shiftKey) handlers.current.submit();
        else handlers.current.run();
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const show = (t: MobileTab) => (tab === t ? "flex" : "hidden");

  return (
    <div className="h-[calc(100vh-3rem)] flex flex-col lg:grid lg:grid-cols-[1fr_1.2fr_1fr]">
      <div className="lg:hidden flex border-b text-sm">
        {(["prompt", "code", "results"] as const).map((k) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`flex-1 py-2 ${tab === k ? "border-b-2 border-blue-500 font-medium" : "text-gray-400"}`}
          >
            {k === "prompt" ? "Problem" : k === "code" ? "Code" : "Tests"}
          </button>
        ))}
      </div>

      <div
        className={`${show("prompt")} lg:flex flex-1 lg:flex-none flex-col min-h-0 border-r`}
      >
        <div className="border-b px-5 py-2 text-xs">
          <Link href={backHref} className="text-blue-500 hover:underline">
            ← Back to problems
          </Link>
        </div>
        <div className="flex-1 overflow-auto">
          <PromptPanel problem={problem} solved={solved} />
        </div>
      </div>

      <div
        className={`${show("code")} lg:flex flex-1 lg:flex-none flex-col min-h-0`}
      >
        <div className="flex-1 min-h-0">
          <Editor
            height="100%"
            defaultLanguage="javascript"
            theme={editorTheme}
            value={code}
            onChange={(v) => updateCode(v ?? "")}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        </div>
        {solved && (
          <div className="flex items-center gap-3 px-3 py-2 border-t bg-green-500/15 text-sm">
            <span className="font-semibold text-green-700 dark:text-green-600">
              ✓ Solved! All tests passed.
            </span>
            {nextId && (
              <Link
                href={`/problem/${nextId}`}
                className="ml-auto rounded bg-green-600 text-white px-3 py-1 hover:bg-green-700"
              >
                Next problem →
              </Link>
            )}
          </div>
        )}
        <div className="flex items-center gap-2 p-2 border-t">
          <Button
            variant="outline"
            size="sm"
            disabled={busy}
            onClick={onRun}
            title="Run (Cmd/Ctrl+Enter)"
          >
            {busy ? "Running…" : "Run"}
          </Button>
          <Button
            size="sm"
            disabled={busy}
            onClick={onSubmit}
            title="Submit (Cmd/Ctrl+Shift+Enter)"
          >
            {busy ? "Submitting…" : "Submit"}
          </Button>
          <span className="hidden xl:block text-xs text-gray-400">
            ⌘/Ctrl + Enter
          </span>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto"
            disabled={busy}
            onClick={() => {
              updateCode(problem.starterCode);
              try {
                localStorage.removeItem(storageKey);
              } catch {}
              setSolved(false);
            }}
          >
            Reset
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={busy}
            onClick={() => updateCode(problem.solution)}
          >
            Solution
          </Button>
        </div>
      </div>

      <div className={`${show("results")} lg:flex flex-1 lg:flex-none min-h-0`}>
        <ResultsTabs problem={problem} result={result} srcdoc={srcdoc} />
      </div>
    </div>
  );
}
