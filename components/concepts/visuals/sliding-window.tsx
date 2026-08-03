"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";
import { Stage, Chip, Eyebrow, enter, exit, pop, focusOn, focusOff, travel } from "./kit";

// A window of size 3 slides across six values, 2, 1, 5, 1, 3, 2, one step at
// a time instead of re-scanning from the start. Each slide drops the value
// that fell out of the window and adds the value that entered, and the
// running sum updates from that difference: 8, then 7, then 9 (a new best),
// then 6. The best value only changes when a new sum beats it.
export function SlidingWindowVisual({ register }: ConceptVisualProps) {
  const scope = useRef<HTMLDivElement>(null);
  const values = [2, 1, 5, 1, 3, 2];
  const chipIds = values.map((_, i) => `#sw-chip-${i}`);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      gsap.set(chipIds, { opacity: 0, y: 12 });
      gsap.set("#sw-window", { opacity: 0, scale: 0.9 });
      gsap.set(["#sw-sum-0", "#sw-sum-1", "#sw-sum-2", "#sw-sum-3"], { opacity: 0 });
      gsap.set(["#sw-best-a", "#sw-best-b"], { opacity: 0, scale: 0.8 });
      gsap.set(".glow", { opacity: 0 });

      if (animate) {
        enter(tl, chipIds.join(", "));
        pop(tl, "#sw-window", "+=0.2");
        tl.to("#sw-sum-0", { opacity: 1, duration: 0.3 }, "<");
        pop(tl, "#sw-best-a", "<");

        // window [1..3]: sum drops to 7, not a new best
        travel(tl, "#sw-window", { x: 56 }, "+=0.5");
        tl.to("#sw-sum-0", { opacity: 0, duration: 0.2 }, "<");
        tl.to("#sw-sum-1", { opacity: 1, duration: 0.2 }, "<");

        // window [2..4]: sum rises to 9, a new best
        travel(tl, "#sw-window", { x: 112 }, "+=0.5");
        tl.to("#sw-sum-1", { opacity: 0, duration: 0.2 }, "<");
        tl.to("#sw-sum-2", { opacity: 1, duration: 0.2 }, "<");
        focusOn(tl, "#sw-window", "+=0.1");
        exit(tl, "#sw-best-a", "+=0.2");
        pop(tl, "#sw-best-b", "<");
        focusOff(tl, "#sw-window", "+=0.3");

        // window [3..5]: sum falls to 6, best stays 9
        travel(tl, "#sw-window", { x: 168 }, "+=0.4");
        tl.to("#sw-sum-2", { opacity: 0, duration: 0.2 }, "<");
        tl.to("#sw-sum-3", { opacity: 1, duration: 0.2 }, "<");
        focusOn(tl, "#sw-best-b", "+=0.1");
      } else {
        tl.set(chipIds, { opacity: 1, y: 0 })
          .set("#sw-window", { opacity: 1, scale: 1, x: 168 })
          .set("#sw-sum-3", { opacity: 1 })
          .set("#sw-best-a", { opacity: 0 })
          .set("#sw-best-b", { opacity: 1, scale: 1 })
          .set("#sw-best-b .glow", { opacity: 1 })
          .set("#sw-best-b", { scale: 1.03 });
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
      height={220}
      label="Six values: 2, 1, 5, 1, 3, 2. A window of size 3 slides one step at a time: it starts over 2, 1, 5 with sum 8, slides to 1, 5, 1 with sum 7, slides to 5, 1, 3 with sum 9, a new best, then slides to 1, 3, 2 with sum 6. The best value ends at 9, lit as the answer."
    >
      <div
        id="sw-window"
        className="absolute rounded-lg border-2 border-[var(--color-primary)] bg-[var(--color-primary)]/10"
        style={{ left: 10, top: 34, width: 168, height: 48 }}
      />
      {values.map((v, i) => (
        <Chip key={i} id={`sw-chip-${i}`} className="absolute" style={{ left: 16 + i * 56, top: 40, width: 44, height: 36 }}>
          {v}
        </Chip>
      ))}

      <Eyebrow className="absolute" style={{ left: 16, top: 100 }}>Window sum</Eyebrow>
      <div className="absolute" style={{ left: 16, top: 120 }}>
        <Chip id="sw-sum-0" className="absolute h-8 w-16 px-0">8</Chip>
        <Chip id="sw-sum-1" className="absolute h-8 w-16 px-0">7</Chip>
        <Chip id="sw-sum-2" className="absolute h-8 w-16 px-0">9</Chip>
        <Chip id="sw-sum-3" className="absolute h-8 w-16 px-0">6</Chip>
      </div>

      <Eyebrow className="absolute" style={{ left: 16, top: 168 }}>Best so far</Eyebrow>
      <div className="absolute" style={{ left: 16, top: 188 }}>
        <Chip id="sw-best-a" className="absolute h-8 w-16 px-0">8</Chip>
        <Chip id="sw-best-b" className="absolute h-8 w-16 px-0">9</Chip>
      </div>
    </Stage>
  );
}
