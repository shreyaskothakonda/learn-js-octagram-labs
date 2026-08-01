"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";
import { Stage, Panel, Frame, Chip, Eyebrow, CodeLine, enter, pop, focusOn, focusOff } from "./kit";

// rex.speak() checks the rex instance first and finds no own speak property
// (a miss badge flashes), then the execution focus walks down the __proto__
// connector to Dog.prototype, where speak lives, and the call resolves there.
export function PrototypesInheritanceVisual({ register }: ConceptVisualProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      gsap.set(["#call-code", "#instance-panel", "#instance-frame", "#proto-panel", "#proto-frame"], {
        opacity: 0,
        y: 12,
      });
      gsap.set("#miss-chip", { opacity: 0, scale: 0.8 });
      gsap.set(["#link-base", "#link-label"], { opacity: 0 });
      gsap.set("#link-active", { opacity: 0 });
      gsap.set("#result-chip", { opacity: 0, scale: 0.8 });
      gsap.set(".glow", { opacity: 0 });

      if (animate) {
        enter(tl, "#call-code");
        enter(tl, "#instance-panel", "+=0.1");
        enter(tl, "#instance-frame", "<");
        // check the instance itself first: focus lands, comes up empty
        focusOn(tl, "#instance-frame", "+=0.2");
        pop(tl, "#miss-chip", "+=0.15");
        focusOff(tl, "#instance-frame", "+=0.35");
        tl.to("#miss-chip", { opacity: 0, duration: 0.2 }, "<");
        // the __proto__ link lights up as the lookup walks down it
        tl.to("#link-base", { opacity: 1, duration: 0.3 }, "+=0.05");
        tl.to("#link-label", { opacity: 1, duration: 0.3 }, "<");
        tl.to("#link-active", { opacity: 1, duration: 0.35, ease: "power2.inOut" }, "<");
        enter(tl, "#proto-panel", "+=0.05");
        enter(tl, "#proto-frame", "<");
        tl.to("#link-active", { opacity: 0, duration: 0.3 }, "+=0.1");
        // found: speak lives on the prototype
        focusOn(tl, "#proto-frame", "<");
        pop(tl, "#result-chip", "+=0.15");
        focusOff(tl, "#proto-frame", "+=0.5");
      } else {
        // reduced motion: jump to labeled end-state (found on the prototype)
        tl.set(
          ["#call-code", "#instance-panel", "#instance-frame", "#proto-panel", "#proto-frame", "#link-base", "#link-label"],
          { opacity: 1, y: 0 },
        )
          .set("#result-chip", { opacity: 1, scale: 1 })
          .set("#proto-frame .glow", { opacity: 1 })
          .set("#proto-frame", { scale: 1.03 });
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
      label="rex.speak() finds no own speak property on the rex instance, so the execution focus walks down the __proto__ link to Dog.prototype, finds speak there, and the call resolves to Rex barks"
    >
      <CodeLine id="call-code" className="whitespace-nowrap" style={{ left: 12, top: 0, width: 160 }}>
        rex.speak()
      </CodeLine>

      <Panel id="instance-panel" label="rex (instance)" style={{ left: 40, top: 34, width: 210, height: 76 }} />
      <Frame id="instance-frame" style={{ left: 56, top: 60, width: 178, height: 38 }}>
        name: &quot;Rex&quot;
      </Frame>
      <Chip
        id="miss-chip"
        className="absolute z-10 whitespace-nowrap !bg-[var(--color-destructive)]/10 !text-[var(--color-destructive)]"
        style={{ left: 262, top: 66 }}
      >
        not found
      </Chip>

      <svg
        className="pointer-events-none absolute left-0 top-0"
        width={320}
        height={300}
        viewBox="0 0 320 300"
        aria-hidden="true"
      >
        <defs>
          <marker id="proto-arrowhead" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" className="fill-[var(--color-muted-foreground)]" />
          </marker>
        </defs>
        <line
          id="link-base"
          x1="145"
          y1="110"
          x2="145"
          y2="164"
          className="stroke-[var(--color-border)]"
          strokeWidth={2}
          markerEnd="url(#proto-arrowhead)"
        />
        <line
          id="link-active"
          x1="145"
          y1="110"
          x2="145"
          y2="164"
          className="stroke-[var(--color-primary)]"
          strokeWidth={2}
        />
      </svg>
      <Eyebrow id="link-label" className="absolute" style={{ left: 157, top: 128 }}>
        __proto__
      </Eyebrow>

      <Panel id="proto-panel" label="Dog.prototype" style={{ left: 40, top: 168, width: 210, height: 76 }} />
      <Frame id="proto-frame" style={{ left: 56, top: 194, width: 178, height: 38 }}>
        speak() {"{"} ... {"}"}
      </Frame>

      <div className="absolute flex items-center gap-2" style={{ left: 12, top: 262 }}>
        <Eyebrow>Result</Eyebrow>
        <Chip id="result-chip">&quot;Rex barks&quot;</Chip>
      </div>
    </Stage>
  );
}
