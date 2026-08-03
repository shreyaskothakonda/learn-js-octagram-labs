"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";
import { Stage, Panel, Frame, Eyebrow, enter, exit, focusOn, focusOff, travel } from "./kit";

// Value frames push onto a vertical stack from the bottom up, and a "top"
// marker tracks whichever frame currently sits on top. 30 pops back off,
// leaving 20 on top, then 40 pushes into the same slot 30 used to hold.
export function StacksVisual({ register }: ConceptVisualProps) {
  const scope = useRef<HTMLDivElement>(null);
  const slot0 = 216; // bottom-most slot (10)
  const slot1 = 172; // (20)
  const slot2 = 128; // (30, later 40)

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      gsap.set(["#st-10", "#st-20", "#st-30", "#st-40"], { opacity: 0, y: 12 });
      gsap.set("#st-top", { opacity: 0, y: 12 });
      gsap.set(".glow", { opacity: 0 });

      if (animate) {
        // push(10)
        enter(tl, "#st-10");
        focusOn(tl, "#st-10", "-=0.15");
        enter(tl, "#st-top", "<");

        // push(20)
        enter(tl, "#st-20", "+=0.25");
        focusOff(tl, "#st-10", "<");
        focusOn(tl, "#st-20", "+=0.05");
        travel(tl, "#st-top", { y: slot1 - slot0 }, "<");

        // push(30)
        enter(tl, "#st-30", "+=0.25");
        focusOff(tl, "#st-20", "<");
        focusOn(tl, "#st-30", "+=0.05");
        travel(tl, "#st-top", { y: slot2 - slot0 }, "<");

        // pop(): 30 comes off, 20 is on top again
        focusOff(tl, "#st-30", "+=0.4");
        exit(tl, "#st-30", "-=0.15");
        focusOn(tl, "#st-20", "+=0.1");
        travel(tl, "#st-top", { y: slot1 - slot0 }, "<");

        // push(40): lands in the slot 30 used to occupy
        enter(tl, "#st-40", "+=0.3");
        focusOff(tl, "#st-20", "<");
        focusOn(tl, "#st-40", "+=0.05");
        travel(tl, "#st-top", { y: slot2 - slot0 }, "<");
      } else {
        tl.set(["#st-10", "#st-20", "#st-40"], { opacity: 1, y: 0 })
          .set("#st-30", { opacity: 0 })
          .set("#st-top", { opacity: 1, y: slot2 - slot0 })
          .set("#st-40 .glow", { opacity: 1 })
          .set("#st-40", { scale: 1.03 });
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
      label="Values 10, 20, then 30 push onto a vertical stack from the bottom up, with a top marker tracking whichever value is currently on top. 30 then pops off, leaving 20 on top, and 40 pushes into the slot 30 used to hold, ending as the new top of the stack."
    >
      <Panel label="Stack" style={{ left: 60, top: 0, width: 200, height: 260 }} />
      <Frame id="st-30" style={{ left: 90, top: slot2, width: 140, height: 40 }}>30</Frame>
      <Frame id="st-40" style={{ left: 90, top: slot2, width: 140, height: 40 }}>40</Frame>
      <Frame id="st-20" style={{ left: 90, top: slot1, width: 140, height: 40 }}>20</Frame>
      <Frame id="st-10" style={{ left: 90, top: slot0, width: 140, height: 40 }}>10</Frame>

      <Eyebrow id="st-top" className="text-[var(--color-primary)]" style={{ left: 272, top: slot0 + 14 }}>
        {"← top"}
      </Eyebrow>
    </Stage>
  );
}
