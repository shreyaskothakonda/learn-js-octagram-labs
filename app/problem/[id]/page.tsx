import { notFound } from "next/navigation";
import { getProblem } from "@/content";
import { Playground } from "@/components/playground/Playground";

export default async function ProblemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const problem = getProblem(id);
  if (!problem) notFound();
  return <Playground problem={problem} />;
}
