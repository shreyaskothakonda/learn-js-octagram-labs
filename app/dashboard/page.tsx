import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAllProblems } from "@/content";

export default async function Dashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: progress } = await supabase.from("progress").select("problem_id,status");
  const { data: attempts } = await supabase
    .from("attempts").select("problem_id,passed,created_at")
    .order("created_at", { ascending: false }).limit(20);

  const solved = (progress ?? []).filter((p) => p.status === "solved").length;
  const attempted = (progress ?? []).length;
  const total = getAllProblems().length;

  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-2xl font-bold mb-4">Your progress</h1>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Stat label="Solved" value={solved} />
        <Stat label="Attempted" value={attempted} />
        <Stat label="Total problems" value={total} />
      </div>
      <h2 className="font-semibold mb-2">Recent attempts</h2>
      <ul className="divide-y border rounded-lg">
        {(attempts ?? []).map((a, i) => (
          <li key={i} className="flex justify-between px-4 py-2 text-sm">
            <span>{a.problem_id}</span>
            <span className={a.passed ? "text-green-500" : "text-red-500"}>{a.passed ? "Passed" : "Failed"}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border p-4 text-center">
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-xs text-gray-400">{label}</div>
    </div>
  );
}
