"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";

export function HigherOrderFunctionsVisual({ register }: ConceptVisualProps) {
  const scope = useRef<SVGSVGElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      // Scene, top half: process(4, double) takes a function in as an argument.
      // The double chip flies into the process box, gets called back on 4, and
      // the result flies out. Scene, bottom half: multiplyBy(3) returns a brand
      // new function, which flies out of its box and is called later with 5.
      gsap.set(["#top-label", "#top-code"], { opacity: 0 });
      gsap.set("#double-chip", { x: 0, opacity: 0 });
      gsap.set("#process-box", { opacity: 0 });
      gsap.set("#callback-arrow", { opacity: 0 });
      gsap.set("#call-label", { opacity: 0 });
      gsap.set("#top-result", { opacity: 0 });

      gsap.set(["#bottom-label", "#bottom-code"], { opacity: 0 });
      gsap.set("#factory-box", { opacity: 0 });
      gsap.set("#returned-fn", { x: 0, opacity: 0 });
      gsap.set("#call-later-code", { opacity: 0 });
      gsap.set("#bottom-arrow", { opacity: 0 });
      gsap.set("#bottom-result", { opacity: 0 });

      if (animate) {
        tl.to(["#top-label", "#top-code"], { opacity: 1, duration: 0.3 })
          .to("#process-box", { opacity: 1, duration: 0.3 }, "+=0.1")
          .to("#double-chip", { opacity: 1, duration: 0.3 }, "+=0.2")
          .to("#double-chip", { x: 90, duration: 0.7, ease: "power2.inOut" }, "+=0.2")
          .to("#call-label", { opacity: 1, duration: 0.3 }, "+=0.15")
          .to("#callback-arrow", { opacity: 1, duration: 0.2 }, "<")
          .to("#top-result", { opacity: 1, duration: 0.3 }, "+=0.25")
          .to(["#bottom-label", "#bottom-code"], { opacity: 1, duration: 0.3 }, "+=0.5")
          .to("#factory-box", { opacity: 1, duration: 0.3 }, "+=0.1")
          .to("#returned-fn", { opacity: 1, duration: 0.3 }, "+=0.2")
          .to("#returned-fn", { x: 120, duration: 0.7, ease: "power2.inOut" }, "+=0.15")
          .to("#call-later-code", { opacity: 1, duration: 0.3 }, "+=0.2")
          .to("#bottom-arrow", { opacity: 1, duration: 0.2 }, "<")
          .to("#bottom-result", { opacity: 1, duration: 0.3 }, "+=0.25");
      } else {
        // reduced motion: jump to labeled end-state
        tl.set(["#top-label", "#top-code", "#process-box"], { opacity: 1 })
          .set("#double-chip", { opacity: 1, x: 90 })
          .set(["#call-label", "#callback-arrow", "#top-result"], { opacity: 1 })
          .set(["#bottom-label", "#bottom-code", "#factory-box"], { opacity: 1 })
          .set("#returned-fn", { opacity: 1, x: 120 })
          .set(["#call-later-code", "#bottom-arrow", "#bottom-result"], { opacity: 1 });
      }
      register(tl);
      return tl;
    };
    mm.add("(prefers-reduced-motion: reduce)", () => { build(false); });
    mm.add("(prefers-reduced-motion: no-preference)", () => { build(true); });
    return () => mm.revert();
  }, { scope });

  return (
    <svg ref={scope} viewBox="0 0 380 300" className="w-full max-w-md" role="img"
      aria-label="A function double is passed into process as an argument and called back, producing a result. Below, multiplyBy returns a brand new function, which is called later on its own">
      <text id="top-label" x="15" y="20" opacity="0" className="fill-[var(--color-muted-foreground)] text-[10px]">
        A function passed in and called back
      </text>
      <text id="top-code" x="15" y="38" opacity="0" className="fill-[var(--color-foreground)] text-[11px] font-mono">
        process(4, double)
      </text>

      <rect id="process-box" x="15" y="50" width="130" height="70" rx="10" opacity="0"
        className="fill-[var(--color-muted)] stroke-[var(--color-border)]" />
      <g id="double-chip">
        <rect x="20" y="75" width="80" height="34" rx="8" className="fill-[var(--color-primary)]" opacity="0.15" />
        <rect x="20" y="75" width="80" height="34" rx="8" className="fill-none stroke-[var(--color-primary)]" />
        <text x="32" y="97" className="fill-[var(--color-foreground)] text-[11px] font-mono">double</text>
      </g>
      <text id="call-label" x="30" y="60" opacity="0" className="fill-[var(--color-muted-foreground)] text-[9px] font-mono">
        op(x) called back
      </text>
      <path id="callback-arrow" d="M 145 100 L 190 100" opacity="0"
        className="stroke-[var(--color-muted-foreground)]" strokeWidth="2" markerEnd="url(#hof-arrowhead)" />
      <text id="top-result" x="200" y="105" opacity="0" className="fill-[var(--color-primary)] text-[13px] font-mono">
        = 8
      </text>

      <line x1="10" y1="140" x2="370" y2="140" className="stroke-[var(--color-border)]" />

      <text id="bottom-label" x="15" y="162" opacity="0" className="fill-[var(--color-muted-foreground)] text-[10px]">
        A function returned as a new function
      </text>
      <text id="bottom-code" x="15" y="180" opacity="0" className="fill-[var(--color-foreground)] text-[11px] font-mono">
        const triple = multiplyBy(3)
      </text>

      <rect id="factory-box" x="15" y="192" width="120" height="70" rx="10" opacity="0"
        className="fill-[var(--color-muted)] stroke-[var(--color-border)]" />
      <g id="returned-fn">
        <rect x="20" y="217" width="110" height="34" rx="8" className="fill-[var(--color-secondary)]" opacity="0.2" />
        <rect x="20" y="217" width="110" height="34" rx="8" className="fill-none stroke-[var(--color-secondary)]" />
        <text x="30" y="239" className="fill-[var(--color-foreground)] text-[10px] font-mono">n =&gt; n * 3</text>
      </g>

      <text id="call-later-code" x="150" y="290" opacity="0" className="fill-[var(--color-foreground)] text-[11px] font-mono">
        triple(5)
      </text>
      <path id="bottom-arrow" d="M 210 285 L 250 285" opacity="0"
        className="stroke-[var(--color-muted-foreground)]" strokeWidth="2" markerEnd="url(#hof-arrowhead)" />
      <text id="bottom-result" x="260" y="290" opacity="0" className="fill-[var(--color-primary)] text-[13px] font-mono">
        = 15
      </text>

      <defs>
        <marker id="hof-arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" className="fill-[var(--color-muted-foreground)]" />
        </marker>
      </defs>
    </svg>
  );
}
