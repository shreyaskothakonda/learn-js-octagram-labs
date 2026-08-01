"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";
import { Stage, Panel, Frame, Chip, travel, focusOn, focusOff } from "./kit";

// Scene: three nested scope panels (global > outer > inner). A lookup frame
// for `z` starts in the inner scope and travels outward, its execution focus
// lighting each scope in turn as it is checked. Nothing matches, so the
// lookup fades out at global and a destructive-tinted ReferenceError chip
// appears in its place.
export function ScopeChainVisual({ register }: ConceptVisualProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      gsap.set("#lookup", { opacity: 0, y: 12, x: 0 });
      gsap.set(".glow", { opacity: 0 });
      gsap.set("#not-found", { opacity: 0, scale: 0.8 });

      if (animate) {
        // enters checking the inner scope first
        tl.to("#lookup", { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" });
        focusOn(tl, "#lookup", "+=0.1");
        focusOff(tl, "#lookup", "+=0.35");
        // travels out to check the outer scope
        travel(tl, "#lookup", { x: 96, y: -84 }, "+=0.05");
        focusOn(tl, "#lookup");
        focusOff(tl, "#lookup", "+=0.35");
        // travels out to check the global scope
        travel(tl, "#lookup", { x: 150, y: -34 }, "+=0.05");
        focusOn(tl, "#lookup");
        focusOff(tl, "#lookup", "+=0.35");
        // no match anywhere: the lookup fades and a ReferenceError chip appears
        tl.to("#lookup", { opacity: 0, duration: 0.3 }, "+=0.15");
        tl.to("#not-found", { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(1.6)" }, "-=0.1");
      } else {
        // reduced motion: jump to labeled end-state (lookup resolved to failure)
        tl.set("#lookup", { opacity: 0 })
          .set("#not-found", { opacity: 1, scale: 1 });
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
      height={300}
      label="A lookup for the variable z starts in the inner scope and travels outward through outer and global, its execution focus checking each scope in turn. No match is found anywhere, so the lookup fades and a ReferenceError chip appears at global scope"
    >
      <Panel label="Global scope" style={{ left: 0, top: 0, width: 400, height: 300 }} />
      <Panel label="outer() scope" style={{ left: 40, top: 56, width: 320, height: 220 }} />
      <Panel label="inner() scope" style={{ left: 90, top: 112, width: 210, height: 130 }} />

      <Frame id="lookup" style={{ left: 130, top: 160, width: 70, height: 40 }}>z</Frame>

      <Chip
        id="not-found"
        className="absolute"
        style={{
          left: 200,
          top: 20,
          color: "var(--color-destructive)",
          backgroundColor: "color-mix(in srgb, var(--color-destructive) 12%, transparent)",
        }}
      >
        ReferenceError
      </Chip>
    </Stage>
  );
}
