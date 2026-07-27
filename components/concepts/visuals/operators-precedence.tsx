"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";

export function OperatorsPrecedenceVisual({ register }: ConceptVisualProps) {
  const scope = useRef<SVGSVGElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      // Scene: 2 + 3 * 4 collapses in precedence order. A highlight first
      // marks 3 * 4 (multiplication binds tighter), the expression is
      // replaced by 2 + 12, a highlight marks the remaining addition, and
      // that collapses to the final result 14.
      gsap.set(["#expr0", "#highlight0", "#label0"], { opacity: 0 });
      gsap.set(["#expr1", "#highlight1", "#label1"], { opacity: 0 });
      gsap.set(["#expr2", "#label2"], { opacity: 0 });

      if (animate) {
        tl.to("#expr0", { opacity: 1, duration: 0.4 })
          .to(["#highlight0", "#label0"], { opacity: 1, duration: 0.3 }, "+=0.3")
          .to("#expr0", { opacity: 0, duration: 0.3 }, "+=0.6")
          .to(["#highlight0", "#label0"], { opacity: 0, duration: 0.3 }, "<")
          .to("#expr1", { opacity: 1, duration: 0.4 }, "+=0.1")
          .to(["#highlight1", "#label1"], { opacity: 1, duration: 0.3 }, "+=0.3")
          .to("#expr1", { opacity: 0, duration: 0.3 }, "+=0.6")
          .to(["#highlight1", "#label1"], { opacity: 0, duration: 0.3 }, "<")
          .to(["#expr2", "#label2"], { opacity: 1, duration: 0.4 }, "+=0.1");
      } else {
        // reduced motion: jump to labeled end-state
        tl.set(["#expr2", "#label2"], { opacity: 1 });
      }
      register(tl);
      return tl;
    };
    mm.add("(prefers-reduced-motion: reduce)", () => { build(false); });
    mm.add("(prefers-reduced-motion: no-preference)", () => { build(true); });
    return () => mm.revert();
  }, { scope });

  return (
    <svg ref={scope} viewBox="0 0 360 180" className="w-full max-w-md" role="img"
      aria-label="The expression 2 plus 3 times 4 collapses in precedence order. 3 times 4 is highlighted and evaluated first to 12, giving 2 plus 12, then that addition is highlighted and evaluated to the final result 14">
      <rect id="highlight0" x="84" y="48" width="80" height="26" rx="5"
        className="fill-[var(--color-primary)] stroke-[var(--color-primary)]" opacity="0.15" />
      <text id="expr0" x="20" y="65" textLength="144" lengthAdjust="spacingAndGlyphs"
        className="fill-[var(--color-foreground)] text-[16px] font-mono">
        2 + 3 * 4
      </text>
      <text id="label0" x="84" y="95" className="fill-[var(--color-muted-foreground)] text-[10px]">
        * binds tighter than + : evaluate first
      </text>

      <rect id="highlight1" x="20" y="48" width="96" height="26" rx="5"
        className="fill-[var(--color-primary)] stroke-[var(--color-primary)]" opacity="0.15" />
      <text id="expr1" x="20" y="65" textLength="96" lengthAdjust="spacingAndGlyphs"
        className="fill-[var(--color-foreground)] text-[16px] font-mono">
        2 + 12
      </text>
      <text id="label1" x="20" y="95" className="fill-[var(--color-muted-foreground)] text-[10px]">
        one operator left: evaluate the addition
      </text>

      <text id="expr2" x="20" y="65" className="fill-[var(--color-primary)] text-[20px] font-mono">
        14
      </text>
      <text id="label2" x="20" y="95" className="fill-[var(--color-muted-foreground)] text-[10px]">
        = 14 (final result)
      </text>
    </svg>
  );
}
