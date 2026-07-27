# Concept Learning Pages (GSAP) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a JavaScript-track concept learning layer — ~28 fine-grained concept pages, each with real definitions, worked examples, real-world use cases, links to practice problems, and a bespoke GSAP animation.

**Architecture:** Content-as-data (a typed `content/concepts/` registry mirroring `content/problems`) plus animation-as-code (one bespoke `components/concepts/visuals/<slug>.tsx` per concept, driven by a shared `<ConceptStage>` client harness). Server-rendered routes generate the index and detail pages from the registry; a Vitest validator guards the data.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, shadcn/ui (Base UI), GSAP + `@gsap/react`, Vitest.

## Global Constraints

- Next.js `16.2.9`, React `19.2.4` — client animation components must be `"use client"`; never animate during render.
- Animation libraries: **only** `gsap` and `@gsap/react`. DOM + SVG scenes. No other animation/diagram libraries.
- Colors come from existing CSS token variables (`--color-*`) or Tailwind token classes — **no hard-coded hex** in visuals.
- Every visual must honor `prefers-reduced-motion`: render a static, labeled end-state instead of animating.
- All prose is plain, accurate (checked against MDN), and free of em dashes and corporate jargon (existing project rule).
- Content is validated in the existing Vitest suite; `npm run test` and `npm run build` must stay green.
- Reuse existing shadcn components (`Button`, `Card`) and the `.dark` theme system. Follow the compact style of `content/problems/*.ts`.

---

## File Structure

```
content/concepts/
  types.ts               # Concept, ConceptExample, ConceptTrack types
  javascript.ts          # javascriptConcepts: Concept[]
  index.ts               # aggregation + lookup helpers
  validate.ts            # validateConcept(concept, problemIds, visualKeys)
content/concepts.validate.test.ts
components/concepts/
  ConceptStage.tsx       # shared client harness: controls, reduced-motion, theming
  visuals/
    index.ts             # visual key -> lazy component map
    closures.tsx         # exemplar; then one per concept
    ...
  ConceptCard.tsx        # index card (server)
  RelatedProblems.tsx    # "Practice this" block (server)
app/learn/concepts/
  page.tsx               # library index
  [slug]/page.tsx        # concept detail
```

Modify: `components/Nav.tsx`, `components/MobileNav.tsx`, `components/playground/PromptPanel.tsx`, `package.json`.

---

### Task 1: Dependencies + content model + validator

**Files:**
- Modify: `package.json` (add deps)
- Create: `content/concepts/types.ts`
- Create: `content/concepts/validate.ts`
- Test: `content/concepts.validate.test.ts`

**Interfaces:**
- Produces: `Concept`, `ConceptExample`, `ConceptTrack` types; `validateConcept(concept: Concept, knownProblemIds: Set<string>, knownVisualKeys: Set<string>): string[]`.

- [ ] **Step 1: Install GSAP**

Run: `npm install gsap @gsap/react`
Expected: both added to `package.json` dependencies, install succeeds.

- [ ] **Step 2: Create the content types**

Create `content/concepts/types.ts`:

```ts
import type { CourseRef, Resource } from "../types";

export type ConceptTrack = "javascript" | "data-structures" | "react";

export type ConceptExample = {
  code: string;
  explanation: string;
};

export type Concept = {
  slug: string;
  track: ConceptTrack;
  topic: string;
  title: string;
  oneLiner: string;
  definition: string;
  examples: ConceptExample[];
  realWorldUseCases: string[];
  relatedProblemIds: string[];
  visual: string;
  furtherReading?: Resource[];
  course?: CourseRef;
};
```

(Confirm `Resource` and `CourseRef` are exported from `content/types.ts` — they are.)

- [ ] **Step 3: Write the failing validator test**

