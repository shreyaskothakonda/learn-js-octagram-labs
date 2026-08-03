"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";
import { Stage, Panel, Frame, Chip, Eyebrow, CodeLine, enter, exit, pop, focusOn, focusOff, DUR, EASE } from "./kit";

// setInterval(tick, 1000) fires tick() every second, shown as a ticks chip
// counting 0, 1, 2, 3. The third tick waits noticeably longer, a reminder
// that 1000ms is a floor: a busy stack can delay a tick past it. Finally
// clearInterval stops the timer for good, and the frame and count settle
// into a dimmed, no-longer-running end state.
export function TimersAndSchedulingVisual({ register }: ConceptVisualProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      gsap.set(["#t-code-set", "#t-panel", "#t-frame"], { opacity: 0, y: 12 });
      gsap.set("#t-count", { opacity: 0, scale: 0.8 });
      gsap.set("#t-count-num", { textContent: "0" });
      gsap.set(["#t-delay-note", "#t-code-clear", "#t-stopped-note"], { opacity: 0, y: 12 });
      gsap.set(".glow", { opacity: 0 });

      if (animate) {
        enter(tl, "#t-code-set");
        enter(tl, ["#t-panel", "#t-frame"], "+=0.15", 0.08);
        pop(tl, "#t-count", "-=0.1");

        // tick 1
        focusOn(tl, "#t-frame", "+=0.3");
        tl.to("#t-count-num", { textContent: "1", duration: DUR.pop, ease: EASE.pop, snap: { textContent: 1 } }, "+=0.1");
        focusOff(tl, "#t-frame", "+=0.3");

        // tick 2
        focusOn(tl, "#t-frame", "+=0.35");
        tl.to("#t-count-num", { textContent: "2", duration: DUR.pop, ease: EASE.pop, snap: { textContent: 1 } }, "+=0.1");
        focusOff(tl, "#t-frame", "+=0.3");

        // tick 3 arrives late: the stack was busy, so the wait stretches
        enter(tl, "#t-delay-note", "+=0.2");
        focusOn(tl, "#t-frame", "+=0.6");
        tl.to("#t-count-num", { textContent: "3", duration: DUR.pop, ease: EASE.pop, snap: { textContent: 1 } }, "+=0.1");
        focusOff(tl, "#t-frame", "+=0.3");
        exit(tl, "#t-delay-note", "+=0.1");

        // clearInterval stops it for good
        enter(tl, "#t-code-clear", "+=0.2");
        focusOn(tl, "#t-code-clear", "+=0.15");
        exit(tl, "#t-frame", "+=0.2");
        tl.to("#t-count", { opacity: 0.5, duration: DUR.focus }, "<");
        enter(tl, "#t-stopped-note", "+=0.15");
        focusOff(tl, "#t-code-clear", "+=0.3");
      } else {
        tl.set(["#t-code-set", "#t-panel", "#t-code-clear", "#t-stopped-note"], { opacity: 1, y: 0 })
          .set("#t-frame", { opacity: 0 })
          .set("#t-count", { opacity: 0.5, scale: 1 })
          .set("#t-count-num", { textContent: "3" })
          .set("#t-delay-note", { opacity: 0 });
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
      label="const id = setInterval(tick, 1000) runs tick roughly every second, shown as a ticks chip counting 0, 1, 2, 3. The third tick arrives after a noticeably longer wait, since a busy call stack can delay a tick past its 1000ms minimum. Then clearInterval(id) runs, stopping the timer for good: the tick frame disappears and the count settles into a dimmed, no-longer-running state."
    >
      <CodeLine id="t-code-set" className="whitespace-nowrap" style={{ left: 16, top: 8 }}>
        const id = setInterval(tick, 1000);
      </CodeLine>

      <Panel id="t-panel" label="Timer" style={{ left: 0, top: 40, width: 400, height: 100 }} />
      <Frame id="t-frame" style={{ left: 16, top: 74, width: 140, height: 40 }}>tick()</Frame>
      <Chip id="t-count" style={{ left: 180, top: 78 }}>
        ticks: <span id="t-count-num">0</span>
      </Chip>

      <Eyebrow id="t-delay-note" style={{ left: 16, top: 144, width: 368 }}>
        a busy stack can delay a tick past 1000ms
      </Eyebrow>

      <CodeLine id="t-code-clear" className="whitespace-nowrap" style={{ left: 16, top: 174 }}>
        clearInterval(id);
      </CodeLine>

      <Eyebrow id="t-stopped-note" style={{ left: 16, top: 210, width: 368 }}>
        stopped: tick will not run again
      </Eyebrow>
    </Stage>
  );
}
