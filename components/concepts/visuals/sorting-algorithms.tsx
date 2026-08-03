"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";
import { Stage, Panel, Chip, Eyebrow, enter, exit, pop, focusOn, focusOff, travel } from "./kit";

// Top: one pass of a comparison sort (O(n^2)) over [5, 2, 4, 1]. Each
// adjacent pair is focused, compared, and swapped when out of order, so the
// largest value bubbles one step closer to the end. Bottom: a divide and
// conquer merge (O(n log n)) of two already-sorted halves, [1, 4] and [2, 5],
// comparing the fronts of each half and popping the smaller one into the
// merged output row until both halves are consumed.
export function SortingAlgorithmsVisual({ register }: ConceptVisualProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      gsap.set(["#srt-b-5", "#srt-b-2", "#srt-b-4", "#srt-b-1"], { opacity: 0, y: 12 });
      gsap.set(["#srt-line-1", "#srt-line-2", "#srt-line-3"], { opacity: 0 });
      gsap.set(["#srt-l0", "#srt-l1", "#srt-r0", "#srt-r1"], { opacity: 0, y: 12 });
      gsap.set(["#srt-out-0", "#srt-out-1", "#srt-out-2", "#srt-out-3"], { opacity: 0, scale: 0.8 });
      gsap.set(".glow", { opacity: 0 });

      if (animate) {
        // --- one bubble pass: compare each adjacent pair, swap if out of order
        enter(tl, "#srt-b-5, #srt-b-2, #srt-b-4, #srt-b-1");

        focusOn(tl, "#srt-b-5", "+=0.2");
        focusOn(tl, "#srt-b-2", "<");
        tl.to("#srt-line-1", { opacity: 1, duration: 0.2 }, "<");
        travel(tl, "#srt-b-5", { x: 64 }, "+=0.35");
        travel(tl, "#srt-b-2", { x: -64 }, "<");
        focusOff(tl, "#srt-b-5", "+=0.1");
        focusOff(tl, "#srt-b-2", "<");
        tl.to("#srt-line-1", { opacity: 0, duration: 0.2 }, "<");

        focusOn(tl, "#srt-b-5", "+=0.15");
        focusOn(tl, "#srt-b-4", "<");
        tl.to("#srt-line-2", { opacity: 1, duration: 0.2 }, "<");
        travel(tl, "#srt-b-5", { x: 128 }, "+=0.35");
        travel(tl, "#srt-b-4", { x: -64 }, "<");
        focusOff(tl, "#srt-b-5", "+=0.1");
        focusOff(tl, "#srt-b-4", "<");
        tl.to("#srt-line-2", { opacity: 0, duration: 0.2 }, "<");

        focusOn(tl, "#srt-b-5", "+=0.15");
        focusOn(tl, "#srt-b-1", "<");
        tl.to("#srt-line-3", { opacity: 1, duration: 0.2 }, "<");
        travel(tl, "#srt-b-5", { x: 192 }, "+=0.35");
        travel(tl, "#srt-b-1", { x: -64 }, "<");
        focusOff(tl, "#srt-b-5", "+=0.1");
        focusOff(tl, "#srt-b-1", "<");

        // --- merge two sorted halves: compare fronts, pop the smaller one
        enter(tl, "#srt-l0, #srt-l1, #srt-r0, #srt-r1", "+=0.4");

        focusOn(tl, "#srt-l0", "+=0.2");
        focusOn(tl, "#srt-r0", "<");
        exit(tl, "#srt-l0", "+=0.35");
        pop(tl, "#srt-out-0", "<");
        focusOff(tl, "#srt-r0", "-=0.2");

        focusOn(tl, "#srt-l1", "+=0.2");
        focusOn(tl, "#srt-r0", "<");
        exit(tl, "#srt-r0", "+=0.35");
        pop(tl, "#srt-out-1", "<");
        focusOff(tl, "#srt-l1", "-=0.2");

        focusOn(tl, "#srt-l1", "+=0.2");
        focusOn(tl, "#srt-r1", "<");
        exit(tl, "#srt-l1", "+=0.35");
        pop(tl, "#srt-out-2", "<");
        focusOff(tl, "#srt-r1", "-=0.2");

        focusOn(tl, "#srt-r1", "+=0.15");
        exit(tl, "#srt-r1", "+=0.35");
        pop(tl, "#srt-out-3", "<");
        focusOn(tl, "#srt-out-3", "+=0.1");
      } else {
        tl.set("#srt-b-5", { opacity: 1, y: 0, x: 192 })
          .set("#srt-b-2", { opacity: 1, y: 0, x: -64 })
          .set("#srt-b-4", { opacity: 1, y: 0, x: -64 })
          .set("#srt-b-1", { opacity: 1, y: 0, x: -64 })
          .set(["#srt-l0", "#srt-l1", "#srt-r0", "#srt-r1"], { opacity: 0 })
          .set(["#srt-out-0", "#srt-out-1", "#srt-out-2", "#srt-out-3"], { opacity: 1, scale: 1 })
          .set("#srt-out-3 .glow", { opacity: 1 })
          .set("#srt-out-3", { scale: 1.03 });
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
      height={340}
      label="Top: one pass of a comparison sort over 5, 2, 4, 1 compares each adjacent pair and swaps it when out of order, so 5 is greater than 2 and swaps, then 5 is greater than 4 and swaps, then 5 is greater than 1 and swaps, leaving 2, 4, 1, 5 after one pass. Bottom: merging two sorted halves, 1, 4 and 2, 5, compares the front of each half and moves the smaller value into the merged row, producing 1, 2, 4, 5, with the last merged value lit as the finished result."
    >
      <Panel label="One pass (O(n squared))" style={{ left: 0, top: 0, width: 400, height: 130 }} />
      <Chip id="srt-b-5" className="absolute" style={{ left: 16, top: 40, width: 44, height: 36 }}>5</Chip>
      <Chip id="srt-b-2" className="absolute" style={{ left: 80, top: 40, width: 44, height: 36 }}>2</Chip>
      <Chip id="srt-b-4" className="absolute" style={{ left: 144, top: 40, width: 44, height: 36 }}>4</Chip>
      <Chip id="srt-b-1" className="absolute" style={{ left: 208, top: 40, width: 44, height: 36 }}>1</Chip>

      <div className="absolute font-mono text-[12px] text-foreground" style={{ left: 16, top: 88 }}>
        <span id="srt-line-1">5 &gt; 2, swap</span>
        <span id="srt-line-2" className="absolute left-0 top-0">5 &gt; 4, swap</span>
        <span id="srt-line-3" className="absolute left-0 top-0">5 &gt; 1, swap</span>
      </div>

      <Panel label="Merge step (O(n log n))" style={{ left: 0, top: 150, width: 400, height: 170 }} />
      <Eyebrow className="absolute" style={{ left: 20, top: 178 }}>Left half</Eyebrow>
      <Eyebrow className="absolute" style={{ left: 200, top: 178 }}>Right half</Eyebrow>
      <Chip id="srt-l0" className="absolute" style={{ left: 20, top: 198, width: 44, height: 36 }}>1</Chip>
      <Chip id="srt-l1" className="absolute" style={{ left: 80, top: 198, width: 44, height: 36 }}>4</Chip>
      <Chip id="srt-r0" className="absolute" style={{ left: 200, top: 198, width: 44, height: 36 }}>2</Chip>
      <Chip id="srt-r1" className="absolute" style={{ left: 260, top: 198, width: 44, height: 36 }}>5</Chip>

      <Eyebrow className="absolute" style={{ left: 20, top: 250 }}>Merged output</Eyebrow>
      <Chip id="srt-out-0" className="absolute" style={{ left: 20, top: 270, width: 44, height: 36 }}>1</Chip>
      <Chip id="srt-out-1" className="absolute" style={{ left: 80, top: 270, width: 44, height: 36 }}>2</Chip>
      <Chip id="srt-out-2" className="absolute" style={{ left: 140, top: 270, width: 44, height: 36 }}>4</Chip>
      <Chip id="srt-out-3" className="absolute" style={{ left: 200, top: 270, width: 44, height: 36 }}>5</Chip>
    </Stage>
  );
}
