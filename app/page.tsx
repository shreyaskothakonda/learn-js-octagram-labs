import Link from "next/link";
import { getProblemsByTrack } from "@/content";
import { createClient, getOptionalUser } from "@/lib/supabase/server";
import { ProgressBar } from "@/components/ui/ProgressBar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import type { Track } from "@/content/types";

const TRACKS: { href: string; track: Track; title: string; desc: string }[] = [
  {
    href: "/learn/javascript",
    track: "javascript",
    title: "JavaScript",
    desc: "Core language: fundamentals, functions, arrays, OOP, async, and the DOM.",
  },
  {
    href: "/learn/data-structures",
    track: "data-structures",
    title: "Data Structures in JS",
    desc: "Stacks, queues, linked lists, trees, graphs, heaps, and algorithms.",
  },
  {
    href: "/learn/react",
    track: "react",
    title: "JavaScript for React",
    desc: "Immutable updates, reducers, selectors, hooks logic, and rendering.",
  },
];

export default async function Home() {
  const solvedIds = new Set<string>();
  const user = await getOptionalUser();
  if (user) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("progress")
      .select("problem_id,status");
    (data ?? []).forEach((r: { problem_id: string; status: string }) => {
      if (r.status === "solved") solvedIds.add(r.problem_id);
    });
  }

  return (
    <main className="mx-auto max-w-5xl p-8">
      <h1 className="text-4xl font-bold mb-2">
        Octagram Labs: Learn JavaScript
      </h1>
      <p className="text-muted-foreground mb-8">
        Practice in the browser. Run code, pass tests, track progress.
      </p>
      <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-1">
        {TRACKS.map((c) => {
          const all = getProblemsByTrack(c.track);
          const solved = all.filter((p) => solvedIds.has(p.id)).length;
          return (
            <Link key={c.href} href={c.href} className="group">
              <Card className="h-full transition group-hover:border-primary">
                <CardHeader>
                  <CardTitle>{c.title}</CardTitle>
                  <CardDescription>{c.desc}</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto space-y-1">
                  <div className="text-xs text-muted-foreground">
                    {solved} / {all.length} solved
                  </div>
                  <ProgressBar value={solved} total={all.length} />
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
