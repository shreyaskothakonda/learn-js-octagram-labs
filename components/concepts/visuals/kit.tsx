"use client";
import type { CSSProperties, ReactNode } from "react";
import type { gsap } from "gsap";

// ============================================================================
// Concept-animation kit: the shared "Runtime Instruments" visual + motion
// language. Every concept visual composes these primitives and motion helpers
// so the 29 animations read as one system. Colors come from theme tokens only.
//
// A visual's shape:
//   1. Root <Stage> holds the scope ref and an aria-label describing the
//      end-state; lay panels/frames/chips inside with absolute px positions.
//   2. In useGSAP, build a `paused` timeline: gsap.set initial hidden states,
//      then compose enter/pop/focusOn/travel/focusOff/exit with small position
//      offsets ("+=0.2") for breathing holds. Call register(tl) in both the
//      reduced and no-preference matchMedia branches.
// ============================================================================

export const GLOW =
  "0 0 0 1.5px var(--color-primary), 0 10px 28px -10px var(--color-primary)";

export const EASE = {
  enter: "power3.out",
  travel: "power2.inOut",
  exit: "power2.in",
  focus: "power2.out",
  pop: "back.out(1.6)",
} as const;

export const DUR = {
  enter: 0.45,
  travel: 0.6,
  exit: 0.3,
  focus: 0.3,
  pop: 0.3,
} as const;

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------

/** Fixed-size relative stage. Holds the scope ref and the scene's aria-label. */
export function Stage({
  refEl,
  width = 400,
  height = 320,
  label,
  children,
}: {
  refEl: React.Ref<HTMLDivElement>;
  width?: number;
  height?: number;
  label: string;
  children: ReactNode;
}) {
  return (
    <div ref={refEl} className="relative mx-auto" style={{ width, height }} role="img" aria-label={label}>
      {children}
    </div>
  );
}

