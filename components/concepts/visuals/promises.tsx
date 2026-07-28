"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";
import { Stage, Frame, Chip, CodeLine, Eyebrow, enter, pop, focusOn } from "./kit";

// Scene: a promise frame starts pending, then settles to fulfilled exactly
// once (the state label crossfades from muted "pending" to green "fulfilled").
// Its .then handler lights up and receives the value; the .catch handler
// stays dim the whole time, showing the outcome that never happens.
export function PromisesVisual({ register }: ConceptVisualProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      gsap.set(["#code-new", "#promise-frame", "#then-frame"], { opacity: 0, y: 12 });
      gsap.set("#catch-frame", { opacity: 0, y: 12 });
      gsap.set("#state-pending", { opacity: 1 });
      gsap.set("#state-fulfilled", { opacity: 0 });
      gsap.set("#resolved-value", { opacity: 0, scale: 0.8 });
      gsap.set(".glow", { opacity: 0 });

      if (animate) {
        enter(tl, "#code-new");
        enter(tl, "#promise-frame", "+=0.2");
        enter(tl, "#then-frame", "+=0.25");
        tl.to("#catch-frame", { opacity: 0.5, y: 0, duration: 0.45, ease: "power3.out" }, "<");

        // the executor settles the promise: pending -> fulfilled, exactly once
        tl.to("#state-pending", { opacity: 0, duration: 0.3 }, "+=0.4");
        tl.to("#state-fulfilled", { opacity: 1, duration: 0.3 }, "<");

        // the matching handler runs and receives the value; .catch never lights
        focusOn(tl, "#then-frame", "+=0.2");
        pop(tl, "#resolved-value", "+=0.15");
      } else {
        // reduced motion: jump to labeled end-state, settled fulfilled once
        tl.set(["#code-new", "#promise-frame", "#then-frame"], { opacity: 1, y: 0 })
          .set("#catch-frame", { opacity: 0.5, y: 0 })
          .set("#state-pending", { opacity: 0 })
          .set("#state-fulfilled", { opacity: 1 })
          .set("#then-frame .glow", { opacity: 1 })
          .set("#then-frame", { scale: 1.03 })
          .set("#resolved-value", { opacity: 1, scale: 1 });
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
      height={250}
      label="A promise starts pending. Its executor settles it exactly once, to fulfilled, and its then handler lights up and receives the resolved value. The catch handler stays dim the whole time, since a promise never settles both ways"
    >
      <CodeLine id="code-new" className="whitespace-nowrap" style={{ left: 16, top: 6, width: 370 }}>
        const p = new Promise((resolve) =&gt; resolve(42))
      </CodeLine>

      <Frame id="promise-frame" style={{ left: 140, top: 44, width: 120, height: 40 }} className="justify-center">
        <span id="state-pending" className="absolute font-mono text-[12px] font-semibold text-muted-foreground">
          pending
        </span>
        <span id="state-fulfilled" className="absolute font-mono text-[12px] font-semibold text-green-600">
          fulfilled
        </span>
      </Frame>

      <Frame id="then-frame" className="whitespace-nowrap justify-center" style={{ left: 24, top: 128, width: 168, height: 44 }}>
        .then(v =&gt; log(v))
      </Frame>
      <Frame id="catch-frame" className="whitespace-nowrap justify-center text-muted-foreground" style={{ left: 208, top: 128, width: 168, height: 44 }}>
        .catch(e =&gt; log(e))
      </Frame>

      <Chip id="resolved-value" style={{ position: "absolute", left: 66, top: 184 }}>
        -&gt; 42
      </Chip>

      <Eyebrow className="absolute" style={{ left: 16, top: 220, width: 370 }}>
        Settles once: fulfilled or rejected, never both
      </Eyebrow>
    </Stage>
  );
}
