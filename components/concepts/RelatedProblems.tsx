import Link from "next/link";
import { getProblem } from "@/content";

export function RelatedProblems({ ids }: { ids: string[] }) {
  const problems = ids.map(getProblem).filter((p): p is NonNullable<typeof p> => !!p);
  if (problems.length === 0) return null;
  return (
    <div>
      <h2 className="font-semibold mb-2">Practice this</h2>
      <div className="grid gap-2 sm:grid-cols-2">
        {problems.map((p) => (
          <Link key={p.id} href={`/problem/${p.id}`}
            className="rounded-lg border p-3 text-sm hover:bg-accent transition-colors">
            {p.title} <span className="text-xs text-muted-foreground">({p.difficulty})</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
