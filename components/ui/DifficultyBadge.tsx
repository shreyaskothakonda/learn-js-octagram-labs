import type { Difficulty } from "@/content/types";
import { Badge } from "./badge";

const styles: Record<Difficulty, string> = {
  easy: "border-transparent bg-green-500/15 text-green-600 dark:text-green-400",
  medium: "border-transparent bg-amber-500/15 text-amber-600 dark:text-amber-400",
  hard: "border-transparent bg-red-500/15 text-red-600 dark:text-red-400",
};

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return (
    <Badge variant="outline" className={`uppercase text-[10px] tracking-wide ${styles[difficulty]}`}>
      {difficulty}
    </Badge>
  );
}
