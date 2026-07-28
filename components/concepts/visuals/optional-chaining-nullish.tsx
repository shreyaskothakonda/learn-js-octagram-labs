"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";
import { Stage, Frame, Chip, Eyebrow, CodeLine, enter, pop, focusOn, focusOff, DUR, EASE } from "./kit";

// Top half: a lookup focus walks user -> address -> city. Address is
// undefined, so ?. short-circuits there (city is never reached, marked with
// a skip glyph), and the result is undefined instead of a crash. Bottom half:
// 0 ?? 5 keeps 0 because 0 is not null/undefined, while 0 || 5 swaps to 5
// because 0 is falsy, showing the two operators diverge.
export function OptionalChainingNullishVisual({ register }: ConceptVisualProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      gsap.set(["#oc-label", "#frame-user", "#frame-address"], { opacity: 0, y: 12 });
      gsap.set(["#arrow1", "#arrow2", "#frame-city"], { opacity: 0 });
      gsap.set("#skip-mark", { opacity: 0 });
      gsap.set(["#result-undefined", "#oc-code"], { opacity: 0, y: 12, scale: 0.9 });

      gsap.set(["#nc-label", "#nc-code", "#or-code"], { opacity: 0, y: 12 });
      gsap.set(["#chip-nc-0", "#chip-nc-5", "#gate-nc", "#result-nc"], { opacity: 0 });
      gsap.set(["#chip-or-0", "#chip-or-5", "#gate-or", "#result-or"], { opacity: 0 });
      gsap.set("#final-note", { opacity: 0, y: 12 });
      gsap.set(".glow", { opacity: 0 });

      if (animate) {
        enter(tl, "#oc-label");
        enter(tl, ["#frame-user", "#frame-address"], "+=0.1", 0.1);
        tl.to("#arrow1", { opacity: 1, duration: DUR.enter, ease: EASE.enter }, "<");
        tl.to("#frame-city", { opacity: 0.35, duration: DUR.enter, ease: EASE.enter }, "+=0.1");
        tl.to("#arrow2", { opacity: 0.35, duration: DUR.enter, ease: EASE.enter }, "<");
        focusOn(tl, "#frame-user", "+=0.2");
        focusOff(tl, "#frame-user", "+=0.3");
        focusOn(tl, "#frame-address", "<");
        tl.to("#skip-mark", { opacity: 1, duration: DUR.focus, ease: EASE.focus }, "+=0.2");
        focusOff(tl, "#frame-address", "+=0.3");
        pop(tl, "#result-undefined", "+=0.15");
        enter(tl, "#oc-code", "+=0.2");

        enter(tl, "#nc-label", "+=0.4");
        enter(tl, ["#nc-code", "#or-code"], "+=0.1", 0.1);
        tl.to(["#chip-nc-0", "#chip-nc-5", "#gate-nc"], { opacity: 1, duration: DUR.enter, ease: EASE.enter, stagger: 0.08 }, "+=0.15");
        tl.to("#result-nc", { opacity: 1, duration: DUR.enter, ease: EASE.enter }, "+=0.15");
        tl.to("#chip-nc-5", { opacity: 0.4, duration: DUR.enter, ease: EASE.enter }, "<");
        tl.to(["#chip-or-0", "#chip-or-5", "#gate-or"], { opacity: 1, duration: DUR.enter, ease: EASE.enter, stagger: 0.08 }, "+=0.3");
        tl.to("#result-or", { opacity: 1, duration: DUR.enter, ease: EASE.enter }, "+=0.15");
        tl.to("#chip-or-0", { opacity: 0.4, duration: DUR.enter, ease: EASE.enter }, "<");
        enter(tl, "#final-note", "+=0.3");
      } else {
        // reduced motion: jump to labeled end-state
        tl.set(["#oc-label", "#frame-user", "#frame-address"], { opacity: 1, y: 0 })
          .set("#arrow1", { opacity: 1 })
          .set("#frame-city", { opacity: 0.35 })
          .set("#arrow2", { opacity: 0.35 })
          .set("#skip-mark", { opacity: 1 })
          .set(["#result-undefined", "#oc-code"], { opacity: 1, y: 0, scale: 1 })
          .set(["#nc-label", "#nc-code", "#or-code"], { opacity: 1, y: 0 })
          .set(["#chip-nc-0", "#gate-nc", "#result-nc"], { opacity: 1 })
          .set("#chip-nc-5", { opacity: 0.4 })
          .set(["#chip-or-5", "#gate-or", "#result-or"], { opacity: 1 })
          .set("#chip-or-0", { opacity: 0.4 })
          .set("#final-note", { opacity: 1, y: 0 });
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
      height={310}
      label="A lookup focus walks user, then address, then city. Address is undefined, so optional chaining short-circuits there, city is never reached, and the chain returns undefined instead of throwing. Below, 0 nullish-coalescing 5 keeps 0 because 0 is not null or undefined, while 0 or 5 swaps to 5 because 0 is falsy"
    >
      <Eyebrow id="oc-label" className="absolute" style={{ left: 8, top: 4 }}>Optional chaining</Eyebrow>

      <Frame id="frame-user" style={{ left: 12, top: 34, width: 70, height: 40 }} className="justify-center">
        user
      </Frame>
      <span id="arrow1" className="absolute font-mono text-[11px] text-muted-foreground" style={{ left: 88, top: 47 }}>
        ?.
      </span>
      <Frame id="frame-address" style={{ left: 106, top: 34, width: 170, height: 40 }} className="justify-center text-[11px]">
        address: undefined
      </Frame>
      <span id="arrow2" className="absolute font-mono text-[11px] text-muted-foreground" style={{ left: 282, top: 47 }}>
        ?.
      </span>
      <span id="skip-mark" className="absolute font-mono text-[13px] text-[var(--color-destructive)]" style={{ left: 285, top: 26 }}>
        &#10005;
      </span>
      <Frame id="frame-city" style={{ left: 306, top: 34, width: 80, height: 40 }} className="justify-center text-muted-foreground">
        city
      </Frame>

      <Chip id="result-undefined" className="absolute" style={{ left: 16, top: 92 }}>undefined</Chip>
      <CodeLine id="oc-code" className="whitespace-nowrap" style={{ left: 16, top: 118, width: 360 }}>
        user?.address?.city // undefined, no crash
      </CodeLine>

      <div className="absolute border-t border-border" style={{ left: 0, top: 144, width: 400 }} />

      <Eyebrow id="nc-label" className="absolute" style={{ left: 8, top: 156 }}>
        Nullish coalescing vs. OR
      </Eyebrow>

      <CodeLine id="nc-code" className="whitespace-nowrap" style={{ left: 20, top: 178, width: 120 }}>0 ?? 5</CodeLine>
      <span
        id="chip-nc-0"
        className="absolute rounded-md bg-green-500/10 px-2 py-1 font-mono text-[12px] font-semibold text-green-600"
        style={{ left: 20, top: 200 }}
      >
        0
      </span>
      <span
        id="chip-nc-5"
        className="absolute rounded-md bg-[var(--color-muted)] px-2 py-1 font-mono text-[12px] font-semibold text-muted-foreground"
        style={{ left: 20, top: 232 }}
      >
        5
      </span>
      <span id="gate-nc" className="absolute font-mono text-[11px] text-muted-foreground" style={{ left: 72, top: 216 }}>
        ??
      </span>
      <span id="result-nc" className="absolute font-mono text-[12px] font-semibold text-green-600" style={{ left: 100, top: 216 }}>
        = 0
      </span>

      <CodeLine id="or-code" className="whitespace-nowrap" style={{ left: 210, top: 178, width: 120 }}>0 || 5</CodeLine>
      <span
        id="chip-or-0"
        className="absolute rounded-md bg-[var(--color-muted)] px-2 py-1 font-mono text-[12px] font-semibold text-muted-foreground"
        style={{ left: 210, top: 200 }}
      >
        0
      </span>
      <span
        id="chip-or-5"
        className="absolute rounded-md bg-green-500/10 px-2 py-1 font-mono text-[12px] font-semibold text-green-600"
        style={{ left: 210, top: 232 }}
      >
        5
      </span>
      <span id="gate-or" className="absolute font-mono text-[11px] text-muted-foreground" style={{ left: 262, top: 216 }}>
        ||
      </span>
      <span id="result-or" className="absolute font-mono text-[12px] font-semibold text-green-600" style={{ left: 292, top: 216 }}>
        = 5
      </span>

      <Eyebrow id="final-note" className="absolute" style={{ left: 16, top: 276, width: 360 }}>
        ?? only replaces null or undefined; || replaces any falsy value
      </Eyebrow>
    </Stage>
  );
}
