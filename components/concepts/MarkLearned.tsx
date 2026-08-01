"use client";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLearnedConcepts, toggleLearned } from "@/lib/concept-progress";

export function MarkLearned({ slug }: { slug: string }) {
  const learned = useLearnedConcepts().has(slug);
  return (
    <Button
      size="sm"
      variant={learned ? "default" : "outline"}
      onClick={() => toggleLearned(slug)}
      aria-pressed={learned}
    >
      {learned ? (
        <>
          <Check className="size-3.5" />
          Learned
        </>
      ) : (
        "Mark as learned"
      )}
    </Button>
  );
}
