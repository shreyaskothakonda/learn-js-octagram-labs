"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";
import { Stage, Panel, Frame, Chip, enter, exit, pop, travel, focusOn, focusOff, GLOW, EASE, DUR } from "./kit";

// Scene: a running script schedules a Promise.then callback into the
// microtask queue and a setTimeout callback into the macrotask queue at
// nearly the same moment. Once the script finishes and the stack empties,
// the ordering is shown by motion, not just labels: the microtask chip
// physically travels up into the call stack (the "running" area) and runs
// first, then travels back down before the macrotask chip gets its own turn
// to travel up and run second. Chips have no built-in glow layer, so each
// chip's running moment is a direct box-shadow + scale tween using the kit's
// GLOW token, matching the same visual weight as focusOn/focusOff on a Frame.
export function MicrotasksVsMacrotasksVisual({ register }: ConceptVisualProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      gsap.set("#script-frame", { opacity: 0, y: 12 });
      gsap.set(["#then-chip", "#timeout-chip"], { opacity: 0, scale: 0.8, boxShadow: "none", x: 0, y: 0 });
      gsap.set(["#order-1", "#order-2"], { opacity: 0, scale: 0.6 });
      gsap.set(".glow", { opacity: 0 });

      if (animate) {
        enter(tl, "#script-frame");
        focusOn(tl, "#script-frame", "-=0.15");

        // the script schedules both callbacks at essentially the same moment
        pop(tl, "#then-chip", "+=0.25");
        pop(tl, "#timeout-chip", "<");

        // the script finishes, the call stack empties
        focusOff(tl, "#script-frame", "+=0.2");
        exit(tl, "#script-frame", "-=0.15");

        // the microtask queue drains first: its chip travels up into the call
        // stack / running area and runs
        travel(tl, "#then-chip", { x: 0, y: -102 }, "+=0.25");
        tl.to("#then-chip", { boxShadow: GLOW, scale: 1.05, duration: DUR.focus, ease: EASE.focus }, "<+=0.1");
        pop(tl, "#order-1", "+=0.1");
        tl.to("#then-chip", { boxShadow: "none", scale: 1, duration: DUR.focus, ease: EASE.focus }, "+=0.3");
        // it travels back down to its queue slot, spent
        travel(tl, "#then-chip", { x: 0, y: 0 }, "<");
        tl.to("#then-chip", { opacity: 0.5, duration: DUR.exit, ease: EASE.exit }, "+=0.05");

        // only now, with the microtask queue fully empty, does the single
        // macrotask get its turn: its chip travels up and runs second
        travel(tl, "#timeout-chip", { x: 0, y: -212 }, "+=0.3");
        tl.to("#timeout-chip", { boxShadow: GLOW, scale: 1.05, duration: DUR.focus, ease: EASE.focus }, "<+=0.1");
        pop(tl, "#order-2", "+=0.1");
        tl.to("#timeout-chip", { boxShadow: "none", scale: 1, duration: DUR.focus, ease: EASE.focus }, "+=0.3");
        travel(tl, "#timeout-chip", { x: 0, y: 0 }, "<");
        tl.to("#timeout-chip", { opacity: 0.5, duration: DUR.exit, ease: EASE.exit }, "+=0.05");
      } else {
        // reduced motion: jump to labeled end-state, both drained in order,
        // back at rest in their queues
        tl.set("#script-frame", { opacity: 0 })
          .set(["#then-chip", "#timeout-chip"], { opacity: 0.5, scale: 1, boxShadow: "none", x: 0, y: 0 })
          .set(["#order-1", "#order-2"], { opacity: 1, scale: 1 });
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
      height={300}
      label="A running script schedules a Promise.then callback into the microtask queue and a setTimeout callback into the macrotask queue at nearly the same moment. Once the script finishes and the call stack empties, the microtask chip travels up into the call stack and runs first, marked 1st, then travels back down; only once the microtask queue is completely empty does the macrotask chip travel up and run second, marked 2nd"
    >
      <Panel label="Call stack" style={{ left: 0, top: 0, width: 400, height: 70 }} />
      <Panel label="Microtask queue" style={{ left: 0, top: 86, width: 400, height: 96 }} />
      <Panel label="Macrotask queue" style={{ left: 0, top: 196, width: 400, height: 96 }} />

      <Frame id="script-frame" className="justify-center" style={{ left: 130, top: 16, width: 140, height: 38 }}>
        script()
      </Frame>

      <Chip id="then-chip" style={{ position: "absolute", left: 130, top: 122 }}>
        Promise.then(fn)
      </Chip>
      <Chip id="timeout-chip" className="!bg-[var(--color-secondary)] !text-foreground" style={{ position: "absolute", left: 128, top: 232 }}>
        setTimeout(fn, 0)
      </Chip>

      <Chip id="order-1" className="!rounded-full !px-0 justify-center h-6 w-6" style={{ position: "absolute", left: 280, top: 118 }}>
        1st
      </Chip>
      <Chip id="order-2" className="!rounded-full !px-0 justify-center h-6 w-6" style={{ position: "absolute", left: 280, top: 228 }}>
        2nd
      </Chip>
    </Stage>
  );
}
