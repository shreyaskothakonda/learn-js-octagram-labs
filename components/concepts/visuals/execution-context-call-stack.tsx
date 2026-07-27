"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";

const FRAME_X = 90;
const FRAME_W = 160;
const FRAME_H = 38;
const GAP = 6;
const Y_GLOBAL = 182;
const Y_FIRST = Y_GLOBAL - GAP - FRAME_H;
const Y_SECOND = Y_FIRST - GAP - FRAME_H;
const Y_THIRD = Y_SECOND - GAP - FRAME_H;

export function ExecutionContextCallStackVisual({ register }: ConceptVisualProps) {
  const scope = useRef<SVGSVGElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      // Scene: frames push onto a vertical call stack as first(), second(), and
      // third() are called; a marker highlights whichever frame is currently
      // running. third() returns and pops off, leaving second() highlighted.
      gsap.set("#frame-global", { opacity: 1 });
      gsap.set(["#frame-first", "#frame-second", "#frame-third"], { opacity: 0 });
      gsap.set("#marker", { opacity: 0, attr: { x: FRAME_X - 2, width: FRAME_W + 4, height: FRAME_H + 4, y: Y_GLOBAL - 2 } });

      if (animate) {
        tl.to("#marker", { opacity: 1, duration: 0.3 })
          .to("#frame-first", { opacity: 1, duration: 0.3 }, "+=0.3")
          .to("#marker", { attr: { y: Y_FIRST - 2 }, duration: 0.4, ease: "power2.inOut" }, "<")
          .to("#frame-second", { opacity: 1, duration: 0.3 }, "+=0.3")
          .to("#marker", { attr: { y: Y_SECOND - 2 }, duration: 0.4, ease: "power2.inOut" }, "<")
          .to("#frame-third", { opacity: 1, duration: 0.3 }, "+=0.3")
          .to("#marker", { attr: { y: Y_THIRD - 2 }, duration: 0.4, ease: "power2.inOut" }, "<")
          .to("#frame-third", { opacity: 0, duration: 0.3 }, "+=0.6")
          .to("#marker", { attr: { y: Y_SECOND - 2 }, duration: 0.4, ease: "power2.inOut" }, "<");
      } else {
        // reduced motion: jump to labeled end-state (third popped, second running)
        tl.set(["#frame-first", "#frame-second"], { opacity: 1 })
          .set("#frame-third", { opacity: 0 })
          .set("#marker", { opacity: 1, attr: { y: Y_SECOND - 2 } });
      }
      register(tl);
      return tl;
    };
    mm.add("(prefers-reduced-motion: reduce)", () => { build(false); });
    mm.add("(prefers-reduced-motion: no-preference)", () => { build(true); });
    return () => mm.revert();
  }, { scope });

  const frame = (id: string, y: number, label: string) => (
    <g id={id}>
      <rect x={FRAME_X} y={y} width={FRAME_W} height={FRAME_H} rx="6"
        className="fill-[var(--color-muted)] stroke-[var(--color-border)]" />
      <text x={FRAME_X + 14} y={y + 24} className="fill-[var(--color-foreground)] text-[11px]">{label}</text>
    </g>
  );

  return (
    <svg ref={scope} viewBox="0 0 360 240" className="w-full max-w-md" role="img"
      aria-label="Frames for first, second, and third push onto a vertical call stack above the global frame; third then returns and pops off, leaving second as the highlighted, currently-running frame">
      {frame("frame-global", Y_GLOBAL, "global")}
      {frame("frame-first", Y_FIRST, "first()")}
      {frame("frame-second", Y_SECOND, "second()")}
      {frame("frame-third", Y_THIRD, "third()")}
      <rect id="marker" x={FRAME_X - 2} y={Y_GLOBAL - 2} width={FRAME_W + 4} height={FRAME_H + 4} rx="8"
        className="fill-none stroke-[var(--color-primary)]" strokeWidth="3" opacity="0" />
    </svg>
  );
}
