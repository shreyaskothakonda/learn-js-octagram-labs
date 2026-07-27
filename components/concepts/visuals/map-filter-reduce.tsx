"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";

const NUMS = [2, 5, 8, 3, 6];
const MAPPED = [4, 10, 16, 6, 12];
const ROW_X = [40, 100, 160, 220, 280];
const SURVIVOR_INDEXES = [1, 2, 4]; // indexes into MAPPED where x > 8
const ROW3_X = [100, 160, 220];
const ACC_X = 160;
const ROW1_Y = 60;
const ROW2_Y = 150;
const ROW3_Y = 230;
const ROW4_Y = 310;

export function MapFilterReduceVisual({ register }: ConceptVisualProps) {
  const scope = useRef<SVGSVGElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      // Scene: a row of numbers is mapped into a new row of doubled values,
      // filter dims the values that are not above 8, and the three survivors
      // fold one at a time into a single reduce accumulator chip.
      gsap.set(["#nums-code", "#map-code", "#filter-code", "#reduce-code"], { opacity: 0 });
      NUMS.forEach((_, i) => gsap.set(`#n${i}`, { x: ROW_X[i], y: ROW1_Y, opacity: 0 }));
      MAPPED.forEach((_, i) => gsap.set(`#m${i}`, { x: ROW_X[i], y: ROW2_Y, opacity: 0, scale: 1 }));
      gsap.set("#acc-chip", { x: ACC_X, y: ROW4_Y, opacity: 0 });
      gsap.set(".acc-value", { textContent: "0" });

      const nIds = NUMS.map((_, i) => `#n${i}`);
      const mIds = MAPPED.map((_, i) => `#m${i}`);

      if (animate) {
        tl.to("#nums-code", { opacity: 1, duration: 0.3 })
          .to(nIds, { opacity: 1, duration: 0.3, stagger: 0.06 }, "+=0.1")
          .to("#map-code", { opacity: 1, duration: 0.3 }, "+=0.3")
          .to(mIds, { opacity: 1, duration: 0.3, stagger: 0.06 }, "+=0.1")
          .to("#filter-code", { opacity: 1, duration: 0.3 }, "+=0.4")
          .to(["#m0", "#m3"], { opacity: 0.15, scale: 0.85, duration: 0.4 }, "+=0.1");
        SURVIVOR_INDEXES.forEach((idx, i) => {
          tl.to(`#m${idx}`, { x: ROW3_X[i], y: ROW3_Y, duration: 0.5, ease: "power2.inOut" }, "<");
        });
        tl.to("#reduce-code", { opacity: 1, duration: 0.3 }, "+=0.3")
          .to("#acc-chip", { opacity: 1, duration: 0.3 }, "+=0.1");

        let running = 0;
        SURVIVOR_INDEXES.forEach((idx) => {
          const next = running + MAPPED[idx];
          tl.to(`#m${idx}`, { x: ACC_X, y: ROW4_Y, opacity: 0, duration: 0.5, ease: "power2.inOut" }, "+=0.25").to(
            ".acc-value",
            { textContent: String(next), duration: 0.2, snap: { textContent: 1 } },
            "-=0.1",
          );
          running = next;
        });
      } else {
        // reduced motion: jump to labeled end-state
        tl.set(["#nums-code", "#map-code", "#filter-code", "#reduce-code"], { opacity: 1 })
          .set(nIds, { opacity: 1 })
          .set(mIds, { opacity: 1 })
          .set(["#m0", "#m3"], { opacity: 0.15, scale: 0.85 });
        SURVIVOR_INDEXES.forEach((idx, i) => {
          tl.set(`#m${idx}`, { x: ROW3_X[i], y: ROW3_Y, opacity: 1 });
        });
        tl.set("#acc-chip", { opacity: 1 }).set(".acc-value", { textContent: "38" });
      }
      register(tl);
      return tl;
    };
    mm.add("(prefers-reduced-motion: reduce)", () => {
      build(false);
    });
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      build(true);
    });
    return () => mm.revert();
  }, { scope });

  const chip = (id: string, value: number) => (
    <g id={id} key={id}>
      <rect
        x="-20"
        y="-14"
        width="40"
        height="28"
        rx="6"
        className="fill-[var(--color-primary)] stroke-[var(--color-primary)]"
        opacity="0.15"
      />
      <rect x="-20" y="-14" width="40" height="28" rx="6" className="fill-none stroke-[var(--color-primary)]" />
      <text x="0" y="5" textAnchor="middle" className="fill-[var(--color-foreground)] text-[11px] font-mono">
        {value}
      </text>
    </g>
  );

  return (
    <svg
      ref={scope}
      viewBox="0 0 380 340"
      className="w-full max-w-md"
      role="img"
      aria-label="A row of five numbers is mapped into a new row of doubled values, filter dims the values that are not above 8, and the three survivors fold one at a time into a single reduce accumulator that ends at 38"
    >
      <text id="nums-code" x="20" y="30" opacity="0" className="fill-[var(--color-muted-foreground)] text-[10px] font-mono">
        const nums = [2, 5, 8, 3, 6];
      </text>
      {NUMS.map((v, i) => chip(`n${i}`, v))}

      <text id="map-code" x="20" y="120" opacity="0" className="fill-[var(--color-muted-foreground)] text-[10px] font-mono">
        nums.map(x =&gt; x * 2)
      </text>
      {MAPPED.map((v, i) => chip(`m${i}`, v))}

      <text id="filter-code" x="20" y="205" opacity="0" className="fill-[var(--color-muted-foreground)] text-[10px] font-mono">
        .filter(x =&gt; x &gt; 8)
      </text>

      <text id="reduce-code" x="20" y="285" opacity="0" className="fill-[var(--color-muted-foreground)] text-[10px] font-mono">
        .reduce((total, x) =&gt; total + x, 0)
      </text>
      <g id="acc-chip" opacity="0">
        <rect x="-30" y="-18" width="60" height="36" rx="8" className="fill-none stroke-[var(--color-border)]" />
        <text
          x="0"
          y="6"
          textAnchor="middle"
          className="acc-value fill-[var(--color-foreground)] text-[13px] font-mono"
        >
          0
        </text>
      </g>
    </svg>
  );
}
