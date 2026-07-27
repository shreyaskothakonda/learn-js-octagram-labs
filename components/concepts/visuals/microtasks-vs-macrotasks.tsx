"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";

export function MicrotasksVsMacrotasksVisual({ register }: ConceptVisualProps) {
  const scope = useRef<SVGSVGElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      // Scene: a script frame runs, scheduling a Promise.then into the left
      // microtask queue and a setTimeout(fn, 0) into the right macrotask queue
      // at essentially the same moment. Once the script finishes, the
      // microtask queue token is marked 1st and drains completely; only then
      // does the macrotask queue token get marked 2nd and run.
      gsap.set("#script-frame", { opacity: 0 });
      gsap.set(["#micro-token", "#macro-token"], { opacity: 0 });
      gsap.set(["#micro-order", "#macro-order"], { opacity: 0, scale: 0.6, transformOrigin: "50% 50%" });

      if (animate) {
        tl.to("#script-frame", { opacity: 1, duration: 0.3 })
          .to(["#micro-token", "#macro-token"], { opacity: 1, duration: 0.3, stagger: 0.1 }, "+=0.3")
          .to("#script-frame", { opacity: 0, duration: 0.3 }, "+=0.4")
          .to("#micro-token", { scale: 1.05, duration: 0.3, yoyo: true, repeat: 1, transformOrigin: "50% 50%" }, "+=0.3")
          .to("#micro-order", { opacity: 1, scale: 1, duration: 0.3 }, "<")
          .to("#micro-token", { opacity: 0.4, duration: 0.3 }, "+=0.2")
          .to("#macro-token", { scale: 1.05, duration: 0.3, yoyo: true, repeat: 1, transformOrigin: "50% 50%" }, "+=0.3")
          .to("#macro-order", { opacity: 1, scale: 1, duration: 0.3 }, "<")
          .to("#macro-token", { opacity: 0.4, duration: 0.3 }, "+=0.2");
      } else {
        // reduced motion: jump to labeled end-state, both drained in order
        tl.set("#script-frame", { opacity: 0 })
          .set(["#micro-token", "#macro-token"], { opacity: 0.4 })
          .set(["#micro-order", "#macro-order"], { opacity: 1, scale: 1 });
      }
      register(tl);
      return tl;
    };
    mm.add("(prefers-reduced-motion: reduce)", () => { build(false); });
    mm.add("(prefers-reduced-motion: no-preference)", () => { build(true); });
    return () => mm.revert();
  }, { scope });

  return (
    <svg ref={scope} viewBox="0 0 360 240" className="w-full max-w-md" role="img"
      aria-label="A running script schedules a Promise.then callback into the microtask queue and a setTimeout callback into the macrotask queue at nearly the same moment. Once the script finishes, the microtask queue drains first and is marked 1st, and only after it is fully empty does the macrotask queue's callback run, marked 2nd">
      <g id="script-frame">
        <rect x="110" y="16" width="140" height="34" rx="6" className="fill-[var(--color-muted)] stroke-[var(--color-border)]" />
        <text x="122" y="38" className="fill-[var(--color-foreground)] text-[10px]">script (sync)</text>
      </g>

      <rect x="16" y="66" width="150" height="150" rx="8" className="fill-none stroke-[var(--color-border)]" />
      <text x="26" y="82" className="fill-[var(--color-primary)] text-[10px]">Microtask Queue</text>

      <rect x="194" y="66" width="150" height="150" rx="8" className="fill-none stroke-[var(--color-border)]" />
      <text x="204" y="82" className="fill-[var(--color-secondary-foreground)] text-[10px]">Macrotask Queue</text>

      <g id="micro-token">
        <rect x="31" y="110" width="120" height="40" rx="6" className="fill-[var(--color-primary)]" opacity="0.15" />
        <rect x="31" y="110" width="120" height="40" rx="6" className="fill-none stroke-[var(--color-primary)]" />
        <text x="41" y="134" className="fill-[var(--color-foreground)] text-[10px]">Promise.then(fn)</text>
      </g>
      <g id="macro-token">
        <rect x="209" y="110" width="120" height="40" rx="6" className="fill-[var(--color-secondary)]" opacity="0.4" />
        <rect x="209" y="110" width="120" height="40" rx="6" className="fill-none stroke-[var(--color-secondary)]" />
        <text x="219" y="134" className="fill-[var(--color-foreground)] text-[10px]">setTimeout(fn, 0)</text>
      </g>

      <g id="micro-order">
        <circle cx="151" cy="110" r="14" className="fill-[var(--color-primary)]" />
        <text x="145" y="115" className="fill-[var(--color-background)] text-[11px] font-semibold">1</text>
      </g>
      <g id="macro-order">
        <circle cx="329" cy="110" r="14" className="fill-[var(--color-secondary)]" />
        <text x="323" y="115" className="fill-[var(--color-foreground)] text-[11px] font-semibold">2</text>
      </g>
    </svg>
  );
}