Create `content/concepts.validate.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { validateConcept } from "./concepts/validate";
import type { Concept } from "./concepts/types";

const base: Concept = {
  slug: "closures",
  track: "javascript",
  topic: "A Closer Look at Functions",
  title: "Closures",
  oneLiner: "A function remembers the variables it was created with.",
  definition: "A closure is a function bundled with references to its surrounding state.",
  examples: [{ code: "function outer(){}", explanation: "x" }],
  realWorldUseCases: ["Private state in modules"],
  relatedProblemIds: ["js-closures-001"],
  visual: "closures",
};
const problemIds = new Set(["js-closures-001"]);
const visualKeys = new Set(["closures"]);

describe("validateConcept", () => {
  it("accepts a valid concept", () => {
    expect(validateConcept(base, problemIds, visualKeys)).toEqual([]);
  });
  it("rejects a non-kebab slug", () => {
    expect(validateConcept({ ...base, slug: "Closures" }, problemIds, visualKeys))
      .toContain("slug must be kebab-case: Closures");
  });
  it("rejects an empty definition", () => {
    expect(validateConcept({ ...base, definition: "" }, problemIds, visualKeys))
      .toContain("concept closures missing definition");
  });
  it("rejects an unknown related problem id", () => {
    expect(validateConcept({ ...base, relatedProblemIds: ["nope"] }, problemIds, visualKeys))
      .toContain("concept closures references unknown problem: nope");
  });
  it("rejects an unregistered visual", () => {
    expect(validateConcept({ ...base, visual: "ghost" }, problemIds, visualKeys))
      .toContain("concept closures references unknown visual: ghost");
  });
});
```

- [ ] **Step 4: Run it, expect failure**

Run: `npx vitest run content/concepts.validate.test.ts`
Expected: FAIL (`validateConcept` not found).

- [ ] **Step 5: Implement the validator**

Create `content/concepts/validate.ts`:

```ts
import type { Concept } from "./types";

const KEBAB = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function validateConcept(
  c: Concept,
  knownProblemIds: Set<string>,
  knownVisualKeys: Set<string>,
): string[] {
  const errors: string[] = [];
  if (!KEBAB.test(c.slug)) errors.push(`slug must be kebab-case: ${c.slug}`);
  if (!c.title) errors.push(`concept ${c.slug} missing title`);
  if (!c.oneLiner) errors.push(`concept ${c.slug} missing oneLiner`);
  if (!c.definition) errors.push(`concept ${c.slug} missing definition`);
  if (!c.examples || c.examples.length === 0) errors.push(`concept ${c.slug} has no examples`);
  if (!c.realWorldUseCases || c.realWorldUseCases.length === 0) errors.push(`concept ${c.slug} has no use cases`);
  for (const id of c.relatedProblemIds) {
    if (!knownProblemIds.has(id)) errors.push(`concept ${c.slug} references unknown problem: ${id}`);
  }
  if (!knownVisualKeys.has(c.visual)) errors.push(`concept ${c.slug} references unknown visual: ${c.visual}`);
  return errors;
}
```

- [ ] **Step 6: Run it, expect pass**

Run: `npx vitest run content/concepts.validate.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json content/concepts/types.ts content/concepts/validate.ts content/concepts.validate.test.ts
git commit -m "feat(concepts): add GSAP deps, concept content model, and validator"
```

---

### Task 2: Concept registry + lookup helpers

**Files:**
- Create: `content/concepts/javascript.ts` (starts with the exemplar only)
- Create: `content/concepts/index.ts`
- Test: extend `content/concepts.validate.test.ts` with a registry-integrity test

**Interfaces:**
- Consumes: `Concept` type; `getAllProblems`/`getProblem` from `@/content`.
- Produces: `getAllConcepts()`, `getConcept(slug)`, `getConceptsByTrack(track)`, `getConceptsByTopic(track, topic)`, `getConceptForProblem(problemId)`; `javascriptConcepts: Concept[]`.

- [ ] **Step 1: Seed the JS registry with a single valid entry**

Create `content/concepts/javascript.ts`:

