import { getAllConcepts, TRACK_ORDER } from "@/content/concepts";
import { TOPICS } from "@/content/manifest";
import { ConceptCard } from "@/components/concepts/ConceptCard";
import { ConceptsProgress } from "@/components/concepts/ConceptsProgress";

export const metadata = { title: "Concepts: Practice" };

const TRACK_LABELS: Record<string, string> = {
  javascript: "JavaScript",
  "data-structures": "Data Structures",
  react: "React",
};

export default function ConceptsIndex() {
  const all = getAllConcepts();
  const sections = TRACK_ORDER.map((track) => ({
    track,
    label: TRACK_LABELS[track] ?? track,
    topics: TOPICS[track]
      .map((t) => ({
        label: t.label,
        items: all.filter((c) => c.track === track && c.topic === t.topic),
      }))
      .filter((g) => g.items.length > 0),
  })).filter((s) => s.topics.length > 0);

  return (
    <main className="mx-auto w-full max-w-5xl p-6 space-y-10">
      <header>
        <h1 className="text-2xl font-bold">Concepts</h1>
        <p className="text-muted-foreground mt-1">Visual explanations of the ideas behind the problems.</p>
        <ConceptsProgress total={all.length} />
      </header>

      {sections.map((section) => (
        <section key={section.track} className="space-y-6">
          <h2 className="text-lg font-semibold border-b pb-2">{section.label}</h2>
          {section.topics.map((g) => (
            <div key={g.label} className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{g.label}</h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {g.items.map((c) => (
                  <ConceptCard key={c.slug} concept={c} />
                ))}
              </div>
            </div>
          ))}
        </section>
      ))}
    </main>
  );
}
