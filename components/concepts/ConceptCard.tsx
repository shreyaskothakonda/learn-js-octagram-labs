"use client";
import Link from "next/link";
import { Check } from "lucide-react";
import type { Concept } from "@/content/concepts/types";
import { useLearnedConcepts } from "@/lib/concept-progress";

export function ConceptCard({ concept }: { concept: Concept }) {
  const learned = useLearnedConcepts().has(concept.slug);
  return (
    <Link href={`/concepts/${concept.slug}`}
      className="relative block rounded-lg border p-4 hover:bg-accent transition-colors">
      {learned && (
        <span
          className="absolute right-2 top-2 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground"
          aria-label="Learned"
          title="Learned"
        >
          <Check className="size-3" />
        </span>
      )}
      <div className="text-xs text-muted-foreground">{concept.topic}</div>
      <div className="font-semibold mt-1">{concept.title}</div>
      <p className="text-sm text-muted-foreground mt-1">{concept.oneLiner}</p>
    </Link>
  );
}
