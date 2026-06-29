"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import type { Difficulty } from "@/content/types";
import { DifficultyBadge } from "./ui/DifficultyBadge";
import { StatusIcon, type Status } from "./ui/StatusIcon";
import { ProgressBar } from "./ui/ProgressBar";
import { Input } from "./ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";

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
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{solvedTotal} of {problems.length} solved</span>
          <span>{Math.round((solvedTotal / Math.max(problems.length, 1)) * 100)}%</span>
        </div>
        <ProgressBar value={solvedTotal} total={problems.length} />
      </div>

      <div className="flex flex-wrap gap-2">
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search problems…" className="flex-1 min-w-[180px]" />
        <Select value={diff} onValueChange={(v) => setDiff(v as "all" | Difficulty)}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All difficulties</SelectItem>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={(v) => setStatus(v as "all" | "solved" | "unsolved")}>
          <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="unsolved">Unsolved</SelectItem>
            <SelectItem value="solved">Solved</SelectItem>
          </SelectContent>
        </Select>
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
              <span className="text-xs text-muted-foreground">{solved}/{all.length}</span>
            </div>
            <ul className="divide-y rounded-lg border">
              {items.map((p) => (
                <li key={p.id}>
                  <Link href={`/problem/${p.id}`} className="flex items-center gap-3 px-4 py-2.5 hover:bg-accent">
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
        <p className="text-sm text-muted-foreground text-center py-8">No problems match your filters.</p>
      )}
    </div>
  );
}
