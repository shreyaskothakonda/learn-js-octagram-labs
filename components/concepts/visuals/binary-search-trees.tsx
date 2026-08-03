"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";
import { Stage, Frame, Chip, pop, enter, focusOn, focusOff, travel } from "./kit";

// A small binary search tree rooted at 8, with 4 and 12 as its children and
// 2, 6, 10, 14 as the four leaves. A search for 6 enters at the root and a
// target chip travels down the tree: 6 is less than 8 (go left), greater
// than 4 (go right), and matches 6, landing on the match.
export function BinarySearchTreesVisual({ register }: ConceptVisualProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const nodeIds = ["#bst-8", "#bst-4", "#bst-12", "#bst-2", "#bst-6", "#bst-10", "#bst-14"];
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      gsap.set(nodeIds, { opacity: 0, y: 12 });
      gsap.set("#bst-edges", { opacity: 0 });
      gsap.set("#bst-target", { opacity: 0, scale: 0.8 });
      gsap.set("#bst-found", { opacity: 0, scale: 0.8 });
      gsap.set(".glow", { opacity: 0 });

      if (animate) {
        enter(tl, nodeIds.join(", "));
        tl.to("#bst-edges", { opacity: 1, duration: 0.3, ease: "power2.out" }, "-=0.15");

        // target 6 enters near the top, above the root
        pop(tl, "#bst-target", "+=0.2");

        // compare with root (8): 6 < 8, go left
        focusOn(tl, "#bst-8", "+=0.15");
        focusOff(tl, "#bst-8", "+=0.35");
        travel(tl, "#bst-target", { x: -115, y: 106 }, "<");

        // compare with 4: 6 > 4, go right
        focusOn(tl, "#bst-4", "+=0.1");
        focusOff(tl, "#bst-4", "+=0.35");
        travel(tl, "#bst-target", { x: -75, y: 190 }, "<");

        // compare with 6: match
        focusOn(tl, "#bst-6", "+=0.1");
        pop(tl, "#bst-found", "+=0.15");
      } else {
        tl.set(nodeIds, { opacity: 1, y: 0 })
          .set("#bst-edges", { opacity: 1 })
          .set("#bst-target", { opacity: 1, scale: 1, x: -75, y: 190 })
          .set("#bst-found", { opacity: 1, scale: 1 })
          .set("#bst-6 .glow", { opacity: 1 })
          .set("#bst-6", { scale: 1.03 });
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
      height={320}
      label="A binary search tree rooted at 8, with 4 and 12 as its children and 2, 6, 10, 14 as leaves. A search for 6 enters near the top and travels down the tree: 6 is less than 8, so it moves toward 4; 6 is greater than 4, so it moves toward 6; 6 matches 6, ending with 6 lit as the match and a found marker beside it."
    >
      <svg id="bst-edges" className="pointer-events-none absolute inset-0" width={400} height={230}>
        <line x1={200} y1={56} x2={128} y2={100} className="stroke-[var(--color-border)]" strokeWidth={2} />
        <line x1={200} y1={56} x2={272} y2={100} className="stroke-[var(--color-border)]" strokeWidth={2} />
        <line x1={120} y1={140} x2={80} y2={184} className="stroke-[var(--color-border)]" strokeWidth={2} />
        <line x1={120} y1={140} x2={160} y2={184} className="stroke-[var(--color-border)]" strokeWidth={2} />
        <line x1={280} y1={140} x2={240} y2={184} className="stroke-[var(--color-border)]" strokeWidth={2} />
        <line x1={280} y1={140} x2={320} y2={184} className="stroke-[var(--color-border)]" strokeWidth={2} />
      </svg>

      <Frame id="bst-8" style={{ left: 170, top: 16, width: 60, height: 40 }}>8</Frame>
      <Frame id="bst-4" style={{ left: 90, top: 100, width: 60, height: 40 }}>4</Frame>
      <Frame id="bst-12" style={{ left: 250, top: 100, width: 60, height: 40 }}>12</Frame>
      <Frame id="bst-2" style={{ left: 50, top: 184, width: 56, height: 40 }}>2</Frame>
      <Frame id="bst-6" style={{ left: 132, top: 184, width: 56, height: 40 }}>6</Frame>
      <Frame id="bst-10" style={{ left: 212, top: 184, width: 56, height: 40 }}>10</Frame>
      <Frame id="bst-14" style={{ left: 292, top: 184, width: 56, height: 40 }}>14</Frame>

      <Chip id="bst-target" style={{ left: 210, top: 0, width: 50, height: 28 }}>6</Chip>
      <Chip id="bst-found" style={{ left: 110, top: 232, width: 100, height: 26 }}>match!</Chip>
    </Stage>
  );
}
