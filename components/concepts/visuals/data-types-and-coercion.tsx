"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";

export function DataTypesAndCoercionVisual({ register }: ConceptVisualProps) {
  const scope = useRef<SVGSVGElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      // Scene: three chips reveal their typeof result, then two rows show
      // "5" + 1 coercing to the string "51" and "5" - 1 coercing to the
      // number 4, each result labeled with the type it landed on.
      gsap.set(["#chip-string", "#chip-number", "#chip-boolean"], { opacity: 0 });
      gsap.set(["#label-string", "#label-number", "#label-boolean"], { opacity: 0 });
      gsap.set(["#exprA-code", "#exprA-arrow", "#exprB-code", "#exprB-arrow"], { opacity: 0 });
      gsap.set(["#resultA-box", "#resultB-box"], { opacity: 0 });
      gsap.set(["#labelA", "#labelB"], { opacity: 0 });
      gsap.set("#resultA-text", { textContent: "?" });
      gsap.set("#resultB-text", { textContent: "?" });

      if (animate) {
        tl.to(["#chip-string", "#chip-number", "#chip-boolean"], { opacity: 1, duration: 0.35 })
          .to(["#label-string", "#label-number", "#label-boolean"], { opacity: 1, duration: 0.3, stagger: 0.1 }, "+=0.2")
          .to(["#exprA-code", "#exprA-arrow"], { opacity: 1, duration: 0.3 }, "+=0.4")
          .to("#resultA-box", { opacity: 1, duration: 0.3 }, "+=0.1")
          .set("#resultA-text", { textContent: "\"51\"" })
          .to("#labelA", { opacity: 1, duration: 0.2 }, "+=0.1")
          .to(["#exprB-code", "#exprB-arrow"], { opacity: 1, duration: 0.3 }, "+=0.4")
          .to("#resultB-box", { opacity: 1, duration: 0.3 }, "+=0.1")
          .set("#resultB-text", { textContent: "4" })
          .to("#labelB", { opacity: 1, duration: 0.2 }, "+=0.1");
      } else {
        // reduced motion: jump to labeled end-state
        tl.set(["#chip-string", "#chip-number", "#chip-boolean"], { opacity: 1 })
          .set(["#label-string", "#label-number", "#label-boolean"], { opacity: 1 })
          .set(["#exprA-code", "#exprA-arrow", "#resultA-box", "#labelA"], { opacity: 1 })
          .set("#resultA-text", { textContent: "\"51\"" })
          .set(["#exprB-code", "#exprB-arrow", "#resultB-box", "#labelB"], { opacity: 1 })
          .set("#resultB-text", { textContent: "4" });
      }
      register(tl);
      return tl;
    };
    mm.add("(prefers-reduced-motion: reduce)", () => { build(false); });
    mm.add("(prefers-reduced-motion: no-preference)", () => { build(true); });
    return () => mm.revert();
  }, { scope });

  const chip = (id: string, x: number, value: string, type: string, colorVar: string) => (
    <g key={id}>
      <g id={`chip-${id}`} opacity="0">
        <rect x={x} y="20" width="90" height="34" rx="6"
          className={`fill-[var(--color-${colorVar})] stroke-[var(--color-${colorVar})]`} opacity="0.15" />
        <rect x={x} y="20" width="90" height="34" rx="6" className={`fill-none stroke-[var(--color-${colorVar})]`} />
        <text x={x + 12} y="42" className="fill-[var(--color-foreground)] text-[11px]">{value}</text>
      </g>
      <text id={`label-${id}`} x={x + 12} y="70" className="fill-[var(--color-muted-foreground)] text-[10px]" opacity="0">
        typeof: {type}
      </text>
    </g>
  );

  return (
    <svg ref={scope} viewBox="0 0 360 220" className="w-full max-w-md" role="img"
      aria-label={'Three value chips reveal their typeof results: string, number, boolean. Below, the expression "5" + 1 coerces to the string "51" while "5" - 1 coerces to the number 4'}>
      {chip("string", 10, "\"hi\"", "string", "primary")}
      {chip("number", 120, "42", "number", "secondary")}
      {chip("boolean", 230, "true", "boolean", "accent")}

      <line x1="10" y1="90" x2="350" y2="90" className="stroke-[var(--color-border)]" />

      <text id="exprA-code" x="10" y="120" className="fill-[var(--color-foreground)] text-[12px]" opacity="0">
        &quot;5&quot; + 1
      </text>
      <line id="exprA-arrow" x1="100" y1="115" x2="150" y2="115"
        className="stroke-[var(--color-muted-foreground)]" strokeWidth="2" opacity="0" />
      <g id="resultA-box" opacity="0">
        <rect x="160" y="100" width="90" height="30" rx="6"
          className="fill-[var(--color-primary)] stroke-[var(--color-primary)]" opacity="0.15" />
        <rect x="160" y="100" width="90" height="30" rx="6" className="fill-none stroke-[var(--color-primary)]" />
        <text id="resultA-text" x="172" y="120" className="fill-[var(--color-foreground)] text-[11px]">?</text>
      </g>
      <text id="labelA" x="260" y="120" className="fill-[var(--color-muted-foreground)] text-[10px]" opacity="0">
        string concat
      </text>

      <text id="exprB-code" x="10" y="165" className="fill-[var(--color-foreground)] text-[12px]" opacity="0">
        &quot;5&quot; - 1
      </text>
      <line id="exprB-arrow" x1="100" y1="160" x2="150" y2="160"
        className="stroke-[var(--color-muted-foreground)]" strokeWidth="2" opacity="0" />
      <g id="resultB-box" opacity="0">
        <rect x="160" y="145" width="90" height="30" rx="6"
          className="fill-[var(--color-secondary)] stroke-[var(--color-secondary)]" opacity="0.15" />
        <rect x="160" y="145" width="90" height="30" rx="6" className="fill-none stroke-[var(--color-secondary)]" />
        <text id="resultB-text" x="197" y="165" className="fill-[var(--color-foreground)] text-[11px]">?</text>
      </g>
      <text id="labelB" x="260" y="165" className="fill-[var(--color-muted-foreground)] text-[10px]" opacity="0">
        numeric coercion
      </text>
    </svg>
  );
}
