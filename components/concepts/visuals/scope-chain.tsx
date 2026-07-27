"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";

export function ScopeChainVisual({ register }: ConceptVisualProps) {
  const scope = useRef<SVGSVGElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      // Scene: three nested scope boxes (global > outer > inner). A lookup token
      // for `z` starts in inner and hops outward, each box briefly highlighted as
      // it is checked. Nothing matches, so the token fades at global and a
      // ReferenceError appears.
      gsap.set(["#global-box", "#global-label", "#outer-box", "#outer-label", "#inner-box", "#inner-label"], {
        opacity: 0,
      });
      gsap.set(["#highlight-inner", "#highlight-outer", "#highlight-global", "#highlight-global-error"], {
        opacity: 0,
      });
      gsap.set("#token", { x: 170, y: 155, opacity: 0 });
      gsap.set("#error-text", { opacity: 0 });

      if (animate) {
        tl.to(["#global-box", "#global-label"], { opacity: 1, duration: 0.3 })
          .to(["#outer-box", "#outer-label"], { opacity: 1, duration: 0.3 }, "+=0.1")
          .to(["#inner-box", "#inner-label"], { opacity: 1, duration: 0.3 }, "+=0.1")
          .to("#token", { opacity: 1, duration: 0.3 }, "+=0.2")
          .to("#highlight-inner", { opacity: 1, duration: 0.2 })
          .to("#highlight-inner", { opacity: 0, duration: 0.2 }, "+=0.25")
          .to("#token", { x: 280, y: 120, duration: 0.6, ease: "power2.inOut" }, "+=0.1")
          .to("#highlight-outer", { opacity: 1, duration: 0.2 })
          .to("#highlight-outer", { opacity: 0, duration: 0.2 }, "+=0.25")
          .to("#token", { x: 330, y: 190, duration: 0.6, ease: "power2.inOut" }, "+=0.1")
          .to("#highlight-global", { opacity: 1, duration: 0.2 })
          .to("#token", { opacity: 0, duration: 0.3 }, "+=0.3")
          .to("#highlight-global-error", { opacity: 1, duration: 0.3 }, "<")
          .to("#error-text", { opacity: 1, duration: 0.3 }, "+=0.1");
      } else {
        // reduced motion: jump to labeled end-state
        tl.set(["#global-box", "#global-label", "#outer-box", "#outer-label", "#inner-box", "#inner-label"], {
          opacity: 1,
        })
          .set("#token", { opacity: 0 })
          .set("#highlight-global-error", { opacity: 1 })
          .set("#error-text", { opacity: 1 });
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
      aria-label="A lookup for the variable z hops from the inner scope outward through outer and global, finds no match anywhere, and ends in a ReferenceError">
      <rect id="global-box" x="15" y="15" width="330" height="210" rx="10"
        className="fill-none stroke-[var(--color-border)]" opacity="0" />
      <text id="global-label" x="25" y="32" className="fill-[var(--color-muted-foreground)] text-[10px]" opacity="0">
        global
      </text>
      <rect id="highlight-global" x="15" y="15" width="330" height="210" rx="10"
        className="fill-none stroke-[var(--color-primary)]" strokeWidth="3" opacity="0" />
      <rect id="highlight-global-error" x="15" y="15" width="330" height="210" rx="10"
        className="fill-none stroke-[var(--color-destructive)]" strokeWidth="3" opacity="0" />

      <rect id="outer-box" x="45" y="55" width="270" height="150" rx="10"
        className="fill-none stroke-[var(--color-border)]" opacity="0" />
      <text id="outer-label" x="55" y="72" className="fill-[var(--color-muted-foreground)] text-[10px]" opacity="0">
        outer()
      </text>
      <rect id="highlight-outer" x="45" y="55" width="270" height="150" rx="10"
        className="fill-none stroke-[var(--color-primary)]" strokeWidth="3" opacity="0" />

      <rect id="inner-box" x="75" y="95" width="190" height="90" rx="10"
        className="fill-none stroke-[var(--color-border)]" opacity="0" />
      <text id="inner-label" x="85" y="112" className="fill-[var(--color-muted-foreground)] text-[10px]" opacity="0">
        inner()
      </text>
      <rect id="highlight-inner" x="75" y="95" width="190" height="90" rx="10"
        className="fill-none stroke-[var(--color-primary)]" strokeWidth="3" opacity="0" />

      <g id="token">
        <circle cx="0" cy="0" r="14" className="fill-[var(--color-primary)]" opacity="0.15" />
        <circle cx="0" cy="0" r="14" className="fill-none stroke-[var(--color-primary)]" />
        <text x="0" y="4" textAnchor="middle" className="fill-[var(--color-foreground)] text-[11px]">z</text>
      </g>

      <text id="error-text" x="200" y="205" textAnchor="middle" opacity="0"
        className="fill-[var(--color-destructive)] text-[10px]">
        ReferenceError: z is not defined
      </text>
    </svg>
  );
}
