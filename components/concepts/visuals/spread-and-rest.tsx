"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";
import { Stage, Panel, Chip, Eyebrow, CodeLine, enter, pop, travel } from "./kit";

// Top half (spread): two source arrays, a and b, explode their chips into one
// new combined array. Bottom half (rest, the mirror motion): call arguments
// gather, the first one peels off into its own slot, and the remaining three
// collect into a rest array.
export function SpreadAndRestVisual({ register }: ConceptVisualProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      gsap.set(["#spread-label", "#a-label", "#b-label"], { opacity: 0, y: 12 });
      gsap.set(["#chip-a1", "#chip-a2", "#chip-b1", "#chip-b2"], { opacity: 0, scale: 0.8 });
      gsap.set("#combined-panel", { opacity: 0, y: 12 });
      gsap.set("#spread-code", { opacity: 0, y: 12 });

      gsap.set(["#rest-label", "#args-label"], { opacity: 0, y: 12 });
      gsap.set(["#chip-arg0", "#chip-arg1", "#chip-arg2", "#chip-arg3"], { opacity: 0, scale: 0.8 });
      gsap.set(["#first-panel", "#rest-panel"], { opacity: 0, y: 12 });
      gsap.set("#rest-code", { opacity: 0, y: 12 });
      gsap.set(".glow", { opacity: 0 });

      if (animate) {
        enter(tl, ["#spread-label", "#a-label", "#b-label"], undefined, 0.08);
        pop(tl, ["#chip-a1", "#chip-a2", "#chip-b1", "#chip-b2"], "+=0.15");
        enter(tl, "#combined-panel", "+=0.2");
        travel(tl, "#chip-a1", { x: 12, y: 70 }, "+=0.15");
        travel(tl, "#chip-a2", { x: 16, y: 70 }, "+=0.1");
        travel(tl, "#chip-b1", { x: -64, y: 70 }, "+=0.1");
        travel(tl, "#chip-b2", { x: -60, y: 70 }, "+=0.1");
        enter(tl, "#spread-code", "+=0.25");

        enter(tl, ["#rest-label", "#args-label"], "+=0.4", 0.1);
        pop(tl, ["#chip-arg0", "#chip-arg1", "#chip-arg2", "#chip-arg3"], "+=0.15");
        enter(tl, ["#first-panel", "#rest-panel"], "+=0.2", 0.1);
        travel(tl, "#chip-arg0", { x: 20, y: 66 }, "+=0.15");
        travel(tl, "#chip-arg1", { x: 68, y: 66 }, "+=0.1");
        travel(tl, "#chip-arg2", { x: 68, y: 66 }, "+=0.1");
        travel(tl, "#chip-arg3", { x: 68, y: 66 }, "+=0.1");
        enter(tl, "#rest-code", "+=0.25");
      } else {
        // reduced motion: jump to labeled end-state (both halves fully collapsed)
        tl.set(["#spread-label", "#a-label", "#b-label"], { opacity: 1, y: 0 })
          .set(["#chip-a1", "#chip-a2", "#chip-b1", "#chip-b2"], { opacity: 1, scale: 1 })
          .set("#chip-a1", { x: 12, y: 70 })
          .set("#chip-a2", { x: 16, y: 70 })
          .set("#chip-b1", { x: -64, y: 70 })
          .set("#chip-b2", { x: -60, y: 70 })
          .set("#combined-panel", { opacity: 1, y: 0 })
          .set("#spread-code", { opacity: 1, y: 0 })
          .set(["#rest-label", "#args-label"], { opacity: 1, y: 0 })
          .set(["#chip-arg0", "#chip-arg1", "#chip-arg2", "#chip-arg3"], { opacity: 1, scale: 1 })
          .set("#chip-arg0", { x: 20, y: 66 })
          .set("#chip-arg1", { x: 68, y: 66 })
          .set("#chip-arg2", { x: 68, y: 66 })
          .set("#chip-arg3", { x: 68, y: 66 })
          .set(["#first-panel", "#rest-panel"], { opacity: 1, y: 0 })
          .set("#rest-code", { opacity: 1, y: 0 });
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
      height={360}
      label="Spread explodes two source arrays, a equals 1, 2 and b equals 3, 4, into one new combined array of 1, 2, 3, 4. Below, the mirror motion: rest gathers the call arguments of sum of 1, 2, 3, 4, peeling the first argument into its own slot and collecting the remaining three into a rest array, ending with first equals 1, rest equals 2, 3, 4"
    >
      <Eyebrow id="spread-label" className="absolute" style={{ left: 8, top: 4 }}>Spread</Eyebrow>
      <Eyebrow id="a-label" className="absolute" style={{ left: 16, top: 22 }}>a = [1, 2]</Eyebrow>
      <Eyebrow id="b-label" className="absolute" style={{ left: 180, top: 22 }}>b = [3, 4]</Eyebrow>

      <Panel id="combined-panel" label="combined" style={{ left: 20, top: 92, width: 280, height: 52 }} />

      <Chip id="chip-a1" className="absolute z-10" style={{ left: 20, top: 42 }}>1</Chip>
      <Chip id="chip-a2" className="absolute z-10" style={{ left: 60, top: 42 }}>2</Chip>
      <Chip id="chip-b1" className="absolute z-10" style={{ left: 184, top: 42 }}>3</Chip>
      <Chip id="chip-b2" className="absolute z-10" style={{ left: 224, top: 42 }}>4</Chip>

      <CodeLine id="spread-code" className="whitespace-nowrap" style={{ left: 20, top: 160, width: 340 }}>
        const combined = [...a, ...b]; // [1, 2, 3, 4]
      </CodeLine>

      <div className="absolute border-t border-border" style={{ left: 0, top: 190, width: 400 }} />

      <Eyebrow id="rest-label" className="absolute" style={{ left: 8, top: 204 }}>Rest</Eyebrow>
      <Eyebrow id="args-label" className="absolute" style={{ left: 60, top: 204 }}>sum(1, 2, 3, 4)</Eyebrow>

      <Panel id="first-panel" label="first" style={{ left: 20, top: 274, width: 70, height: 44 }} />
      <Panel id="rest-panel" label="rest" style={{ left: 110, top: 274, width: 190, height: 44 }} />

      <Chip id="chip-arg0" className="absolute z-10" style={{ left: 20, top: 224 }}>1</Chip>
      <Chip id="chip-arg1" className="absolute z-10" style={{ left: 60, top: 224 }}>2</Chip>
      <Chip id="chip-arg2" className="absolute z-10" style={{ left: 100, top: 224 }}>3</Chip>
      <Chip id="chip-arg3" className="absolute z-10" style={{ left: 140, top: 224 }}>4</Chip>

      <CodeLine id="rest-code" className="whitespace-nowrap" style={{ left: 20, top: 330, width: 340 }}>
        first = 1, rest = [2, 3, 4]
      </CodeLine>
    </Stage>
  );
}
