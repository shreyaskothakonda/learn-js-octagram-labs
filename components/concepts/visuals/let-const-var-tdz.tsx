"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";
import { Stage, Panel, CodeLine, Chip, enter, pop, exit, focusOn, focusOff } from "./kit";

// var is hoisted and reads as undefined from the top. A destructive temporal
// dead zone band covers the region before `let count = 5;`; the execution
// focus steps down through the lines, throwing on an early read and clearing
// the band the moment the declaration itself runs.
export function LetConstVarTdzVisual({ register }: ConceptVisualProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      gsap.set(["#line-var", "#line-early", "#line-let", "#line-late"], { opacity: 0, y: 12 });
      gsap.set("#chip-var-value", { opacity: 0, scale: 0.8 });
      gsap.set("#tdz-band", { opacity: 0, y: 12 });
      gsap.set(["#chip-error", "#chip-let-value", "#chip-success"], { opacity: 0, scale: 0.8 });
      gsap.set(".glow", { opacity: 0 });

      if (animate) {
        enter(tl, "#line-var");
        focusOn(tl, "#line-var", "-=0.15");
        pop(tl, "#chip-var-value", "+=0.15");
        focusOff(tl, "#line-var", "+=0.2");

        enter(tl, "#tdz-band", "+=0.15");
        enter(tl, "#line-early", "+=0.15");
        focusOn(tl, "#line-early", "-=0.15");
        pop(tl, "#chip-error", "+=0.15");
        focusOff(tl, "#line-early", "+=0.3");

        enter(tl, "#line-let", "+=0.2");
        focusOn(tl, "#line-let", "-=0.15");
        pop(tl, "#chip-let-value", "+=0.15");
        exit(tl, "#tdz-band", "<");
        focusOff(tl, "#line-let", "+=0.3");

        enter(tl, "#line-late", "+=0.2");
        focusOn(tl, "#line-late", "-=0.15");
        pop(tl, "#chip-success", "+=0.15");
        focusOff(tl, "#line-late", "+=0.3");
      } else {
        // reduced motion: jump to labeled end-state
        tl.set(["#line-var", "#line-early", "#line-let", "#line-late"], { opacity: 1, y: 0 })
          .set("#chip-var-value", { opacity: 1, scale: 1 })
          .set("#tdz-band", { opacity: 0 })
          .set(["#chip-error", "#chip-let-value", "#chip-success"], { opacity: 1, scale: 1 });
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
      label="A module scope shows var msg hoisted and read as undefined from the top. A destructive temporal dead zone band covers the region before let count = 5. Reading count inside the band throws a ReferenceError; once the let declaration runs the band clears, and reading count after that returns 5"
    >
      <Panel label="Module scope" style={{ left: 0, top: 0, width: 400, height: 280 }} />

      <CodeLine id="line-var" gutter={1} style={{ left: 16, top: 40, width: 200, height: 28 }}>
        var msg;
      </CodeLine>
      <Chip id="chip-var-value" className="absolute" style={{ left: 230, top: 44 }}>undefined</Chip>

      <Panel
        id="tdz-band"
        label="TDZ"
        className="!border-[var(--color-destructive)] !bg-[var(--color-destructive)]/10"
        style={{ left: 16, top: 78, width: 330, height: 56 }}
      />

      <CodeLine id="line-early" gutter={2} style={{ left: 16, top: 90, width: 230, height: 28 }}>
        console.log(count);
      </CodeLine>
      <Chip id="chip-error" className="absolute !bg-[var(--color-destructive)]/10 !text-[var(--color-destructive)]" style={{ left: 260, top: 94 }}>
        ReferenceError
      </Chip>

      <CodeLine id="line-let" gutter={3} style={{ left: 16, top: 148, width: 200, height: 28 }}>
        let count = 5;
      </CodeLine>
      <Chip id="chip-let-value" className="absolute" style={{ left: 230, top: 152 }}>5</Chip>

      <CodeLine id="line-late" gutter={4} style={{ left: 16, top: 200, width: 230, height: 28 }}>
        console.log(count);
      </CodeLine>
      <Chip id="chip-success" className="absolute" style={{ left: 260, top: 204 }}>5</Chip>
    </Stage>
  );
}
