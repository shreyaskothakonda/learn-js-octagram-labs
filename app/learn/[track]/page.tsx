import { notFound } from "next/navigation";
import { ProblemList } from "@/components/ProblemList";
import type { Track } from "@/content/types";

const VALID: Track[] = ["javascript", "data-structures"];

export default async function TrackPage({ params }: { params: Promise<{ track: string }> }) {
  const { track } = await params;
  if (!VALID.includes(track as Track)) notFound();
  const title = track === "javascript" ? "JavaScript" : "Data Structures in JS";
  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-3xl font-bold mb-6">{title}</h1>
      <ProblemList track={track as Track} />
    </main>
  );
}
