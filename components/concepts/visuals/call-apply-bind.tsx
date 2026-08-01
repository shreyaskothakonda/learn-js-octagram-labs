"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";
import { Stage, Panel, Frame, Chip, CodeLine, enter, pop, focusOn, focusOff, travel } from "./kit";

// The same greet function invoked three ways. call and apply both re-point
// the same "this" chip at a new target and run immediately, producing a
// result right away. bind does not run anything, it returns a brand new
// pre-bound frame, which travels to a call site and is invoked later.
export function CallApplyBindVisual({ register }: ConceptVisualProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      gsap.set(["#invoke-panel", "#greet-fn", "#call-code", "#result-1", "#apply-code", "#result-2"], {
        opacity: 0,
        y: 12,
      });
      gsap.set("#this-chip", { opacity: 0, scale: 0.8 });
      gsap.set(["#bind-panel", "#bind-code", "#bound-fn", "#callsite-panel", "#invoke-code", "#result-3"], {
        opacity: 0,
        y: 12,
      });
      gsap.set(".glow", { opacity: 0 });

      if (animate) {
        enter(tl, "#invoke-panel");
        enter(tl, "#greet-fn", "+=0.1");
        enter(tl, "#call-code", "+=0.15");
        pop(tl, "#this-chip", "+=0.15");
        focusOn(tl, "#greet-fn", "+=0.1");
        enter(tl, "#result-1", "+=0.15");
        focusOff(tl, "#greet-fn", "+=0.3");

        enter(tl, "#apply-code", "+=0.25");
        travel(tl, "#this-chip", { y: 36 }, "+=0.1");
        tl.to("#this-chip", { textContent: "grace", duration: 0.2 }, "<");
        focusOn(tl, "#greet-fn", "+=0.15");
        enter(tl, "#result-2", "+=0.15");
        focusOff(tl, "#greet-fn", "+=0.3");

        enter(tl, "#bind-panel", "+=0.4");
        enter(tl, "#bind-code", "+=0.15");
        enter(tl, "#bound-fn", "+=0.2");
        enter(tl, "#callsite-panel", "+=0.15");
        travel(tl, "#bound-fn", { x: 220, y: 0 }, "+=0.2");
        enter(tl, "#invoke-code", "+=0.2");
        focusOn(tl, "#bound-fn", "+=0.15");
        enter(tl, "#result-3", "+=0.15");
        focusOff(tl, "#bound-fn", "+=0.4");
      } else {
        // reduced motion: jump to labeled end-state (this repointed to grace, bound-fn traveled)
        tl.set(["#invoke-panel", "#greet-fn", "#call-code", "#result-1", "#apply-code", "#result-2"], {
          opacity: 1,
          y: 0,
        })
          .set("#this-chip", { opacity: 1, scale: 1, y: 36, textContent: "grace" })
          .set(
            ["#bind-panel", "#bind-code", "#callsite-panel", "#invoke-code", "#result-3"],
            { opacity: 1, y: 0 },
          )
          .set("#bound-fn", { opacity: 1, y: 0, x: 220 });
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
      height={270}
      label="The same greet function is invoked three ways. greet.call and greet.apply both re-point the same this target, first to ada then to grace, and run immediately, each producing a result right away. greet.bind does not run anything, it returns a new pre-bound frame, which travels to a call site and is invoked later, producing Hi Alan"
    >
      <Panel id="invoke-panel" label="call() / apply()" style={{ left: 0, top: 0, width: 400, height: 120 }} />
      <Frame id="greet-fn" style={{ left: 12, top: 20, width: 130, height: 32 }}>greet(){"{}"}</Frame>

      <CodeLine id="call-code" className="whitespace-nowrap" style={{ left: 12, top: 60, width: 150 }}>
        greet.call(ada)
      </CodeLine>
      <Chip id="this-chip" className="absolute z-10" style={{ left: 195, top: 56 }}>ada</Chip>
      <CodeLine id="result-1" className="whitespace-nowrap" style={{ left: 248, top: 60, width: 145 }}>
        -&gt; &quot;Hi, Ada&quot;
      </CodeLine>

      <CodeLine id="apply-code" className="whitespace-nowrap" style={{ left: 12, top: 96, width: 175 }}>
        greet.apply(grace, [])
      </CodeLine>
      <CodeLine id="result-2" className="whitespace-nowrap" style={{ left: 248, top: 96, width: 145 }}>
        -&gt; &quot;Hi, Grace&quot;
      </CodeLine>

      <Panel id="bind-panel" label="bind()" style={{ left: 0, top: 136, width: 190, height: 80 }} />
      <CodeLine id="bind-code" className="whitespace-nowrap" style={{ left: 12, top: 154, width: 170 }}>
        greet.bind(alan)
      </CodeLine>
      <Frame id="bound-fn" className="whitespace-nowrap" style={{ left: 12, top: 182, width: 168, height: 30 }}>
        boundGreet(alan)
      </Frame>

      <Panel id="callsite-panel" label="Call site" style={{ left: 220, top: 136, width: 180, height: 80 }} />
      <CodeLine id="invoke-code" className="whitespace-nowrap" style={{ left: 232, top: 226, width: 130 }}>
        boundGreet()
      </CodeLine>
      <CodeLine id="result-3" className="whitespace-nowrap" style={{ left: 232, top: 246, width: 160 }}>
        -&gt; &quot;Hi, Alan&quot; (later)
      </CodeLine>
    </Stage>
  );
}
