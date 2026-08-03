"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";
import { Stage, Frame, enter, exit, focusOn, focusOff } from "./kit";

// From start, the search recurses into "pick A" and hits a dead end. It then
// backtracks: the dead end and the choice that led to it are undone, and the
// search returns to start to try the other branch, "pick B", which leads to
// a solution.
export function RecursionAndBacktrackingVisual({ register }: ConceptVisualProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      gsap.set(["#rb-root", "#rb-left", "#rb-right", "#rb-dead", "#rb-good"], { opacity: 0, y: 12 });
      gsap.set(
        ["#rb-edge-root-left", "#rb-edge-root-right", "#rb-edge-left-dead", "#rb-edge-right-good"],
        { opacity: 0 },
      );
      gsap.set(".glow", { opacity: 0 });

      if (animate) {
        enter(tl, "#rb-root");
        focusOn(tl, "#rb-root", "+=0.2");

        // descend into "pick A"
        tl.to("#rb-edge-root-left", { opacity: 1, duration: 0.3 }, "+=0.2");
        enter(tl, "#rb-left", "<");
        focusOff(tl, "#rb-root", "<");
        focusOn(tl, "#rb-left", "+=0.1");

        // dead end
        tl.to("#rb-edge-left-dead", { opacity: 1, duration: 0.3 }, "+=0.2");
        enter(tl, "#rb-dead", "<");
        focusOff(tl, "#rb-left", "<");
        focusOn(tl, "#rb-dead", "+=0.1");

        // backtrack: undo the dead end and the choice that led to it
        focusOff(tl, "#rb-dead", "+=0.4");
        exit(tl, "#rb-dead", "<");
        tl.to("#rb-edge-left-dead", { opacity: 0, duration: 0.2 }, "<");
        exit(tl, "#rb-left", "+=0.1");
        tl.to("#rb-edge-root-left", { opacity: 0, duration: 0.2 }, "<");
        focusOn(tl, "#rb-root", "+=0.1");

        // descend into "pick B"
        tl.to("#rb-edge-root-right", { opacity: 1, duration: 0.3 }, "+=0.2");
        enter(tl, "#rb-right", "<");
        focusOff(tl, "#rb-root", "<");
        focusOn(tl, "#rb-right", "+=0.1");

        // solution found
        tl.to("#rb-edge-right-good", { opacity: 1, duration: 0.3 }, "+=0.2");
        enter(tl, "#rb-good", "<");
        focusOff(tl, "#rb-right", "<");
        focusOn(tl, "#rb-good", "+=0.1");
      } else {
        tl.set(["#rb-root", "#rb-right", "#rb-good"], { opacity: 1, y: 0 })
          .set(["#rb-left", "#rb-dead"], { opacity: 0 })
          .set(["#rb-edge-root-right", "#rb-edge-right-good"], { opacity: 1 })
          .set(["#rb-edge-root-left", "#rb-edge-left-dead"], { opacity: 0 })
          .set("#rb-good .glow", { opacity: 1 })
          .set("#rb-good", { scale: 1.03 });
      }
      register(tl);
      return tl;
    };
    mm.add("(prefers-reduced-motion: reduce)", () => { build(false); });
    mm.add("(prefers-reduced-motion: no-preference)", () => { build(true); });
    return () => mm.revert();
  }, { scope });

  return (
    <Stage
      refEl={scope}
      height={260}
      label="From start, the search recurses into pick A and hits a dead end, tinted as a failure. It then backtracks: the dead end and the pick A choice are undone, and the search returns to start to try pick B, which leads to a labeled solution that stays lit as the final answer."
    >
      <svg className="pointer-events-none absolute left-0 top-0" width={400} height={260}>
        <line id="rb-edge-root-left" x1={210} y1={56} x2={110} y2={100} className="stroke-[var(--color-border)]" strokeWidth={2} />
        <line id="rb-edge-root-right" x1={210} y1={56} x2={290} y2={100} className="stroke-[var(--color-border)]" strokeWidth={2} />
        <line id="rb-edge-left-dead" x1={110} y1={140} x2={115} y2={184} className="stroke-[var(--color-border)]" strokeWidth={2} />
        <line id="rb-edge-right-good" x1={290} y1={140} x2={295} y2={184} className="stroke-[var(--color-border)]" strokeWidth={2} />
      </svg>

      <Frame id="rb-root" style={{ left: 170, top: 16, width: 80, height: 40 }}>start</Frame>
      <Frame id="rb-left" style={{ left: 70, top: 100, width: 80, height: 40 }}>pick A</Frame>
      <Frame id="rb-right" style={{ left: 250, top: 100, width: 80, height: 40 }}>pick B</Frame>
      <Frame id="rb-dead" className="!border-[var(--color-destructive)] !text-[var(--color-destructive)]" style={{ left: 65, top: 184, width: 90, height: 40 }}>
        dead end
      </Frame>
      <Frame id="rb-good" style={{ left: 240, top: 184, width: 110, height: 40 }}>solution!</Frame>
    </Stage>
  );
}
