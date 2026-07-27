"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";

export function HoistingVisual({ register }: ConceptVisualProps) {
  const scope = useRef<SVGSVGElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      // Scene: a scope box with source lines in original order. var/function lines
      // float up to a "hoisted" shelf before an execution playhead steps downward.
      // The let line stays put behind a temporal-dead-zone band that clears once
      // the playhead reaches its line.
      gsap.set("#scope-box", { opacity: 0 });
      gsap.set(["#let-group", "#func-group", "#var-group", "#assign-text", "#call-text"], { opacity: 0 });
      gsap.set(["#func-group", "#var-group"], { x: 0, y: 0 });
      gsap.set("#shelf-label", { opacity: 0 });
      gsap.set("#tdz-band", { opacity: 1 });
      gsap.set("#playhead", { opacity: 0, attr: { y1: 55, y2: 55 } });

      if (animate) {
        tl.to("#scope-box", { opacity: 1, duration: 0.4 })
          .to(["#let-group", "#func-group", "#var-group", "#assign-text", "#call-text"], {
            opacity: 1,
            duration: 0.3,
          }, "+=0.1")
          .to("#shelf-label", { opacity: 1, duration: 0.2 }, "+=0.3")
          .to("#func-group", { x: 160, y: -57, duration: 0.6, ease: "power2.inOut" }, "<")
          .to("#var-group", { x: 160, y: -67, duration: 0.6, ease: "power2.inOut" }, "<")
          .to("#playhead", { opacity: 1, duration: 0.2 }, "+=0.3")
          .to("#playhead", { attr: { y1: 200, y2: 200 }, duration: 1.2, ease: "none" }, "+=0.1")
          .to("#tdz-band", { opacity: 0, duration: 0.3 }, "-=1.05");
      } else {
        // reduced motion: jump to labeled end-state
        tl.set("#scope-box", { opacity: 1 })
          .set(["#let-group", "#func-group", "#var-group", "#assign-text", "#call-text"], { opacity: 1 })
          .set("#func-group", { x: 160, y: -57 })
          .set("#var-group", { x: 160, y: -67 })
          .set("#shelf-label", { opacity: 1 })
          .set("#tdz-band", { opacity: 0 })
          .set("#playhead", { opacity: 1, attr: { y1: 200, y2: 200 } });
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
      aria-label="Var and function declarations move to a hoisted shelf at the top of the scope before the code runs, while the let declaration stays in place until the execution line reaches it and its temporal dead zone clears">
      <rect id="scope-box" x="20" y="30" width="320" height="195" rx="10"
        className="fill-[var(--color-muted)] stroke-[var(--color-border)]" opacity="0" />
      <text id="shelf-label" x="190" y="42" className="fill-[var(--color-muted-foreground)] text-[10px]" opacity="0">
        hoisted:
      </text>

      <g id="let-group">
        <rect id="tdz-band" x="25" y="63" width="130" height="24" rx="4"
          className="fill-[var(--color-destructive)] stroke-[var(--color-destructive)]" opacity="0.15" />
        <rect x="25" y="63" width="130" height="24" rx="4" className="fill-none stroke-[var(--color-destructive)]" />
        <text x="32" y="79" className="fill-[var(--color-foreground)] text-[11px]">let count;</text>
      </g>

      <g id="func-group">
        <text x="30" y="109" className="fill-[var(--color-foreground)] text-[11px]">function greet() {"{}"}</text>
      </g>

      <g id="var-group">
        <text x="30" y="139" className="fill-[var(--color-foreground)] text-[11px]">var msg;</text>
      </g>

      <text id="assign-text" x="30" y="169" className="fill-[var(--color-muted-foreground)] text-[11px]">
        msg = &apos;hi&apos;;
      </text>
      <text id="call-text" x="30" y="199" className="fill-[var(--color-muted-foreground)] text-[11px]">
        greet();
      </text>

      <line id="playhead" x1="25" x2="335" y1="55" y2="55"
        className="stroke-[var(--color-primary)]" strokeWidth="2" />
    </svg>
  );
}
