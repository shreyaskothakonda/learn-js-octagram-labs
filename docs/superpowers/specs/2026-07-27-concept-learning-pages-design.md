# Concept Learning Pages with GSAP Visualizations — Design

Date: 2026-07-27
Status: Approved (design)

## Goal

Add a learning-content layer to learn.octagramlabs.com: fine-grained **concept
pages** for the concepts covered across the practice questions. Each page gives
a real definition, worked examples, real-world use cases, links to the relevant
practice problems, and — most importantly — a **bespoke GSAP animation** that
visualizes the concept.

The concepts are fine-grained (individual concepts such as *closures*, *the
event loop*, *spread operator* — not just broad topics). Every concept gets its
own hand-authored animation. We ship one track first (JavaScript), review, then
expand to Data Structures and React in later spec→plan cycles.

## Scope

**In scope (this spec):** the content model, routes, the shared GSAP animation
harness, validation/testing, cross-linking with existing problems, and the full
JavaScript pilot (~28 concepts, each with prose + a bespoke visualization).

**Out of scope (future specs):** Data Structures concepts, React concepts. They
reuse the same engine and content model built here.

## Non-goals

- No MDX pipeline. Content is typed data, animations are code.
- No per-concept animation libraries beyond GSAP (DOM + SVG only).
- No unit tests of animation frames. Animations are verified by build + review.
- No changes to the problem-execution playground.

## Architecture (Approach A: data-driven registry + bespoke visual components)

Two clean halves, mirroring the existing `content/problems` pattern:

1. **Content as data** — a typed registry under `content/concepts/`. Prose,
   examples, use cases, and cross-links live here. Self-validating like
   `content/problems`.
2. **Animation as code** — one bespoke React component per concept under
   `components/concepts/visuals/<slug>.tsx`, each driving its own GSAP timeline.
   A shared `<ConceptStage>` wrapper provides the *common* concerns (controls,
   cleanup, reduced-motion, theming) so only the timeline itself is bespoke.

### Content model

```ts
// content/concepts/types.ts
export type ConceptTrack = "javascript" | "data-structures" | "react";

export type ConceptExample = {
  code: string;          // JS snippet shown with the existing code styling
  explanation: string;   // 1–3 sentences, plain language
};

export type Concept = {
  slug: string;                 // unique, kebab-case, used in the URL
  track: ConceptTrack;
  topic: string;                // must match a topic in content/manifest.ts
  title: string;                // e.g. "Closures"
  oneLiner: string;             // one-sentence hook shown on the index card
  definition: string;          // 1–3 paragraphs, accurate and plain
  examples: ConceptExample[];   // 1–3 worked examples
  realWorldUseCases: string[];  // 2–5 concrete "where you actually see this"
  relatedProblemIds: string[];  // ids from content/problems (validated to exist)
  visual: string;               // key into the visuals registry
  furtherReading?: { label: string; url: string }[];
  course?: CourseRef;           // reuse the existing CourseRef shape
};
```

- Registry file(s): `content/concepts/javascript.ts` exporting
  `javascriptConcepts: Concept[]`, aggregated in `content/concepts/index.ts`
  with `getAllConcepts()`, `getConcept(slug)`, `getConceptsByTrack(track)`,
  `getConceptsByTopic(track, topic)`, and `getConceptForProblem(problemId)`.
- The visuals registry (`components/concepts/visuals/index.ts`) maps
  `visual` keys → lazy-loaded components, so the content layer never imports
  React components directly and the index page stays server-rendered.

### Routes

- `/learn/concepts` — server component. Concept library grouped by topic (JS
  only for the pilot). Each card: title, one-liner, topic chip. Links to detail.
- `/learn/concepts/[slug]` — server component for prose (SEO-friendly,
  fast) that renders the client visual island. Page order:
  1. Title + topic chip + one-liner
  2. **Animated visual** (hero) — the bespoke `<ConceptStage>`
  3. Definition
  4. Worked examples (code + explanation)
  5. Real-world use cases
  6. "Practice this" — cards linking to `relatedProblemIds`
  7. Further reading
- Static params via `generateStaticParams()` over all concept slugs.

### Cross-linking with existing problems

- `PromptPanel` (problem Learning tab) gains a "Visualize this concept →" link
  when `getConceptForProblem(problem.id)` resolves. Purely additive.
- Concept pages link back to their practice problems.
- Nav: add "Concepts" entry (reuse existing `Nav`/`MobileNav` link list).

### Animation harness (GSAP)

- Dependencies: `gsap` and `@gsap/react` (both free; `useGSAP` gives automatic
  context cleanup on unmount). No other animation libraries.
