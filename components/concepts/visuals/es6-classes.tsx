"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";
import { Stage, Panel, Frame, Eyebrow, CodeLine, enter, focusOn, focusOff } from "./kit";

// class Dog is sugar: the execution focus lights it up, then it desugars into
// a constructor Frame and a Dog.prototype Frame holding bark. new Dog("Rex")
// then builds an instance Frame, linked back up to Dog.prototype by the same
// __proto__ connector the prototype-chain visual uses.
export function Es6ClassesVisual({ register }: ConceptVisualProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      gsap.set(["#class-frame", "#ctor-panel", "#ctor-frame", "#proto-panel", "#proto-frame"], {
        opacity: 0,
        y: 12,
      });
      gsap.set(["#new-call", "#instance-panel", "#instance-frame"], { opacity: 0, y: 12 });
      gsap.set(["#link-base", "#link-label"], { opacity: 0 });
      gsap.set("#link-active", { opacity: 0 });
      gsap.set(".glow", { opacity: 0 });

      if (animate) {
        enter(tl, "#class-frame");
        focusOn(tl, "#class-frame", "+=0.2");
        focusOff(tl, "#class-frame", "+=0.35");
        enter(tl, "#ctor-panel", "+=0.15");
        enter(tl, "#ctor-frame", "<");
        enter(tl, "#proto-panel", "+=0.05");
        enter(tl, "#proto-frame", "<");
        enter(tl, "#new-call", "+=0.4");
        enter(tl, "#instance-panel", "+=0.2");
        enter(tl, "#instance-frame", "<");
        enter(tl, "#link-base", "+=0.15");
        enter(tl, "#link-label", "<");
        tl.to("#link-active", { opacity: 1, duration: 0.35, ease: "power2.inOut" }, "+=0.05");
        focusOn(tl, "#proto-frame", "<");
        tl.to("#link-active", { opacity: 0, duration: 0.3 }, "+=0.3");
        focusOff(tl, "#proto-frame", "+=0.4");
      } else {
        // reduced motion: jump to labeled end-state (instance linked to the prototype)
        tl.set(
          [
            "#class-frame", "#ctor-panel", "#ctor-frame", "#proto-panel", "#proto-frame",
            "#new-call", "#instance-panel", "#instance-frame", "#link-base", "#link-label",
          ],
          { opacity: 1, y: 0 },
        );
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
      label="class Dog desugars into a constructor function and a Dog.prototype holding bark, then new Dog(Rex) creates an instance linked back to that prototype by the same proto link the prototype chain uses"
    >
      <Frame id="class-frame" className="whitespace-nowrap justify-center" style={{ left: 60, top: 0, width: 280, height: 40 }}>
        class Dog {"{"} ... {"}"}
      </Frame>

      <Panel id="ctor-panel" label="Constructor function" style={{ left: 12, top: 66, width: 180, height: 80 }} />
      <Frame id="ctor-frame" className="whitespace-nowrap" style={{ left: 24, top: 92, width: 156, height: 38 }}>
        function Dog(name)
      </Frame>

      <Panel id="proto-panel" label="Dog.prototype" style={{ left: 208, top: 66, width: 180, height: 80 }} />
      <Frame id="proto-frame" className="whitespace-nowrap" style={{ left: 220, top: 92, width: 156, height: 38 }}>
        bark() {"{"} ... {"}"}
      </Frame>

      <CodeLine id="new-call" className="whitespace-nowrap" style={{ left: 20, top: 178, width: 160 }}>
        new Dog(&quot;Rex&quot;)
      </CodeLine>

      <Panel id="instance-panel" label="rex (instance)" style={{ left: 90, top: 212, width: 220, height: 76 }} />
      <Frame id="instance-frame" className="whitespace-nowrap" style={{ left: 106, top: 238, width: 188, height: 38 }}>
        name: &quot;Rex&quot;
      </Frame>

      <svg
        className="pointer-events-none absolute left-0 top-0"
        width={400}
        height={300}
        viewBox="0 0 400 300"
        aria-hidden="true"
      >
        <defs>
          <marker id="class-link-arrowhead" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
            <path d="M0,8 L4,0 L8,8 Z" className="fill-[var(--color-muted-foreground)]" />
          </marker>
        </defs>
        <line
          id="link-base"
          x1="230"
          y1="212"
          x2="290"
          y2="150"
          className="stroke-[var(--color-border)]"
          strokeWidth={2}
          markerEnd="url(#class-link-arrowhead)"
        />
        <line
          id="link-active"
          x1="230"
          y1="212"
          x2="290"
          y2="150"
          className="stroke-[var(--color-primary)]"
          strokeWidth={2}
        />
      </svg>
      <Eyebrow id="link-label" className="absolute" style={{ left: 238, top: 178 }}>
        __proto__
      </Eyebrow>
    </Stage>
  );
}
