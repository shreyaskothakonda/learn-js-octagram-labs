"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";
import { Stage, Panel, Chip, Eyebrow, enter, exit, focusOn, focusOff, travel } from "./kit";

// Chips enqueue at the back (right) of the queue and dequeue from the front
// (left). 1, 2, and 3 enqueue in order; 1 then dequeues from the front while
// 2 and 3 shift down; 4 enqueues into the freed slot at the back.
export function QueuesVisual({ register }: ConceptVisualProps) {
  const scope = useRef<HTMLDivElement>(null);
  const slotGap = 75;

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      gsap.set(["#q-1", "#q-2", "#q-3", "#q-4"], { opacity: 0, y: 12 });
      gsap.set(".glow", { opacity: 0 });

      if (animate) {
        // enqueue 1, 2, 3
        enter(tl, "#q-1");
        focusOn(tl, "#q-1", "+=0.1");
        focusOff(tl, "#q-1", "+=0.3");

        enter(tl, "#q-2", "+=0.2");
        focusOn(tl, "#q-2", "+=0.05");
        focusOff(tl, "#q-2", "+=0.3");

        enter(tl, "#q-3", "+=0.2");
        focusOn(tl, "#q-3", "+=0.05");
        focusOff(tl, "#q-3", "+=0.3");

        // dequeue: 1 leaves from the front, 2 and 3 shift toward it
        focusOn(tl, "#q-1", "+=0.2");
        exit(tl, "#q-1", "+=0.2");
        travel(tl, "#q-2", { x: -slotGap }, "<");
        travel(tl, "#q-3", { x: -slotGap }, "<");

        // enqueue 4 into the freed slot at the back
        enter(tl, "#q-4", "+=0.2");

        // contrast the two live ends: front (2) and back (4)
        focusOn(tl, "#q-2", "+=0.1");
        focusOn(tl, "#q-4", "<");
      } else {
        tl.set("#q-1", { opacity: 0 })
          .set("#q-2", { opacity: 1, x: -slotGap })
          .set("#q-3", { opacity: 1, x: -slotGap })
          .set("#q-4", { opacity: 1 })
          .set("#q-2 .glow", { opacity: 1 })
          .set("#q-2", { scale: 1.03 })
          .set("#q-4 .glow", { opacity: 1 })
          .set("#q-4", { scale: 1.03 });
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
      height={180}
      label="Values 1, 2, then 3 enqueue in order at the back of a queue. 1 then dequeues from the front, 2 and 3 shift toward the front to take its place, and 4 enqueues into the freed slot at the back, ending with 2 lit as the current front and 4 lit as the current back."
    >
      <Eyebrow style={{ left: 40, top: 46 }}>Front</Eyebrow>
      <Eyebrow style={{ left: 314, top: 46 }}>Back</Eyebrow>
      <Panel label="Queue" style={{ left: 20, top: 66, width: 360, height: 70 }} />

      <Chip id="q-1" style={{ left: 40, top: 90, width: 60, height: 40 }}>1</Chip>
      <Chip id="q-2" style={{ left: 115, top: 90, width: 60, height: 40 }}>2</Chip>
      <Chip id="q-3" style={{ left: 190, top: 90, width: 60, height: 40 }}>3</Chip>
      <Chip id="q-4" style={{ left: 190, top: 90, width: 60, height: 40 }}>4</Chip>
    </Stage>
  );
}
