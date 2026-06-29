import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient, getOptionalUser } from "@/lib/supabase/server";
import { getProblem, getProblemsByTrack } from "@/content";
import type { Track, Difficulty } from "@/content/types";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Card, CardContent } from "@/components/ui/card";

const TRACKS: { track: Track; label: string }[] = [
  { track: "javascript", label: "JavaScript" },
  { track: "data-structures", label: "Data Structures" },
  { track: "react", label: "React" },
];

function currentStreak(days: string[]): number {
  const set = new Set(days);
  if (set.size === 0) return 0;
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  const cursor = new Date();
  if (!set.has(iso(cursor))) cursor.setUTCDate(cursor.getUTCDate() - 1);
  let streak = 0;
  while (set.has(iso(cursor))) { streak++; cursor.setUTCDate(cursor.getUTCDate() - 1); }
  return streak;
}

export default async function Dashboard() {
  const user = await getOptionalUser();
  if (!user) redirect("/login");
  const supabase = await createClient();

  const { data: progress } = await supabase.from("progress").select("problem_id,status");
  const { data: attempts } = await supabase
    .from("attempts").select("id,problem_id,passed,created_at")
    .order("created_at", { ascending: false }).limit(100);

  const solvedIds = new Set((progress ?? []).filter((p) => p.status === "solved").map((p) => p.problem_id));
  const solved = solvedIds.size;
  const attempted = (progress ?? []).length;

  const byDiff: Record<Difficulty, number> = { easy: 0, medium: 0, hard: 0 };
  for (const id of solvedIds) { const p = getProblem(id); if (p) byDiff[p.difficulty]++; }

  const streak = currentStreak((attempts ?? []).map((a) => a.created_at.slice(0, 10)));
  const recent = (attempts ?? []).slice(0, 15);

  return (
    <main className="mx-auto max-w-5xl p-8 space-y-8">
      <h1 className="text-2xl font-bold">Your progress</h1>

      <div className="grid grid-cols-3 gap-4">
        <Stat label="Solved" value={solved} />
        <Stat label="Attempted" value={attempted} />
        <Stat label="Day streak" value={streak} />
      </div>

      <section>
        <h2 className="font-semibold mb-3">By track</h2>
        <div className="space-y-4">
          {TRACKS.map((t) => {
            const all = getProblemsByTrack(t.track);
            const s = all.filter((p) => solvedIds.has(p.id)).length;
            return (
              <div key={t.track}>
                <div className="flex justify-between text-sm mb-1">
                  <Link href={`/learn/${t.track}`} className="hover:text-blue-500">{t.label}</Link>
                  <span className="text-muted-foreground">{s} / {all.length}</span>
                </div>
                <ProgressBar value={s} total={all.length} />
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="font-semibold mb-3">Solved by difficulty</h2>
        <div className="grid grid-cols-3 gap-4">
          <Stat label="Easy" value={byDiff.easy} />
          <Stat label="Medium" value={byDiff.medium} />
          <Stat label="Hard" value={byDiff.hard} />
        </div>
      </section>

      <section>
        <h2 className="font-semibold mb-3">Recent attempts</h2>
        {recent.length === 0 ? (
          <p className="text-sm text-muted-foreground">No attempts yet. Solve a problem to see it here.</p>
        ) : (
          <ul className="divide-y border rounded-lg">
            {recent.map((a) => {
              const p = getProblem(a.problem_id);
              return (
                <li key={a.id} className="flex justify-between items-center px-4 py-2 text-sm">
                  <Link href={`/problem/${a.problem_id}`} className="hover:text-blue-500 truncate">
                    {p ? p.title : a.problem_id}
                  </Link>
                  <span className={a.passed ? "text-green-500 shrink-0" : "text-red-500 shrink-0"}>{a.passed ? "Passed" : "Failed"}</span>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardContent className="p-4 text-center">
        <div className="text-3xl font-bold">{value}</div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </CardContent>
    </Card>
  );
}
