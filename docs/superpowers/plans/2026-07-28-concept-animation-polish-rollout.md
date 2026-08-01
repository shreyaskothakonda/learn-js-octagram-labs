# Concept Animation Polish — Rollout Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development. Steps use checkbox syntax.

**Goal:** Rebuild the remaining 27 concept visuals in the "Runtime Instruments" style by composing the shared kit, so all 29 read as one polished system.

**Architecture:** Each visual is rewritten to compose `components/concepts/visuals/kit.tsx` primitives and motion helpers, following the reference exemplar `components/concepts/visuals/the-event-loop.tsx`. The `<ConceptStage>` harness, the content registry, and the `register`/matchMedia/reduced-motion contract are all unchanged. Only `components/concepts/visuals/<slug>.tsx` files change.

**Tech Stack:** Next 16, React 19, GSAP + @gsap/react, Tailwind v4, the concept kit.

## Global Constraints

- Compose the kit (`Stage`, `Panel`, `Frame`, `Chip`, `Eyebrow`, `CodeLine`, and `enter`/`exit`/`pop`/`focusOn`/`focusOff`/`travel`/`EASE`/`DUR`/`GLOW`). Do not reintroduce raw `<svg>` scenes except a small absolutely-positioned SVG overlay purely for connector lines/arrows when needed.
- Keep the existing contract: `"use client"`, `useGSAP(() => {...}, { scope })` with the scope ref on the `Stage` root, a `paused` timeline, `register(tl)` called in BOTH matchMedia branches, reduced-motion branch renders a static labeled end-state, `return () => mm.revert()`.
- Colors from theme tokens only (the kit handles this); no hard-coded hex. Motion stays refined and calm (kit EASE/DUR); one execution-focus lit at a time.
- Preserve each concept's teaching logic and its `aria-label` end-state description (read the current file first). No content-registry changes.
- No em dashes anywhere. `npm run test`, `npm run build`, `npm run lint` stay green.

---

## Per-visual recipe (applies to every task)

For each slug in the task's group:

1. **Read the current `components/concepts/visuals/<slug>.tsx`** to capture the scene's teaching logic, element set, motion beats, and the reduced-motion end-state. Read `the-event-loop.tsx` (reference) and `kit.tsx` (API) before writing.
2. **Rewrite the file** composing the kit in the Runtime Instruments style:
   - Root `<Stage refEl={scope} label={<same accurate aria-label>}>` with a fixed px canvas (~360-420 wide).
   - Lay the scene with `Panel` (labeled regions), `Frame` (elevated mono cards / stack frames / value boxes), `Chip` (small tokens / outputs), `CodeLine` (source lines), and `Eyebrow` (micro-labels). Absolute px positions.
   - Build the `paused` timeline using the motion helpers: `enter` for staggered reveals, `pop` for chips, `focusOn`/`focusOff` to move the single execution focus to the active element, `travel` for elements moving between regions, `exit` for leaving. Use `"+=0.2"`-style holds between beats for calm pacing.
   - Reduced-motion branch: `.set()` the same elements to their final labeled state (mirror the current file's end-state).
   - Call `register(tl)` in both `mm.add` branches; `return () => mm.revert()`.
3. Keep the scene legible: real mono code text (kit uses Geist Mono), uppercase panel labels, breathing space. Prefer clarity over density.

Each task ends by running `grep -rn "—" components/concepts/visuals/<changed files>`, `npx vitest run content/concepts.validate.test.ts`, `npm run build`, `npm run lint` (all green, grep empty), then one commit `feat(concepts): rebuild <group> visuals in Runtime Instruments style`.

Animations are visual; the controller browser-smokes each group. The task gate is: builds, lints clean, tests pass, faithfully composes the kit per the recipe.

---

### Task 1: Behind the Scenes (5)
Rebuild: `hoisting`, `scope-chain`, `the-this-keyword`, `execution-context-call-stack`, `primitives-vs-references`.
Notes: `execution-context-call-stack` is a natural fit for `Frame`s stacking in a Call-stack `Panel` with focus on the top frame. `scope-chain` = nested `Panel`s with a lookup token that `travel`s outward and `focusOn` each scope. `primitives-vs-references` = value `Chip`s vs `Frame`s with a shared-reference connector (small SVG overlay line).

### Task 2: Fundamentals (4)
Rebuild: `data-types-and-coercion`, `let-const-var-tdz`, `truthy-falsy`, `operators-precedence`.
Notes: keep the falsy set exactly `false,0,-0,0n,"",null,undefined,NaN`. `let-const-var-tdz` uses a TDZ band (destructive-token tinted region) that clears; `Frame`/`CodeLine` for declarations.

### Task 3: Data Structures, Operators & Strings (4)
Rebuild: `destructuring`, `spread-and-rest`, `optional-chaining-nullish`, `maps-and-sets`.
Notes: keep `??` vs `||` distinction (`0 ?? 5 === 0`). `Chip`s for unpacked values; `Frame`s for objects/arrays.

### Task 4: A Closer Look at Functions (4)
Rebuild: `closures`, `higher-order-functions`, `currying`, `call-apply-bind`.
Notes: `closures` = a returned `Frame` carrying a `Chip` "backpack" of its captured variable out of the parent `Panel`. `currying` = arity chain of `Frame`s each capturing one arg with `focusOn` advancing.

### Task 5: Working With Arrays (2)
Rebuild: `map-filter-reduce`, `sorting-arrays`.
Notes: rows of value `Chip`s; `map` transforms each, `filter` drops some, `reduce` folds into one accumulator `Frame`. `sorting-arrays` = bars/chips reordering with the comparator shown.

### Task 6: Object-Oriented Programming (3)
Rebuild: `prototypes-inheritance`, `es6-classes`, `getters-setters`.
Notes: `prototypes-inheritance` = a lookup token walking up `__proto__` connectors (SVG overlay arrows) between `Panel`s until it `focusOn`s the method.

### Task 7: Asynchronous JavaScript remaining (3)
Rebuild: `promises`, `async-await`, `microtasks-vs-macrotasks`.
Notes: `promises` = a state `Frame` transitioning pending -> fulfilled/rejected with handlers lighting on settle. Match the event-loop exemplar's queue treatment for `microtasks-vs-macrotasks`.

### Task 8: Modern JavaScript (1)
Rebuild: `es-modules`.
Notes: two module `Panel`s with an export->import connector (SVG overlay) and a live-binding value `Chip` propagating across.

### Task 9: Beyond the Course (2)
Rebuild: `regular-expressions`, `iterators-generators`.
Notes: `regular-expressions` = a string of character `Chip`s with a scanning focus highlighting the match span/groups. `iterators-generators` = a generator `Frame` yielding value `Chip`s one per `next()`, pausing at each `yield`.

### Task 10: Final polish pass
- [ ] Full `npm run test`, `npm run build`, `npm run lint`.
- [ ] Controller browser-smoke across a sample spanning tasks (light + dark + reduced motion), confirm animations play, focus moves, 0 console errors, no horizontal page scroll.
- [ ] Commit any fixes.

## Self-Review

- Coverage: all 27 remaining visuals grouped across Tasks 1-9; kit + event-loop already done. Task 10 verifies.
- No placeholders: the recipe is concrete (read current file for logic, compose kit per named primitives/helpers, mirror reduced-motion end-state); per-group notes call out the tricky scenes.
- Consistency: every task composes the same kit API defined in `kit.tsx` and follows `the-event-loop.tsx`.
