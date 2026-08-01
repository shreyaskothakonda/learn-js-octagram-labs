"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";
import { Stage, Panel, Frame, Chip, Eyebrow, CodeLine, enter, pop, focusOn, focusOff, travel, DUR, EASE } from "./kit";

// makeCounter() returns an inner function that closes over count. The
// returned function (a Frame) travels out of the outer scope to a call site,
// carrying a "backpack" chip holding the captured count. Two calls read and
// update that same chip, showing the private variable survives between calls.
export function ClosuresVisual({ register }: ConceptVisualProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      gsap.set(["#scene-label", "#outer-panel", "#let-code"], { opacity: 0, y: 12 });
      gsap.set("#inner-frame", { opacity: 0, y: 12 });
      gsap.set("#backpack-chip", { opacity: 0, scale: 0.8, textContent: "0" });
      gsap.set(["#call-panel", "#call-code"], { opacity: 0, y: 12 });
      gsap.set("#note-label", { opacity: 0, y: 12 });
      gsap.set(".glow", { opacity: 0 });

      if (animate) {
        enter(tl, "#scene-label");
        enter(tl, ["#outer-panel", "#let-code"], "+=0.1", 0.08);
        enter(tl, "#inner-frame", "+=0.2");
        pop(tl, "#backpack-chip", "-=0.1");
        enter(tl, "#call-panel", "+=0.25");
        travel(tl, "#inner-frame", { x: 208, y: 0 }, "+=0.15");
        travel(tl, "#backpack-chip", { x: 208, y: 0 }, "<");
        enter(tl, "#call-code", "+=0.2");

        focusOn(tl, "#inner-frame", "+=0.2");
        tl.to("#backpack-chip", { textContent: "1", duration: DUR.pop, ease: EASE.pop, snap: { textContent: 1 } }, "+=0.15");
        focusOff(tl, "#inner-frame", "+=0.35");

        focusOn(tl, "#inner-frame", "+=0.3");
        tl.to("#backpack-chip", { textContent: "2", duration: DUR.pop, ease: EASE.pop, snap: { textContent: 1 } }, "+=0.15");
        focusOff(tl, "#inner-frame", "+=0.35");
        enter(tl, "#note-label", "+=0.15");
      } else {
        // reduced motion: jump to labeled end-state (frame at call site, count at 2)
        tl.set(["#scene-label", "#outer-panel", "#let-code", "#call-panel", "#call-code", "#note-label"], { opacity: 1, y: 0 })
          .set("#inner-frame", { opacity: 1, y: 0, x: 208 })
          .set("#backpack-chip", { opacity: 1, scale: 1, x: 208, textContent: "2" });
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
      label="makeCounter returns an inner function that closes over count. The returned function carries a backpack chip holding the captured count out to a call site. Calling it twice reads and updates that same chip, count going from 0 to 1 to 2"
    >
      <Eyebrow id="scene-label" className="absolute" style={{ left: 8, top: 0 }}>
        Returned function closes over count
      </Eyebrow>

      <Panel id="outer-panel" label="makeCounter()" style={{ left: 0, top: 20, width: 200, height: 110 }} />
      <CodeLine id="let-code" className="whitespace-nowrap" style={{ left: 12, top: 46, width: 176 }}>
        let count = 0;
      </CodeLine>
      <Frame id="inner-frame" style={{ left: 12, top: 82, width: 176, height: 40 }}>() =&gt; ++count</Frame>
      <Chip id="backpack-chip" className="absolute z-10" style={{ left: 148, top: 66 }}>0</Chip>

      <Panel id="call-panel" label="Call site" style={{ left: 220, top: 20, width: 180, height: 110 }} />
      <CodeLine id="call-code" className="whitespace-nowrap" style={{ left: 232, top: 150, width: 150 }}>
        next(); next();
      </CodeLine>

      <Eyebrow id="note-label" className="absolute" style={{ left: 8, top: 184, width: 380 }}>
        count is private, only this returned function can reach it
      </Eyebrow>
    </Stage>
  );
}
