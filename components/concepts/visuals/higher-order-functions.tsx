"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";
import { Stage, Panel, Frame, Chip, Eyebrow, CodeLine, enter, pop, focusOn, focusOff, travel } from "./kit";

// Two beats. Top: process(4, double) takes the double function in as an
// argument, calls it back, and produces a result. Bottom: multiplyBy(3)
// returns a brand new function instead, which is called later on its own.
export function HigherOrderFunctionsVisual({ register }: ConceptVisualProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      gsap.set(["#beat1-label", "#beat1-code", "#process-panel"], { opacity: 0, y: 12 });
      gsap.set("#double-chip", { opacity: 0, scale: 0.8 });
      gsap.set("#callback-note", { opacity: 0, y: 12 });
      gsap.set("#result-chip-1", { opacity: 0, scale: 0.8 });

      gsap.set(["#beat2-label", "#beat2-code", "#factory-panel"], { opacity: 0, y: 12 });
      gsap.set("#returned-fn", { opacity: 0, y: 12 });
      gsap.set(["#callsite-panel", "#invoke-code"], { opacity: 0, y: 12 });
      gsap.set("#result-chip-2", { opacity: 0, scale: 0.8 });
      gsap.set(".glow", { opacity: 0 });

      if (animate) {
        // beat 1: double is passed in and called back
        enter(tl, "#beat1-label");
        enter(tl, ["#beat1-code", "#process-panel"], "+=0.1", 0.08);
        pop(tl, "#double-chip", "+=0.2");
        travel(tl, "#double-chip", { x: 130, y: 0 }, "+=0.15");
        focusOn(tl, "#process-panel", "+=0.15");
        enter(tl, "#callback-note", "<");
        pop(tl, "#result-chip-1", "+=0.2");
        focusOff(tl, "#process-panel", "+=0.4");

        // beat 2: multiplyBy(3) returns a new function, called later
        enter(tl, "#beat2-label", "+=0.5");
        enter(tl, ["#beat2-code", "#factory-panel"], "+=0.1", 0.08);
        enter(tl, "#returned-fn", "+=0.2");
        enter(tl, "#callsite-panel", "+=0.15");
        travel(tl, "#returned-fn", { x: 208, y: 0 }, "+=0.15");
        enter(tl, "#invoke-code", "+=0.2");
        focusOn(tl, "#returned-fn", "+=0.15");
        pop(tl, "#result-chip-2", "+=0.2");
        focusOff(tl, "#returned-fn", "+=0.4");
      } else {
        // reduced motion: jump to labeled end-state (both beats fully resolved)
        tl.set(["#beat1-label", "#beat1-code", "#process-panel", "#callback-note"], { opacity: 1, y: 0 })
          .set("#double-chip", { opacity: 1, scale: 1, x: 130 })
          .set("#result-chip-1", { opacity: 1, scale: 1 })
          .set(["#beat2-label", "#beat2-code", "#factory-panel", "#callsite-panel", "#invoke-code"], { opacity: 1, y: 0 })
          .set("#returned-fn", { opacity: 1, y: 0, x: 208 })
          .set("#result-chip-2", { opacity: 1, scale: 1 });
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
      height={320}
      label="process(4, double) takes the double function in as an argument and calls it back, producing 8. Below, multiplyBy(3) returns a brand new function instead of a number, and that returned function is called later on its own as triple(5), producing 15"
    >
      <Eyebrow id="beat1-label" className="absolute" style={{ left: 8, top: 0 }}>
        Passed in, called back
      </Eyebrow>
      <CodeLine id="beat1-code" className="whitespace-nowrap" style={{ left: 8, top: 20, width: 220 }}>
        process(4, double)
      </CodeLine>
      <Panel id="process-panel" label="process()" style={{ left: 130, top: 44, width: 260, height: 84 }} />
      <Chip id="double-chip" className="absolute z-10" style={{ left: 4, top: 64 }}>double</Chip>
      <Eyebrow id="callback-note" className="absolute" style={{ left: 140, top: 102 }}>
        op(4) called back
      </Eyebrow>
      <Chip id="result-chip-1" className="absolute" style={{ left: 340, top: 64 }}>8</Chip>

      <div className="absolute border-t border-border" style={{ left: 0, top: 138, width: 400 }} />

      <Eyebrow id="beat2-label" className="absolute" style={{ left: 8, top: 150 }}>
        Returned as a new function
      </Eyebrow>
      <CodeLine id="beat2-code" className="whitespace-nowrap" style={{ left: 8, top: 170, width: 260 }}>
        const triple = multiplyBy(3)
      </CodeLine>
      <Panel id="factory-panel" label="multiplyBy()" style={{ left: 0, top: 194, width: 190, height: 80 }} />
      <Frame id="returned-fn" style={{ left: 12, top: 220, width: 166, height: 40 }}>n =&gt; n * 3</Frame>
      <Panel id="callsite-panel" label="Call site" style={{ left: 220, top: 194, width: 180, height: 80 }} />
      <CodeLine id="invoke-code" className="whitespace-nowrap" style={{ left: 232, top: 288, width: 90 }}>
        triple(5)
      </CodeLine>
      <Chip id="result-chip-2" className="absolute" style={{ left: 340, top: 284 }}>15</Chip>
    </Stage>
  );
}
