import type { Problem, TestCase } from "@/content/types";
import Link from "next/link";
import { getConceptForProblem } from "@/content/concepts";
import { Hints } from "./Hints";
import { DifficultyBadge } from "../ui/DifficultyBadge";

function sampleIO(problem: Problem, tc: TestCase): { input: string; output: string } {
  if (problem.kind === "function") {
    const args = (tc.input ?? []).map((v) => JSON.stringify(v)).join(", ");
    return { input: `${problem.functionName}(${args})`, output: JSON.stringify(tc.expected) };
  }
  if (problem.kind === "harness") {
    return { input: tc.description ?? tc.run ?? "", output: JSON.stringify(tc.expected) };
  }
  return { input: tc.description ?? "(see HTML View)", output: "assertion passes" };
}

export function PromptPanel({ problem, solved }: { problem: Problem; solved: boolean }) {
  const visible = problem.testCases.filter((t) => !t.hidden);
  const hiddenCount = problem.testCases.length - visible.length;
  const concept = getConceptForProblem(problem.id);

  return (
    <div className="p-5 overflow-auto space-y-4">
      <div>
        <h1 className="text-xl font-bold">{problem.title}</h1>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-gray-400">{problem.topic}</span>
          <DifficultyBadge difficulty={problem.difficulty} />
        </div>
        {problem.course && (
          <p className="text-xs text-gray-400 mt-1">
            Course · Section {problem.course.section}: {problem.course.sectionTitle} · Lecture {problem.course.lecture}: {problem.course.lectureName}
          </p>
        )}
      </div>

      <p className="whitespace-pre-wrap text-sm">{problem.prompt}</p>

      {problem.examples && problem.examples.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold text-sm">Examples</h3>
          {problem.examples.map((ex, i) => (
            <div key={i} className="rounded border text-xs font-mono p-3 space-y-1 bg-gray-500/5">
              <div><span className="text-gray-400">Input: </span>{ex.input}</div>
              <div><span className="text-gray-400">Output: </span>{ex.output}</div>
              {ex.explanation && <div className="font-sans text-gray-400">{ex.explanation}</div>}
            </div>
          ))}
        </div>
      )}

      {visible.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold text-sm">Sample tests</h3>
          <div className="rounded border divide-y text-xs font-mono">
            {visible.map((tc, i) => {
              const io = sampleIO(problem, tc);
              return (
                <div key={i} className="p-2 space-y-0.5">
                  <div><span className="text-gray-400">Input: </span>{io.input}</div>
                  <div><span className="text-gray-400">Output: </span>{io.output}</div>
                </div>
              );
            })}
          </div>
          {hiddenCount > 0 && (
            <p className="text-xs text-gray-400">+ {hiddenCount} hidden test{hiddenCount === 1 ? "" : "s"} run on Submit.</p>
          )}
        </div>
      )}

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

      {concept && (
        <Link href={`/learn/concepts/${concept.slug}`} className="inline-block text-sm text-blue-500 underline">
          Visualize this concept: {concept.title} →
        </Link>
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
