"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";

export function LetConstVarTdzVisual({ register }: ConceptVisualProps) {
  const scope = useRef<SVGSVGElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      // Scene: var is hoisted and reads as undefined from the top. A red
      // temporal-dead-zone band covers the region before `let count = 5;`.
      // A playhead steps downward: reading count inside the band throws,
      // the band clears once the let line runs, and reading count after
      // that succeeds and returns 5.
      gsap.set("#scope-box", { opacity: 0 });
      gsap.set(["#var-line", "#var-chip", "#early-line", "#let-line", "#late-line"], { opacity: 0 });
      gsap.set("#tdz-band", { opacity: 0 });
      gsap.set("#playhead", { opacity: 0, attr: { y1: 48, y2: 48 } });
      gsap.set(["#error-mark", "#error-text", "#let-chip", "#success-mark", "#success-text"], { opacity: 0 });

      if (animate) {
        tl.to("#scope-box", { opacity: 1, duration: 0.4 })
          .to(["#var-line", "#var-chip"], { opacity: 1, duration: 0.3 }, "+=0.1")
          .to(["#early-line", "#let-line", "#late-line"], { opacity: 1, duration: 0.3 }, "+=0.1")
          .to("#tdz-band", { opacity: 1, duration: 0.3 }, "+=0.1")
          .to("#playhead", { opacity: 1, duration: 0.2 }, "+=0.2")
          .to("#playhead", { attr: { y1: 92, y2: 92 }, duration: 0.6, ease: "power1.inOut" }, "+=0.1")
          .to(["#error-mark", "#error-text"], { opacity: 1, duration: 0.2 }, "+=0.1")
          .to("#playhead", { attr: { y1: 133, y2: 133 }, duration: 0.6, ease: "power1.inOut" }, "+=0.4")
          .to("#tdz-band", { opacity: 0, duration: 0.3 }, "<")
          .to("#let-chip", { opacity: 1, duration: 0.3 }, "+=0.1")
          .to("#playhead", { attr: { y1: 172, y2: 172 }, duration: 0.6, ease: "power1.inOut" }, "+=0.4")
          .to(["#success-mark", "#success-text"], { opacity: 1, duration: 0.2 }, "+=0.1");
      } else {
        // reduced motion: jump to labeled end-state
        tl.set("#scope-box", { opacity: 1 })
          .set(["#var-line", "#var-chip", "#early-line", "#let-line", "#late-line"], { opacity: 1 })
          .set("#tdz-band", { opacity: 0 })
          .set("#playhead", { opacity: 1, attr: { y1: 172, y2: 172 } })
          .set(["#error-mark", "#error-text", "#let-chip", "#success-mark", "#success-text"], { opacity: 1 });
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
      aria-label="A scope timeline shows var msg initialized to undefined from the top. A red temporal dead zone band covers the region before let count equals 5. Reading count inside the band throws a ReferenceError, the band clears once the let line runs, and reading count after that succeeds and returns 5">
      <rect id="scope-box" x="15" y="20" width="330" height="220" rx="10"
        className="fill-[var(--color-muted)] stroke-[var(--color-border)]" opacity="0" />

      <g id="var-line">
        <text x="25" y="48" className="fill-[var(--color-foreground)] text-[11px]">var msg;</text>
      </g>
      <g id="var-chip">
        <rect x="230" y="35" width="90" height="22" rx="5" className="fill-none stroke-[var(--color-muted-foreground)]" />
        <text x="238" y="51" className="fill-[var(--color-muted-foreground)] text-[10px]">undefined</text>
      </g>

      <g id="tdz-band" opacity="0">
        <rect x="20" y="72" width="320" height="70" rx="6"
          className="fill-[var(--color-destructive)] stroke-[var(--color-destructive)]" opacity="0.15" />
        <rect x="20" y="72" width="320" height="70" rx="6" className="fill-none stroke-[var(--color-destructive)]" />
      </g>

      <g id="early-line">
        <text x="25" y="90" className="fill-[var(--color-foreground)] text-[11px]">console.log(count);</text>
      </g>
      <g id="error-mark">
        <text x="230" y="90" className="fill-[var(--color-destructive)] text-[13px]">&#10005;</text>
      </g>
      <text id="error-text" x="245" y="90" className="fill-[var(--color-destructive)] text-[10px]">
        ReferenceError
      </text>

      <g id="let-line">
        <text x="25" y="133" className="fill-[var(--color-foreground)] text-[11px]">let count = 5;</text>
      </g>
      <g id="let-chip">
        <rect x="230" y="120" width="60" height="22" rx="5" className="fill-none stroke-[var(--color-primary)]" />
        <text x="248" y="136" className="fill-[var(--color-primary)] text-[10px]">5</text>
      </g>

      <g id="late-line">
        <text x="25" y="172" className="fill-[var(--color-foreground)] text-[11px]">console.log(count);</text>
      </g>
      <g id="success-mark">
        <text x="230" y="172" className="fill-[var(--color-primary)] text-[13px]">&#10003;</text>
      </g>
      <text id="success-text" x="245" y="172" className="fill-[var(--color-primary)] text-[10px]">
        5
      </text>

      <line id="playhead" x1="20" x2="340" y1="48" y2="48"
        className="stroke-[var(--color-secondary)]" strokeWidth="2" />
    </svg>
  );
}