```ts
import type { Concept } from "./types";

export const javascriptConcepts: Concept[] = [
  {
    slug: "closures",
    track: "javascript",
    topic: "A Closer Look at Functions",
    title: "Closures",
    oneLiner: "A function keeps access to the variables it was born in, even after that scope returns.",
    definition:
      "A closure is a function together with references to the variables from the scope where it was created. When a function is returned from or passed out of its parent, it carries that surrounding state with it, so it can still read and update those variables long after the parent has finished running.",
    examples: [
      {
        code: "function makeCounter() {\n  let count = 0;\n  return () => ++count;\n}\nconst next = makeCounter();\nnext(); // 1\nnext(); // 2",
        explanation: "The returned arrow function keeps a live reference to count, so each call updates the same private variable.",
      },
    ],
    realWorldUseCases: [
      "Private state in a module or hook (a value only the returned functions can touch).",
      "Event handlers and callbacks that remember the data they were set up with.",
      "Function factories like debounce, throttle, once, and memoize.",
    ],
    relatedProblemIds: ["js-closures-007"],
    visual: "closures",
    furtherReading: [
      { label: "MDN: Closures", url: "https://developer.mozilla.org/docs/Web/JavaScript/Closures" },
    ],
  },
];
```

(During Step: verify `js-closures-007` exists via `getProblem`; if the id differs, substitute a real `js-closures-*` id. The Task 2 test enforces this.)

- [ ] **Step 2: Implement the aggregation + helpers**

Create `content/concepts/index.ts`:

```ts
import type { Concept, ConceptTrack } from "./types";
import { javascriptConcepts } from "./javascript";

const ALL: Concept[] = [...javascriptConcepts];

export function getAllConcepts(): Concept[] {
  return ALL;
}
export function getConcept(slug: string): Concept | undefined {
  return ALL.find((c) => c.slug === slug);
}
export function getConceptsByTrack(track: ConceptTrack): Concept[] {
  return ALL.filter((c) => c.track === track);
}
export function getConceptsByTopic(track: ConceptTrack, topic: string): Concept[] {
  return ALL.filter((c) => c.track === track && c.topic === topic);
}
export function getConceptForProblem(problemId: string): Concept | undefined {
  return ALL.find((c) => c.relatedProblemIds.includes(problemId));
}
```

- [ ] **Step 3: Add a registry-integrity test**

Append to `content/concepts.validate.test.ts`:

```ts
import { getAllConcepts } from "./concepts";
import { getAllProblems } from "./index";
import { visualKeys } from "../components/concepts/visuals";

describe("concept registry integrity", () => {
  const problemIds = new Set(getAllProblems().map((p) => p.id));
  const keys = new Set(visualKeys);
  it("every concept passes validation", () => {
    for (const c of getAllConcepts()) {
      expect(validateConcept(c, problemIds, keys), c.slug).toEqual([]);
    }
  });
  it("slugs are unique", () => {
    const slugs = getAllConcepts().map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
```

(This imports `visualKeys` from the registry built in Task 3. If executing strictly in order, temporarily define `export const visualKeys: string[] = ["closures"]` in a stub `components/concepts/visuals/index.ts`, then flesh it out in Task 3.)

- [ ] **Step 4: Run tests, expect pass**

Run: `npx vitest run content/concepts.validate.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add content/concepts/javascript.ts content/concepts/index.ts content/concepts.validate.test.ts components/concepts/visuals/index.ts
git commit -m "feat(concepts): registry, lookup helpers, and integrity test"
```

---

### Task 3: Visuals registry + ConceptStage harness

**Files:**
- Create: `components/concepts/visuals/index.ts`
- Create: `components/concepts/ConceptStage.tsx`
- Create: `components/concepts/visuals/closures.tsx` (exemplar visual)

**Interfaces:**
- Produces: `visualKeys: string[]`, `getVisual(key): LazyComponent`; `<ConceptStage>` client component; a visual-component contract:
  `type ConceptVisualProps = { register: (tl: gsap.core.Timeline) => void }` — each visual builds its timeline inside `useGSAP` and calls `register(tl)`.

- [ ] **Step 1: Define the visual contract + registry**

Create `components/concepts/visuals/index.ts`:

