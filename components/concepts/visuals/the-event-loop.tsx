"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";

// "Runtime Instruments" style: HTML/CSS panels animated by GSAP. A single
// accent focus (ring + soft glow) marks the element the runtime is executing
// right now, gliding from frame to frame. Colors come from theme tokens.
const GLOW = "0 0 0 1.5px var(--color-primary), 0 10px 28px -10px var(--color-primary)";

function Panel({ label, style }: { label: string; style: React.CSSProperties }) {
  return (
    <div
      className="absolute rounded-xl border border-border bg-[var(--color-muted)]/30"
      style={style}
    >
      <span className="absolute left-3 top-2 font-sans text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

export function TheEventLoopVisual({ register }: ConceptVisualProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      const focusOn = (sel: string, at?: string) =>
        tl.to(`${sel} .glow`, { opacity: 1, duration: 0.3, ease: "power2.out" }, at)
          .to(sel, { scale: 1.03, duration: 0.3, ease: "power2.out" }, "<");
      const focusOff = (sel: string, at?: string) =>
        tl.to(`${sel} .glow`, { opacity: 0, duration: 0.3, ease: "power2.out" }, at)
          .to(sel, { scale: 1, duration: 0.3, ease: "power2.out" }, "<");

      gsap.set(["#main-frame", "#tok-timer", "#tok-then"], { opacity: 0, y: 12 });
      gsap.set(".glow", { opacity: 0 });
      gsap.set(["#out-1", "#out-2", "#out-3", "#out-4"], { opacity: 0, scale: 0.8 });

      if (animate) {
        // main() runs
        tl.to("#main-frame", { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" });
        focusOn("#main-frame", "-=0.15");
        tl.to("#out-1", { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.6)" }, "+=0.15");
        // it schedules a timer (Web API) and a microtask (.then)
        tl.to("#tok-timer", { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }, "+=0.25");
        tl.to("#tok-then", { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }, "+=0.2");
        tl.to("#out-2", { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.6)" }, "+=0.15");
        // main() returns, stack empties
        focusOff("#main-frame", "+=0.2");
        tl.to("#main-frame", { opacity: 0, y: 12, duration: 0.35, ease: "power2.in" }, "-=0.15");
        // microtask queue drains first
        tl.to("#tok-then", { x: 4, y: -104, duration: 0.6, ease: "power2.inOut" }, "+=0.25");
        focusOn("#tok-then");
        tl.to("#out-3", { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.6)" }, "+=0.15");
        focusOff("#tok-then", "+=0.2");
        tl.to("#tok-then", { opacity: 0, duration: 0.3, ease: "power2.in" }, "-=0.15");
        // only now the one macrotask runs: timer moves to macrotask queue, then up
        tl.to("#tok-timer", { x: -216, y: 178, duration: 0.6, ease: "power2.inOut" }, "+=0.25");
        tl.to("#tok-timer", { x: -212, y: 0, duration: 0.6, ease: "power2.inOut" }, "+=0.3");
        focusOn("#tok-timer");
        tl.to("#out-4", { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.6)" }, "+=0.15");
        focusOff("#tok-timer", "+=0.2");
        tl.to("#tok-timer", { opacity: 0, duration: 0.3, ease: "power2.in" }, "-=0.15");
      } else {
        tl.set(["#main-frame", "#tok-timer", "#tok-then"], { opacity: 0 })
          .set(["#out-1", "#out-2", "#out-3", "#out-4"], { opacity: 1, scale: 1 });
      }
      register(tl);
      return tl;
    };
    mm.add("(prefers-reduced-motion: reduce)", () => { build(false); });
    mm.add("(prefers-reduced-motion: no-preference)", () => { build(true); });
    return () => mm.revert();
  }, { scope });

  const frame = "absolute rounded-lg border border-border bg-card shadow-sm font-mono text-[12px] text-foreground flex items-center px-3";

  return (
    <div
      ref={scope}
      className="relative mx-auto"
      style={{ width: 400, height: 320 }}
      role="img"
      aria-label="main runs and logs 1, schedules a setTimeout callback in the Web API and a resolved Promise then callback in the microtask queue, then logs 2. When main returns and the call stack empties, the microtask queue drains first and logs 3, and only then does the single macrotask (the timer callback) run and log 4. Final order: 1, 2, 3, 4."
    >
      <Panel label="Call stack" style={{ left: 0, top: 0, width: 188, height: 96 }} />
      <Panel label="Web API" style={{ left: 212, top: 0, width: 188, height: 96 }} />
      <Panel label="Microtask queue" style={{ left: 0, top: 112, width: 400, height: 66 }} />
      <Panel label="Macrotask queue" style={{ left: 0, top: 190, width: 400, height: 66 }} />

      <div id="main-frame" className={frame} style={{ left: 16, top: 40, width: 150, height: 44 }}>
        <span className="glow pointer-events-none absolute inset-0 rounded-lg" style={{ boxShadow: GLOW }} />
        main()
      </div>
      <div id="tok-timer" className={frame} style={{ left: 226, top: 40, width: 160, height: 44 }}>
        <span className="glow pointer-events-none absolute inset-0 rounded-lg" style={{ boxShadow: GLOW }} />
        setTimeout(fn, 0)
      </div>
      <div id="tok-then" className={frame} style={{ left: 12, top: 138, width: 180, height: 34 }}>
        <span className="glow pointer-events-none absolute inset-0 rounded-lg" style={{ boxShadow: GLOW }} />
        .then(fn)
      </div>

      <div className="absolute flex items-center gap-2" style={{ left: 4, top: 284 }}>
        <span className="font-sans text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          Output
        </span>
        {["1", "2", "3", "4"].map((n, i) => (
          <span
            key={n}
            id={`out-${i + 1}`}
            className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-[var(--color-primary)]/10 font-mono text-[12px] font-semibold text-[var(--color-primary)]"
          >
            {n}
          </span>
        ))}
      </div>
    </div>
  );
}
