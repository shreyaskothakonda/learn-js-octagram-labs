import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllConcepts, getConcept } from "@/content/concepts";
import { highlightJs } from "@/lib/highlight";
import { ConceptStage } from "@/components/concepts/ConceptStage";
import { RunnableExample } from "@/components/concepts/RunnableExample";
import { ConceptCheck } from "@/components/concepts/ConceptCheck";
import { Pitfalls } from "@/components/concepts/Pitfalls";
import { MarkLearned } from "@/components/concepts/MarkLearned";
import { RelatedProblems } from "@/components/concepts/RelatedProblems";
import { RelatedConcepts } from "@/components/concepts/RelatedConcepts";
import { ConceptNav } from "@/components/concepts/ConceptNav";

export function generateStaticParams() {
  return getAllConcepts().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getConcept(slug);
  return { title: c ? `${c.title}: Practice` : "Concept" };
}

export default async function ConceptPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getConcept(slug);
  if (!c) notFound();

  const examples = await Promise.all(
    c.examples.map(async (ex) => ({ ...ex, highlighted: await highlightJs(ex.code) })),
  );

  const hasPitfalls = (c.pitfalls?.length ?? 0) > 0;
  const hasTakeaways = (c.keyTakeaways?.length ?? 0) > 0;
  const hasCheck = !!c.check;

  const onThisPage = [
    { id: "definition", label: "Definition" },
    { id: "examples", label: "Examples" },
    ...(hasPitfalls ? [{ id: "pitfalls", label: "Common mistakes" }] : []),
    ...(hasTakeaways ? [{ id: "takeaways", label: "Key takeaways" }] : []),
    ...(hasCheck ? [{ id: "check", label: "Check" }] : []),
    { id: "usecases", label: "Where you see this" },
    { id: "practice", label: "Practice" },
    { id: "related", label: "Related concepts" },
  ];

  return (
    <main className="mx-auto w-full max-w-6xl p-6 space-y-6">
      <div className="text-xs">
        <Link href="/concepts" className="text-blue-500 hover:underline">← All concepts</Link>
      </div>

      <header>
        <div className="text-xs text-muted-foreground">{c.topic}</div>
        <h1 className="text-2xl font-bold mt-1">{c.title}</h1>
        <div className="flex flex-wrap items-start justify-between gap-3 mt-1">
          <p className="text-muted-foreground max-w-2xl">{c.oneLiner}</p>
          <MarkLearned slug={c.slug} />
        </div>
      </header>

      <div className="lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-8">
        <div className="lg:sticky lg:top-6 self-start space-y-4">
          <ConceptStage visual={c.visual} />
          <nav className="hidden lg:block rounded-lg border p-3 text-sm" aria-label="On this page">
            <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">On this page</div>
            <ul className="space-y-1">
              {onThisPage.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-muted-foreground hover:text-foreground transition-colors">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="space-y-8 mt-8 lg:mt-0">
          <section id="definition" className="space-y-2 scroll-mt-6">
            <h2 className="font-semibold">Definition</h2>
            <p className="whitespace-pre-wrap leading-relaxed">{c.definition}</p>
          </section>

          <section id="examples" className="space-y-4 scroll-mt-6">
            <h2 className="font-semibold">Examples</h2>
            {examples.map((ex, i) => (
              <RunnableExample key={i} code={ex.code} highlighted={ex.highlighted} explanation={ex.explanation} />
            ))}
          </section>

          {hasPitfalls && (
            <section id="pitfalls" className="space-y-2 scroll-mt-6">
              <Pitfalls items={c.pitfalls ?? []} />
            </section>
          )}

          {hasTakeaways && (
            <section id="takeaways" className="space-y-2 scroll-mt-6">
              <h2 className="font-semibold">Key takeaways</h2>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                {c.keyTakeaways?.map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            </section>
          )}

          {hasCheck && c.check && (
            <section id="check" className="space-y-2 scroll-mt-6">
              <ConceptCheck check={c.check} />
            </section>
          )}

          <section id="usecases" className="space-y-2 scroll-mt-6">
            <h2 className="font-semibold">Where you see this</h2>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              {c.realWorldUseCases.map((u, i) => <li key={i}>{u}</li>)}
            </ul>
          </section>

          <section id="practice" className="scroll-mt-6">
            <RelatedProblems ids={c.relatedProblemIds} />
          </section>

          <section id="related" className="scroll-mt-6">
            <RelatedConcepts slug={c.slug} />
          </section>

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
        </div>
      </div>

      <ConceptNav slug={c.slug} />
    </main>
  );
}
