"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";
import { Stage, Frame, Chip, Eyebrow, enter, exit, pop, focusOn, focusOff, EASE, DUR } from "./kit";

// 2 + 3 * 4 collapses in precedence order. The execution focus lands on the
// sub-expression that evaluates next: first the multiplication (it binds
// tighter), then the remaining addition, before the final result settles.
export function OperatorsPrecedenceVisual({ register }: ConceptVisualProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      gsap.set(["#tok-2", "#sub-mul", "#sub-add", "#result-final"], { opacity: 0, y: 12 });
      gsap.set("#plus", { opacity: 0 });
      gsap.set(["#note-a", "#note-b", "#note-c"], { opacity: 0, y: 12 });
      gsap.set(".glow", { opacity: 0 });

      if (animate) {
        pop(tl, "#tok-2");
        tl.to("#plus", { opacity: 1, duration: DUR.enter, ease: EASE.enter }, "<");
        enter(tl, "#sub-mul", "<");
        enter(tl, "#note-a", "+=0.1");
        focusOn(tl, "#sub-mul", "+=0.25");
        focusOff(tl, "#sub-mul", "+=0.6");
        exit(tl, "#sub-mul", "-=0.1");
        exit(tl, "#note-a", "<");

        enter(tl, "#sub-add", "+=0.1");
        enter(tl, "#note-b", "<");
        focusOn(tl, "#sub-add", "+=0.25");
        focusOff(tl, "#sub-add", "+=0.6");
        exit(tl, ["#tok-2", "#plus", "#sub-add", "#note-b"], "-=0.1");

        pop(tl, "#result-final", "+=0.15");
        enter(tl, "#note-c", "+=0.1");
      } else {
        // reduced motion: jump to labeled end-state (final collapsed result)
        tl.set(["#result-final", "#note-c"], { opacity: 1, y: 0 });
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
      height={180}
      label="The expression 2 plus 3 times 4 collapses in precedence order. The multiplication 3 times 4 takes the execution focus first, since it binds tighter, and evaluates to 12, leaving 2 plus 12; that addition then takes the focus and evaluates to the final result 14"
    >
      <Chip id="tok-2" className="absolute" style={{ left: 16, top: 58 }}>2</Chip>
      <span id="plus" className="absolute font-mono text-[16px] text-foreground" style={{ left: 52, top: 58 }}>+</span>
      <Frame id="sub-mul" style={{ left: 76, top: 50, width: 84, height: 32 }} className="justify-center text-[13px]">
        3 * 4
      </Frame>
      <Eyebrow id="note-a" className="absolute" style={{ left: 16, top: 100 }}>
        * binds tighter than +: evaluate first
      </Eyebrow>

      <Frame id="sub-add" style={{ left: 76, top: 50, width: 84, height: 32 }} className="justify-center text-[13px]">
        12
      </Frame>
      <Eyebrow id="note-b" className="absolute" style={{ left: 16, top: 100 }}>
        one operator left: evaluate the addition
      </Eyebrow>

      <Frame id="result-final" style={{ left: 16, top: 46, width: 84, height: 40 }} className="justify-center text-[20px] font-semibold text-[var(--color-primary)]">
        14
      </Frame>
      <Eyebrow id="note-c" className="absolute" style={{ left: 16, top: 100 }}>
        = 14 (final result)
      </Eyebrow>
    </Stage>
  );
}
