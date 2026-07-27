"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";

export function TheThisKeywordVisual({ register }: ConceptVisualProps) {
  const scope = useRef<SVGSVGElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      // Scene: four panels, one call site each, showing how `this` re-points
      // depending on how showThis() is invoked: method, standalone, call/bind,
      // and arrow (lexical).
      const groups = ["A", "B", "C", "D"];
      for (const g of groups) {
        gsap.set([`#panel${g}-box`, `#panel${g}-code`, `#panel${g}-arrow`], { opacity: 0 });
        gsap.set(`#panel${g}-result`, { opacity: 0, scale: 0.7, transformOrigin: "50% 50%" });
      }

      if (animate) {
        for (const g of groups) {
          tl.to([`#panel${g}-box`, `#panel${g}-code`], { opacity: 1, duration: 0.3 }, g === "A" ? undefined : "+=0.3")
            .to(`#panel${g}-arrow`, { opacity: 1, duration: 0.2 }, "+=0.1")
            .to(`#panel${g}-result`, { opacity: 1, scale: 1, duration: 0.3 }, "+=0.05");
        }
      } else {
        // reduced motion: jump to labeled end-state, all four panels resolved
        for (const g of groups) {
          tl.set([`#panel${g}-box`, `#panel${g}-code`, `#panel${g}-arrow`], { opacity: 1 })
            .set(`#panel${g}-result`, { opacity: 1, scale: 1 });
        }
      }
      register(tl);
      return tl;
    };
    mm.add("(prefers-reduced-motion: reduce)", () => { build(false); });
    mm.add("(prefers-reduced-motion: no-preference)", () => { build(true); });
    return () => mm.revert();
  }, { scope });

  const panel = (id: string, x: number, y: number, code: string, result: string) => (
    <g>
      <rect id={`panel${id}-box`} x={x} y={y} width="170" height="120" rx="8"
        className="fill-[var(--color-muted)] stroke-[var(--color-border)]" opacity="0" />
      <text id={`panel${id}-code`} x={x + 10} y={y + 22} className="fill-[var(--color-foreground)] text-[10px]" opacity="0">
        {code}
      </text>
      <g id={`panel${id}-arrow`} opacity="0">
        <line x1={x + 85} y1={y + 35} x2={x + 85} y2={y + 65}
          className="stroke-[var(--color-muted-foreground)]" strokeWidth="2" />
        <polygon points={`${x + 80},${y + 62} ${x + 90},${y + 62} ${x + 85},${y + 70}`}
          className="fill-[var(--color-muted-foreground)]" />
      </g>
      <g id={`panel${id}-result`} opacity="0">
        <rect x={x + 15} y={y + 78} width="140" height="30" rx="6"
          className="fill-[var(--color-primary)] stroke-[var(--color-primary)]" opacity="0.15" />
        <rect x={x + 15} y={y + 78} width="140" height="30" rx="6"
          className="fill-none stroke-[var(--color-primary)]" />
        <text x={x + 85} y={y + 98} textAnchor="middle" className="fill-[var(--color-foreground)] text-[10px]">
          {result}
        </text>
      </g>
    </g>
  );

  return (
    <svg ref={scope} viewBox="0 0 380 280" className="w-full max-w-md" role="img"
      aria-label="Four panels show showThis called four ways: as a method this becomes the object, called standalone this becomes undefined, called with call or bind this becomes the chosen object, and as an arrow function this stays lexical">
      {panel("A", 10, 10, "person.showThis()", "this = person")}
      {panel("B", 200, 10, "showThis()", "this = undefined")}
      {panel("C", 10, 150, "showThis.call(user)", "this = user")}
      {panel("D", 200, 150, "() => this  (inside method)", "this = enclosing")}
    </svg>
  );
}
