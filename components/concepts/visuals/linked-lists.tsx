"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";
import { Stage, Frame, enter, focusOn, focusOff, DUR, EASE } from "./kit";

// Node frames joined by connector arrows: 1 -> 2 -> 3. A new node, 99, is
// inserted between 1 and 2 by re-pointing one arrow: the direct 1 -> 2 arrow
// fades out and two new arrows, 1 -> 99 and 99 -> 2, take its place.
export function LinkedListsVisual({ register }: ConceptVisualProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      gsap.set(["#ll-a", "#ll-b", "#ll-c"], { opacity: 0, y: 12 });
      gsap.set("#ll-d", { opacity: 0, scale: 0.8 });
      gsap.set(["#ll-arrow-ad", "#ll-arrow-db"], { opacity: 0 });
      gsap.set(".glow", { opacity: 0 });

      if (animate) {
        enter(tl, "#ll-a, #ll-b, #ll-c");

        // walk the list: a -> b -> c
        focusOn(tl, "#ll-a", "+=0.15");
        focusOff(tl, "#ll-a", "+=0.35");
        focusOn(tl, "#ll-b", "<");
        focusOff(tl, "#ll-b", "+=0.35");
        focusOn(tl, "#ll-c", "<");
        focusOff(tl, "#ll-c", "+=0.35");

        // insert 99 between a and b: re-point the a -> b arrow
        tl.to("#ll-arrow-ab", { opacity: 0, duration: DUR.exit, ease: EASE.exit }, "+=0.15");
        tl.to("#ll-d", { opacity: 1, scale: 1, duration: DUR.pop, ease: EASE.pop }, "<");
        tl.to(
          ["#ll-arrow-ad", "#ll-arrow-db"],
          { opacity: 1, duration: DUR.enter, ease: EASE.enter, stagger: 0.1 },
          "-=0.05",
        );
        focusOn(tl, "#ll-d", "+=0.1");
      } else {
        tl.set(["#ll-a", "#ll-b", "#ll-c", "#ll-d"], { opacity: 1, y: 0, scale: 1 })
          .set("#ll-arrow-ab", { opacity: 0 })
          .set(["#ll-arrow-ad", "#ll-arrow-db"], { opacity: 1 })
          .set("#ll-d .glow", { opacity: 1 })
          .set("#ll-d", { scale: 1.03 });
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
      height={210}
      label="Nodes 1, 2, and 3 join in a chain, each pointing to the next with an arrow. The focus walks the chain from 1 to 2 to 3. Then a new node, 99, is inserted between 1 and 2: the direct arrow from 1 to 2 fades away, and two new arrows appear, one from 1 down to 99 and one from 99 up to 2, re-pointing the list through the new node."
    >
      <svg className="pointer-events-none absolute inset-0" width={400} height={210}>
        <defs>
          <marker id="ll-head-border" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 Z" style={{ fill: "var(--color-border)" }} />
          </marker>
          <marker id="ll-head-primary" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 Z" style={{ fill: "var(--color-primary)" }} />
          </marker>
        </defs>
        <line
          id="ll-arrow-ab"
          x1={90} y1={62} x2={155} y2={62}
          className="stroke-[var(--color-border)]"
          strokeWidth={2}
          markerEnd="url(#ll-head-border)"
        />
        <line
          x1={230} y1={62} x2={295} y2={62}
          className="stroke-[var(--color-border)]"
          strokeWidth={2}
          markerEnd="url(#ll-head-border)"
        />
        <line
          id="ll-arrow-ad"
          x1={55} y1={84} x2={122} y2={140}
          className="stroke-[var(--color-primary)]"
          strokeWidth={2}
          markerEnd="url(#ll-head-primary)"
        />
        <line
          id="ll-arrow-db"
          x1={160} y1={162} x2={193} y2={87}
          className="stroke-[var(--color-primary)]"
          strokeWidth={2}
          markerEnd="url(#ll-head-primary)"
        />
      </svg>

      <Frame id="ll-a" style={{ left: 20, top: 40, width: 70, height: 44 }}>1</Frame>
      <Frame id="ll-b" style={{ left: 160, top: 40, width: 70, height: 44 }}>2</Frame>
      <Frame id="ll-c" style={{ left: 300, top: 40, width: 70, height: 44 }}>3</Frame>
      <Frame id="ll-d" style={{ left: 90, top: 140, width: 70, height: 44 }}>99</Frame>
    </Stage>
  );
}
