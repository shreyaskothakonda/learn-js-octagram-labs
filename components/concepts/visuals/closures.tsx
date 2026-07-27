"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";

export function ClosuresVisual({ register }: ConceptVisualProps) {
  const scope = useRef<SVGSVGElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      // Scene: outer() box with a `count` chip; a returned function ("backpack")
      // leaves the box carrying the chip; two calls increment the chip.
      gsap.set("#backpack", { x: 0, opacity: 0 });
      gsap.set(".count-chip", { textContent: "0" });
      if (animate) {
        tl.to("#outer-box", { opacity: 1, duration: 0.4 })
          .to("#backpack", { opacity: 1, duration: 0.3 }, "+=0.2")
          .to("#backpack", { x: 160, duration: 0.8, ease: "power2.inOut" }, "+=0.3")
          .to(".count-chip", { textContent: "1", duration: 0.2, snap: { textContent: 1 } }, "+=0.4")
          .to(".count-chip", { textContent: "2", duration: 0.2, snap: { textContent: 1 } }, "+=0.6");
      } else {
        // reduced motion: jump to labeled end-state
        tl.set("#outer-box", { opacity: 1 })
          .set("#backpack", { opacity: 1, x: 160 })
          .set(".count-chip", { textContent: "2" });
      }
      register(tl);
      return tl;
    };
    mm.add("(prefers-reduced-motion: reduce)", () => { build(false); });
    mm.add("(prefers-reduced-motion: no-preference)", () => { build(true); });
    return () => mm.revert();
  }, { scope });

  return (
    <svg ref={scope} viewBox="0 0 360 220" className="w-full max-w-md" role="img"
      aria-label="A returned function carries its count variable out of the outer function's scope">
      <rect id="outer-box" x="10" y="30" width="150" height="150" rx="10"
        className="fill-[var(--color-muted)] stroke-[var(--color-border)]" opacity="0" />
      <text x="20" y="50" className="fill-[var(--color-muted-foreground)] text-[11px]">makeCounter()</text>
      <g id="backpack">
        <rect x="40" y="90" width="90" height="40" rx="8"
          className="fill-[var(--color-primary)]" opacity="0.15" />
        <rect x="40" y="90" width="90" height="40" rx="8"
          className="fill-none stroke-[var(--color-primary)]" />
        <text x="52" y="108" className="fill-[var(--color-foreground)] text-[11px]">count:</text>
        <text x="98" y="108" className="count-chip fill-[var(--color-foreground)] text-[11px]">0</text>
        <text x="52" y="124" className="fill-[var(--color-muted-foreground)] text-[10px]">() =&gt; ++count</text>
      </g>
    </svg>
  );
}
