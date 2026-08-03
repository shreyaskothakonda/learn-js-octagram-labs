"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";
import { Stage, Frame, Chip, enter, pop, focusOn, focusOff } from "./kit";

// A small binary tree: 1 at the root, 2 and 3 as its children, 4 and 5 as 2's
// children. A pre-order walk (root, then left subtree, then right subtree)
// visits 1, 2, 4, 5, 3, emitting each value as a chip in a row below the tree.
export function TreesVisual({ register }: ConceptVisualProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      gsap.set(["#tr-1", "#tr-2", "#tr-3", "#tr-4", "#tr-5"], { opacity: 0, y: 12 });
      gsap.set("#tr-edges", { opacity: 0 });
      gsap.set(["#tr-out-0", "#tr-out-1", "#tr-out-2", "#tr-out-3", "#tr-out-4"], { opacity: 0, scale: 0.8 });
      gsap.set(".glow", { opacity: 0 });

      if (animate) {
        enter(tl, "#tr-1, #tr-2, #tr-3, #tr-4, #tr-5");
        tl.to("#tr-edges", { opacity: 1, duration: 0.3, ease: "power2.out" }, "-=0.15");

        // pre-order: root, then left subtree entirely, then right subtree
        focusOn(tl, "#tr-1", "+=0.2");
        pop(tl, "#tr-out-0", "+=0.1");
        focusOff(tl, "#tr-1", "+=0.3");

        focusOn(tl, "#tr-2", "<");
        pop(tl, "#tr-out-1", "+=0.1");
        focusOff(tl, "#tr-2", "+=0.3");

        focusOn(tl, "#tr-4", "<");
        pop(tl, "#tr-out-2", "+=0.1");
        focusOff(tl, "#tr-4", "+=0.3");

        focusOn(tl, "#tr-5", "<");
        pop(tl, "#tr-out-3", "+=0.1");
        focusOff(tl, "#tr-5", "+=0.3");

        focusOn(tl, "#tr-3", "<");
        pop(tl, "#tr-out-4", "+=0.1");
        // last node visited stays lit as the end state
      } else {
        tl.set(["#tr-1", "#tr-2", "#tr-3", "#tr-4", "#tr-5"], { opacity: 1, y: 0 })
          .set("#tr-edges", { opacity: 1 })
          .set(["#tr-out-0", "#tr-out-1", "#tr-out-2", "#tr-out-3", "#tr-out-4"], { opacity: 1, scale: 1 })
          .set("#tr-3 .glow", { opacity: 1 })
          .set("#tr-3", { scale: 1.03 });
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
      label="A binary tree with 1 at the root, 2 and 3 as its children, and 4 and 5 as the children of 2. A pre-order traversal visits the root before either subtree: 1, then 2, then 2's children 4 and 5, then 3, emitting each value as a chip in a row below the tree and ending with 3 lit as the last node visited."
    >
      <svg id="tr-edges" className="pointer-events-none absolute inset-0" width={400} height={230}>
        <line x1={200} y1={56} x2={128} y2={100} className="stroke-[var(--color-border)]" strokeWidth={2} />
        <line x1={200} y1={56} x2={272} y2={100} className="stroke-[var(--color-border)]" strokeWidth={2} />
        <line x1={120} y1={140} x2={75} y2={184} className="stroke-[var(--color-border)]" strokeWidth={2} />
        <line x1={120} y1={140} x2={165} y2={184} className="stroke-[var(--color-border)]" strokeWidth={2} />
      </svg>

      <Frame id="tr-1" style={{ left: 170, top: 16, width: 60, height: 40 }}>1</Frame>
      <Frame id="tr-2" style={{ left: 90, top: 100, width: 60, height: 40 }}>2</Frame>
      <Frame id="tr-3" style={{ left: 250, top: 100, width: 60, height: 40 }}>3</Frame>
      <Frame id="tr-4" style={{ left: 40, top: 184, width: 60, height: 40 }}>4</Frame>
      <Frame id="tr-5" style={{ left: 140, top: 184, width: 60, height: 40 }}>5</Frame>

      <Chip id="tr-out-0" style={{ left: 10, top: 270, width: 56, height: 32 }}>1</Chip>
      <Chip id="tr-out-1" style={{ left: 80, top: 270, width: 56, height: 32 }}>2</Chip>
      <Chip id="tr-out-2" style={{ left: 150, top: 270, width: 56, height: 32 }}>4</Chip>
      <Chip id="tr-out-3" style={{ left: 220, top: 270, width: 56, height: 32 }}>5</Chip>
      <Chip id="tr-out-4" style={{ left: 290, top: 270, width: 56, height: 32 }}>3</Chip>
    </Stage>
  );
}