- `components/concepts/ConceptStage.tsx` — a `"use client"` wrapper that owns
  the concerns common to every concept, so individual visuals stay bespoke:
  - **Playback controls**: Replay, Play/Pause, and a scrub slider bound to the
    timeline's `progress()`.
  - **Reduced motion**: via `gsap.matchMedia()` + `prefers-reduced-motion`, the
    timeline renders its final labeled end-state instead of animating.
  - **Theming**: colors read from the existing CSS token variables so light/dark
    both look intentional; no hard-coded hex.
  - **Lifecycle**: the timeline is built inside `useGSAP(() => {...}, { scope })`
    and paused at 0; controls drive it. Cleanup is automatic.
  - Contract: each visual is a component that receives a `stageRef`/registration
    callback and returns its built `gsap.core.Timeline`. `<ConceptStage>` renders
    `{children}` (the SVG/DOM scene) and wires the returned timeline to controls.
- Each `visuals/<slug>.tsx` builds one hand-authored timeline over an
  SVG/DOM scene. Examples of the bespoke treatment:
  - **event-loop** — call stack + macrotask/microtask queues; frames push/pop
    and callbacks drain in the correct order.
  - **closures** — a returned function carries a "backpack" of its captured
    variables out of the parent scope.
  - **hoisting** — `var`/function declarations float to the top of their scope
    before execution begins.
  - **scope-chain** — nested scope boxes; a variable lookup walks outward until
    it resolves.
  - **promises** — a node transitions pending → fulfilled/rejected with handlers
    firing on settle.
  - **this-binding** — the same call site re-pointing `this` under
    method/standalone/call-apply-bind/arrow forms.

### Reused infrastructure

- Existing code-styling / difficulty badges / Card / Button (shadcn) components.
- Existing `.dark` theme system and CSS tokens.
- Existing `getProblem`/`getAllProblems` for validating and rendering links.

## Pilot concept set (JavaScript, ~28)

Grouped by existing topic:

- **Fundamentals: Part 1 / Part 2** — data types & coercion; `let`/`const`/`var`
  and the TDZ; truthy/falsy values; operators & precedence.
- **Behind the Scenes** — hoisting; scope & the scope chain; the `this` keyword;
  execution context & the call stack; primitives vs references.
- **Data Structures, Operators & Strings** — destructuring; spread & rest;
  optional chaining & nullish coalescing; Maps & Sets.
- **A Closer Look at Functions** — higher-order functions; closures; currying;
  `call`/`apply`/`bind`.
- **Working With Arrays** — map/filter/reduce; sorting arrays.
- **Object-Oriented Programming** — prototypes & prototypal inheritance; ES6
  classes; getters/setters.
- **Asynchronous JavaScript** — the event loop; promises; async/await;
  microtasks vs macrotasks.
- **Modern JavaScript** — ES modules (import/export).
- **Beyond the Course** — regular expressions; iterators & generators.

Final count is fixed during planning; the list above is the target. Each concept
links to the real `relatedProblemIds` already present in `content/problems`.

## Validation & testing

- `content/concepts/validate.ts` + `content/concepts.validate.test.ts` (Vitest,
  alongside the existing content tests):
  - slugs are unique and kebab-case;
  - `title`, `oneLiner`, `definition` non-empty; `examples`,
    `realWorldUseCases` non-empty;
  - `topic` exists in `content/manifest.ts` for the track;
  - every `relatedProblemId` resolves via `getProblem`;
  - every `visual` key exists in the visuals registry.
- `next build` type-checks all pages and visuals.
- Browser smoke pass on 3–4 concept pages (light + dark, reduced-motion) before
  declaring done. Animations are visual and reviewed manually.

## File structure

```
content/concepts/
  types.ts
  javascript.ts          # javascriptConcepts: Concept[]
  index.ts               # aggregation + lookup helpers
  validate.ts
content/concepts.validate.test.ts
components/concepts/
  ConceptStage.tsx       # shared client harness (controls, reduced-motion, theme)
  visuals/
    index.ts             # slug/key -> lazy component registry
    closures.tsx
    event-loop.tsx
    hoisting.tsx
    ...one per concept
  ConceptCard.tsx        # index card
  RelatedProblems.tsx    # "Practice this" block
app/learn/concepts/
  page.tsx               # index
  [slug]/page.tsx        # detail
```

## Risks & mitigations

- **Effort of ~28 bespoke animations.** Mitigation: the `<ConceptStage>` harness
  removes repeated control/cleanup/theming work; visuals are built in batches by
  topic during implementation, each verified before moving on.
- **GSAP + React 19 / Next 16 cleanup pitfalls.** Mitigation: use `@gsap/react`
  `useGSAP` (built for this) with a scoped ref; never animate during render.
- **Accessibility.** Mitigation: reduced-motion end-states are part of the
  harness contract, not an afterthought; controls are keyboard-operable.
- **Content accuracy.** Mitigation: definitions/examples reviewed against MDN;
  `furtherReading` points to authoritative sources.

## Rollout

1. This spec → implementation plan → build engine + registry + routes +
   validation + all ~28 JS concepts.
2. Review the JS pilot end-to-end.
3. Separate spec→plan cycles for Data Structures and React concepts, reusing the
   engine and content model unchanged.
