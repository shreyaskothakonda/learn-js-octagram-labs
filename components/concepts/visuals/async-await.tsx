"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";

const CALLER_Y = 190;
const STACK_Y = 140;
const SUSPEND_DX = 170;
const SUSPEND_DY = -50;

export function AsyncAwaitVisual({ register }: ConceptVisualProps) {
  const scope = useRef<SVGSVGElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      // Scene: main() calls doStuff(), an async frame that pushes onto the
      // stack. It hits `await fetchData()`, parks itself in the dashed
      // "paused at await" slot, and the marker returns to main() so the caller
      // keeps running. A pending promise chip flips to resolved; only then
      // does doStuff()'s frame move back onto the stack (resumed) and finish.
      gsap.set("#async-frame", { opacity: 0, x: 0, y: 0 });
      gsap.set("#promise-pending", { opacity: 0 });
      gsap.set("#promise-resolved", { opacity: 0 });
      gsap.set("#marker", { opacity: 0, attr: { y: CALLER_Y - 4 } });

      if (animate) {
        tl.to("#marker", { opacity: 1, duration: 0.3 })
          .to("#async-frame", { opacity: 1, duration: 0.3 }, "+=0.3")
          .to("#marker", { attr: { y: STACK_Y - 4 }, duration: 0.4, ease: "power2.inOut" }, "<")
          .to("#async-frame", { x: SUSPEND_DX, y: SUSPEND_DY, duration: 0.5, ease: "power2.inOut" }, "+=0.3")
          .to("#marker", { attr: { y: CALLER_Y - 4 }, duration: 0.4, ease: "power2.inOut" }, "<")
          .to("#promise-pending", { opacity: 1, duration: 0.3 }, "<")
          .to("#promise-pending", { opacity: 0, duration: 0.3 }, "+=0.6")
          .to("#promise-resolved", { opacity: 1, duration: 0.3 }, "<")
          .to("#async-frame", { x: 0, y: 0, duration: 0.5, ease: "power2.inOut" }, "+=0.3")
          .to("#marker", { attr: { y: STACK_Y - 4 }, duration: 0.4, ease: "power2.inOut" }, "<")
          .to("#async-frame", { opacity: 0, duration: 0.3 }, "+=0.4")
          .to("#marker", { attr: { y: CALLER_Y - 4 }, duration: 0.4, ease: "power2.inOut" }, "<");
      } else {
        // reduced motion: jump to labeled end-state, doStuff() has resumed,
        // finished, and returned control to the caller
        tl.set("#async-frame", { opacity: 0, x: 0, y: 0 })
          .set("#promise-pending", { opacity: 0 })
          .set("#promise-resolved", { opacity: 1 })
          .set("#marker", { opacity: 1, attr: { y: CALLER_Y - 4 } });
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
      aria-label="main calls doStuff, an async function whose frame pushes onto the call stack. When doStuff hits await fetchData, its frame parks in a paused-at-await slot and the highlighted, currently-running frame returns to main, so the caller keeps going while the promise is still pending. Once the promise resolves, doStuff's frame resumes, is highlighted again, and finishes, returning control to main">
      <rect x="20" y={CALLER_Y} width="140" height="38" rx="6"
        className="fill-[var(--color-muted)] stroke-[var(--color-border)]" />
      <text x="34" y={CALLER_Y + 24} className="fill-[var(--color-foreground)] text-[11px]">main()</text>

      <rect x="190" y="90" width="150" height="38" rx="6" strokeDasharray="4 3"
        className="fill-none stroke-[var(--color-border)]" />
      <text x="190" y="82" className="fill-[var(--color-muted-foreground)] text-[10px]">paused at await</text>

      <rect x="190" y="150" width="150" height="50" rx="8" className="fill-none stroke-[var(--color-border)]" />
      <text x="200" y="143" className="fill-[var(--color-muted-foreground)] text-[10px]">fetchData()</text>
      <text id="promise-pending" x="200" y="180" className="fill-[var(--color-muted-foreground)] text-[11px]">pending</text>
      <text id="promise-resolved" x="200" y="180" className="fill-[var(--color-primary)] text-[11px]" opacity="0">resolved</text>

      <g id="async-frame">
        <rect x="20" y={STACK_Y} width="140" height="38" rx="6"
          className="fill-[var(--color-primary)]" opacity="0.15" />
        <rect x="20" y={STACK_Y} width="140" height="38" rx="6"
          className="fill-none stroke-[var(--color-primary)]" />
        <text x="30" y={STACK_Y + 24} className="fill-[var(--color-foreground)] text-[10px]">doStuff() [async]</text>
      </g>

      <rect id="marker" x="16" y={CALLER_Y - 4} width="148" height="46" rx="8"
        className="fill-none stroke-[var(--color-primary)]" strokeWidth="3" opacity="0" />
    </svg>
  );
}
