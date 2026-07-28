# Concept Animation Polish — Design Direction

Date: 2026-07-28
Status: Direction approved; flagship proof in progress

## Problem

The 29 JavaScript concept animations are correct and clear but visually thin:
flat `--color-muted` rectangles, thin borders, tiny 10-11px SVG text, fade-in
reveals with no stagger, generic easing, no emphasis on the active element, and
no shared visual language (each of the 29 was authored independently). The net
effect reads as a wireframe, not a finished explainer.

## Decisions (from the user)

- **Rendering:** richer HTML + CSS scenes animated by GSAP (not raw SVG), for
  real shadows, blur, gradients, web fonts, crisp text.
- **Motion character:** refined and calm.
- **Scope/sequence:** flagship-first — polish 3-4 hero concepts, extract a
  shared kit, review, then roll out to the remaining ~25.

## Direction: "Runtime Instruments"

A calm, engineered instrument-panel view of how JavaScript runs. The visuals
live inside the existing product theme (shadcn tokens, light/dark), so the
identity comes from the diagramming and motion language, not a new palette.

### Color (from product tokens; no new brand palette)

- Stage/surface: `--color-card` / `--color-background`.
- Panel: elevated card, hairline `--color-border`, soft shadow.
- Ink: `--color-foreground` (code), `--color-muted-foreground` (secondary).
- Accent: `--color-primary`, reserved for the single "executing now" element.
- Semantic (used sparingly, already in tokens): `--color-destructive`
  (errors / temporal dead zone), a green for settled/fulfilled, a muted tone
  for queued/pending.
- Discipline: exactly one element is accent-lit at any moment. Emphasis moves;
  it never multiplies. This single-accent rule is a primary polish lever.

### Type

- Code: Geist Mono (already loaded) at a consistent scale (~13px code / 11px
  labels), crisp real text rather than tiny SVG glyphs.
- Labels/eyebrows: Geist, uppercase micro-labels for panel titles
  (`CALL STACK`, `MICROTASK QUEUE`, `SCOPE`).

### Kit primitives (HTML + CSS)

Built once, composed by every visual:

- `Panel` — a labeled region with an uppercase eyebrow, hairline border, soft
  inner surface.
- `Frame` / `Card` — a stack frame or code frame: radius token, soft shadow,
  mono text, gains elevation + accent ring when active.
- `Chip` — a small value/task token (a queued callback, a variable binding).
- `Connector` — a thin line/arrow between elements (references, prototype
  links, import/export bindings). A small absolutely-positioned SVG overlay or
  CSS pseudo-elements inside the HTML scene.
- `CodeLine` — a source line with an optional gutter number and highlight
  state.

### Motion vocabulary (refined and calm)

- Entrances: staggered, `power3.out`, ~0.35-0.5s, 8-12px upward drift + fade,
  stagger ~0.06-0.09s.
- Travel: `power2.inOut`, ~0.5-0.7s, with a subtle settle (scale 0.98 -> 1),
  no bounce.
- Active emphasis: accent ring + soft box-shadow glow easing in over ~0.3s,
  very subtle scale to ~1.03, plus an optional faint live pulse (opacity
  0.85<->1, ~1.5s sine). Only one active at a time.
- State change (pending -> fulfilled, TDZ clearing): cross-fade + color
  transition over ~0.3-0.4s.
- Choreography: deliberate 0.2-0.4s holds between beats so the sequence reads
  as steps, not a blur. This is the main fix for the "too fast / unpolished"
  feel; playback still defaults to 0.5x via `ConceptStage`.
- Reduced motion: unchanged contract — render a static, fully labeled
  end-state; `ConceptStage` hides the transport for these users.

### Signature: the "execution focus"

A single accent treatment (ring + soft glow + faint pulse) representing where
the runtime's attention is right now, gliding from element to element. It is
the one memorable device shared by all 29 visuals, and it encodes a true fact:
JavaScript runs one thing at a time. It replaces today's scattered, emphasis-
less reveals with a coherent focal point.

## Constraints (unchanged from the feature)

- Only `gsap` + `@gsap/react`. Colors from `--color-*` tokens, no hard-coded
  hex. No em dashes or corporate jargon. `npm run test` and `npm run build`
  stay green. Every visual keeps the `ConceptVisualProps` contract: build a
  paused timeline, call `register(tl)`, branch on `gsap.matchMedia()` for
  reduced motion.
- The `<ConceptStage>` harness (controls, speed, reduced-motion, autoplay)
  does not change; only the visual scenes and a new shared kit do.

## Plan of attack

1. Build one flagship (the event loop) in this style as the taste proof; review
   in the browser.
2. On approval, extract the reusable kit (primitives + motion helpers +
   easing/timing constants) from the flagship.
3. Rebuild the remaining flagships (closures, scope chain, prototype chain).
4. Roll the kit across the other ~25 visuals via a plan + subagent execution,
   one topic-group per task, each verified by build + browser smoke.
