"use client";
import { useState } from "react";
import type { RunResult } from "@/lib/runner/types";
import type { Problem } from "@/content/types";
import { TestResults } from "./TestResults";
import { ConsoleOutput } from "./ConsoleOutput";
import { HtmlView } from "./HtmlView";

export function ResultsTabs({ problem, result, srcdoc }: { problem: Problem; result: RunResult | null; srcdoc: string | null }) {
  const tabs = problem.kind === "dom" ? (["Tests", "Console", "HTML View"] as const) : (["Tests", "Console"] as const);
  const [active, setActive] = useState<string>("Tests");
  return (
    <div className="flex flex-col h-full border-l">
      <div className="flex border-b">
        {tabs.map((t) => (
          <button key={t} onClick={() => setActive(t)}
            className={`px-4 py-2 text-sm ${active === t ? "border-b-2 border-blue-500 font-medium" : "text-gray-400"}`}>
            {t}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-auto" aria-live="polite">
        {active === "Tests" && <TestResults result={result} />}
        {active === "Console" && <ConsoleOutput result={result} />}
        {active === "HTML View" && <HtmlView srcdoc={srcdoc} />}
      </div>
    </div>
  );
}
