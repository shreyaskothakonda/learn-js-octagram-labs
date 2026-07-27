"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";

export function EsModulesVisual({ register }: ConceptVisualProps) {
  const scope = useRef<SVGSVGElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      // Scene: two module boxes, math.js (exporter) and app.js (importer). An
      // arrow connects the named export to the import that reads it. math.js
      // mutates the exported binding, a dot travels the arrow, and the
      // importer's value updates to match: a live binding, not a copy.
      gsap.set(["#box-exporter", "#box-importer"], { opacity: 0 });
      gsap.set("#arrow-path", { opacity: 0 });
      gsap.set("#arrow-label", { opacity: 0 });
      gsap.set(["#chip-exporter", "#chip-importer"], { opacity: 0 });
      gsap.set(".exporter-value", { textContent: "0" });
      gsap.set(".importer-value", { textContent: "0" });
      gsap.set("#pulse", { opacity: 0, attr: { cx: 172 } });
      gsap.set("#highlight-exporter", { opacity: 0 });
      gsap.set("#highlight-importer", { opacity: 0 });

      if (animate) {
        tl.to("#box-exporter", { opacity: 1, duration: 0.35 })
          .to("#box-importer", { opacity: 1, duration: 0.35 }, "+=0.1")
          .to("#arrow-path", { opacity: 1, duration: 0.3 }, "+=0.2")
          .to("#arrow-label", { opacity: 1, duration: 0.3 }, "<")
          .to(["#chip-exporter", "#chip-importer"], { opacity: 1, duration: 0.3 }, "+=0.1")
          .to("#highlight-exporter", { opacity: 1, duration: 0.2 }, "+=0.4")
          .to(".exporter-value", { textContent: "1", duration: 0.2, snap: { textContent: 1 } }, "<")
          .to("#highlight-exporter", { opacity: 0, duration: 0.2 }, "+=0.15")
          .to("#pulse", { opacity: 1, attr: { cx: 172 }, duration: 0.01 }, "+=0.1")
          .to("#pulse", { attr: { cx: 228 }, duration: 0.6, ease: "power2.inOut" })
          .to("#highlight-importer", { opacity: 1, duration: 0.2 }, "-=0.1")
          .to(".importer-value", { textContent: "1", duration: 0.2, snap: { textContent: 1 } }, "<")
          .to("#pulse", { opacity: 0, duration: 0.2 })
          .to("#highlight-importer", { opacity: 0, duration: 0.2 }, "+=0.15");
      } else {
        // reduced motion: jump to labeled end-state
        tl.set(["#box-exporter", "#box-importer"], { opacity: 1 })
          .set("#arrow-path", { opacity: 1 })
          .set("#arrow-label", { opacity: 1 })
          .set(["#chip-exporter", "#chip-importer"], { opacity: 1 })
          .set(".exporter-value", { textContent: "1" })
          .set(".importer-value", { textContent: "1" });
      }
      register(tl);
      return tl;
    };
    mm.add("(prefers-reduced-motion: reduce)", () => { build(false); });
    mm.add("(prefers-reduced-motion: no-preference)", () => { build(true); });
    return () => mm.revert();
  }, { scope });

  return (
    <svg ref={scope} viewBox="0 0 400 200" className="w-full max-w-md" role="img"
      aria-label="math.js exports a live total binding that app.js imports. When math.js increments total, a dot travels the connecting arrow and app.js's copy updates to match, showing the import is a live reference, not a copy">
      <g id="box-exporter" opacity="0">
        <rect id="highlight-exporter" x="18" y="28" width="150" height="140" rx="10"
          className="fill-none stroke-[var(--color-primary)]" strokeWidth="3" opacity="0" />
        <rect x="20" y="30" width="146" height="136" rx="10"
          className="fill-[var(--color-muted)] stroke-[var(--color-border)]" />
        <text x="30" y="50" className="fill-[var(--color-muted-foreground)] text-[11px]">math.js</text>
        <text x="30" y="75" className="fill-[var(--color-foreground)] text-[10px]">export let total</text>
        <text x="30" y="90" className="fill-[var(--color-foreground)] text-[10px]">  = 0;</text>
        <text x="30" y="110" className="fill-[var(--color-foreground)] text-[10px]">total++;</text>
        <g id="chip-exporter" opacity="0">
          <rect x="30" y="122" width="70" height="30" rx="8" className="fill-[var(--color-primary)]" opacity="0.15" />
          <rect x="30" y="122" width="70" height="30" rx="8" className="fill-none stroke-[var(--color-primary)]" />
          <text x="40" y="141" className="fill-[var(--color-foreground)] text-[11px]">total:</text>
          <text x="82" y="141" className="exporter-value fill-[var(--color-foreground)] text-[11px]">0</text>
        </g>
      </g>

      <g id="box-importer" opacity="0">
        <rect id="highlight-importer" x="232" y="28" width="150" height="140" rx="10"
          className="fill-none stroke-[var(--color-primary)]" strokeWidth="3" opacity="0" />
        <rect x="234" y="30" width="146" height="136" rx="10"
          className="fill-[var(--color-muted)] stroke-[var(--color-border)]" />
        <text x="244" y="50" className="fill-[var(--color-muted-foreground)] text-[11px]">app.js</text>
        <text x="244" y="75" className="fill-[var(--color-foreground)] text-[10px]">{"import { total }"}</text>
        <text x="244" y="90" className="fill-[var(--color-foreground)] text-[10px]">{"  from \"./math.js\";"}</text>
        <g id="chip-importer" opacity="0">
          <rect x="244" y="122" width="70" height="30" rx="8" className="fill-[var(--color-primary)]" opacity="0.15" />
          <rect x="244" y="122" width="70" height="30" rx="8" className="fill-none stroke-[var(--color-primary)]" />
          <text x="254" y="141" className="fill-[var(--color-foreground)] text-[11px]">total:</text>
          <text x="296" y="141" className="importer-value fill-[var(--color-foreground)] text-[11px]">0</text>
        </g>
      </g>

      <defs>
        <marker id="arrow-head" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" className="fill-[var(--color-primary)]" />
        </marker>
      </defs>
      <line id="arrow-path" x1="172" y1="137" x2="228" y2="137"
        className="stroke-[var(--color-primary)]" strokeWidth="2" markerEnd="url(#arrow-head)" opacity="0" />
      <text id="arrow-label" x="200" y="185" textAnchor="middle"
        className="fill-[var(--color-muted-foreground)] text-[10px]" opacity="0">
        live binding
      </text>
      <circle id="pulse" cx="172" cy="137" r="6" className="fill-[var(--color-primary)]" opacity="0" />
    </svg>
  );
}
