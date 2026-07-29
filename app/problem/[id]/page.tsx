import { notFound } from "next/navigation";
import { getProblem, getProblemsByTrack } from "@/content";
import { Playground } from "@/components/playground/Playground";

export default async function ProblemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const problem = getProblem(id);
  if (!problem) notFound();

  const siblings = getProblemsByTrack(problem.track);
  const idx = siblings.findIndex((p) => p.id === id);
  const nextId = idx >= 0 && idx < siblings.length - 1 ? siblings[idx + 1].id : null;

  return <Playground problem={problem} nextId={nextId} backHref={`/${problem.track}`} />;
}
