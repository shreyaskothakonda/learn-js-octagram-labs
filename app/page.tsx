import Link from "next/link";
import { getProblemsByTrack } from "@/content";
import { createClient, getOptionalUser } from "@/lib/supabase/server";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { Track } from "@/content/types";

const TRACKS: { href: string; track: Track; title: string; desc: string }[] = [
  { href: "/learn/javascript", track: "javascript", title: "JavaScript", desc: "Core language: fundamentals, functions, arrays, OOP, async, and the DOM." },
  { href: "/learn/data-structures", track: "data-structures", title: "Data Structures in JS", desc: "Stacks, queues, linked lists, trees, graphs, heaps, and algorithms." },
  { href: "/learn/react", track: "react", title: "JavaScript for React", desc: "Immutable updates, reducers, selectors, hooks logic, and rendering." },
];

export default async function Home() {
  const solvedIds = new Set<string>();
  const user = await getOptionalUser();
  if (user) {
    const supabase = await createClient();
    const { data } = await supabase.from("progress").select("problem_id,status");
    (data ?? []).forEach((r: { problem_id: string; status: string }) => { if (r.status === "solved") solvedIds.add(r.problem_id); });
  }

  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="text-4xl font-bold mb-2">Octagram Labs: Learn JavaScript</h1>
      <p className="text-gray-500 mb-8">Practice in the browser. Run code, pass tests, track progress.</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TRACKS.map((c) => {
          const all = getProblemsByTrack(c.track);
          const solved = all.filter((p) => solvedIds.has(p.id)).length;
          return (
            <Link key={c.href} href={c.href} className="flex flex-col rounded-xl border p-6 hover:border-blue-500 transition">
              <h2 className="text-xl font-semibold">{c.title}</h2>
              <p className="text-sm text-gray-500 mt-1 flex-1">{c.desc}</p>
              <div className="mt-4 space-y-1">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>{solved} / {all.length} solved</span>
                </div>
                <ProgressBar value={solved} total={all.length} />
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
