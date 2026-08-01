# Concept Pages: Learning + Effortlessness — Design

Date: 2026-07-29
Status: Approved (build all four bundles + extras)

## Goal

The concept pages today are passive: watch animation, read text, see dead code,
follow links. Make them active and frictionless: run/edit the code, recall with
pitfalls + takeaways + a self-check, move through concepts without returning to
the index, and track what you have learned.

## Bundles (all approved)

1. **Runnable examples** — each code example is runnable and editable in the
   existing Web Worker sandbox, syntax-highlighted for reading.
2. **Recall** — Common mistakes, Key takeaways, and a Check-your-understanding
   question per concept.
3. **Effortless flow + progress** — sticky animation on desktop, Prev/Next
   concept navigation, Related concepts links, and Mark-as-learned progress
   with an index overview.
4. **Reading polish** — syntax highlighting and an on-page section list.

## Content model additions (`content/concepts/types.ts`)

```ts
export type ConceptCheck = {
  question: string;
  options: string[];        // 2-4 options
  answerIndex: number;      // index into options
  explanation?: string;     // shown after answering
};

export type Concept = {
  // ...existing fields...
  pitfalls?: string[];       // common mistakes, plain sentences
  keyTakeaways?: string[];   // 2-4 one-line recap points
  check?: ConceptCheck;      // one self-check question
  related?: string[];        // slugs of related concepts
};
```

Validation (`content/concepts/validate.ts`, tested): if `check` present,
`options.length` in [2,4] and `answerIndex` in range; `pitfalls`/`keyTakeaways`
entries non-empty; every `related` slug resolves to a known concept (pass the
known slug set into the validator). All new fields optional so the build never
breaks mid-rollout.

## Runnable examples

- **Worker**: add a `kind: "script"` branch to `public/runner-worker.js` that
  runs the code with a captured `console` and returns `{ consoleLogs, error,
  runtimeMs }` (no test cases). Reuses the existing `fakeConsole`.
- **Helper**: `lib/runner/run-script.ts` exporting
  `runScript(code: string, timeoutMs?): Promise<{ logs: string[]; error?: string }>`
  built on a Worker like `run-in-worker.ts`. Unit-tested against the worker
  contract shape (pure logic parts).
- **Highlighting**: add `shiki`. A server helper `lib/highlight.ts`
  `highlightJs(code): Promise<string>` returns themed HTML (dual light/dark via
  CSS variables). Runs at build (static pages), server-only, not shipped to the
  client bundle.
- **Component**: `components/concepts/RunnableExample.tsx` (client). Props:
  `code: string`, `highlighted: string`, `explanation: string`.
  - Default: render `highlighted` in a styled `<pre>` (read-only).
  - Buttons: **Run** (executes current code via `runScript`, shows a console
    output panel with logs or the error), **Edit** (swap the `<pre>` for a
    `<textarea>` seeded with `code`; Run then uses the edited text), **Copy**,
    **Reset** (restore original + clear output).
  - Output panel: monospace, shows each log line, or a destructive-tinted error.
    Empty-run hint when there is no output.

## Recall UI

- `components/concepts/Pitfalls.tsx` — a "Common mistakes" list with a warning
  accent (reuse the amber treatment already used for problem pitfalls).
- Key takeaways: a simple checklist-styled `<ul>` in the page.
- `components/concepts/ConceptCheck.tsx` (client) — renders the question and
  option buttons; on pick, marks the chosen option correct/incorrect, reveals
  the right answer and `explanation`, and offers "Try again". Keyboard operable.

## Effortless flow + progress

- **Layout** (`app/concepts/[slug]/page.tsx`): on `lg`, a two-column grid:
  left column holds the `ConceptStage` in a `sticky top-6` wrapper; right column
  scrolls the reading content. On mobile, single column, animation first.
- **Prev/Next**: `content/concepts/index.ts` gains `getConceptNeighbors(slug)`
  returning `{ prev, next }` over the concepts ordered by `TOPICS.javascript`
  topic order then array order. Footer nav renders Prev/Next cards.
- **Related concepts**: render `c.related` (fallback: other concepts in the same
  topic, excluding self) as a small link list.
- **Mark as learned** (no auth, no DB — resilient to Supabase downtime):
  `lib/concept-progress.ts` stores a `Set<slug>` in `localStorage` under
  `learned-concepts`, with `useLearnedConcepts()` (a `useSyncExternalStore` over
  a storage-event subscription) and `toggleLearned(slug)`.
  - `components/concepts/MarkLearned.tsx` (client): a toggle button on the page.
  - `components/concepts/ConceptCard.tsx` becomes client-aware of learned state
    (shows a check when learned).
  - `components/concepts/ConceptsProgress.tsx` (client): "N of M learned"
    counter + a slim progress bar on the index header.

## Reading polish

- shiki highlighting (above) for all example code.
- A compact "On this page" section list in the left column under the sticky
  animation (anchors to the page sections), desktop only.

## Page section order (right column)

Header (topic, title, oneLiner, Mark-as-learned) is above the columns.
Right column: Definition, Examples (runnable), Common mistakes, Key takeaways,
Check your understanding, Where you see this, Practice problems, Related
concepts, Further reading. Footer: Prev/Next.

## Non-goals

- No account-based concept sync (localStorage only for now; can layer Supabase
  later).
- No Monaco for inline examples (a textarea is lighter and enough).
- No changes to the animations themselves or the ConceptStage controls.

## Rollout

Engineering foundation first (model + validator, worker script kind + helper,
highlight helper, RunnableExample, ConceptCheck, progress + MarkLearned +
index, page layout). Then author `pitfalls` + `keyTakeaways` + `check` +
`related` for all 29 concepts in topic-group batches. Then final verification
(tests, build, lint, browser smoke light/dark/reduced-motion).
