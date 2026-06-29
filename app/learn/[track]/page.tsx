import { notFound } from "next/navigation";
import { getProblemsByTrack } from "@/content";
import { TOPICS } from "@/content/manifest";
import { createClient, getOptionalUser } from "@/lib/supabase/server";
import { TrackBrowser } from "@/components/TrackBrowser";
import type { Track } from "@/content/types";

const VALID: Track[] = ["javascript", "data-structures", "react"];
const titles: Record<string, string> = {
  javascript: "JavaScript",
  "data-structures": "Data Structures in JS",
  react: "JavaScript for React",
};

export default async function TrackPage({ params }: { params: Promise<{ track: string }> }) {
  const { track } = await params;
  if (!VALID.includes(track as Track)) notFound();

  const problems = getProblemsByTrack(track as Track).map((p) => ({
    id: p.id, title: p.title, topic: p.topic, difficulty: p.difficulty,
  }));

  const progress: Record<string, "solved" | "attempted"> = {};
  const user = await getOptionalUser();
  if (user) {
    const supabase = await createClient();
    const { data } = await supabase.from("progress").select("problem_id,status");
    (data ?? []).forEach((r: { problem_id: string; status: string }) => {
      progress[r.problem_id] = r.status as "solved" | "attempted";
    });
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-3xl font-bold mb-6">{titles[track]}</h1>
      <TrackBrowser topics={TOPICS[track as Track]} problems={problems} progress={progress} />
    </main>
  );
}