/** A labeled region (call stack, queue, scope, module). */
export function Panel({
  id,
  label,
  style,
  className = "",
}: {
  id?: string;
  label: string;
  style?: CSSProperties;
  className?: string;
}) {
  return (
    <div
      id={id}
      className={`absolute rounded-xl border border-border bg-[var(--color-muted)]/30 ${className}`}
      style={style}
    >
      <span className="absolute left-3 top-2 font-sans text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

const FRAME =
  "absolute rounded-lg border border-border bg-card shadow-sm font-mono text-[12px] text-foreground flex items-center px-3";

/** An elevated monospace card (stack frame, code frame, value box). Has a
 *  built-in `.glow` layer so focusOn/focusOff can light it as "executing now". */
export function Frame({
  id,
  style,
  className = "",
  children,
}: {
  id?: string;
  style?: CSSProperties;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div id={id} className={`${FRAME} ${className}`} style={style}>
      <span className="glow pointer-events-none absolute inset-0 rounded-lg" style={{ boxShadow: GLOW }} />
      {children}
    </div>
  );
}

/**
 * True when a style places the element on the stage. Chip and Eyebrow render
 * inline by default so they can sit in a flex row, but a scene that gives them
 * a coordinate means them to be placed absolutely. Without this, left and top
 * are silently ignored and the element flows into the wrong place.
 */
function isPlaced(style?: CSSProperties): boolean {
  if (!style) return false;
  return (
    style.left !== undefined ||
    style.top !== undefined ||
    style.right !== undefined ||
    style.bottom !== undefined
  );
}

/** A small accent token (a queued task, a variable binding, an output value). */
export function Chip({
  id,
  style,
  className = "",
  children,
}: {
  id?: string;
  style?: CSSProperties;
  className?: string;
  children: ReactNode;
}) {
  // A placed chip is absolute, which already anchors the glow layer. An inline
  // chip needs relative for the same reason. They are mutually exclusive: using
  // both lets one position utility override the other in the Tailwind cascade.
  const position = isPlaced(style) || className.includes("absolute") ? "absolute" : "relative";
  return (
    <span
      id={id}
      className={`${position} inline-flex items-center justify-center rounded-md bg-[var(--color-primary)]/10 px-2 py-1 font-mono text-[12px] font-semibold text-[var(--color-primary)] ${className}`}
      style={style}
    >
      {/* Same focus layer Frame carries, so focusOn/focusOff work on a chip too. */}
      <span className="glow pointer-events-none absolute inset-0 rounded-md" style={{ boxShadow: GLOW, opacity: 0 }} />
      {children}
    </span>
  );
}

/** An uppercase micro-label (an eyebrow like OUTPUT, RESULT, STEP). */
export function Eyebrow({
  id,
  children,
  style,
  className = "",
}: {
  id?: string;
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
}) {
  const placed = isPlaced(style) && !className.includes("absolute") ? "absolute " : "";
  return (
    <span
      id={id}
      className={`${placed}font-sans text-[10px] font-medium uppercase tracking-wide text-muted-foreground ${className}`}
      style={style}
    >
      {children}
    </span>
  );
}

/** A source line with an optional gutter number and a focusable `.glow`. */
export function CodeLine({
  id,
  gutter,
  style,
  className = "",
  children,
}: {
  id?: string;
  gutter?: number;
  style?: CSSProperties;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      id={id}
      className={`absolute flex items-center gap-2 rounded px-2 py-1 font-mono text-[12px] text-foreground ${className}`}
      style={style}
    >
      <span className="glow pointer-events-none absolute inset-0 rounded" style={{ boxShadow: GLOW }} />
      {gutter != null && <span className="w-4 shrink-0 text-right text-[10px] text-muted-foreground">{gutter}</span>}
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Motion helpers: each takes the timeline and returns it for chaining.
// `at` is a GSAP position parameter (e.g. "+=0.2" for a breathing hold, "<" to
// start with the previous tween).
// ---------------------------------------------------------------------------

type TL = gsap.core.Timeline;
type Target = gsap.TweenTarget;

/** Staggered fade + upward drift into place. Pair with gsap.set(target,{opacity:0,y:12}). */
export function enter(tl: TL, target: Target, at?: string, stagger = 0.07): TL {
  return tl.to(target, { opacity: 1, y: 0, duration: DUR.enter, ease: EASE.enter, stagger }, at);
}

/** Fade + drift out (leaving the stage / popping off the call stack). */
export function exit(tl: TL, target: Target, at?: string): TL {
  return tl.to(target, { opacity: 0, y: 12, duration: DUR.exit, ease: EASE.exit }, at);
}

/** A chip settling in with a gentle pop. Pair with gsap.set(target,{opacity:0,scale:0.8}). */
export function pop(tl: TL, target: Target, at?: string): TL {
  return tl.to(target, { opacity: 1, scale: 1, duration: DUR.pop, ease: EASE.pop }, at);
}

/** Light the execution focus on `sel` (must contain a `.glow` child). */
export function focusOn(tl: TL, sel: string, at?: string): TL {
  return tl
    .to(`${sel} .glow`, { opacity: 1, duration: DUR.focus, ease: EASE.focus }, at)
    .to(sel, { scale: 1.03, duration: DUR.focus, ease: EASE.focus }, "<");
}

/** Move the execution focus away from `sel`. */
export function focusOff(tl: TL, sel: string, at?: string): TL {
  return tl
    .to(`${sel} .glow`, { opacity: 0, duration: DUR.focus, ease: EASE.focus }, at)
    .to(sel, { scale: 1, duration: DUR.focus, ease: EASE.focus }, "<");
}

/** Deliberate travel to a new offset (a frame moving between panels). */
export function travel(tl: TL, sel: string, to: { x?: number; y?: number }, at?: string): TL {
  return tl.to(sel, { ...to, duration: DUR.travel, ease: EASE.travel }, at);
}
