"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";
import { Stage, Panel, Frame, Chip, Eyebrow, enter, exit, pop, focusOn, focusOff, travel } from "./kit";

// A memo table fills in fib(0) through fib(6) left to right, each cell
// briefly focused while it is "computed" and then popping in its value. A
// later call for fib(4) travels down to the table instead of recursing: it
// finds the cell already filled, lights it up as a cache hit, and reuses the
// value with no recomputation.
export function DynamicProgrammingVisual({ register }: ConceptVisualProps) {
  const scope = useRef<HTMLDivElement>(null);
  const fib = [0, 1, 1, 2, 3, 5, 8];
  const cellIds = fib.map((_, i) => `#dp-cell-${i}`);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      gsap.set(cellIds, { opacity: 0, scale: 0.8 });
      gsap.set("#dp-query", { opacity: 0, y: 12 });
      gsap.set("#dp-hit-text", { opacity: 0 });
      gsap.set(".glow", { opacity: 0 });

      if (animate) {
        fib.forEach((_, i) => {
          focusOn(tl, `#dp-cell-${i}`, i === 0 ? "+=0.2" : "+=0.15");
          pop(tl, `#dp-cell-${i}`, "<");
          focusOff(tl, `#dp-cell-${i}`, "+=0.12");
        });

        enter(tl, "#dp-query", "+=0.35");
        travel(tl, "#dp-query", { y: 128 }, "+=0.2");
        focusOn(tl, "#dp-cell-4", "<");
        pop(tl, "#dp-hit-text", "+=0.15");
        exit(tl, "#dp-query", "+=0.4");
      } else {
        tl.set(cellIds, { opacity: 1, scale: 1 })
          .set("#dp-query", { opacity: 0 })
          .set("#dp-hit-text", { opacity: 1 })
          .set("#dp-cell-4 .glow", { opacity: 1 })
          .set("#dp-cell-4", { scale: 1.03 });
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
      height={240}
      label="A memo table for fib of 0 through 6 fills in left to right, values 0, 1, 1, 2, 3, 5, 8, each cell briefly lit while it is computed. A later query for fib of 4 travels down to the table instead of recursing, finds the cell already filled, and lights it up as a cache hit that reuses the value with no recomputation."
    >
      <Frame id="dp-query" className="absolute justify-center" style={{ left: 193, top: 16, width: 70, height: 34 }}>
        fib(4)
      </Frame>

      <Panel label="Memo table" style={{ left: 0, top: 96, width: 400, height: 110 }} />
      {fib.map((_, i) => (
        <Eyebrow key={i} className="absolute" style={{ left: 16 + i * 48, top: 124 }}>
          n={i}
        </Eyebrow>
      ))}
      {fib.map((v, i) => (
        <Chip key={i} id={`dp-cell-${i}`} className="absolute" style={{ left: 16 + i * 48, top: 144, width: 40, height: 36 }}>
          {v}
        </Chip>
      ))}

      <Eyebrow id="dp-hit-text" className="absolute text-[var(--color-primary)]" style={{ left: 16, top: 216 }}>
        cache hit: fib(4) reused, no recomputation
      </Eyebrow>
    </Stage>
  );
}
