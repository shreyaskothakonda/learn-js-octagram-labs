"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";

export function DestructuringVisual({ register }: ConceptVisualProps) {
  const scope = useRef<SVGSVGElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      // Scene: a user object with name/age properties splits apart. Two
      // carrier chips peel off the object's values, one at a time, and
      // travel into their own named destination boxes on the right.
      gsap.set(["#source-box", "#source-title", "#src-name-row", "#src-age-row"], { opacity: 0 });
      gsap.set(
        ["#target-name-box", "#target-name-label", "#target-age-box", "#target-age-label"],
        { opacity: 0 },
      );
      gsap.set(["#target-name-value", "#target-age-value"], { opacity: 0 });
      gsap.set("#carrier-name", { x: 100, y: 88, opacity: 0 });
      gsap.set("#carrier-age", { x: 100, y: 138, opacity: 0 });
      gsap.set("#code-line", { opacity: 0 });

      if (animate) {
        tl.to(["#source-box", "#source-title"], { opacity: 1, duration: 0.4 })
          .to(["#src-name-row", "#src-age-row"], { opacity: 1, duration: 0.3, stagger: 0.1 }, "+=0.1")
          .to(
            ["#target-name-box", "#target-name-label", "#target-age-box", "#target-age-label"],
            { opacity: 1, duration: 0.3 },
            "+=0.2",
          )
          .to("#carrier-name", { opacity: 1, duration: 0.25 }, "+=0.2")
          .to("#carrier-name", { x: 305, y: 87, duration: 0.6, ease: "power2.inOut" }, "+=0.1")
          .to("#carrier-name", { opacity: 0, duration: 0.2 }, "+=0.05")
          .to("#target-name-value", { opacity: 1, duration: 0.2 }, "<")
          .to("#carrier-age", { opacity: 1, duration: 0.25 }, "+=0.2")
          .to("#carrier-age", { x: 305, y: 147, duration: 0.6, ease: "power2.inOut" }, "+=0.1")
          .to("#carrier-age", { opacity: 0, duration: 0.2 }, "+=0.05")
          .to("#target-age-value", { opacity: 1, duration: 0.2 }, "<")
          .to("#code-line", { opacity: 1, duration: 0.4 }, "+=0.3");
      } else {
        // reduced motion: jump to labeled end-state
        tl.set(["#source-box", "#source-title", "#src-name-row", "#src-age-row"], { opacity: 1 })
          .set(
            ["#target-name-box", "#target-name-label", "#target-age-box", "#target-age-label"],
            { opacity: 1 },
          )
          .set(["#target-name-value", "#target-age-value"], { opacity: 1 })
          .set("#carrier-name", { opacity: 0 })
          .set("#carrier-age", { opacity: 0 })
          .set("#code-line", { opacity: 1 });
      }
      register(tl);
      return tl;
    };
    mm.add("(prefers-reduced-motion: reduce)", () => { build(false); });
    mm.add("(prefers-reduced-motion: no-preference)", () => { build(true); });
    return () => mm.revert();
  }, { scope });

  return (
    <svg ref={scope} viewBox="0 0 380 240" className="w-full max-w-md" role="img"
      aria-label="A user object with name and age properties splits apart. Carrier chips peel off each value and travel into their own named variable box, ending with const name, age equals user">
      <rect id="source-box" x="20" y="55" width="170" height="120" rx="10"
        className="fill-[var(--color-muted)] stroke-[var(--color-border)]" opacity="0" />
      <text id="source-title" x="25" y="45" className="fill-[var(--color-muted-foreground)] text-[10px]" opacity="0">
        const user = {"{ ... }"}
      </text>

      <g id="src-name-row" opacity="0">
        <text x="35" y="95" className="fill-[var(--color-muted-foreground)] text-[11px] font-mono">name:</text>
        <text x="90" y="95" className="fill-[var(--color-foreground)] text-[11px] font-mono">&quot;Ada&quot;</text>
      </g>
      <g id="src-age-row" opacity="0">
        <text x="35" y="140" className="fill-[var(--color-muted-foreground)] text-[11px] font-mono">age:</text>
        <text x="90" y="140" className="fill-[var(--color-foreground)] text-[11px] font-mono">30</text>
      </g>

      <g id="target-name-box" opacity="0">
        <rect x="245" y="65" width="120" height="44" rx="8"
          className="fill-[var(--color-primary)] stroke-[var(--color-primary)]" opacity="0.15" />
        <rect x="245" y="65" width="120" height="44" rx="8" className="fill-none stroke-[var(--color-primary)]" />
      </g>
      <text id="target-name-label" x="253" y="80" className="fill-[var(--color-muted-foreground)] text-[9px]" opacity="0">
        name
      </text>
      <text id="target-name-value" x="253" y="101" opacity="0"
        className="fill-[var(--color-foreground)] text-[13px] font-mono">
        &quot;Ada&quot;
      </text>

      <g id="target-age-box" opacity="0">
        <rect x="245" y="125" width="120" height="44" rx="8"
          className="fill-[var(--color-primary)] stroke-[var(--color-primary)]" opacity="0.15" />
        <rect x="245" y="125" width="120" height="44" rx="8" className="fill-none stroke-[var(--color-primary)]" />
      </g>
      <text id="target-age-label" x="253" y="140" className="fill-[var(--color-muted-foreground)] text-[9px]" opacity="0">
        age
      </text>
      <text id="target-age-value" x="253" y="161" opacity="0"
        className="fill-[var(--color-foreground)] text-[13px] font-mono">
        30
      </text>

      <g id="carrier-name">
        <rect x="-30" y="-12" width="60" height="24" rx="6"
          className="fill-[var(--color-primary)] stroke-[var(--color-primary)]" opacity="0.15" />
        <rect x="-30" y="-12" width="60" height="24" rx="6" className="fill-none stroke-[var(--color-primary)]" />
        <text x="0" y="4" textAnchor="middle" className="fill-[var(--color-foreground)] text-[11px] font-mono">
          &quot;Ada&quot;
        </text>
      </g>
      <g id="carrier-age">
        <rect x="-30" y="-12" width="60" height="24" rx="6"
          className="fill-[var(--color-primary)] stroke-[var(--color-primary)]" opacity="0.15" />
        <rect x="-30" y="-12" width="60" height="24" rx="6" className="fill-none stroke-[var(--color-primary)]" />
        <text x="0" y="4" textAnchor="middle" className="fill-[var(--color-foreground)] text-[11px] font-mono">
          30
        </text>
      </g>

      <text id="code-line" x="20" y="215" opacity="0"
        className="fill-[var(--color-muted-foreground)] text-[11px] font-mono">
        const {"{ name, age }"} = user;
      </text>
    </svg>
  );
}
