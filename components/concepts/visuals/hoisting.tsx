"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";
import { Stage, Panel, CodeLine, Eyebrow, enter, travel, focusOn, focusOff } from "./kit";

// Scene: a scope panel holding source lines in original order. The var and
// function lines travel up to a "hoisted" shelf before the code runs, while
// the let line stays put behind a temporal-dead-zone band. An execution focus
// then steps down through the lines that still run in place (the let
// declaration, the assignment, and the call), clearing the TDZ band the
// moment it reaches the let line.
export function HoistingVisual({ register }: ConceptVisualProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      gsap.set(["#line-let", "#line-func", "#line-var", "#line-assign", "#line-call"], { opacity: 0, y: 12 });
      gsap.set(".glow", { opacity: 0 });
      gsap.set(["#line-func", "#line-var"], { x: 0, y: 0 });
      gsap.set(".shelf-label", { opacity: 0 });
      gsap.set(".tdz-band", { opacity: 1 });

      if (animate) {
        enter(tl, ["#line-let", "#line-func", "#line-var", "#line-assign", "#line-call"]);
        tl.to(".shelf-label", { opacity: 1, duration: 0.25 }, "+=0.2");
        travel(tl, "#line-func", { x: 216, y: -68 }, "<");
        travel(tl, "#line-var", { x: 216, y: -76 }, "<");
        focusOn(tl, "#line-let", "+=0.25");
        tl.to(".tdz-band", { opacity: 0, duration: 0.3 }, "<");
        focusOff(tl, "#line-let", "+=0.35");
        focusOn(tl, "#line-assign", "+=0.15");
        focusOff(tl, "#line-assign", "+=0.35");
        focusOn(tl, "#line-call", "+=0.15");
      } else {
        // reduced motion: jump to labeled end-state
        tl.set(["#line-let", "#line-func", "#line-var", "#line-assign", "#line-call"], { opacity: 1, y: 0 })
          .set("#line-func", { x: 216, y: -68 })
          .set("#line-var", { x: 216, y: -76 })
          .set(".shelf-label", { opacity: 1 })
          .set(".tdz-band", { opacity: 0 })
          .set("#line-call .glow", { opacity: 1 })
          .set("#line-call", { scale: 1.03 });
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
      height={280}
      label="Var and function declarations travel to a hoisted shelf at the top of the scope before the code runs, while the let declaration stays in place until the execution focus reaches it and its temporal dead zone clears. The focus then steps down through the assignment and the function call."
    >
      <Panel label="Scope" style={{ left: 0, top: 0, width: 400, height: 280 }} />
      <Eyebrow className="absolute shelf-label" style={{ left: 240, top: 16 }}>Hoisted</Eyebrow>

      <Panel
        label="TDZ"
        className="tdz-band"
        style={{
          left: 20,
          top: 62,
          width: 168,
          height: 32,
          borderColor: "var(--color-destructive)",
          backgroundColor: "color-mix(in srgb, var(--color-destructive) 14%, transparent)",
        }}
      />

      <CodeLine id="line-let" gutter={1} style={{ left: 24, top: 66 }}>let count;</CodeLine>
      <CodeLine id="line-func" gutter={2} style={{ left: 24, top: 106 }}>function greet() {"{}"}</CodeLine>
      <CodeLine id="line-var" gutter={3} style={{ left: 24, top: 146 }}>var msg;</CodeLine>
      <CodeLine id="line-assign" gutter={4} style={{ left: 24, top: 186 }}>msg = &apos;hi&apos;;</CodeLine>
      <CodeLine id="line-call" gutter={5} style={{ left: 24, top: 226 }}>greet();</CodeLine>
    </Stage>
  );
}
