"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";

export function PrototypesInheritanceVisual({ register }: ConceptVisualProps) {
  const scope = useRef<SVGSVGElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      // Scene: an instance box (rex) sits above a prototype box (Dog.prototype),
      // linked by a __proto__ arrow. A lookup token for .speak checks the
      // instance first (miss), then walks the arrow down to the prototype,
      // finds speak() there (hit), and the call result appears.
      gsap.set(["#instance-box", "#instance-label", "#instance-prop", "#proto-arrow", "#proto-arrowhead",
        "#proto-arrow-label", "#proto-box", "#proto-label", "#proto-method"], { opacity: 0 });
      gsap.set(["#highlight-instance", "#highlight-proto"], { opacity: 0 });
      gsap.set("#token", { x: 250, y: 50, opacity: 0 });
      gsap.set("#result-text", { opacity: 0 });

      if (animate) {
        tl.to(["#instance-box", "#instance-label", "#instance-prop"], { opacity: 1, duration: 0.4 })
          .to(["#proto-arrow", "#proto-arrowhead", "#proto-arrow-label"], { opacity: 1, duration: 0.3 }, "+=0.15")
          .to(["#proto-box", "#proto-label", "#proto-method"], { opacity: 1, duration: 0.3 }, "+=0.05")
          .to("#token", { opacity: 1, duration: 0.3 }, "+=0.25")
          .to("#highlight-instance", { opacity: 1, duration: 0.2 })
          .to("#highlight-instance", { opacity: 0, duration: 0.2 }, "+=0.3")
          .to("#token", { x: 250, y: 175, duration: 0.6, ease: "power2.inOut" }, "+=0.1")
          .to("#highlight-proto", { opacity: 1, duration: 0.2 })
          .to("#result-text", { opacity: 1, duration: 0.3 }, "+=0.2");
      } else {
        // reduced motion: jump to labeled end-state
        tl.set(["#instance-box", "#instance-label", "#instance-prop", "#proto-arrow", "#proto-arrowhead",
          "#proto-arrow-label", "#proto-box", "#proto-label", "#proto-method"], { opacity: 1 })
          .set("#token", { opacity: 0 })
          .set("#highlight-proto", { opacity: 1 })
          .set("#result-text", { opacity: 1 });
      }
      register(tl);
      return tl;
    };
    mm.add("(prefers-reduced-motion: reduce)", () => { build(false); });
    mm.add("(prefers-reduced-motion: no-preference)", () => { build(true); });
    return () => mm.revert();
  }, { scope });

  return (
    <svg ref={scope} viewBox="0 0 360 260" className="w-full max-w-md" role="img"
      aria-label="rex.speak() finds no own speak property on the rex instance, walks the __proto__ link down to Dog.prototype, finds speak there, and returns Rex barks">
      <rect id="instance-box" x="90" y="15" width="180" height="70" rx="10"
        className="fill-[var(--color-muted)] stroke-[var(--color-border)]" opacity="0" />
      <text id="instance-label" x="100" y="34" className="fill-[var(--color-muted-foreground)] text-[11px]" opacity="0">
        rex (instance)
      </text>
      <text id="instance-prop" x="100" y="58" className="fill-[var(--color-foreground)] text-[11px]" opacity="0">
        name: &quot;Rex&quot;
      </text>
      <rect id="highlight-instance" x="90" y="15" width="180" height="70" rx="10"
        className="fill-none stroke-[var(--color-destructive)]" strokeWidth="3" opacity="0" />

      <line id="proto-arrow" x1="180" y1="85" x2="180" y2="138" className="stroke-[var(--color-muted-foreground)]"
        strokeWidth="2" opacity="0" />
      <polygon id="proto-arrowhead" points="180,140 174,128 186,128" className="fill-[var(--color-muted-foreground)]"
        opacity="0" />
      <text id="proto-arrow-label" x="188" y="115" className="fill-[var(--color-muted-foreground)] text-[10px]" opacity="0">
        __proto__
      </text>

      <rect id="proto-box" x="90" y="140" width="180" height="70" rx="10"
        className="fill-[var(--color-muted)] stroke-[var(--color-border)]" opacity="0" />
      <text id="proto-label" x="100" y="159" className="fill-[var(--color-muted-foreground)] text-[11px]" opacity="0">
        Dog.prototype
      </text>
      <text id="proto-method" x="100" y="183" className="fill-[var(--color-foreground)] text-[11px]" opacity="0">
        speak() {"{"} ... {"}"}
      </text>
      <rect id="highlight-proto" x="90" y="140" width="180" height="70" rx="10"
        className="fill-none stroke-[var(--color-primary)]" strokeWidth="3" opacity="0" />

      <g id="token">
        <circle cx="0" cy="0" r="14" className="fill-[var(--color-primary)]" opacity="0.15" />
        <circle cx="0" cy="0" r="14" className="fill-none stroke-[var(--color-primary)]" />
        <text x="0" y="4" textAnchor="middle" className="fill-[var(--color-foreground)] text-[9px]">.speak</text>
      </g>

      <text id="result-text" x="180" y="240" textAnchor="middle" opacity="0"
        className="fill-[var(--color-primary)] text-[11px]">
        rex.speak() returns &quot;Rex barks&quot;
      </text>
    </svg>
  );
}
