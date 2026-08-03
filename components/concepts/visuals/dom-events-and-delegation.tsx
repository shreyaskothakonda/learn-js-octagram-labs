"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";
import { Stage, Panel, Frame, Chip, CodeLine, enter, pop, focusOn, travel } from "./kit";

// A click on the innermost button bubbles up through li and ul. A small
// click chip starts on the button and travels up past each ancestor, and a
// single line of log text is replaced at each stop, ending at the delegated
// listener attached on ul, which is where the handler actually runs.
export function DomEventsAndDelegationVisual({ register }: ConceptVisualProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      gsap.set(["#de-code", "#de-panel-ul", "#de-panel-li", "#de-frame-button"], { opacity: 0, y: 12 });
      gsap.set("#de-click", { opacity: 0, scale: 0.8 });
      gsap.set("#de-log", { opacity: 0, y: 12, textContent: "click fires on button, then bubbles up" });
      gsap.set(".glow", { opacity: 0 });

      if (animate) {
        enter(tl, "#de-code");
        enter(tl, ["#de-panel-ul", "#de-panel-li", "#de-frame-button"], "+=0.15", 0.1);

        pop(tl, "#de-click", "+=0.2");
        focusOn(tl, "#de-click", "<");
        enter(tl, "#de-log", "+=0.15");

        // bubbles up through li
        travel(tl, "#de-click", { y: -123 }, "+=0.3");
        focusOn(tl, "#de-click", "<");
        tl.to("#de-log", { opacity: 0, duration: 0.15 }, "+=0.15")
          .set("#de-log", { textContent: "bubbles through li (not the target itself)" })
          .to("#de-log", { opacity: 1, duration: 0.15 });

        // bubbles up through ul
        travel(tl, "#de-click", { y: -183 }, "+=0.3");
        focusOn(tl, "#de-click", "<");
        tl.to("#de-log", { opacity: 0, duration: 0.15 }, "+=0.15")
          .set("#de-log", { textContent: "reaches ul, where the delegated listener checks event.target" })
          .to("#de-log", { opacity: 1, duration: 0.15 });

        // arrives at the delegated listener, to the right of the listener line
        travel(tl, "#de-click", { x: 150, y: -222 }, "+=0.3");
        focusOn(tl, "#de-code", "<");
      } else {
        tl.set(["#de-code", "#de-panel-ul", "#de-panel-li", "#de-frame-button"], { opacity: 1, y: 0 })
          .set("#de-click", { opacity: 1, scale: 1, x: 150, y: -222 })
          .set("#de-log", { opacity: 1, textContent: "reaches ul, where the delegated listener checks event.target" })
          .set("#de-code .glow", { opacity: 1 })
          .set("#de-click .glow", { opacity: 1 });
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
      height={390}
      label="A click starts on a button nested inside a li, itself nested inside a ul. A single listener is attached on ul: ul.addEventListener click handler. The click travels up from the button, through li, through ul, ending at that delegated listener, which checks event.target to find out the click actually started on the button and runs the handler."
    >
      <CodeLine id="de-code" className="whitespace-nowrap" style={{ left: 16, top: 6 }}>
        ul.addEventListener(&quot;click&quot;, handler);
      </CodeLine>

      <Panel id="de-panel-ul" label="ul" style={{ left: 20, top: 40, width: 360, height: 280 }} />
      <Panel id="de-panel-li" label="li" style={{ left: 60, top: 100, width: 280, height: 170 }} />
      <Frame id="de-frame-button" style={{ left: 110, top: 220, width: 180, height: 50 }}>
        button (click here)
      </Frame>

      <Chip id="de-click" style={{ left: 172, top: 228, width: 56, height: 28 }}>click</Chip>

      <div className="absolute font-mono text-[12px] text-foreground" style={{ left: 16, top: 330, width: 368 }}>
        <span id="de-log">click fires on button, then bubbles up</span>
      </div>
    </Stage>
  );
}
