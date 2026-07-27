import Link from "next/link";
import type { Concept } from "@/content/concepts/types";

export function ConceptCard({ concept }: { concept: Concept }) {
  return (
    <Link href={`/learn/concepts/${concept.slug}`}
      className="block rounded-lg border p-4 hover:bg-accent transition-colors">
      <div className="text-xs text-muted-foreground">{concept.topic}</div>
      <div className="font-semibold mt-1">{concept.title}</div>
      <p className="text-sm text-muted-foreground mt-1">{concept.oneLiner}</p>
    </Link>
  );
}
