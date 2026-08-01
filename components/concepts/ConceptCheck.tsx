"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { ConceptCheck as ConceptCheckType } from "@/content/concepts/types";

export function ConceptCheck({ check }: { check: ConceptCheckType }) {
  const [picked, setPicked] = useState<number | null>(null);

  function handlePick(index: number) {
    if (picked === null) {
      setPicked(index);
    }
  }

  function handleReset() {
    setPicked(null);
  }

  const isCorrect = picked !== null && picked === check.answerIndex;

  return (
    <div className="rounded-lg border p-4 space-y-3">
      <div>
        <div className="text-xs uppercase tracking-wide text-muted-foreground">
          Check your understanding
        </div>
        <p className="text-sm font-medium mt-1">{check.question}</p>
      </div>

      <div className="flex flex-col gap-2">
        {check.options.map((option, i) => {
          let extraClass = "";
          if (picked !== null) {
            if (i === check.answerIndex) {
              extraClass = "border-green-500 text-green-600 bg-green-500/10";
            } else if (i === picked) {
              extraClass =
                "border-[var(--color-destructive)] text-[var(--color-destructive)] bg-[var(--color-destructive)]/10";
            } else {
              extraClass = "text-muted-foreground";
            }
          }

          return (
            <Button
              key={i}
              type="button"
              variant="outline"
              className={`w-full justify-start text-left ${extraClass}`}
              disabled={picked !== null}
              onClick={() => handlePick(i)}
            >
              {option}
            </Button>
          );
        })}
      </div>

      {picked !== null && (
        <div className="space-y-2">
          <p className={`text-sm font-semibold ${isCorrect ? "text-green-600" : "text-[var(--color-destructive)]"}`}>
            {isCorrect ? "Correct" : "Not quite"}
          </p>
          {check.explanation && (
            <p className="text-sm text-muted-foreground">{check.explanation}</p>
          )}
          <Button size="sm" variant="ghost" onClick={handleReset}>
            Try again
          </Button>
        </div>
      )}
    </div>
  );
}
