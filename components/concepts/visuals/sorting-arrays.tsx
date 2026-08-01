"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";
import { Stage, Frame, CodeLine, Eyebrow, enter, exit, focusOn, focusOff, travel } from "./kit";

const VALUES = [3, 1, 2];
const SLOT_X = [35, 165, 295];
const VALUE_Y = 90;

// Bubble-sort pass over [3, 1, 2]: the comparator (a, b) => a - b is applied to
// each adjacent pair, the execution focus lights both frames in the pair being
// compared, a positive result swaps them, and a final comparison confirms the
// last pair already sits in order before the array reports sorted.
export function SortingArraysVisual({ register }: ConceptVisualProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      gsap.set("#comparator-code", { opacity: 0, y: 12 });
      gsap.set(["#v0", "#v1", "#v2"], { opacity: 0, y: 12 });
      gsap.set("#compare-readout", { opacity: 0, y: 12 });
      gsap.set("#sorted-tag", { opacity: 0, y: 12 });
      gsap.set(".glow", { opacity: 0 });

      if (animate) {
        enter(tl, "#comparator-code");
        enter(tl, ["#v0", "#v1", "#v2"], "+=0.1", 0.08);

        // compare v0 (3) and v1 (1): 3 - 1 = 2, positive, swap
        tl.set(".readout-text", { textContent: "3 - 1 = 2  ->  swap" });
        enter(tl, "#compare-readout", "+=0.25");
        focusOn(tl, "#v0", "<");
        focusOn(tl, "#v1", "<");
        travel(tl, "#v0", { x: SLOT_X[1] - SLOT_X[0] }, "+=0.3");
        travel(tl, "#v1", { x: SLOT_X[0] - SLOT_X[1] }, "<");
        focusOff(tl, "#v0", "+=0.15");
        focusOff(tl, "#v1", "<");

        // compare v0 (now 3, slot 1) and v2 (2, slot 2): 3 - 2 = 1, positive, swap
        tl.set(".readout-text", { textContent: "3 - 2 = 1  ->  swap" }, "+=0.2");
        focusOn(tl, "#v0", "<");
        focusOn(tl, "#v2", "<");
        travel(tl, "#v0", { x: SLOT_X[2] - SLOT_X[0] }, "+=0.3");
        travel(tl, "#v2", { x: SLOT_X[1] - SLOT_X[2] }, "<");
        focusOff(tl, "#v0", "+=0.15");
        focusOff(tl, "#v2", "<");

        // verification pass: compare v1 (1, slot 0) and v2 (2, slot 1): -1, already in order
        tl.set(".readout-text", { textContent: "1 - 2 = -1  ->  keep order" }, "+=0.2");
        focusOn(tl, "#v1", "<");
        focusOn(tl, "#v2", "<");
        focusOff(tl, "#v1", "+=0.5");
        focusOff(tl, "#v2", "<");

        exit(tl, "#compare-readout", "+=0.1");
        enter(tl, "#sorted-tag", "+=0.1");
      } else {
        // reduced motion: jump to labeled end-state (array sorted ascending)
        tl.set("#comparator-code", { opacity: 1, y: 0 })
          .set(["#v0", "#v1", "#v2"], { opacity: 1, y: 0 })
          .set("#v0", { x: SLOT_X[2] - SLOT_X[0] })
          .set("#v1", { x: SLOT_X[0] - SLOT_X[1] })
          .set("#v2", { x: SLOT_X[1] - SLOT_X[2] })
          .set("#compare-readout", { opacity: 0 })
          .set("#sorted-tag", { opacity: 1, y: 0 });
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
      label="Three values, 3, 1, and 2, are sorted ascending with the comparator (a, b) => a - b. The execution focus lights each adjacent pair as it is compared: 3 and 1 compare positive and swap, then 3 and 2 compare positive and swap, leaving 1, 2, 3. A final comparison of 1 and 2 returns negative, confirming the pair is already in order, and the array reports sorted"
    >
      <CodeLine id="comparator-code" gutter={1} style={{ left: 8, top: 16, width: 260 }}>
        arr.sort((a, b) =&gt; a - b)
      </CodeLine>

      <Frame id="v0" style={{ left: SLOT_X[0], top: VALUE_Y, width: 90, height: 44 }} className="justify-center">
        {VALUES[0]}
      </Frame>
      <Frame id="v1" style={{ left: SLOT_X[1], top: VALUE_Y, width: 90, height: 44 }} className="justify-center">
        {VALUES[1]}
      </Frame>
      <Frame id="v2" style={{ left: SLOT_X[2], top: VALUE_Y, width: 90, height: 44 }} className="justify-center">
        {VALUES[2]}
      </Frame>

      <CodeLine id="compare-readout" style={{ left: 8, top: 160, width: 280 }}>
        <span className="readout-text" />
      </CodeLine>
      <Eyebrow id="sorted-tag" className="absolute !text-green-600" style={{ left: 8, top: 200 }}>
        sorted ascending, in place
      </Eyebrow>
    </Stage>
  );
}
