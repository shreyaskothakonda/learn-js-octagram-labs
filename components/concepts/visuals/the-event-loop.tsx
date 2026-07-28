"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";
import { Stage, Panel, Frame, Chip, Eyebrow, enter, exit, pop, focusOn, focusOff, travel } from "./kit";

// Reference exemplar for the "Runtime Instruments" kit. A single accent focus
// (ring + soft glow) marks the frame the runtime is executing right now, and it
// glides from the call stack through the queues, encoding that JavaScript runs
// one thing at a time.
export function TheEventLoopVisual({ register }: ConceptVisualProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      gsap.set(["#main-frame", "#tok-timer", "#tok-then"], { opacity: 0, y: 12 });
      gsap.set(".glow", { opacity: 0 });
      gsap.set(["#out-1", "#out-2", "#out-3", "#out-4"], { opacity: 0, scale: 0.8 });

      if (animate) {
        // main() runs and logs 1
        enter(tl, "#main-frame");
        focusOn(tl, "#main-frame", "-=0.15");
        pop(tl, "#out-1", "+=0.15");
        // it schedules a timer (Web API) and a microtask (.then), then logs 2
        enter(tl, "#tok-timer", "+=0.25");
        enter(tl, "#tok-then", "+=0.2");
        pop(tl, "#out-2", "+=0.15");
        // main() returns, the stack empties
        focusOff(tl, "#main-frame", "+=0.2");
        exit(tl, "#main-frame", "-=0.15");
        // the microtask queue drains first: .then moves up and logs 3
        travel(tl, "#tok-then", { x: 4, y: -104 }, "+=0.25");
        focusOn(tl, "#tok-then");
        pop(tl, "#out-3", "+=0.15");
        focusOff(tl, "#tok-then", "+=0.2");
        exit(tl, "#tok-then", "-=0.15");
        // only now the one macrotask runs: the timer moves to the queue, then up
        travel(tl, "#tok-timer", { x: -216, y: 178 }, "+=0.25");
        travel(tl, "#tok-timer", { x: -212, y: 0 }, "+=0.3");
        focusOn(tl, "#tok-timer");
        pop(tl, "#out-4", "+=0.15");
        focusOff(tl, "#tok-timer", "+=0.2");
        exit(tl, "#tok-timer", "-=0.15");
      } else {
        tl.set(["#main-frame", "#tok-timer", "#tok-then"], { opacity: 0 })
          .set(["#out-1", "#out-2", "#out-3", "#out-4"], { opacity: 1, scale: 1 });
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
      label="main runs and logs 1, schedules a setTimeout callback in the Web API and a resolved Promise then callback in the microtask queue, then logs 2. When main returns and the call stack empties, the microtask queue drains first and logs 3, and only then does the single macrotask (the timer callback) run and log 4. Final order: 1, 2, 3, 4."
    >
      <Panel label="Call stack" style={{ left: 0, top: 0, width: 188, height: 96 }} />
      <Panel label="Web API" style={{ left: 212, top: 0, width: 188, height: 96 }} />
      <Panel label="Microtask queue" style={{ left: 0, top: 112, width: 400, height: 66 }} />
      <Panel label="Macrotask queue" style={{ left: 0, top: 190, width: 400, height: 66 }} />

      <Frame id="main-frame" style={{ left: 16, top: 40, width: 150, height: 44 }}>main()</Frame>
      <Frame id="tok-timer" style={{ left: 226, top: 40, width: 160, height: 44 }}>setTimeout(fn, 0)</Frame>
      <Frame id="tok-then" style={{ left: 12, top: 138, width: 180, height: 34 }}>.then(fn)</Frame>

      <div className="absolute flex items-center gap-2" style={{ left: 4, top: 284 }}>
        <Eyebrow>Output</Eyebrow>
        {["1", "2", "3", "4"].map((n, i) => (
          <Chip key={n} id={`out-${i + 1}`} className="h-6 w-6 px-0">{n}</Chip>
        ))}
      </div>
    </Stage>
  );
}
