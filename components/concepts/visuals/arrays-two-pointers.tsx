"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";
import { Stage, Panel, Chip, Eyebrow, enter, exit, pop, focusOn, focusOff, travel } from "./kit";

// A sorted row of value chips with left/right pointer markers converging from
// either end. Each step compares the pair the pointers touch, moves whichever
// pointer is on the wrong side of the target, and ends with both pointers
// lighting the pair whose sum matches the target.
export function ArraysTwoPointersVisual({ register }: ConceptVisualProps) {
  const scope = useRef<HTMLDivElement>(null);
  const values = [1, 2, 5, 7, 9, 10];
  const chipIds = values.map((_, i) => `#tp-chip-${i}`);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      gsap.set(chipIds, { opacity: 0, y: 12 });
      gsap.set(["#tp-ptr-left", "#tp-ptr-right"], { opacity: 0, scale: 0.8 });
      gsap.set(["#tp-line-1", "#tp-line-2", "#tp-line-3", "#tp-line-4"], { opacity: 0 });
      gsap.set("#tp-out", { opacity: 0, scale: 0.8 });
      gsap.set(".glow", { opacity: 0 });

      if (animate) {
        enter(tl, chipIds.join(", "));
        pop(tl, "#tp-ptr-left", "+=0.2");
        pop(tl, "#tp-ptr-right", "<");

        // 1 + 10 = 11, too high: move right inward
        focusOn(tl, "#tp-chip-0", "+=0.15");
        focusOn(tl, "#tp-chip-5", "<");
        enter(tl, "#tp-line-1", "+=0.1");
        exit(tl, "#tp-line-1", "+=0.55");
        focusOff(tl, "#tp-chip-5", "-=0.15");
        travel(tl, "#tp-ptr-right", { x: -64 }, "<");
        focusOn(tl, "#tp-chip-4", "+=0.05");
        enter(tl, "#tp-line-2", "+=0.1");

        // 1 + 9 = 10, still too high: move right inward again
        exit(tl, "#tp-line-2", "+=0.55");
        focusOff(tl, "#tp-chip-4", "-=0.15");
        travel(tl, "#tp-ptr-right", { x: -128 }, "<");
        focusOn(tl, "#tp-chip-3", "+=0.05");
        enter(tl, "#tp-line-3", "+=0.1");

        // 1 + 7 = 8, too low: move left inward
        exit(tl, "#tp-line-3", "+=0.55");
        focusOff(tl, "#tp-chip-0", "-=0.15");
        travel(tl, "#tp-ptr-left", { x: 64 }, "<");
        focusOn(tl, "#tp-chip-1", "+=0.05");
        enter(tl, "#tp-line-4", "+=0.1");
        pop(tl, "#tp-out", "+=0.15");
      } else {
        tl.set(chipIds, { opacity: 1, y: 0 })
          .set("#tp-ptr-left", { opacity: 1, scale: 1, x: 64 })
          .set("#tp-ptr-right", { opacity: 1, scale: 1, x: -128 })
          .set(["#tp-line-1", "#tp-line-2", "#tp-line-3"], { opacity: 0 })
          .set("#tp-line-4", { opacity: 1 })
          .set("#tp-chip-1 .glow", { opacity: 1 })
          .set("#tp-chip-1", { scale: 1.03 })
          .set("#tp-chip-3 .glow", { opacity: 1 })
          .set("#tp-chip-3", { scale: 1.03 })
          .set("#tp-out", { opacity: 1, scale: 1 });
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
      height={210}
      label="A sorted row of six values: 1, 2, 5, 7, 9, 10. A left pointer starts at the first value and a right pointer at the last. Each step compares the pointed-at pair against a target of 9, moving right inward when the sum is too high and left inward when it is too low: 1 plus 10 is too high, 1 plus 9 is too high, 1 plus 7 is too low, then 2 plus 7 equals 9, the target, and both pointers light the matching pair."
    >
      <Panel label="Array" style={{ left: 0, top: 0, width: 400, height: 100 }} />
      {values.map((v, i) => (
        <Chip key={i} id={`tp-chip-${i}`} style={{ left: 16 + i * 64, top: 40, width: 44, height: 36 }}>
          {v}
        </Chip>
      ))}
      <Eyebrow id="tp-ptr-left" style={{ left: 16 + 22 - 6, top: 82 }} className="text-[var(--color-primary)]">
        L
      </Eyebrow>
      <Eyebrow id="tp-ptr-right" style={{ left: 336 + 22 - 6, top: 82 }} className="text-[var(--color-primary)]">
        R
      </Eyebrow>

      <Eyebrow style={{ left: 16, top: 112 }}>Target: 9</Eyebrow>

      <div className="absolute font-mono text-[12px] text-foreground" style={{ left: 16, top: 136 }}>
        <span id="tp-line-1">1 + 10 = 11, too high</span>
        <span id="tp-line-2" className="absolute left-0 top-0">1 + 9 = 10, too high</span>
        <span id="tp-line-3" className="absolute left-0 top-0">1 + 7 = 8, too low</span>
        <span id="tp-line-4" className="absolute left-0 top-0">2 + 7 = 9, found</span>
      </div>

      <div className="absolute flex items-center gap-2" style={{ left: 16, top: 166 }}>
        <Eyebrow>Pair sum</Eyebrow>
        <Chip id="tp-out" className="h-6 w-8 px-0">9</Chip>
      </div>
    </Stage>
  );
}
