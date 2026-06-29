import type { Problem } from "@/content/types";
import { Hints } from "./Hints";

export function PromptPanel({ problem, solved }: { problem: Problem; solved: boolean }) {
  return (
    <div className="p-5 overflow-auto space-y-4">
      <div>
        <h1 className="text-xl font-bold">{problem.title}</h1>
        <span className="text-xs uppercase text-gray-400">{problem.topic} · {problem.difficulty}</span>
      </div>
      <p className="whitespace-pre-wrap text-sm">{problem.prompt}</p>

      {problem.hints && problem.hints.length > 0 && <Hints hints={problem.hints} />}

      {problem.pitfalls && problem.pitfalls.length > 0 && (
        <details className="text-sm">
          <summary className="cursor-pointer text-amber-500">Common pitfalls</summary>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            {problem.pitfalls.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        </details>
      )}

      {problem.resources.length > 0 && (
        <div className="text-sm">
          <h3 className="font-semibold mb-1">Learning resources</h3>
          <ul className="list-disc pl-5">
            {problem.resources.map((r) => (
              <li key={r.url}><a className="text-blue-500 underline" href={r.url} target="_blank" rel="noreferrer">{r.label}</a></li>
            ))}
          </ul>
        </div>
      )}

      {problem.explanation && (
        <details open={solved} className="text-sm rounded border p-3 bg-gray-500/5">
          <summary className="cursor-pointer font-semibold text-green-600">
            {solved ? "Solved — approach & explanation" : "Approach & explanation (try first)"}
          </summary>
          <p className="whitespace-pre-wrap mt-2">{problem.explanation}</p>
        </details>
      )}
    </div>
  );
}
