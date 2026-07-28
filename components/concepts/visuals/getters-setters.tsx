"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";
import { Stage, Panel, Frame, Chip, CodeLine, enter, pop, focusOn, focusOff } from "./kit";

// Reading obj.balance routes through the get frame and returns the stored
// value. Assigning -5 routes through the set frame, fails validation, and is
// rejected before it ever touches the field. Assigning 100 routes through the
// same set frame, passes validation, and the stored value updates live.
export function GettersSettersVisual({ register }: ConceptVisualProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      gsap.set(["#account-panel", "#balance-frame", "#get-panel", "#get-frame", "#set-panel", "#set-frame"], {
        opacity: 0,
        y: 12,
      });
      gsap.set(["#read-code", "#write1-code", "#write2-code"], { opacity: 0, y: 12 });
      gsap.set(["#read-result", "#write1-result", "#write2-result"], { opacity: 0, scale: 0.8 });
      gsap.set(".glow", { opacity: 0 });
      gsap.set("#balance-chip", { textContent: "25" });

      if (animate) {
        enter(tl, "#account-panel");
        enter(tl, "#balance-frame", "<");
        enter(tl, "#get-panel", "+=0.1");
        enter(tl, "#get-frame", "<");
        enter(tl, "#set-panel", "+=0.05");
        enter(tl, "#set-frame", "<");

        // read: getter runs and returns the current value
        enter(tl, "#read-code", "+=0.3");
        focusOn(tl, "#get-frame", "+=0.1");
        pop(tl, "#read-result", "+=0.1");
        focusOff(tl, "#get-frame", "+=0.4");

        // write a bad value: setter runs, validates, rejects
        enter(tl, "#write1-code", "+=0.25");
        focusOn(tl, "#set-frame", "+=0.1");
        pop(tl, "#write1-result", "+=0.1");
        focusOff(tl, "#set-frame", "+=0.4");

        // write a good value: setter runs, validates, accepts, field updates
        enter(tl, "#write2-code", "+=0.25");
        focusOn(tl, "#set-frame", "+=0.1");
        pop(tl, "#write2-result", "+=0.1");
        tl.to("#balance-chip", { textContent: "100", duration: 0.2, snap: { textContent: 1 } }, "<");
        focusOff(tl, "#set-frame", "+=0.5");
      } else {
        // reduced motion: jump to labeled end-state (rejected write ignored, accepted write stored)
        tl.set(
          [
            "#account-panel", "#balance-frame", "#get-panel", "#get-frame", "#set-panel", "#set-frame",
            "#read-code", "#write1-code", "#write2-code",
          ],
          { opacity: 1, y: 0 },
        )
          .set(["#read-result", "#write1-result", "#write2-result"], { opacity: 1, scale: 1 })
          .set("#balance-chip", { textContent: "100" });
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
      label="Reading obj.balance runs a getter that returns the stored value, 25. Assigning obj.balance = -5 runs a setter that rejects the value, leaving the field unchanged. Assigning obj.balance = 100 runs the same setter, passes validation, and the field updates to 100"
    >
      <Panel id="account-panel" label="account" style={{ left: 100, top: 0, width: 200, height: 70 }} />
      <Frame id="balance-frame" className="whitespace-nowrap gap-1" style={{ left: 112, top: 26, width: 176, height: 32 }}>
        <span>_balance:</span>
        <Chip id="balance-chip">25</Chip>
      </Frame>

      <Panel id="get-panel" label="get balance()" style={{ left: 10, top: 82, width: 380, height: 66 }} />
      <Frame id="get-frame" className="whitespace-nowrap" style={{ left: 22, top: 106, width: 220, height: 34 }}>
        return this._balance
      </Frame>

      <Panel id="set-panel" label="set balance(v)" style={{ left: 10, top: 160, width: 380, height: 66 }} />
      <Frame id="set-frame" className="whitespace-nowrap" style={{ left: 22, top: 184, width: 220, height: 34 }}>
        if (v &lt; 0) reject
      </Frame>

      <CodeLine id="read-code" className="whitespace-nowrap" style={{ left: 12, top: 240, width: 140 }}>
        obj.balance
      </CodeLine>
      <Chip id="read-result" style={{ position: "absolute", left: 170, top: 240 }}>
        -&gt; 25
      </Chip>

      <CodeLine id="write1-code" className="whitespace-nowrap" style={{ left: 12, top: 274, width: 170 }}>
        obj.balance = -5
      </CodeLine>
      <Chip
        id="write1-result"
        className="!bg-[var(--color-destructive)]/10 !text-[var(--color-destructive)]"
        style={{ position: "absolute", left: 200, top: 274 }}
      >
        rejected
      </Chip>

      <CodeLine id="write2-code" className="whitespace-nowrap" style={{ left: 12, top: 308, width: 170 }}>
        obj.balance = 100
      </CodeLine>
      <Chip
        id="write2-result"
        className="!bg-green-500/10 !text-green-600"
        style={{ position: "absolute", left: 200, top: 308 }}
      >
        accepted
      </Chip>
    </Stage>
  );
}
