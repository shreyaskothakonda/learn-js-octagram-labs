import type { Problem } from "@/content/types";

export function PromptPanel({ problem }: { problem: Problem }) {
  return (
    <div className="p-5 overflow-auto space-y-4">
      <div>
        <h1 className="text-xl font-bold">{problem.title}</h1>
        <span className="text-xs uppercase text-gray-400">{problem.topic} · {problem.difficulty}</span>
      </div>
      <p className="whitespace-pre-wrap text-sm">{problem.prompt}</p>
      {problem.hints && problem.hints.length > 0 && (
        <details className="text-sm">
          <summary className="cursor-pointer text-blue-500">Hints</summary>
          <ul className="list-disc pl-5 mt-2">{problem.hints.map((h, i) => <li key={i}>{h}</li>)}</ul>
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
    </div>
  );
}
