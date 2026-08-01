# Concept Page Learning Features — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development. Steps use checkbox syntax.

**Goal:** Make concept pages active and frictionless: runnable/editable examples, recall content (pitfalls, takeaways, self-check), effortless flow (sticky viz, prev/next, related, mark-as-learned), and syntax highlighting.

**Architecture:** Extend the `Concept` model with optional fields; add a `script` execution kind to the existing Web Worker and a shiki highlight helper; build client components (RunnableExample, ConceptCheck, MarkLearned, ConceptsProgress); restructure the concept detail page into a two-column sticky layout; author the new content across 29 concepts.

**Tech Stack:** Next 16, React 19, GSAP, shiki (new), the existing runner Worker, Vitest.

## Global Constraints

- No em dashes or corporate jargon anywhere (prose, comments, UI text).
- Colors from theme tokens (`--color-*`) / existing Tailwind token classes; no hard-coded hex.
- New `Concept` fields are OPTIONAL so the build stays green mid-rollout.
- `npm run test`, `npm run build`, `npm run lint` stay green after every task.
- Reuse existing components (shadcn Button, the concept kit patterns) and the `.dark` theme.
- Client components that read browser state (localStorage, media queries) must use `useSyncExternalStore`, never setState-in-effect (the repo enforces the `react-hooks` lint).

---

## Task 1: Concept model + validator extensions

**Files:** Modify `content/concepts/types.ts`, `content/concepts/validate.ts`, `content/concepts.validate.test.ts`.

- [ ] Add to `types.ts`: `ConceptCheck` type (`question: string; options: string[]; answerIndex: number; explanation?: string`) and optional `Concept` fields `pitfalls?: string[]`, `keyTakeaways?: string[]`, `check?: ConceptCheck`, `related?: string[]`.
- [ ] Extend `validateConcept(c, knownProblemIds, knownVisualKeys, knownTopics, knownSlugs)`: add a `knownSlugs: Set<string>` param. New rules: if `check` present, `options.length` in [2,4] and `answerIndex` in `[0, options.length)`; non-empty strings in `pitfalls`/`keyTakeaways` when present; every `related` slug in `knownSlugs` and not equal to `c.slug`. Update the registry-integrity test to pass `knownSlugs = new Set(getAllConcepts().map(c => c.slug))`, and add unit tests: bad answerIndex rejected, unknown related slug rejected, self-related rejected.
- [ ] Update all `validateConcept` call sites for the new param.
- [ ] Verify: `npx vitest run content/concepts.validate.test.ts`, `npm run build`. Commit `feat(concepts): extend model with pitfalls, takeaways, check, related`.

**Interfaces produced:** `ConceptCheck`; extended `validateConcept` signature.

---

## Task 2: Worker script kind + runScript helper + highlight helper

**Files:** Modify `public/runner-worker.js`; create `lib/runner/run-script.ts`, `lib/runner/run-script.test.ts`, `lib/highlight.ts`; add `shiki` dep.

- [ ] In `public/runner-worker.js`, add near the top of `onmessage`, before the `harness` branch: a `kind === "script"` branch that runs `new Function("console", code)(fakeConsole)` in a try/catch and posts `{ consoleLogs, error, runtimeMs }` (error is the caught message or undefined).
- [ ] `lib/runner/run-script.ts`: `runScript(code: string, timeoutMs = 3000): Promise<{ logs: string[]; error?: string }>` that spawns `new Worker("/runner-worker.js")`, posts `{ kind: "script", code }`, resolves `{ logs: e.data.consoleLogs ?? [], error: e.data.error }`, and on timeout/`onerror` resolves `{ logs: [], error: "Execution timed out" }` (mirror `run-in-worker.ts`).
- [ ] `lib/runner/run-script.test.ts`: since the Worker is not available in vitest node env, test only the message-shape mapping by extracting a pure `mapWorkerResult(data)` helper from `run-script.ts` and asserting it maps `{consoleLogs, error}` correctly. Keep it minimal and honest.
- [ ] `npm install shiki`.
- [ ] `lib/highlight.ts`: `export async function highlightJs(code: string): Promise<string>` using shiki `codeToHtml(code, { lang: "javascript", themes: { light: "github-light", dark: "github-dark" }, defaultColor: false })`. Server-only (no "use client"). Returns HTML string with shiki dual-theme CSS-variable classes.
- [ ] Add minimal CSS so shiki dual themes follow the app `.dark` class: in `app/globals.css`, add rules so `.shiki` uses `--shiki-light*` vars by default and `.dark .shiki` uses `--shiki-dark*` vars (standard shiki dual-theme snippet). Verify build.
- [ ] Verify + commit `feat(concepts): worker script kind, runScript helper, shiki highlight`.

