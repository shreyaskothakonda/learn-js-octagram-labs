"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import type { Difficulty } from "@/content/types";
import { DifficultyBadge } from "./ui/DifficultyBadge";
import { StatusIcon, type Status } from "./ui/StatusIcon";
import { ProgressBar } from "./ui/ProgressBar";

type Slim = { id: string; title: string; topic: string; difficulty: Difficulty };
type TopicDef = { topic: string; label: string };

export function TrackBrowser({
  topics, problems, progress,
}: { topics: TopicDef[]; problems: Slim[]; progress: Record<string, "solved" | "attempted"> }) {
  const [query, setQuery] = useState("");
  const [diff, setDiff] = useState<"all" | Difficulty>("all");
  const [status, setStatus] = useState<"all" | "solved" | "unsolved">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return problems.filter((p) => {
      if (q && !p.title.toLowerCase().includes(q)) return false;
      if (diff !== "all" && p.difficulty !== diff) return false;
      const solved = progress[p.id] === "solved";
      if (status === "solved" && !solved) return false;
      if (status === "unsolved" && solved) return false;
      return true;
    });
  }, [problems, query, diff, status, progress]);

  const solvedTotal = problems.filter((p) => progress[p.id] === "solved").length;

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <div className="flex justify-between text-sm text-gray-500">
          <span>{solvedTotal} of {problems.length} solved</span>
          <span>{Math.round((solvedTotal / Math.max(problems.length, 1)) * 100)}%</span>
        </div>
        <ProgressBar value={solvedTotal} total={problems.length} />
      </div>

      <div className="flex flex-wrap gap-2">
        <input
          value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search problems…"
          className="flex-1 min-w-[180px] rounded border px-3 py-1.5 text-sm bg-transparent"
        />
        <select value={diff} onChange={(e) => setDiff(e.target.value as typeof diff)} className="rounded border px-2 py-1.5 text-sm bg-transparent">
          <option value="all">All difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className="rounded border px-2 py-1.5 text-sm bg-transparent">
          <option value="all">All</option>
          <option value="unsolved">Unsolved</option>
          <option value="solved">Solved</option>
        </select>
      </div>

      {topics.map((t) => {
        const items = filtered.filter((p) => p.topic === t.topic);
        if (items.length === 0) return null;
        const all = problems.filter((p) => p.topic === t.topic);
        const solved = all.filter((p) => progress[p.id] === "solved").length;
        return (
          <section key={t.topic}>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-semibold">{t.label}</h2>
              <span className="text-xs text-gray-400">{solved}/{all.length}</span>
            </div>
            <ul className="divide-y rounded-lg border">
              {items.map((p) => (
                <li key={p.id}>
                  <Link href={`/problem/${p.id}`} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-500/5">
                    <StatusIcon status={progress[p.id] as Status} />
                    <span className="flex-1 text-sm">{p.title}</span>
                    <DifficultyBadge difficulty={p.difficulty} />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      {filtered.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-8">No problems match your filters.</p>
      )}
    </div>
  );
}
