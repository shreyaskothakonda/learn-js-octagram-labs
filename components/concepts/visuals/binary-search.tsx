"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";
import { Stage, Panel, Chip, Eyebrow, enter, pop, focusOn, focusOff, travel } from "./kit";

// A sorted row of eight values with lo, mid, and hi markers searching for 38.
// mid starts at index 3 (12): too small, so the left half (indexes 0-3) is
// discarded and lo jumps past it. mid moves to index 5 (23): still too
// small, so indexes 4-5 are discarded too and lo jumps again. mid lands on
// index 6, which is 38, the target, and lights up as found.
export function BinarySearchVisual({ register }: ConceptVisualProps) {
  const scope = useRef<HTMLDivElement>(null);
  const values = [2, 5, 8, 12, 16, 23, 38, 45];
  const chipIds = values.map((_, i) => `#bs-chip-${i}`);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      gsap.set(chipIds, { opacity: 0, y: 12 });
      gsap.set(["#bs-lo", "#bs-mid", "#bs-hi"], { opacity: 0, scale: 0.8 });
      gsap.set(["#bs-line-1", "#bs-line-2", "#bs-line-3"], { opacity: 0 });
      gsap.set(".glow", { opacity: 0 });

      if (animate) {
        enter(tl, chipIds.join(", "));
        pop(tl, "#bs-lo", "+=0.2");
        pop(tl, "#bs-mid", "<");
        pop(tl, "#bs-hi", "<");

        // mid = 3 (12), target 38 is greater: discard the left half
        focusOn(tl, "#bs-chip-3", "+=0.15");
        tl.to("#bs-line-1", { opacity: 1, duration: 0.2 }, "<");
        focusOff(tl, "#bs-chip-3", "+=0.4");
        tl.to("#bs-chip-0, #bs-chip-1, #bs-chip-2, #bs-chip-3", { opacity: 0.35, duration: 0.3 }, "<");
        tl.to("#bs-line-1", { opacity: 0, duration: 0.2 }, "<");
        travel(tl, "#bs-lo", { x: 184 }, "<");
        travel(tl, "#bs-mid", { x: 92 }, "<");

        // mid = 5 (23), target 38 is still greater: discard again
        focusOn(tl, "#bs-chip-5", "+=0.2");
        tl.to("#bs-line-2", { opacity: 1, duration: 0.2 }, "<");
        focusOff(tl, "#bs-chip-5", "+=0.4");
        tl.to("#bs-chip-4, #bs-chip-5", { opacity: 0.35, duration: 0.3 }, "<");
        tl.to("#bs-line-2", { opacity: 0, duration: 0.2 }, "<");
        travel(tl, "#bs-lo", { x: 276 }, "<");
        travel(tl, "#bs-mid", { x: 138 }, "<");

        // mid = 6 (38): found
        focusOn(tl, "#bs-chip-6", "+=0.2");
        tl.to("#bs-line-3", { opacity: 1, duration: 0.2 }, "<");
      } else {
        tl.set(chipIds, { opacity: 1, y: 0 })
          .set("#bs-chip-0, #bs-chip-1, #bs-chip-2, #bs-chip-3, #bs-chip-4, #bs-chip-5", { opacity: 0.35 })
          .set("#bs-lo", { opacity: 1, scale: 1, x: 276 })
          .set("#bs-mid", { opacity: 1, scale: 1, x: 138 })
          .set("#bs-hi", { opacity: 1, scale: 1 })
          .set("#bs-line-3", { opacity: 1 })
          .set("#bs-chip-6 .glow", { opacity: 1 })
          .set("#bs-chip-6", { scale: 1.03 });
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
      height={230}
      label="A sorted row of eight values: 2, 5, 8, 12, 16, 23, 38, 45. Searching for 38, mid starts at index 3, the value 12: too small, so the left half up to and including mid is discarded and dimmed, and lo jumps past it. mid moves to index 5, the value 23: still too small, so that half is discarded too. mid then lands on index 6, the value 38, which matches the target and lights up as found."
    >
      <Panel label="Sorted array" style={{ left: 0, top: 0, width: 400, height: 100 }} />
      {values.map((v, i) => (
        <Chip key={i} id={`bs-chip-${i}`} className="absolute" style={{ left: 16 + i * 46, top: 40, width: 40, height: 36 }}>
          {v}
        </Chip>
      ))}
      <Eyebrow id="bs-lo" className="absolute text-[var(--color-primary)]" style={{ left: 16 + 20 - 8, top: 96 }}>lo</Eyebrow>
      <Eyebrow id="bs-mid" className="absolute text-[var(--color-primary)]" style={{ left: 154 + 20 - 10, top: 82 }}>mid</Eyebrow>
      <Eyebrow id="bs-hi" className="absolute text-[var(--color-primary)]" style={{ left: 338 + 20 - 8, top: 82 }}>hi</Eyebrow>

      <Eyebrow className="absolute" style={{ left: 16, top: 120 }}>Target: 38</Eyebrow>

      <div className="absolute font-mono text-[12px] text-foreground" style={{ left: 16, top: 144 }}>
        <span id="bs-line-1">mid = 12, too small, search right half</span>
        <span id="bs-line-2" className="absolute left-0 top-0">mid = 23, too small, search right half</span>
        <span id="bs-line-3" className="absolute left-0 top-0">mid = 38, found</span>
      </div>
    </Stage>
  );
}
