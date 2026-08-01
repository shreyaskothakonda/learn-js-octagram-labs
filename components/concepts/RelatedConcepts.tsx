import Link from "next/link";
import { getConcept, getConceptsByTopic } from "@/content/concepts";

export function RelatedConcepts({ slug }: { slug: string }) {
  const c = getConcept(slug);
  if (!c) return null;

  let related = (c.related ?? [])
    .map((s) => getConcept(s))
    .filter((r): r is NonNullable<typeof r> => !!r && r.slug !== slug);

  if (related.length === 0) {
    related = getConceptsByTopic(c.track, c.topic)
      .filter((r) => r.slug !== slug)
      .slice(0, 3);
  }

  if (related.length === 0) return null;

  return (
    <div>
      <h2 className="font-semibold mb-2">Related concepts</h2>
      <div className="grid gap-2 sm:grid-cols-2">
        {related.map((r) => (
          <Link
            key={r.slug}
            href={`/concepts/${r.slug}`}
            className="rounded-lg border p-3 text-sm hover:bg-accent transition-colors"
          >
            <div className="font-medium">{r.title}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{r.oneLiner}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
