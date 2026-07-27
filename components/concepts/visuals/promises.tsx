"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";

export function PromisesVisual({ register }: ConceptVisualProps) {
  const scope = useRef<SVGSVGElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      // Scene: a pending promise chip sits between two possible paths, one to a
      // fulfilled bin with a lit .then handler, one to a rejected bin with a
      // .catch handler. The chip settles down the fulfilled path exactly once;
      // the rejected path and .catch handler stay dim the whole time, showing
      // the road not taken.
      gsap.set("#promise-chip", { x: 0, y: 0 });
      gsap.set("#label-pending", { opacity: 1 });
      gsap.set("#label-fulfilled", { opacity: 0 });
      gsap.set("#path-fulfilled", { opacity: 0.25 });
      gsap.set("#bin-fulfilled-glow", { opacity: 0 });
      gsap.set("#then-box-glow", { opacity: 0 });

      if (animate) {
        tl.to("#promise-chip", { scale: 1.06, duration: 0.35, yoyo: true, repeat: 1, transformOrigin: "50% 50%" }, "+=0.2")
          .to("#path-fulfilled", { opacity: 1, duration: 0.3 }, "+=0.2")
          .to("#promise-chip", { x: -70, y: 105, duration: 0.6, ease: "power2.inOut" }, "<")
          .to("#label-pending", { opacity: 0, duration: 0.2 }, "-=0.2")
          .to("#label-fulfilled", { opacity: 1, duration: 0.2 }, "<")
          .to("#bin-fulfilled-glow", { opacity: 1, duration: 0.3 }, "-=0.1")
          .to("#then-box-glow", { opacity: 1, duration: 0.3 }, "+=0.2");
      } else {
        // reduced motion: jump to labeled end-state, settled fulfilled
        tl.set("#promise-chip", { x: -70, y: 105 })
          .set("#label-pending", { opacity: 0 })
          .set("#label-fulfilled", { opacity: 1 })
          .set("#path-fulfilled", { opacity: 1 })
          .set("#bin-fulfilled-glow", { opacity: 1 })
          .set("#then-box-glow", { opacity: 1 });
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
      aria-label="A pending promise chip settles down the fulfilled path into a fulfilled bin, lighting up its then handler. The rejected path, rejected bin, and catch handler stay dim the whole time, since a promise settles exactly once, to fulfilled or rejected, never both">
      <line id="path-fulfilled" x1="150" y1="55" x2="90" y2="105"
        className="stroke-[var(--color-primary)]" strokeWidth="2" />
      <line id="path-rejected" x1="210" y1="55" x2="270" y2="105"
        className="stroke-[var(--color-destructive)]" strokeWidth="2" opacity="0.25" />

      <g id="promise-chip">
        <rect x="130" y="20" width="100" height="40" rx="8" className="fill-[var(--color-muted)] stroke-[var(--color-border)]" />
        <text id="label-pending" x="150" y="45" className="fill-[var(--color-muted-foreground)] text-[11px]">pending</text>
        <text id="label-fulfilled" x="145" y="45" className="fill-[var(--color-primary)] text-[11px]" opacity="0">fulfilled</text>
      </g>

      <g id="bin-fulfilled">
        <rect x="20" y="105" width="140" height="46" rx="8" className="fill-none stroke-[var(--color-border)]" />
        <g id="bin-fulfilled-glow" opacity="0">
          <rect x="20" y="105" width="140" height="46" rx="8" className="fill-[var(--color-primary)]" opacity="0.15" />
          <rect x="20" y="105" width="140" height="46" rx="8" className="fill-none stroke-[var(--color-primary)]" />
        </g>
        <text x="30" y="98" className="fill-[var(--color-primary)] text-[10px]">fulfilled</text>
      </g>
      <g id="bin-rejected">
        <rect x="200" y="105" width="140" height="46" rx="8" className="fill-none stroke-[var(--color-destructive)]" opacity="0.35" />
        <text x="210" y="98" className="fill-[var(--color-destructive)] text-[10px]" opacity="0.6">rejected</text>
      </g>

      <g id="then-box">
        <rect x="20" y="175" width="140" height="42" rx="8" className="fill-none stroke-[var(--color-border)]" />
        <g id="then-box-glow" opacity="0">
          <rect x="20" y="175" width="140" height="42" rx="8" className="fill-[var(--color-primary)]" opacity="0.15" />
          <rect x="20" y="175" width="140" height="42" rx="8" className="fill-none stroke-[var(--color-primary)]" />
        </g>
        <text x="30" y="200" className="fill-[var(--color-foreground)] text-[10px]">.then(onFulfilled)</text>
      </g>
      <g id="catch-box">
        <rect x="200" y="175" width="140" height="42" rx="8" className="fill-none stroke-[var(--color-border)]" opacity="0.5" />
        <text x="210" y="200" className="fill-[var(--color-muted-foreground)] text-[10px]">.catch(onRejected)</text>
      </g>
    </svg>
  );
}