**Interfaces produced:** `runScript(code, timeoutMs) -> {logs, error}`; `highlightJs(code) -> Promise<string>`.

---

## Task 3: RunnableExample component

**Files:** Create `components/concepts/RunnableExample.tsx` (client).

- [ ] Props: `{ code: string; highlighted: string; explanation: string }`.
- [ ] State: `editing` (bool), `text` (string, init `code`), `output` (`{ logs: string[]; error?: string } | null`), `busy`.
- [ ] Render a styled container: when `!editing`, a `<pre>` with `dangerouslySetInnerHTML={{ __html: highlighted }}` (class `shiki`); when `editing`, a `<textarea value={text} onChange>` monospace, auto-height (min rows to fit `code`).
- [ ] Button row (shadcn Buttons, size sm): **Run** (`busy` guard; call `runScript(editing ? text : code)`; set `output`), **Edit/Done** (toggle `editing`), **Copy** (`navigator.clipboard.writeText(editing ? text : code)`, toast or transient "Copied"), **Reset** (set `text=code`, `editing=false`, `output=null`).
- [ ] Output panel below (only when `output`): monospace; each log on its own line; if `output.error`, show it in `text-[var(--color-destructive)]`; if no logs and no error, show muted "Ran with no console output.".
- [ ] The `explanation` renders under the block as today (muted text).
- [ ] Verify build + lint. Commit `feat(concepts): RunnableExample with run, edit, copy, reset`.

**Interfaces produced:** `<RunnableExample code highlighted explanation />`.

---

## Task 4: ConceptCheck + Pitfalls components

**Files:** Create `components/concepts/ConceptCheck.tsx` (client), `components/concepts/Pitfalls.tsx` (server ok).

- [ ] `ConceptCheck` props `{ check: ConceptCheck }`. Render the `question`, then option buttons. State: `picked: number | null`. On pick: mark each option: the correct one green (`text-green-600`/`border-green-500`), a wrong pick destructive-tinted; reveal `explanation`; show a "Try again" that resets `picked`. Fully keyboard operable (buttons). No auto-advance.
- [ ] `Pitfalls` props `{ items: string[] }`: an amber-accented "Common mistakes" block (match the `text-amber-500` treatment used in `components/playground/PromptPanel.tsx`), a `<ul>` of items.
- [ ] Verify build + lint. Commit `feat(concepts): ConceptCheck and Pitfalls components`.

**Interfaces produced:** `<ConceptCheck check />`, `<Pitfalls items />`.

---

## Task 5: Concept progress + neighbors + index overview

**Files:** Create `lib/concept-progress.ts`, `components/concepts/MarkLearned.tsx`, `components/concepts/ConceptsProgress.tsx`; modify `content/concepts/index.ts`, `components/concepts/ConceptCard.tsx`.

- [ ] `lib/concept-progress.ts` (client util): key `learned-concepts` in localStorage holding a JSON array of slugs. Exports: `getLearned(): Set<string>`, `toggleLearned(slug)`, `isLearned(slug)`, and a `useLearnedConcepts()` hook via `useSyncExternalStore` subscribing to `window` `storage` events plus a same-tab custom event dispatched on toggle (so the UI updates immediately). Server snapshot returns empty set.
- [ ] `content/concepts/index.ts`: add `getOrderedConcepts()` (concepts sorted by `TOPICS.javascript` topic order then their array order) and `getConceptNeighbors(slug): { prev?: Concept; next?: Concept }`.
- [ ] `MarkLearned.tsx` (client): a toggle button using `useLearnedConcepts()` + `toggleLearned`; shows "Mark as learned" / "Learned" with a check icon when set.
- [ ] `ConceptsProgress.tsx` (client): "N of M learned" text + a slim progress bar; takes `total: number`.
- [ ] `ConceptCard.tsx`: make it client-aware of learned state (read `isLearned` via the hook) and show a small check badge when learned. Keep it a link.
- [ ] Wire `ConceptsProgress` into the index header (`app/concepts/page.tsx`), passing the concept count.
- [ ] Verify build + lint (no setState-in-effect; useSyncExternalStore only). Commit `feat(concepts): mark-as-learned progress, prev/next neighbors, index overview`.