```ts
import { lazy, type ComponentType } from "react";
import type { gsap } from "gsap";

export type ConceptVisualProps = {
  register: (tl: gsap.core.Timeline) => void;
};

const registry: Record<string, ComponentType<ConceptVisualProps>> = {
  closures: lazy(() => import("./closures").then((m) => ({ default: m.ClosuresVisual }))),
};

export const visualKeys = Object.keys(registry);
export function getVisual(key: string) {
  return registry[key];
}
```

- [ ] **Step 2: Implement the ConceptStage harness**

Create `components/concepts/ConceptStage.tsx`:

```tsx
"use client";
import { Suspense, useRef, useState, type ComponentType } from "react";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import { getVisual, type ConceptVisualProps } from "./visuals";

export function ConceptStage({ visual }: { visual: string }) {
  const Visual = getVisual(visual) as ComponentType<ConceptVisualProps> | undefined;
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  function register(tl: gsap.core.Timeline) {
    tlRef.current = tl;
    tl.eventCallback("onUpdate", () => setProgress(tl.progress()));
    tl.eventCallback("onComplete", () => setPlaying(false));
  }
  function replay() { tlRef.current?.restart(); setPlaying(true); }
  function toggle() {
    const tl = tlRef.current;
    if (!tl) return;
    if (tl.progress() === 1) { tl.restart(); setPlaying(true); return; }
    if (playing) { tl.pause(); setPlaying(false); } else { tl.play(); setPlaying(true); }
  }
  function scrub(v: number) { tlRef.current?.pause(); setPlaying(false); tlRef.current?.progress(v); }

  if (!Visual) return null;
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="min-h-[260px] flex items-center justify-center overflow-x-auto">
        <Suspense fallback={<p className="text-sm text-muted-foreground">Loading visual…</p>}>
          <Visual register={register} />
        </Suspense>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <Button size="sm" variant="outline" onClick={toggle}>{playing ? "Pause" : "Play"}</Button>
        <Button size="sm" variant="outline" onClick={replay}>Replay</Button>
        <input
          type="range" min={0} max={1} step={0.001} value={progress}
          onChange={(e) => scrub(Number(e.target.value))}
          className="flex-1 accent-[var(--color-primary)]"
          aria-label="Scrub animation"
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Implement the exemplar visual (closures)**

Create `components/concepts/visuals/closures.tsx`. This is the reference implementation every other visual follows: `"use client"`, build the timeline in `useGSAP` scoped to a ref, start paused, call `register(tl)`, and branch on reduced motion via `gsap.matchMedia`. Colors use token vars.

```tsx
"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";

