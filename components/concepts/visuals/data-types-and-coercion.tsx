"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";
import { Stage, Panel, Frame, Chip, Eyebrow, enter, pop, focusOn, focusOff, EASE, DUR } from "./kit";

// Three value chips reveal their typeof result, then two coercion rows show
// "5" + 1 landing on the string "51" while "5" - 1 lands on the number 4.
// A small Frame carries the execution focus onto whichever operator drives
// the conversion, echoing the single-focus language used across the kit.
export function DataTypesAndCoercionVisual({ register }: ConceptVisualProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      gsap.set(["#chip-str", "#chip-num", "#chip-bool"], { opacity: 0, scale: 0.8 });
      gsap.set(["#type-str", "#type-num", "#type-bool"], { opacity: 0, y: 12 });
      gsap.set(["#valA1", "#op-a", "#valA2", "#valB1", "#op-b", "#valB2"], { opacity: 0, y: 12 });
      gsap.set(["#arrow-a", "#arrow-b"], { opacity: 0 });
      gsap.set(["#result-a", "#result-b"], { opacity: 0, scale: 0.8 });
      gsap.set(["#tag-a", "#tag-b"], { opacity: 0, y: 12 });
      gsap.set(".glow", { opacity: 0 });

      if (animate) {
        pop(tl, "#chip-str");
        pop(tl, "#chip-num", "-=0.15");
        pop(tl, "#chip-bool", "-=0.15");
        enter(tl, ["#type-str", "#type-num", "#type-bool"], "+=0.15", 0.08);

        enter(tl, ["#valA1", "#op-a", "#valA2"], "+=0.35", 0.08);
        tl.to("#arrow-a", { opacity: 1, duration: DUR.enter, ease: EASE.enter }, "<");
        focusOn(tl, "#op-a", "+=0.15");
        pop(tl, "#result-a", "+=0.2");
        enter(tl, "#tag-a", "+=0.1");
        focusOff(tl, "#op-a", "+=0.3");

        enter(tl, ["#valB1", "#op-b", "#valB2"], "+=0.35", 0.08);
        tl.to("#arrow-b", { opacity: 1, duration: DUR.enter, ease: EASE.enter }, "<");
        focusOn(tl, "#op-b", "+=0.15");
        pop(tl, "#result-b", "+=0.2");
        enter(tl, "#tag-b", "+=0.1");
        focusOff(tl, "#op-b", "+=0.3");
      } else {
        // reduced motion: jump to labeled end-state
        tl.set(["#chip-str", "#chip-num", "#chip-bool"], { opacity: 1, scale: 1 })
          .set(["#type-str", "#type-num", "#type-bool"], { opacity: 1, y: 0 })
          .set(["#valA1", "#op-a", "#valA2", "#valB1", "#op-b", "#valB2"], { opacity: 1, y: 0 })
          .set(["#arrow-a", "#arrow-b"], { opacity: 1 })
          .set(["#result-a", "#result-b"], { opacity: 1, scale: 1 })
          .set(["#tag-a", "#tag-b"], { opacity: 1, y: 0 });
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
      label="Three value chips reveal their typeof results: string, number, boolean. Below, the operator driving each coercion takes the execution focus in turn: the plus operator coerces the string 5 and the number 1 into the string 51, and the minus operator coerces them into the number 4"
    >
      <Panel label="Values" style={{ left: 0, top: 8, width: 400, height: 96 }} />
      <Chip id="chip-str" className="absolute" style={{ left: 16, top: 36 }}>&quot;hi&quot;</Chip>
      <Eyebrow id="type-str" className="absolute" style={{ left: 16, top: 72 }}>typeof: string</Eyebrow>
      <Chip id="chip-num" className="absolute" style={{ left: 146, top: 36 }}>42</Chip>
      <Eyebrow id="type-num" className="absolute" style={{ left: 146, top: 72 }}>typeof: number</Eyebrow>
      <Chip id="chip-bool" className="absolute" style={{ left: 276, top: 36 }}>true</Chip>
      <Eyebrow id="type-bool" className="absolute" style={{ left: 276, top: 72 }}>typeof: boolean</Eyebrow>

      <Panel label="Coercion" style={{ left: 0, top: 118, width: 400, height: 170 }} />

      <Chip id="valA1" className="absolute" style={{ left: 16, top: 150 }}>&quot;5&quot;</Chip>
      <Frame id="op-a" style={{ left: 64, top: 146, width: 32, height: 32 }} className="justify-center">+</Frame>
      <Chip id="valA2" className="absolute" style={{ left: 106, top: 150 }}>1</Chip>
      <span id="arrow-a" className="absolute font-mono text-[14px] text-muted-foreground" style={{ left: 146, top: 152 }}>&#8594;</span>
      <Chip id="result-a" className="absolute" style={{ left: 176, top: 150 }}>&quot;51&quot;</Chip>
      <Eyebrow id="tag-a" className="absolute" style={{ left: 250, top: 154 }}>string concat</Eyebrow>

      <Chip id="valB1" className="absolute" style={{ left: 16, top: 210 }}>&quot;5&quot;</Chip>
      <Frame id="op-b" style={{ left: 64, top: 206, width: 32, height: 32 }} className="justify-center">-</Frame>
      <Chip id="valB2" className="absolute" style={{ left: 106, top: 210 }}>1</Chip>
      <span id="arrow-b" className="absolute font-mono text-[14px] text-muted-foreground" style={{ left: 146, top: 212 }}>&#8594;</span>
      <Chip id="result-b" className="absolute" style={{ left: 176, top: 210 }}>4</Chip>
      <Eyebrow id="tag-b" className="absolute" style={{ left: 250, top: 214 }}>numeric coercion</Eyebrow>
    </Stage>
  );
}
