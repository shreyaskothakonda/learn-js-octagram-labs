"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";
import { Stage, Frame, enter, exit, pop, focusOn, focusOff, travel } from "./kit";

// A min-heap of 2, 5, 4, 9, 8, 6. Inserting 3 lands in the next open slot,
// then bubbles up one level (swapping with 4, its parent) before stopping,
// since 3 is greater than the root, 2. Extracting the root then removes 2,
// moves the last slot's value (4) up to the root, and sifts it down one
// level by swapping with its smaller child, 3, which lands at the root.
export function HeapsVisual({ register }: ConceptVisualProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const baseIds = ["#hp-2", "#hp-5", "#hp-4", "#hp-9", "#hp-8", "#hp-6"];
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      gsap.set(baseIds, { opacity: 0, y: 12 });
      gsap.set("#hp-3", { opacity: 0, scale: 0.8 });
      gsap.set("#hp-edge-new", { opacity: 0 });
      gsap.set(".glow", { opacity: 0 });

      if (animate) {
        enter(tl, baseIds.join(", "));

        // insert 3 into the next open slot (child of 4)
        pop(tl, "#hp-3", "+=0.2");
        tl.to("#hp-edge-new", { opacity: 1, duration: 0.3, ease: "power2.out" }, "<");
        focusOn(tl, "#hp-3", "+=0.1");

        // bubble up: 3 is less than its parent 4, so they swap
        travel(tl, "#hp-3", { x: -50, y: -80 }, "+=0.3");
        travel(tl, "#hp-4", { x: 50, y: 80 }, "<");
        // 3 is now compared with the root, 2; 3 is greater, so bubbling stops
        focusOff(tl, "#hp-3", "+=0.4");

        // extract-min: remove the root, 2
        focusOn(tl, "#hp-2", "+=0.2");
        exit(tl, "#hp-2", "+=0.2");

        // move the last slot's value, 4, up to the root
        travel(tl, "#hp-4", { x: -80, y: -80 }, "+=0.1");
        tl.to("#hp-edge-new", { opacity: 0, duration: 0.3, ease: "power2.in" }, "<");
        focusOn(tl, "#hp-4", "+=0.2");

        // sift down: 4 is greater than its smaller child, 3, so they swap
        travel(tl, "#hp-4", { x: 0, y: 0 }, "+=0.3");
        travel(tl, "#hp-3", { x: -130, y: -160 }, "<");
        focusOff(tl, "#hp-4", "<");
        focusOn(tl, "#hp-3", "+=0.1");
      } else {
        tl.set(["#hp-5", "#hp-9", "#hp-8", "#hp-6"], { opacity: 1, y: 0 })
          .set("#hp-2", { opacity: 0 })
          .set("#hp-edge-new", { opacity: 0 })
          .set("#hp-4", { opacity: 1, y: 0, x: 0 })
          .set("#hp-3", { opacity: 1, scale: 1, x: -130, y: -160 })
          .set("#hp-3 .glow", { opacity: 1 })
          .set("#hp-3", { scale: 1.03 });
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
      height={260}
      label="A min-heap holding 2, 5, 4, 9, 8, and 6. Inserting 3 places it in the next open slot, and it bubbles up one level, swapping with its parent 4, before stopping because it is greater than the root, 2. Extracting the root then removes 2, moves 4 up to the root, and sifts it down one level, swapping with its smaller child 3, which ends up lit at the root as the new minimum."
    >
      <svg className="pointer-events-none absolute inset-0" width={400} height={230}>
        <line x1={195} y1={50} x2={125} y2={90} className="stroke-[var(--color-border)]" strokeWidth={2} />
        <line x1={220} y1={50} x2={290} y2={90} className="stroke-[var(--color-border)]" strokeWidth={2} />
        <line x1={100} y1={130} x2={80} y2={170} className="stroke-[var(--color-border)]" strokeWidth={2} />
        <line x1={130} y1={130} x2={165} y2={170} className="stroke-[var(--color-border)]" strokeWidth={2} />
        <line x1={260} y1={130} x2={255} y2={170} className="stroke-[var(--color-border)]" strokeWidth={2} />
        <line
          id="hp-edge-new"
          x1={280} y1={130} x2={320} y2={170}
          className="stroke-[var(--color-border)]"
          strokeWidth={2}
        />
      </svg>

      <Frame id="hp-2" style={{ left: 170, top: 10, width: 50, height: 40 }}>2</Frame>
      <Frame id="hp-5" style={{ left: 90, top: 90, width: 50, height: 40 }}>5</Frame>
      <Frame id="hp-4" style={{ left: 250, top: 90, width: 50, height: 40 }}>4</Frame>
      <Frame id="hp-9" style={{ left: 40, top: 170, width: 50, height: 40 }}>9</Frame>
      <Frame id="hp-8" style={{ left: 130, top: 170, width: 50, height: 40 }}>8</Frame>
      <Frame id="hp-6" style={{ left: 220, top: 170, width: 50, height: 40 }}>6</Frame>
      <Frame id="hp-3" style={{ left: 300, top: 170, width: 50, height: 40 }}>3</Frame>
    </Stage>
  );
}
