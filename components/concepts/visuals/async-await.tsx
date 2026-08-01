"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";
import { Stage, Panel, Frame, Chip, enter, exit, focusOn, focusOff } from "./kit";

// Scene: main() calls doStuff(), an async frame that pushes onto the call
// stack. It hits await fetchData() and pauses (it dims and shows a "paused"
// chip); the execution focus returns to main so the caller keeps running
// while the promise is pending. Once the promise resolves, the async frame
// undims, the focus returns to it, and it finishes and pops off, handing
// control back to main for good.
export function AsyncAwaitVisual({ register }: ConceptVisualProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      gsap.set("#async-frame", { opacity: 0, y: 12 });
      gsap.set("#paused-chip", { opacity: 0 });
      gsap.set("#state-pending", { opacity: 0 });
      gsap.set("#state-resolved", { opacity: 0 });
      gsap.set(".glow", { opacity: 0 });

      if (animate) {
        // main() runs
        enter(tl, "#caller-frame");
        focusOn(tl, "#caller-frame", "-=0.15");

        // main() calls doStuff(); its async frame pushes onto the stack
        enter(tl, "#async-frame", "+=0.3");
        focusOff(tl, "#caller-frame", "<");
        focusOn(tl, "#async-frame", "+=0.1");

        // fetchData() is called: the promise starts pending
        tl.to("#state-pending", { opacity: 1, duration: 0.3 }, "+=0.2");

        // doStuff() hits await: it pauses (dims, shows "paused"), and the
        // execution focus returns to the caller so main keeps running
        tl.to("#async-frame", { opacity: 0.5, duration: 0.35, ease: "power2.out" }, "+=0.15");
        tl.to("#paused-chip", { opacity: 1, duration: 0.3 }, "<");
        focusOff(tl, "#async-frame", "<");
        focusOn(tl, "#caller-frame", "+=0.05");

        // the awaited promise settles
        tl.to("#state-pending", { opacity: 0, duration: 0.3 }, "+=0.5");
        tl.to("#state-resolved", { opacity: 1, duration: 0.3 }, "<");

        // doStuff() resumes: it undims, the "paused" chip clears, and focus
        // moves back to it
        tl.to("#async-frame", { opacity: 1, duration: 0.35, ease: "power2.out" }, "+=0.2");
        tl.to("#paused-chip", { opacity: 0, duration: 0.25 }, "<");
        focusOff(tl, "#caller-frame", "<");
        focusOn(tl, "#async-frame", "+=0.05");

        // doStuff() finishes and pops off the stack; control returns to main
        focusOff(tl, "#async-frame", "+=0.4");
        exit(tl, "#async-frame", "-=0.15");
        focusOn(tl, "#caller-frame", "+=0.15");
      } else {
        // reduced motion: jump to labeled end-state, doStuff() has resumed,
        // finished, and returned control to main
        tl.set("#async-frame", { opacity: 0 })
          .set("#paused-chip", { opacity: 0 })
          .set("#state-pending", { opacity: 0 })
          .set("#state-resolved", { opacity: 1 })
          .set("#caller-frame", { opacity: 1, y: 0 })
          .set("#caller-frame .glow", { opacity: 1 })
          .set("#caller-frame", { scale: 1.03 });
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
      width={440}
      height={230}
      label="main calls doStuff, an async function whose frame pushes onto the call stack. When doStuff hits await fetchData, it pauses, dimming and showing a paused chip, and the execution focus returns to main so the caller keeps running while the promise is pending. Once the promise resolves, doStuff undims, the focus returns to it, and it finishes and pops off the stack, handing control back to main for good"
    >
      <Panel label="Call stack" style={{ left: 0, top: 0, width: 250, height: 210 }} />
      <Panel label="fetchData()" style={{ left: 266, top: 0, width: 164, height: 96 }} />

      <Frame id="async-frame" className="whitespace-nowrap gap-2" style={{ left: 16, top: 96, width: 228, height: 40 }}>
        <span>doStuff() [async]</span>
        <Chip id="paused-chip" className="!bg-[var(--color-muted)] !text-muted-foreground">
          paused
        </Chip>
      </Frame>
      <Frame id="caller-frame" className="justify-center" style={{ left: 16, top: 150, width: 178, height: 40 }}>
        main()
      </Frame>

      <span id="state-pending" className="absolute font-mono text-[12px] font-semibold text-muted-foreground" style={{ left: 292, top: 50 }}>
        pending
      </span>
      <span id="state-resolved" className="absolute font-mono text-[12px] font-semibold text-green-600" style={{ left: 292, top: 50 }}>
        resolved
      </span>
    </Stage>
  );
}
