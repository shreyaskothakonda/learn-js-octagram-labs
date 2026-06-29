import type { Difficulty } from "@/content/types";

const styles: Record<Difficulty, string> = {
  easy: "bg-green-500/15 text-green-600 dark:text-green-400",
  medium: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  hard: "bg-red-500/15 text-red-600 dark:text-red-400",
};

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return (
    <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${styles[difficulty]}`}>
      {difficulty}
    </span>
  );
}
