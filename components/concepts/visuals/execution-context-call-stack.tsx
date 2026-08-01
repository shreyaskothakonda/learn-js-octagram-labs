"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";
import { Stage, Panel, Frame, enter, exit, focusOn, focusOff } from "./kit";

// Frames push onto a vertical call stack as first(), second(), and third() are
// called; the execution focus lights whichever frame is currently running.
// third() returns and pops off, leaving second() as the running frame.
export function ExecutionContextCallStackVisual({ register }: ConceptVisualProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      gsap.set(["#frame-first", "#frame-second", "#frame-third"], { opacity: 0, y: 12 });
      gsap.set(".glow", { opacity: 0 });

      if (animate) {
        focusOn(tl, "#frame-global");
        enter(tl, "#frame-first", "+=0.25");
        focusOff(tl, "#frame-global", "<");
        focusOn(tl, "#frame-first", "+=0.1");
        enter(tl, "#frame-second", "+=0.25");
        focusOff(tl, "#frame-first", "<");
        focusOn(tl, "#frame-second", "+=0.1");
        enter(tl, "#frame-third", "+=0.25");
        focusOff(tl, "#frame-second", "<");
        focusOn(tl, "#frame-third", "+=0.1");
        // third() returns and pops off the stack
        focusOff(tl, "#frame-third", "+=0.5");
        exit(tl, "#frame-third", "-=0.15");
        focusOn(tl, "#frame-second", "+=0.15");
      } else {
        // reduced motion: jump to labeled end-state (third popped, second running)
        tl.set(["#frame-first", "#frame-second"], { opacity: 1, y: 0 })
          .set("#frame-third", { opacity: 0 })
          .set("#frame-second .glow", { opacity: 1 })
          .set("#frame-second", { scale: 1.03 });
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
      height={280}
      label="Frames for first, second, and third push onto a vertical call stack above the global frame, with the execution focus lighting whichever frame runs; third then returns and pops off, leaving second as the running frame"
    >
      <Panel label="Call stack" style={{ left: 0, top: 0, width: 400, height: 280 }} />
      <Frame id="frame-third" style={{ left: 120, top: 44, width: 160, height: 40 }}>third()</Frame>
      <Frame id="frame-second" style={{ left: 120, top: 92, width: 160, height: 40 }}>second()</Frame>
      <Frame id="frame-first" style={{ left: 120, top: 140, width: 160, height: 40 }}>first()</Frame>
      <Frame id="frame-global" style={{ left: 120, top: 188, width: 160, height: 40 }}>global</Frame>
    </Stage>
  );
}
