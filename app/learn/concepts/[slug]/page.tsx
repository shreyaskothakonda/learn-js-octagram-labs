import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllConcepts, getConcept } from "@/content/concepts";
import { ConceptStage } from "@/components/concepts/ConceptStage";
import { RelatedProblems } from "@/components/concepts/RelatedProblems";

export function generateStaticParams() {
  return getAllConcepts().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getConcept(slug);
  return { title: c ? `${c.title} — Octagram Labs` : "Concept" };
}

export default async function ConceptPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getConcept(slug);
  if (!c) notFound();
  return (
    <main className="mx-auto w-full max-w-3xl p-6 space-y-8">
      <div className="text-xs">
        <Link href="/learn/concepts" className="text-blue-500 hover:underline">← All concepts</Link>
      </div>
      <header>
        <div className="text-xs text-muted-foreground">{c.topic}</div>
        <h1 className="text-2xl font-bold mt-1">{c.title}</h1>
        <p className="text-muted-foreground mt-1">{c.oneLiner}</p>
      </header>

      <ConceptStage visual={c.visual} />

      <section className="space-y-2">
        <h2 className="font-semibold">Definition</h2>
        <p className="whitespace-pre-wrap leading-relaxed">{c.definition}</p>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold">Examples</h2>
        {c.examples.map((ex, i) => (
          <div key={i} className="space-y-1">
            <pre className="rounded-lg border bg-muted/40 p-3 overflow-x-auto text-sm"><code>{ex.code}</code></pre>
            <p className="text-sm text-muted-foreground">{ex.explanation}</p>
          </div>
        ))}
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold">Where you see this</h2>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          {c.realWorldUseCases.map((u, i) => <li key={i}>{u}</li>)}
        </ul>
      </section>

      <RelatedProblems ids={c.relatedProblemIds} />

      {c.furtherReading && c.furtherReading.length > 0 && (
        <section className="space-y-1 text-sm">
          <h2 className="font-semibold">Further reading</h2>
          <ul className="list-disc pl-5">
            {c.furtherReading.map((r) => (
              <li key={r.url}><a className="text-blue-500 underline" href={r.url} target="_blank" rel="noreferrer">{r.label}</a></li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
