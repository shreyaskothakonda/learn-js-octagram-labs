import { notFound } from "next/navigation";
import { ProblemList } from "@/components/ProblemList";
import type { Track } from "@/content/types";

const VALID: Track[] = ["javascript", "data-structures", "react"];

export default async function TrackPage({ params }: { params: Promise<{ track: string }> }) {
  const { track } = await params;
  if (!VALID.includes(track as Track)) notFound();
  const titles: Record<string, string> = {
    javascript: "JavaScript",
    "data-structures": "Data Structures in JS",
    react: "JavaScript for React",
  };
  const title = titles[track];
  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-3xl font-bold mb-6">{title}</h1>
      <ProblemList track={track as Track} />
    </main>
  );
}
