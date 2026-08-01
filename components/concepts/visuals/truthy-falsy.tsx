"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";
import { Stage, Panel, enter, pop, travel } from "./kit";

type ValueItem = {
  id: string;
  label: string;
  falsy: boolean;
  beltX: number;
  beltY: number;
  binX: number;
  binY: number;
};

// The eight falsy values, exactly: false, 0, -0, 0n, "", null, undefined, NaN.
// "0", [], and {} are truthy. Values sit on a belt, then travel one at a time
// into a falsy bin or a truthy bin depending on how each coerces to boolean.
// Belt and bin coordinates are spaced by each label's approximate rendered
// width (short labels like "0" sit close together, "undefined" gets a row
// of its own) so chips never overlap in either the belt or the bins.
const ITEMS: ValueItem[] = [
  { id: "false", label: "false", falsy: true, beltX: 16, beltY: 30, binX: 26, binY: 248 },
  { id: "zero", label: "0", falsy: true, beltX: 77, beltY: 30, binX: 85, binY: 248 },
  { id: "negzero", label: "-0", falsy: true, beltX: 110, beltY: 30, binX: 116, binY: 248 },
  { id: "bigzero", label: "0n", falsy: true, beltX: 150, beltY: 30, binX: 154, binY: 248 },
  { id: "emptystr", label: '""', falsy: true, beltX: 190, beltY: 30, binX: 26, binY: 276 },
  { id: "null", label: "null", falsy: true, beltX: 230, beltY: 30, binX: 64, binY: 276 },
  { id: "undefined", label: "undefined", falsy: true, beltX: 16, beltY: 68, binX: 26, binY: 304 },
  { id: "nan", label: "NaN", falsy: true, beltX: 105, beltY: 68, binX: 116, binY: 276 },
  { id: "strzero", label: '"0"', falsy: false, beltX: 152, beltY: 68, binX: 236, binY: 240 },
  { id: "emptyarr", label: "[]", falsy: false, beltX: 199, beltY: 68, binX: 283, binY: 240 },
  { id: "emptyobj", label: "{}", falsy: false, beltX: 239, beltY: 68, binX: 323, binY: 240 },
];

export function TruthyFalsyVisual({ register }: ConceptVisualProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      gsap.set(["#belt-panel", "#falsy-bin", "#truthy-bin"], { opacity: 0, y: 12 });
      ITEMS.forEach((item) => {
        gsap.set(`#chip-${item.id}`, { opacity: 0, scale: 0.8 });
      });

      if (animate) {
        enter(tl, ["#belt-panel", "#falsy-bin", "#truthy-bin"], undefined, 0.1);
        pop(tl, ITEMS.map((i) => `#chip-${i.id}`), "+=0.15");

        ITEMS.forEach((item) => {
          travel(tl, `#chip-${item.id}`, { x: item.binX - item.beltX, y: item.binY - item.beltY }, "+=0.12");
        });
      } else {
        // reduced motion: jump to labeled end-state (every chip settled in its bin)
        tl.set(["#belt-panel", "#falsy-bin", "#truthy-bin"], { opacity: 1, y: 0 });
        ITEMS.forEach((item) => {
          tl.set(`#chip-${item.id}`, {
            opacity: 1,
            scale: 1,
            x: item.binX - item.beltX,
            y: item.binY - item.beltY,
          });
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
    <Stage
      refEl={scope}
      height={360}
      label="Eleven value chips, false, 0, negative 0, 0n, an empty string, null, undefined, NaN, the string 0, an empty array, and an empty object, sit on a belt and drop one by one into a falsy bin or a truthy bin. Only the first eight, false through NaN, are falsy; the string 0, the empty array, and the empty object are truthy"
    >
      <Panel id="belt-panel" label="Values" style={{ left: 0, top: 0, width: 400, height: 100 }} />
      <Panel id="falsy-bin" label="Falsy" style={{ left: 16, top: 210, width: 200, height: 130 }} />
      <Panel id="truthy-bin" label="Truthy" style={{ left: 226, top: 210, width: 164, height: 60 }} />

      {ITEMS.map((item) => (
        <span
          key={item.id}
          id={`chip-${item.id}`}
          className={
            "absolute inline-flex items-center justify-center rounded-md px-2 py-1 font-mono text-[11px] font-semibold " +
            (item.falsy
              ? "bg-[var(--color-destructive)]/10 text-[var(--color-destructive)]"
              : "bg-[var(--color-primary)]/10 text-[var(--color-primary)]")
          }
          style={{ left: item.beltX, top: item.beltY }}
        >
          {item.label}
        </span>
      ))}
    </Stage>
  );
}