export function ClosuresVisual({ register }: ConceptVisualProps) {
  const scope = useRef<SVGSVGElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      // Scene: outer() box with a `count` chip; a returned function ("backpack")
      // leaves the box carrying the chip; two calls increment the chip.
      gsap.set("#backpack", { x: 0, opacity: 0 });
      gsap.set(".count-chip", { textContent: "0" });
      if (animate) {
        tl.to("#outer-box", { opacity: 1, duration: 0.4 })
          .to("#backpack", { opacity: 1, duration: 0.3 }, "+=0.2")
          .to("#backpack", { x: 160, duration: 0.8, ease: "power2.inOut" }, "+=0.3")
          .to(".count-chip", { textContent: "1", duration: 0.2, snap: { textContent: 1 } }, "+=0.4")
          .to(".count-chip", { textContent: "2", duration: 0.2, snap: { textContent: 1 } }, "+=0.6");
      } else {
        // reduced motion: jump to labeled end-state
        tl.set("#outer-box", { opacity: 1 })
          .set("#backpack", { opacity: 1, x: 160 })
          .set(".count-chip", { textContent: "2" });
      }
      register(tl);
      return tl;
    };
    mm.add("(prefers-reduced-motion: reduce)", () => { build(false); });
    mm.add("(prefers-reduced-motion: no-preference)", () => { build(true); });
    return () => mm.revert();
  }, { scope });

  return (
    <svg ref={scope} viewBox="0 0 360 220" className="w-full max-w-md" role="img"
      aria-label="A returned function carries its count variable out of the outer function's scope">
      <rect id="outer-box" x="10" y="30" width="150" height="150" rx="10"
        className="fill-[var(--color-muted)] stroke-[var(--color-border)]" opacity="0" />
      <text x="20" y="50" className="fill-[var(--color-muted-foreground)] text-[11px]">makeCounter()</text>
      <g id="backpack">
        <rect x="40" y="90" width="90" height="40" rx="8"
          className="fill-[var(--color-primary)]" opacity="0.15" />
        <rect x="40" y="90" width="90" height="40" rx="8"
          className="fill-none stroke-[var(--color-primary)]" />
        <text x="52" y="108" className="fill-[var(--color-foreground)] text-[11px]">count:</text>
        <text x="98" y="108" className="count-chip fill-[var(--color-foreground)] text-[11px]">0</text>
        <text x="52" y="124" className="fill-[var(--color-muted-foreground)] text-[10px]">() =&gt; ++count</text>
      </g>
    </svg>
  );
}
```

- [ ] **Step 4: Verify build + registry test**

Run: `npx vitest run content/concepts.validate.test.ts && npm run build`
Expected: tests PASS; build succeeds.

- [ ] **Step 5: Commit**

```bash
git add components/concepts/
git commit -m "feat(concepts): ConceptStage harness, visuals registry, closures exemplar"
```

---

### Task 4: Concept routes (index + detail)

**Files:**
- Create: `components/concepts/ConceptCard.tsx`
- Create: `components/concepts/RelatedProblems.tsx`
- Create: `app/learn/concepts/page.tsx`
- Create: `app/learn/concepts/[slug]/page.tsx`

**Interfaces:**
- Consumes: `getAllConcepts`, `getConcept`, `getConceptsByTrack`, `getProblem`; `<ConceptStage>`.
- Produces: routes `/learn/concepts` and `/learn/concepts/[slug]`.

- [ ] **Step 1: ConceptCard (server)**

Create `components/concepts/ConceptCard.tsx`:

```tsx
import Link from "next/link";
import type { Concept } from "@/content/concepts/types";

export function ConceptCard({ concept }: { concept: Concept }) {
  return (
    <Link href={`/learn/concepts/${concept.slug}`}
      className="block rounded-lg border p-4 hover:bg-accent transition-colors">
      <div className="text-xs text-muted-foreground">{concept.topic}</div>
      <div className="font-semibold mt-1">{concept.title}</div>
      <p className="text-sm text-muted-foreground mt-1">{concept.oneLiner}</p>
    </Link>
  );
}
```

- [ ] **Step 2: RelatedProblems (server)**

Create `components/concepts/RelatedProblems.tsx`:

```tsx
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
```

- [ ] **Step 3: Index page**

Create `app/learn/concepts/page.tsx`:

```tsx
import { getConceptsByTrack } from "@/content/concepts";
import { TOPICS } from "@/content/manifest";
import { ConceptCard } from "@/components/concepts/ConceptCard";

