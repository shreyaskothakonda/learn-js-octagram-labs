"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";
import { Stage, Panel, Frame, Chip, Eyebrow, enter, exit, pop, focusOn, focusOff, travel } from "./kit";

// try pushes a risky() frame onto the call stack. risky() throws: it pops off
// the stack (unwinding) and hands an error chip down to the catch block,
// tinted destructive to read as "something went wrong". The catch block logs
// it and finishes, then the finally block runs right after, whether or not
// anything threw, and ends as the last thing lit up.
export function ErrorHandlingVisual({ register }: ConceptVisualProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      gsap.set(["#frame-try", "#frame-risky", "#catch-frame", "#finally-frame"], { opacity: 0, y: 12 });
      gsap.set("#error-chip", { opacity: 0, scale: 0.8 });
      gsap.set(".glow", { opacity: 0 });

      if (animate) {
        enter(tl, "#frame-try");
        focusOn(tl, "#frame-try", "-=0.15");

        enter(tl, "#frame-risky", "+=0.25");
        focusOff(tl, "#frame-try", "<");
        focusOn(tl, "#frame-risky", "+=0.1");

        // risky() throws: it unwinds off the stack and hands off an error
        pop(tl, "#error-chip", "+=0.3");
        focusOff(tl, "#frame-risky", "<");
        exit(tl, "#frame-risky", "-=0.15");

        // the error travels down into the catch block
        travel(tl, "#error-chip", { x: -150, y: 138 }, "+=0.15");
        enter(tl, "#catch-frame", "<+=0.1");
        focusOn(tl, "#catch-frame", "+=0.1");
        focusOff(tl, "#catch-frame", "+=0.4");

        // finally always runs, right after catch finishes
        enter(tl, "#finally-frame", "+=0.15");
        focusOn(tl, "#finally-frame", "+=0.1");
      } else {
        // reduced motion: jump to labeled end-state (caught, cleaned up)
        tl.set("#frame-try", { opacity: 1, y: 0 })
          .set("#frame-risky", { opacity: 0 })
          .set("#error-chip", { opacity: 1, scale: 1, x: -150, y: 138 })
          .set(["#catch-frame", "#finally-frame"], { opacity: 1, y: 0 })
          .set("#finally-frame .glow", { opacity: 1 })
          .set("#finally-frame", { scale: 1.03 });
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
      label="try pushes a risky call onto the call stack. The risky call throws, unwinds off the stack, and hands an error down to the catch block, shown with a destructive tint. The catch block logs the error and finishes, then the finally block runs right after, since finally always runs whether or not anything threw, and ends as the last thing lit up"
    >
      <Panel label="Call stack" style={{ position: "absolute", left: 0, top: 0, width: 250, height: 130 }} />
      <Panel
        label="catch (err)"
        className="!border-[var(--color-destructive)]/40 !bg-[var(--color-destructive)]/5"
        style={{ position: "absolute", left: 0, top: 150, width: 190, height: 150 }}
      />
      <Panel label="finally" style={{ position: "absolute", left: 210, top: 150, width: 190, height: 150 }} />

      <Frame id="frame-try" className="whitespace-nowrap" style={{ position: "absolute", left: 14, top: 86, width: 220, height: 34 }}>
        try {"{"} risky() {"}"}
      </Frame>
      <Frame id="frame-risky" className="whitespace-nowrap" style={{ position: "absolute", left: 14, top: 40, width: 150, height: 34 }}>
        risky()
      </Frame>

      <Chip
        id="error-chip"
        className="absolute z-10 !bg-[var(--color-destructive)]/10 !text-[var(--color-destructive)]"
        style={{ position: "absolute", left: 176, top: 44 }}
      >
        Error!
      </Chip>

      <Frame id="catch-frame" className="whitespace-nowrap" style={{ position: "absolute", left: 14, top: 222, width: 162, height: 36 }}>
        log(err.message)
      </Frame>
      <Eyebrow className="absolute" style={{ position: "absolute", left: 14, top: 266, width: 170 }}>
        only runs if something threw
      </Eyebrow>

      <Frame id="finally-frame" className="whitespace-nowrap" style={{ position: "absolute", left: 224, top: 222, width: 162, height: 36 }}>
        cleanup()
      </Frame>
      <Eyebrow className="absolute" style={{ position: "absolute", left: 224, top: 266, width: 170 }}>
        runs whether or not it threw
      </Eyebrow>
    </Stage>
  );
}
