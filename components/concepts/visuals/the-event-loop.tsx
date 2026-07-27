"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";

export function TheEventLoopVisual({ register }: ConceptVisualProps) {
  const scope = useRef<SVGSVGElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      // Scene: main() runs on the call stack, logging 1, registering a setTimeout
      // (sent to the Web API panel) and a resolved Promise.then (sent straight to
      // the microtask queue), then logging 2. Once main() pops and the stack is
      // empty, the microtask token moves up to run first (logging 3), fully
      // draining the microtask queue. Only then does the timer token move from
      // the Web API into the macrotask queue and finally up to run (logging 4),
      // showing the full order 1, 2, 3, 4 build up at the bottom.
      gsap.set("#main-frame", { opacity: 0 });
      gsap.set("#webapi-token", { opacity: 0, x: 0, y: 0 });
      gsap.set("#micro-token", { opacity: 0, x: 0, y: 0 });
      gsap.set(["#out-1", "#out-2", "#out-3", "#out-4"], { opacity: 0 });

      if (animate) {
        tl.to("#main-frame", { opacity: 1, duration: 0.3 })
          .to("#out-1", { opacity: 1, duration: 0.2 }, "+=0.2")
          .to("#webapi-token", { opacity: 1, duration: 0.3 }, "+=0.3")
          .to("#micro-token", { opacity: 1, duration: 0.3 }, "+=0.25")
          .to("#out-2", { opacity: 1, duration: 0.2 }, "+=0.25")
          .to("#main-frame", { opacity: 0, duration: 0.3 }, "+=0.3")
          .to("#micro-token", { x: 0, y: -90, duration: 0.5, ease: "power2.inOut" }, "+=0.35")
          .to("#out-3", { opacity: 1, duration: 0.2 }, "+=0.1")
          .to("#micro-token", { opacity: 0, duration: 0.25 }, "+=0.15")
          .to("#webapi-token", { x: -190, y: 166, duration: 0.5, ease: "power2.inOut" }, "+=0.2")
          .to("#webapi-token", { x: -190, y: 0, duration: 0.5, ease: "power2.inOut" }, "+=0.3")
          .to("#out-4", { opacity: 1, duration: 0.2 }, "+=0.1")
          .to("#webapi-token", { opacity: 0, duration: 0.25 }, "+=0.15");
      } else {
        // reduced motion: jump to labeled end-state, everything has run and
        // the output order 1, 2, 3, 4 is fully visible
        tl.set("#main-frame", { opacity: 0 })
          .set("#micro-token", { opacity: 0, x: 0, y: -90 })
          .set("#webapi-token", { opacity: 0, x: -190, y: 0 })
          .set(["#out-1", "#out-2", "#out-3", "#out-4"], { opacity: 1 });
      }
      register(tl);
      return tl;
    };
    mm.add("(prefers-reduced-motion: reduce)", () => { build(false); });
    mm.add("(prefers-reduced-motion: no-preference)", () => { build(true); });
    return () => mm.revert();
  }, { scope });

  return (
    <svg ref={scope} viewBox="0 0 390 320" className="w-full max-w-md" role="img"
      aria-label="main runs console.log(1), registers a setTimeout callback with the Web API and a resolved Promise.then callback directly in the microtask queue, then runs console.log(2). Once main returns and the call stack is empty, the microtask queue drains first, running the then callback and logging 3, and only after the microtask queue is empty does the event loop take the one setTimeout callback from the macrotask queue and run it, logging 4. Final order: 1, 2, 3, 4">
      <rect x="14" y="14" width="170" height="90" rx="8" className="fill-none stroke-[var(--color-border)]" />
      <text x="24" y="30" className="fill-[var(--color-muted-foreground)] text-[10px]">Call Stack</text>

      <rect x="204" y="14" width="172" height="90" rx="8" className="fill-none stroke-[var(--color-border)]" />
      <text x="214" y="30" className="fill-[var(--color-muted-foreground)] text-[10px]">Web API: Timer</text>

      <rect x="14" y="120" width="362" height="60" rx="8" className="fill-none stroke-[var(--color-border)]" />
      <text x="24" y="136" className="fill-[var(--color-muted-foreground)] text-[10px]">Microtask Queue (Promise callbacks)</text>

      <rect x="14" y="196" width="362" height="60" rx="8" className="fill-none stroke-[var(--color-border)]" />
      <text x="24" y="212" className="fill-[var(--color-muted-foreground)] text-[10px]">Macrotask Queue (timers, I/O)</text>

      <g id="main-frame">
        <rect x="34" y="50" width="130" height="36" rx="6" className="fill-[var(--color-primary)]" opacity="0.15" />
        <rect x="34" y="50" width="130" height="36" rx="6" className="fill-none stroke-[var(--color-primary)]" />
        <text x="46" y="73" className="fill-[var(--color-foreground)] text-[11px]">main()</text>
      </g>

      <g id="webapi-token">
        <rect x="224" y="50" width="140" height="36" rx="6" className="fill-[var(--color-secondary)]" opacity="0.4" />
        <rect x="224" y="50" width="140" height="36" rx="6" className="fill-none stroke-[var(--color-secondary)]" />
        <text x="234" y="73" className="fill-[var(--color-foreground)] text-[10px]">setTimeout(fn, 0)</text>
      </g>

      <g id="micro-token">
        <rect x="34" y="140" width="150" height="30" rx="6" className="fill-[var(--color-primary)]" opacity="0.15" />
        <rect x="34" y="140" width="150" height="30" rx="6" className="fill-none stroke-[var(--color-primary)]" />
        <text x="44" y="160" className="fill-[var(--color-foreground)] text-[10px]">.then(fn)</text>
      </g>

      <text x="14" y="300" className="fill-[var(--color-muted-foreground)] text-[10px]">console.log order:</text>
      <text id="out-1" x="150" y="300" className="fill-[var(--color-foreground)] text-[12px] font-semibold">1</text>
      <text id="out-2" x="175" y="300" className="fill-[var(--color-foreground)] text-[12px] font-semibold">2</text>
      <text id="out-3" x="200" y="300" className="fill-[var(--color-foreground)] text-[12px] font-semibold">3</text>
      <text id="out-4" x="225" y="300" className="fill-[var(--color-foreground)] text-[12px] font-semibold">4</text>
    </svg>
  );
}
