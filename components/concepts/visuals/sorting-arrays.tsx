"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";

const BASELINE_Y = 220;
const PTR_Y = 100;
const SLOT_X = [70, 190, 310];

export function SortingArraysVisual({ register }: ConceptVisualProps) {
  const scope = useRef<SVGSVGElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      // Scene: three bars, valued 3, 1, 2, get sorted ascending by a
      // comparator (a, b) => a - b. Two pointers walk adjacent pairs; the
      // sign of a - b decides whether that pair swaps places.
      gsap.set("#bar-a", { x: SLOT_X[0], y: BASELINE_Y });
      gsap.set("#bar-b", { x: SLOT_X[1], y: BASELINE_Y });
      gsap.set("#bar-c", { x: SLOT_X[2], y: BASELINE_Y });
      gsap.set(["#ptr-1", "#ptr-2"], { y: PTR_Y, opacity: 0 });
      gsap.set(["#comparator-label", "#compare-readout", "#sorted-label"], { opacity: 0 });

      if (animate) {
        tl.to("#comparator-label", { opacity: 1, duration: 0.3 })
          .set("#ptr-1", { x: SLOT_X[0] })
          .set("#ptr-2", { x: SLOT_X[1] })
          .set("#compare-readout", { textContent: "3 - 1 = 2 (positive: swap)" })
          .to(["#ptr-1", "#ptr-2", "#compare-readout"], { opacity: 1, duration: 0.3 }, "+=0.1")
          .to("#bar-a", { x: SLOT_X[1], duration: 0.6, ease: "power2.inOut" }, "+=0.3")
          .to("#bar-b", { x: SLOT_X[0], duration: 0.6, ease: "power2.inOut" }, "<")
          .to(["#ptr-1", "#ptr-2", "#compare-readout"], { opacity: 0, duration: 0.2 }, "+=0.3")
          .set("#ptr-1", { x: SLOT_X[1] })
          .set("#ptr-2", { x: SLOT_X[2] })
          .set("#compare-readout", { textContent: "3 - 2 = 1 (positive: swap)" })
          .to(["#ptr-1", "#ptr-2", "#compare-readout"], { opacity: 1, duration: 0.3 }, "+=0.1")
          .to("#bar-a", { x: SLOT_X[2], duration: 0.6, ease: "power2.inOut" }, "+=0.3")
          .to("#bar-c", { x: SLOT_X[1], duration: 0.6, ease: "power2.inOut" }, "<")
          .to(["#ptr-1", "#ptr-2", "#compare-readout"], { opacity: 0, duration: 0.2 }, "+=0.3")
          .set("#ptr-1", { x: SLOT_X[0] })
          .set("#ptr-2", { x: SLOT_X[1] })
          .set("#compare-readout", { textContent: "1 - 2 = -1 (negative: keep order)" })
          .to(["#ptr-1", "#ptr-2", "#compare-readout"], { opacity: 1, duration: 0.3 }, "+=0.1")
          .to(["#ptr-1", "#ptr-2", "#compare-readout"], { opacity: 0, duration: 0.3 }, "+=0.6")
          .to("#sorted-label", { opacity: 1, duration: 0.4 }, "+=0.1");
      } else {
        // reduced motion: jump to labeled end-state (array sorted ascending)
        tl.set("#comparator-label", { opacity: 1 })
          .set("#bar-a", { x: SLOT_X[2] })
          .set("#bar-b", { x: SLOT_X[0] })
          .set("#bar-c", { x: SLOT_X[1] })
          .set(["#ptr-1", "#ptr-2", "#compare-readout"], { opacity: 0 })
          .set("#sorted-label", { opacity: 1 });
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

  const bar = (id: string, value: number, height: number) => (
    <g id={id} key={id}>
      <rect
        x="-35"
        y={-height}
        width="70"
        height={height}
        rx="6"
        className="fill-[var(--color-primary)] stroke-[var(--color-primary)]"
        opacity="0.15"
      />
      <rect x="-35" y={-height} width="70" height={height} rx="6" className="fill-none stroke-[var(--color-primary)]" />
      <text x="0" y={-height / 2 + 4} textAnchor="middle" className="fill-[var(--color-foreground)] text-[13px] font-mono">
        {value}
      </text>
    </g>
  );

  return (
    <svg
      ref={scope}
      viewBox="0 0 380 300"
      className="w-full max-w-md"
      role="img"
      aria-label="Three bars valued 3, 1, and 2 are sorted ascending by comparing adjacent pairs with a - b: a positive result swaps the pair, a negative result keeps their order, ending in the sequence 1, 2, 3"
    >
      <text id="comparator-label" x="20" y="30" opacity="0" className="fill-[var(--color-muted-foreground)] text-[10px] font-mono">
        arr.sort((a, b) =&gt; a - b)
      </text>
      <text id="compare-readout" x="20" y="55" opacity="0" className="fill-[var(--color-foreground)] text-[11px] font-mono" />

      <g id="ptr-1" opacity="0">
        <path d="M -8,0 L 8,0 L 0,14 Z" className="fill-[var(--color-primary)]" />
      </g>
      <g id="ptr-2" opacity="0">
        <path d="M -8,0 L 8,0 L 0,14 Z" className="fill-[var(--color-primary)]" />
      </g>

      {bar("bar-a", 3, 90)}
      {bar("bar-b", 1, 30)}
      {bar("bar-c", 2, 60)}

      <line x1="20" y1={BASELINE_Y} x2="360" y2={BASELINE_Y} className="stroke-[var(--color-border)]" />

      <text id="sorted-label" x="20" y="280" opacity="0" className="fill-[var(--color-muted-foreground)] text-[10px]">
        sorted ascending, in place
      </text>
    </svg>
  );
}
