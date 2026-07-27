"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";

export function SpreadAndRestVisual({ register }: ConceptVisualProps) {
  const scope = useRef<SVGSVGElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      // Scene, top half (spread): two source arrays, a and b, explode their
      // chips into one new combined array. Scene, bottom half (rest, the
      // mirror motion): call arguments converge, the first one peels off
      // into `first`, the remaining three collect into a `rest` array.
      gsap.set(["#spread-label", "#a-label", "#b-label"], { opacity: 0 });
      gsap.set(["#chip-a1", "#chip-a2", "#chip-b1", "#chip-b2"], { opacity: 0 });
      gsap.set(["#combined-box", "#combined-label"], { opacity: 0 });
      gsap.set("#spread-code", { opacity: 0 });

      gsap.set(["#rest-label", "#args-label"], { opacity: 0 });
      gsap.set(["#chip-arg0", "#chip-arg1", "#chip-arg2", "#chip-arg3"], { opacity: 0 });
      gsap.set(["#first-box", "#first-label", "#rest-box", "#rest-array-label"], { opacity: 0 });
      gsap.set("#rest-code", { opacity: 0 });

      const chipAStart: Record<string, { x: number; y: number }> = {
        "#chip-a1": { x: 45, y: 55 },
        "#chip-a2": { x: 90, y: 55 },
        "#chip-b1": { x: 195, y: 55 },
        "#chip-b2": { x: 240, y: 55 },
      };
      Object.entries(chipAStart).forEach(([id, pos]) => gsap.set(id, { ...pos }));
      const slotX = [58, 98, 138, 178];
      const chipOrder = ["#chip-a1", "#chip-a2", "#chip-b1", "#chip-b2"];

      const argStart: Record<string, { x: number; y: number }> = {
        "#chip-arg0": { x: 45, y: 205 },
        "#chip-arg1": { x: 90, y: 205 },
        "#chip-arg2": { x: 135, y: 205 },
        "#chip-arg3": { x: 180, y: 205 },
      };
      Object.entries(argStart).forEach(([id, pos]) => gsap.set(id, { ...pos }));
      const restSlotX = [148, 188, 228];
      const restOrder = ["#chip-arg1", "#chip-arg2", "#chip-arg3"];

      if (animate) {
        tl.to(["#spread-label", "#a-label", "#b-label"], { opacity: 1, duration: 0.3 })
          .to(chipOrder, { opacity: 1, duration: 0.3, stagger: 0.08 }, "+=0.1")
          .to(["#combined-box", "#combined-label"], { opacity: 1, duration: 0.3 }, "+=0.2");
        chipOrder.forEach((id, i) => {
          tl.to(id, { x: slotX[i], y: 137, duration: 0.5, ease: "power2.inOut" }, "+=0.12");
        });
        tl.to("#spread-code", { opacity: 1, duration: 0.4 }, "+=0.3")
          .to(["#rest-label", "#args-label"], { opacity: 1, duration: 0.3 }, "+=0.4")
          .to(
            ["#chip-arg0", "#chip-arg1", "#chip-arg2", "#chip-arg3"],
            { opacity: 1, duration: 0.3, stagger: 0.08 },
            "+=0.1",
          )
          .to(["#first-box", "#first-label", "#rest-box", "#rest-array-label"], { opacity: 1, duration: 0.3 }, "+=0.2")
          .to("#chip-arg0", { x: 50, y: 263, duration: 0.5, ease: "power2.inOut" }, "+=0.15");
        restOrder.forEach((id, i) => {
          tl.to(id, { x: restSlotX[i], y: 263, duration: 0.5, ease: "power2.inOut" }, "+=0.1");
        });
        tl.to("#rest-code", { opacity: 1, duration: 0.4 }, "+=0.3");
      } else {
        // reduced motion: jump to labeled end-state
        tl.set(["#spread-label", "#a-label", "#b-label"], { opacity: 1 })
          .set(chipOrder, { opacity: 1 });
        chipOrder.forEach((id, i) => tl.set(id, { x: slotX[i], y: 137 }));
        tl.set(["#combined-box", "#combined-label"], { opacity: 1 })
          .set("#spread-code", { opacity: 1 })
          .set(["#rest-label", "#args-label"], { opacity: 1 })
          .set(["#chip-arg0", "#chip-arg1", "#chip-arg2", "#chip-arg3"], { opacity: 1 })
          .set("#chip-arg0", { x: 50, y: 263 });
        restOrder.forEach((id, i) => tl.set(id, { x: restSlotX[i], y: 263 }));
        tl.set(["#first-box", "#first-label", "#rest-box", "#rest-array-label"], { opacity: 1 })
          .set("#rest-code", { opacity: 1 });
      }
      register(tl);
      return tl;
    };
    mm.add("(prefers-reduced-motion: reduce)", () => { build(false); });
    mm.add("(prefers-reduced-motion: no-preference)", () => { build(true); });
    return () => mm.revert();
  }, { scope });

  const chip = (id: string, text: string) => (
    <g id={id} key={id}>
      <rect x="-18" y="-11" width="36" height="22" rx="5"
        className="fill-[var(--color-primary)] stroke-[var(--color-primary)]" opacity="0.15" />
      <rect x="-18" y="-11" width="36" height="22" rx="5" className="fill-none stroke-[var(--color-primary)]" />
      <text x="0" y="4" textAnchor="middle" className="fill-[var(--color-foreground)] text-[10px] font-mono">
        {text}
      </text>
    </g>
  );

  return (
    <svg ref={scope} viewBox="0 0 380 310" className="w-full max-w-md" role="img"
      aria-label="Spread explodes two source arrays, a and b, into one new combined array. Below it, the mirror motion: rest gathers function call arguments, peeling the first one into a separate variable and collecting the remaining three into a rest array">
      <text id="spread-label" x="15" y="20" opacity="0" className="fill-[var(--color-muted-foreground)] text-[10px]">
        Spread
      </text>
      <text id="a-label" x="20" y="35" opacity="0" className="fill-[var(--color-muted-foreground)] text-[10px]">
        a = [1, 2]
      </text>
      <text id="b-label" x="170" y="35" opacity="0" className="fill-[var(--color-muted-foreground)] text-[10px]">
        b = [3, 4]
      </text>

      {chip("chip-a1", "1")}
      {chip("chip-a2", "2")}
      {chip("chip-b1", "3")}
      {chip("chip-b2", "4")}

      <g id="combined-box" opacity="0">
        <rect x="20" y="118" width="200" height="38" rx="8" className="fill-none stroke-[var(--color-border)]" />
      </g>
      <text id="combined-label" x="20" y="110" opacity="0" className="fill-[var(--color-muted-foreground)] text-[10px]">
        combined
      </text>

      <text id="spread-code" x="20" y="180" opacity="0"
        className="fill-[var(--color-muted-foreground)] text-[10px] font-mono">
        [...a, ...b] = [1, 2, 3, 4]
      </text>

      <line x1="10" y1="192" x2="370" y2="192" className="stroke-[var(--color-border)]" />

      <text id="rest-label" x="15" y="212" opacity="0" className="fill-[var(--color-muted-foreground)] text-[10px]">
        Rest
      </text>
      <text id="args-label" x="80" y="212" opacity="0" className="fill-[var(--color-muted-foreground)] text-[10px]">
        sum(1, 2, 3, 4)
      </text>

      {chip("chip-arg0", "1")}
      {chip("chip-arg1", "2")}
      {chip("chip-arg2", "3")}
      {chip("chip-arg3", "4")}

      <g id="first-box" opacity="0">
        <rect x="20" y="245" width="60" height="36" rx="8" className="fill-none stroke-[var(--color-border)]" />
      </g>
      <text id="first-label" x="20" y="237" opacity="0" className="fill-[var(--color-muted-foreground)] text-[10px]">
        first
      </text>

      <g id="rest-box" opacity="0">
        <rect x="110" y="245" width="160" height="36" rx="8" className="fill-none stroke-[var(--color-border)]" />
      </g>
      <text id="rest-array-label" x="110" y="237" opacity="0" className="fill-[var(--color-muted-foreground)] text-[10px]">
        rest
      </text>

      <text id="rest-code" x="20" y="298" opacity="0"
        className="fill-[var(--color-muted-foreground)] text-[10px] font-mono">
        first = 1, rest = [2, 3, 4]
      </text>
    </svg>
  );
}
