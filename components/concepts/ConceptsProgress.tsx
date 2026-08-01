"use client";
import { useLearnedConcepts } from "@/lib/concept-progress";

export function ConceptsProgress({ total }: { total: number }) {
  const learned = useLearnedConcepts();
  const count = Math.min(learned.size, total);
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="mt-3 max-w-xs space-y-1.5">
      <p className="text-sm text-muted-foreground">
        {count} of {total} learned
      </p>
      <div className="h-1.5 rounded bg-muted">
        <div
          className="h-1.5 rounded bg-primary transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
