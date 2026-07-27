"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";

type ConveyorItem = { id: string; label: string; falsy: boolean };

const ITEMS: ConveyorItem[] = [
  { id: "v0", label: "0", falsy: true },
  { id: "v1", label: "\"\"", falsy: true },
  { id: "v2", label: "null", falsy: true },
  { id: "v3", label: "undefined", falsy: true },
  { id: "v4", label: "NaN", falsy: true },
  { id: "v5", label: "\"0\"", falsy: false },
  { id: "v6", label: "[]", falsy: false },
  { id: "v7", label: "{}", falsy: false },
];

const START_Y = 55;
const BIN_Y = 210;

export function TruthyFalsyVisual({ register }: ConceptVisualProps) {
  const scope = useRef<SVGSVGElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      // Scene: eight value chips sit on a conveyor belt, then drop one by
      // one into a falsy bin or a truthy bin depending on how each value
      // coerces to a boolean.
      const falsyItems = ITEMS.filter((i) => i.falsy);
      const truthyItems = ITEMS.filter((i) => !i.falsy);

      gsap.set(["#belt", "#falsy-bin", "#truthy-bin"], { opacity: 0 });
      ITEMS.forEach((item, i) => {
        gsap.set(`#chip-${item.id}`, { opacity: 0, x: 25 + i * 42, y: START_Y });
      });

      if (animate) {
        tl.to(["#belt", "#falsy-bin", "#truthy-bin"], { opacity: 1, duration: 0.4 })
          .to(ITEMS.map((i) => `#chip-${i.id}`), { opacity: 1, duration: 0.3, stagger: 0.05 }, "+=0.1");

        falsyItems.forEach((item, idx) => {
          tl.to(`#chip-${item.id}`, {
            x: 45 + idx * 27,
            y: BIN_Y,
            duration: 0.5,
            ease: "power1.in",
          }, "+=0.15");
        });
        truthyItems.forEach((item, idx) => {
          tl.to(`#chip-${item.id}`, {
            x: 215 + idx * 45,
            y: BIN_Y,
            duration: 0.5,
            ease: "power1.in",
          }, "+=0.15");
        });
      } else {
        // reduced motion: jump to labeled end-state
        tl.set(["#belt", "#falsy-bin", "#truthy-bin"], { opacity: 1 });
        falsyItems.forEach((item, idx) => {
          tl.set(`#chip-${item.id}`, { opacity: 1, x: 45 + idx * 27, y: BIN_Y });
        });
        truthyItems.forEach((item, idx) => {
          tl.set(`#chip-${item.id}`, { opacity: 1, x: 215 + idx * 45, y: BIN_Y });
        });
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
      aria-label="Eight value chips, 0, empty string, null, undefined, NaN, the string 0, an empty array, and an empty object, drop from a conveyor belt into a falsy bin or a truthy bin. The first five are falsy; the string 0, the empty array, and the empty object are truthy">
      <line id="belt" x1="15" y1="70" x2="345" y2="70"
        className="stroke-[var(--color-border)]" strokeWidth="2" opacity="0" />

      <g id="falsy-bin" opacity="0">
        <rect x="15" y="195" width="165" height="50" rx="8" className="fill-[var(--color-muted)] stroke-[var(--color-border)]" />
        <text x="25" y="188" className="fill-[var(--color-destructive)] text-[10px]">falsy</text>
      </g>
      <g id="truthy-bin" opacity="0">
        <rect x="190" y="195" width="155" height="50" rx="8" className="fill-[var(--color-muted)] stroke-[var(--color-border)]" />
        <text x="200" y="188" className="fill-[var(--color-primary)] text-[10px]">truthy</text>
      </g>

      {ITEMS.map((item) => (
        <g id={`chip-${item.id}`} key={item.id} opacity="0">
          <rect x="-17" y="-11" width="34" height="22" rx="5"
            className={item.falsy
              ? "fill-[var(--color-destructive)] stroke-[var(--color-destructive)]"
              : "fill-[var(--color-primary)] stroke-[var(--color-primary)]"}
            opacity="0.15" />
          <rect x="-17" y="-11" width="34" height="22" rx="5"
            className={item.falsy
              ? "fill-none stroke-[var(--color-destructive)]"
              : "fill-none stroke-[var(--color-primary)]"} />
          <text x="0" y="4" textAnchor="middle" className="fill-[var(--color-foreground)] text-[9px]">
            {item.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