**Interfaces produced:** `useLearnedConcepts`, `toggleLearned`, `isLearned`; `getConceptNeighbors`, `getOrderedConcepts`; `<MarkLearned slug />`, `<ConceptsProgress total />`.

---

## Task 6: Concept detail page layout overhaul

**Files:** Modify `app/concepts/[slug]/page.tsx`; create `components/concepts/RelatedConcepts.tsx`, `components/concepts/ConceptNav.tsx`.

- [ ] Restructure the page: header block (topic, title, oneLiner, `<MarkLearned>`), then on `lg` a two-column grid (`lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]` or similar): left column = `<div className="lg:sticky lg:top-6">` wrapping `<ConceptStage>` plus an "On this page" anchor list; right column = the reading content. Single column on mobile with the animation first.
- [ ] Examples: for each example, `await highlightJs(ex.code)` (server) and render `<RunnableExample code={ex.code} highlighted={html} explanation={ex.explanation} />`.
- [ ] Insert new sections in the right column in the spec's order: Definition, Examples, `<Pitfalls items={c.pitfalls}>` (if present), Key takeaways (if present), `<ConceptCheck check={c.check}>` (if present), Where you see this, `<RelatedProblems>`, `<RelatedConcepts>`, Further reading.
- [ ] `RelatedConcepts.tsx` (server): given the concept, render `c.related` (or fallback to same-topic others, excluding self) as titled links to `/concepts/<slug>`.
- [ ] `ConceptNav.tsx` (server): footer Prev/Next cards from `getConceptNeighbors(slug)`.
- [ ] Add stable `id` anchors to each right-column section for the "On this page" list.
- [ ] Verify build + browser (desktop sticky, mobile stack). Commit `feat(concepts): two-column sticky layout, runnable examples, recall sections, prev/next`.

---

## Content authoring tasks 7-15 (per topic group)

For EVERY concept in the group, add to its object in `content/concepts/javascript.ts`:
- `pitfalls`: 2-3 common mistakes (plain, specific, accurate).
- `keyTakeaways`: 2-4 one-line recap points.
- `check`: one multiple-choice `{ question, options (3-4), answerIndex, explanation }` that tests the core idea (not trivia). Verify the `answerIndex` is correct.
- `related`: 1-3 slugs of genuinely related concepts (must be real slugs in the file).

Recipe per task: read the concept's existing `definition`/`examples` for accuracy, add the four fields, run `grep -rn "—" content/concepts/javascript.ts` (none), `npx vitest run content/concepts.validate.test.ts` (the validator now checks check/related), `npm run build`. One commit per group: `content(concepts): add recall fields to <group> concepts`.

- [ ] **Task 7** Behind the Scenes: hoisting, scope-chain, the-this-keyword, execution-context-call-stack, primitives-vs-references
- [ ] **Task 8** Fundamentals: data-types-and-coercion, let-const-var-tdz, truthy-falsy, operators-precedence
- [ ] **Task 9** Data/Strings: destructuring, spread-and-rest, optional-chaining-nullish, maps-and-sets
- [ ] **Task 10** Functions: closures, higher-order-functions, currying, call-apply-bind
- [ ] **Task 11** Arrays: map-filter-reduce, sorting-arrays
- [ ] **Task 12** OOP: prototypes-inheritance, es6-classes, getters-setters
- [ ] **Task 13** Async: the-event-loop, promises, async-await, microtasks-vs-macrotasks
- [ ] **Task 14** Modern: es-modules
- [ ] **Task 15** Beyond: regular-expressions, iterators-generators

---

## Task 16: Final verification

- [ ] `npm run test`, `npm run build`, `npm run lint` all green; `grep -rn "—"` across `content/concepts` and `components/concepts` empty.
- [ ] Browser smoke: a few concept pages in light + dark + reduced motion. Confirm: example Run shows output; Edit + Run works; Copy works; ConceptCheck reveals correctly; Mark-as-learned persists and reflects on the index counter; Prev/Next and Related links work; sticky animation on desktop; no console errors, no horizontal scroll.
- [ ] Commit any fixes.

## Self-Review

- Coverage: model+validator (T1), runner+highlight (T2), RunnableExample (T3), recall components (T4), progress+nav+index (T5), page layout (T6), content for all 29 (T7-15), verification (T16). All spec sections covered.
- Optional fields keep the build green during the T7-15 rollout.
- Interfaces named per task; page (T6) consumes T1-T5 outputs.
