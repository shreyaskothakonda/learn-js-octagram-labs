import Link from "next/link";
import { getConceptNeighbors } from "@/content/concepts";

export function ConceptNav({ slug }: { slug: string }) {
  const { prev, next } = getConceptNeighbors(slug);
  if (!prev && !next) return null;

  return (
    <div className="flex justify-between gap-4 border-t pt-4">
      {prev ? (
        <Link
          href={`/concepts/${prev.slug}`}
          className="rounded-lg border p-3 text-sm hover:bg-accent transition-colors max-w-[48%]"
        >
          <div className="text-xs text-muted-foreground">Previous</div>
          <div className="font-medium mt-0.5">{prev.title}</div>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          href={`/concepts/${next.slug}`}
          className="rounded-lg border p-3 text-sm text-right hover:bg-accent transition-colors max-w-[48%] ml-auto"
        >
          <div className="text-xs text-muted-foreground">Next</div>
          <div className="font-medium mt-0.5">{next.title}</div>
        </Link>
      ) : (
        <span />
      )}
    </div>
  );
}
