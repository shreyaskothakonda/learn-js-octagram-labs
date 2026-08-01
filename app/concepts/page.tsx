import { getConceptsByTrack } from "@/content/concepts";
import { TOPICS } from "@/content/manifest";
import { ConceptCard } from "@/components/concepts/ConceptCard";
import { ConceptsProgress } from "@/components/concepts/ConceptsProgress";

export const metadata = { title: "Concepts: Practice" };

export default function ConceptsIndex() {
  const concepts = getConceptsByTrack("javascript");
  const topics = TOPICS.javascript
    .map((t) => ({ label: t.label, items: concepts.filter((c) => c.topic === t.topic) }))
    .filter((g) => g.items.length > 0);
  return (
    <main className="mx-auto w-full max-w-5xl p-6 space-y-8">
      <header>
        <h1 className="text-2xl font-bold">JavaScript Concepts</h1>
        <p className="text-muted-foreground mt-1">Visual explanations of the ideas behind the problems.</p>
        <ConceptsProgress total={concepts.length} />
      </header>
      {topics.map((g) => (
        <section key={g.label} className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{g.label}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {g.items.map((c) => <ConceptCard key={c.slug} concept={c} />)}
          </div>
        </section>
      ))}
    </main>
  );
}