export const metadata = { title: "Concepts — Octagram Labs" };

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
```

- [ ] **Step 4: Detail page**

Create `app/learn/concepts/[slug]/page.tsx`:

```tsx
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
```

- [ ] **Step 5: Build + browser smoke**

Run: `npm run build`, then `npm run dev` and open `/learn/concepts` and `/learn/concepts/closures`.
Expected: index lists the closures card under "A Closer Look at Functions"; detail page shows the animation with working Play/Replay/scrub in both light and dark.

- [ ] **Step 6: Commit**

```bash
git add components/concepts/ConceptCard.tsx components/concepts/RelatedProblems.tsx app/learn/concepts/
git commit -m "feat(concepts): index and detail routes"
```

---

### Task 5: Cross-links (Nav, MobileNav, problem Learning tab)

**Files:**
- Modify: `components/Nav.tsx` (desktop link row)
- Modify: `components/MobileNav.tsx` (`links` array)
- Modify: `components/playground/PromptPanel.tsx` (learning section)

**Interfaces:**
- Consumes: `getConceptForProblem`.

- [ ] **Step 1: Add desktop Nav link**

In `components/Nav.tsx`, add after the React `NavLink`:

```tsx
<NavLink href="/learn/react">React</NavLink>
<NavLink href="/learn/concepts">Concepts</NavLink>
```

- [ ] **Step 2: Add mobile Nav link**

In `components/MobileNav.tsx`, add to the `links` array after the react entry:

```tsx
["/learn/react", "React"],
["/learn/concepts", "Concepts"],
```

- [ ] **Step 3: Add "Visualize this concept" link to the Learning tab**

In `components/playground/PromptPanel.tsx`: import at top:

```tsx
import Link from "next/link";
import { getConceptForProblem } from "@/content/concepts";
```

Inside the component body (before the `return`), compute:

```tsx
const concept = getConceptForProblem(problem.id);
```

Then render, right after the resources block:

```tsx
{concept && (
  <Link href={`/learn/concepts/${concept.slug}`} className="inline-block text-sm text-blue-500 underline">
    Visualize this concept: {concept.title} →
  </Link>
)}
```

(`PromptPanel` is a server component with no `"use client"`; confirm it stays server-only — importing `getConceptForProblem` and `Link` is fine.)

- [ ] **Step 4: Build + browser check**

Run: `npm run build`; open a problem whose id is in `closures.relatedProblemIds` (e.g. `/problem/js-closures-007`).
Expected: "Visualize this concept: Closures →" link appears in the Learning content and navigates to the concept page. Nav shows "Concepts" on desktop and in the mobile drawer.

- [ ] **Step 5: Commit**

```bash
git add components/Nav.tsx components/MobileNav.tsx components/playground/PromptPanel.tsx
git commit -m "feat(concepts): cross-link nav and problem learning tab to concept pages"
```

---

## Content + visual authoring tasks (Tasks 6–14)

Each task below adds one topic-group's concepts. For **every concept** in a task:

1. Append a `Concept` object to `content/concepts/javascript.ts` with: accurate `definition` (checked against MDN), 1–3 `examples` (real runnable snippets + plain explanation), 2–5 `realWorldUseCases`, `furtherReading` (MDN link), and `relatedProblemIds` chosen by filtering the real problems: pick 2–5 ids from `getProblemsByTopic("javascript", <topic>)` output that match the concept (the integrity test fails the build on any wrong id).
2. Register a visual key in `components/concepts/visuals/index.ts` and create `components/concepts/visuals/<slug>.tsx` following the **closures exemplar contract exactly**: `"use client"`, `useGSAP` scoped to a ref, timeline built `paused`, `register(tl)` called, `gsap.matchMedia` branch for reduced motion rendering a labeled end-state, colors from `--color-*` tokens, an `aria-label` describing the end-state.
3. Run `npx vitest run content/concepts.validate.test.ts && npm run build`, open each new page in the browser (light + dark), then commit the task.

The **animation brief** for each concept specifies what the bespoke scene must show. Keep scenes to 3–6 timeline beats.

Each task ends with:
```bash
git add content/concepts/javascript.ts components/concepts/visuals/
git commit -m "feat(concepts): <topic-group> concepts + visuals"
```
and the gate: integrity test green, `npm run build` green, each page verified in the browser.

---

### Task 6: Behind the Scenes (5 concepts)

- **hoisting** (topic "Behind the Scenes") — Brief: source lines for `var x`/`function foo()` visibly float to the top of their scope box before an "execution" playhead starts stepping through; `let`/`const` shown staying put in a "temporal dead zone" band. Related: `js-bts-*` hoisting problems.
- **scope-chain** (topic "Behind the Scenes") — Brief: nested boxes (global → outer → inner); a variable lookup token starts inner and hops outward, highlighting each scope until it resolves, then a failed lookup reaching global → ReferenceError.
- **the-this-keyword** (topic "Behind the Scenes") — Brief: one `showThis()` call site; `this` arrow re-points across four panels — method call (→ object), standalone (→ undefined/global), `call`/`bind` (→ chosen object), arrow (→ lexical).
- **execution-context-call-stack** (topic "Behind the Scenes") — Brief: frames push onto a vertical stack as functions are called and pop as they return; the currently-running frame is highlighted.
- **primitives-vs-references** (topic "Behind the Scenes") — Brief: primitive copy duplicates a value chip; object copy draws two variables pointing an arrow at one shared box; mutating through one arrow updates the shared box.

Related-problem source topics: "Behind the Scenes", plus `js-scope-*` for scope-chain.

---

### Task 7: Fundamentals (4 concepts)

- **data-types-and-coercion** (topic "Fundamentals: Part 1") — Brief: value chips labeled with `typeof`; a coercion step morphs `"5" + 1` → `"51"` vs `"5" - 1` → `4`, showing the string/number conversion path.
- **let-const-var-tdz** (topic "Fundamentals: Part 2") — Brief: a timeline bar with a "temporal dead zone" region before a `let` declaration; accessing before it flashes an error, after it succeeds; `var` shown initialized to `undefined` from the top.
- **truthy-falsy** (topic "Fundamentals: Part 2") — Brief: a conveyor of values (`0`, `""`, `null`, `undefined`, `NaN`, `"0"`, `[]`, `{}`) dropping into a truthy or falsy bin.
- **operators-precedence** (topic "Fundamentals: Part 1") — Brief: an expression like `2 + 3 * 4` collapses in precedence order, multiplying first then adding, with each sub-result replacing its operands.

Related-problem source topics: "Fundamentals: Part 1", "Fundamentals: Part 2".

---

### Task 8: Data Structures, Operators & Strings (4 concepts)

- **destructuring** (topic "Data Structures, Operators & Strings") — Brief: an array/object splits, animated lines carry each element/property into its named target variable.
- **spread-and-rest** (topic "Data Structures, Operators & Strings") — Brief: spread "explodes" an array into a new combined array; rest "collects" trailing arguments into one array (mirror animation).
- **optional-chaining-nullish** (topic "Data Structures, Operators & Strings") — Brief: a property access walks a nested object; when it hits `undefined`, `?.` short-circuits to `undefined` (no crash); `??` picks the right-hand default only for null/undefined, not for `0`/`""`.
- **maps-and-sets** (topic "Data Structures, Operators & Strings") — Brief: a Set rejecting a duplicate insert; a Map storing key→value pairs with O(1) lookup highlight.

Related-problem source topics: "Data Structures, Operators & Strings" (`js-objects-*`, `js-strings-*`, `js-es6-*`).

---

### Task 9: A Closer Look at Functions (3 concepts; closures already done)

- **higher-order-functions** (topic "A Closer Look at Functions") — Brief: a function passed as an argument into another, which calls it back; and a function returning a new function.
- **currying** (topic "A Closer Look at Functions") — Brief: `add(1)(2)(3)` shown as a chain of boxes, each capturing one argument until arity is met, then the sum computes.
- **call-apply-bind** (topic "A Closer Look at Functions") — Brief: the same function invoked three ways, `this` arrow re-pointing to the passed object; `bind` shown returning a new pre-bound function.

Related-problem source topics: "A Closer Look at Functions" (`js-hof-*`, `js-fp-*`, `js-closures-*`).

---

### Task 10: Working With Arrays (2 concepts)

- **map-filter-reduce** (topic "Working With Arrays") — Brief: a row of numbers; `map` transforms each into a new row; `filter` drops some; `reduce` folds the row into a single accumulator chip, step by step.
- **sorting-arrays** (topic "Working With Arrays") — Brief: bars reordering under a comparator; show the comparator return sign (`a-b`) driving each swap.

Related-problem source topics: "Working With Arrays" (`js-arrays-*`, `js-arraymethods-*`).

---

### Task 11: Object-Oriented Programming (3 concepts)

- **prototypes-inheritance** (topic "Object-Oriented Programming") — Brief: an instance's failed property lookup walks up the prototype chain (`__proto__` arrows) until it finds the method on the prototype.
- **es6-classes** (topic "Object-Oriented Programming") — Brief: a `class` desugars into a constructor function + prototype methods; `new` creates an instance linked to the prototype.
- **getters-setters** (topic "Object-Oriented Programming") — Brief: reading a property triggers a getter function; assigning triggers a setter that validates before storing.

Related-problem source topics: "Object-Oriented Programming" (`js-classes-*`, `js-objects-*`).

---

### Task 12: Asynchronous JavaScript (4 concepts)

- **the-event-loop** (topic "Asynchronous JavaScript") — Brief (flagship): call stack + Web APIs + macrotask queue + microtask queue; a `setTimeout` and a resolved `Promise.then` both scheduled, showing microtasks drain fully before the next macrotask.
- **promises** (topic "Asynchronous JavaScript") — Brief: a promise node transitions pending → fulfilled or rejected; `.then`/`.catch` handlers light up on settle.
- **async-await** (topic "Asynchronous JavaScript") — Brief: an `await` visibly pauses the function frame, control returns to the caller, then resumes the frame when the awaited promise settles.
- **microtasks-vs-macrotasks** (topic "Asynchronous JavaScript") — Brief: two queues side by side; ordering demo where `Promise.then` (microtask) runs before `setTimeout(…,0)` (macrotask).

Related-problem source topics: "Asynchronous JavaScript" (`js-async-*`).

---

### Task 13: Modern JavaScript (1 concept)

- **es-modules** (topic "Modern JavaScript") — Brief: two module boxes; a named `export` connects by an arrow to an `import` in another module; a live-binding update propagates across the arrow.

Related-problem source topics: "Modern JavaScript".

---

### Task 14: Beyond the Course (2 concepts)

- **regular-expressions** (topic "Beyond the Course") — Brief: a pattern scanning across an input string character by character, highlighting the matched span and captured groups.
- **iterators-generators** (topic "Beyond the Course") — Brief: a generator function yielding values one at a time on each `next()`, pausing at each `yield` with the frame state preserved.

Related-problem source topics: "Beyond the Course" (`js-regex-*`, `js-iterators-*`).

---

### Task 15: Final validation + polish

**Files:** none new (verification + fixes only).

- [ ] **Step 1: Full test suite**

Run: `npm run test`
Expected: all content tests pass, including the concept integrity test over all ~28 concepts.

- [ ] **Step 2: Full build**

Run: `npm run build`
Expected: success; every `/learn/concepts/[slug]` statically generated.

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: clean (no `react-hooks` errors in visuals; `useGSAP` handles cleanup).

- [ ] **Step 4: Browser smoke across a sample**

Open `/learn/concepts` and 4 detail pages spanning topics (e.g. `closures`, `the-event-loop`, `hoisting`, `map-filter-reduce`) in light + dark and with OS "reduce motion" on.
Expected: animations play, controls work, reduced-motion shows a static labeled end-state, no console errors, no horizontal page scroll.

- [ ] **Step 5: Commit any fixes**

```bash
git add -A
git commit -m "chore(concepts): final validation pass for JS concept pages"
```

---

## Self-Review (completed)

- **Spec coverage:** content model (T1), registry/helpers (T2), ConceptStage + reduced motion + theming (T3), routes with the specified section order (T4), cross-links to problems + nav (T5), all pilot concept groups (T6–T14), validation/testing + browser smoke (T1/T2/T15). Covered.
- **Placeholder scan:** infra tasks and the exemplar carry complete code; content tasks carry a precise per-concept recipe + animation brief + a self-checking related-problem selection rule (the integrity test fails the build on bad ids), which is concrete work, not a TODO.
- **Type consistency:** `Concept`/`ConceptExample`/`ConceptTrack` (T1) used unchanged in T2/T4; `ConceptVisualProps.register` (T3) matches the exemplar and every visual; `visualKeys`/`getVisual` (T3) consumed by T2's test and `ConceptStage`; helper names (`getConcept`, `getConceptsByTrack`, `getConceptForProblem`) consistent across T2/T4/T5.
