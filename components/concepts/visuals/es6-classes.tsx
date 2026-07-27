"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";

export function Es6ClassesVisual({ register }: ConceptVisualProps) {
  const scope = useRef<SVGSVGElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      // Scene: a class Dog box splits into the two things it desugars to, a
      // constructor function and a Dog.prototype with bark on it. Then new
      // Dog("Rex") builds an instance box, linked back up to the prototype
      // box by a __proto__ arrow.
      gsap.set(["#class-box", "#class-text"], { opacity: 0 });
      gsap.set(["#split-arrow-left", "#split-arrow-right", "#ctor-box", "#ctor-text", "#proto-box", "#proto-label", "#proto-text"], {
        opacity: 0,
      });
      gsap.set(["#new-call", "#instance-box", "#instance-label", "#instance-prop"], { opacity: 0 });
      gsap.set(["#link-arrow", "#link-arrowhead", "#link-label", "#highlight-link"], { opacity: 0 });

      if (animate) {
        tl.to(["#class-box", "#class-text"], { opacity: 1, duration: 0.4 })
          .to(["#split-arrow-left", "#split-arrow-right"], { opacity: 1, duration: 0.3 }, "+=0.15")
          .to(["#ctor-box", "#ctor-text", "#proto-box", "#proto-label", "#proto-text"], { opacity: 1, duration: 0.4 }, "+=0.05")
          .to("#new-call", { opacity: 1, duration: 0.3 }, "+=0.3")
          .to(["#instance-box", "#instance-label", "#instance-prop"], { opacity: 1, duration: 0.4 }, "+=0.2")
          .to(["#link-arrow", "#link-arrowhead", "#link-label"], { opacity: 1, duration: 0.3 }, "+=0.2")
          .to("#highlight-link", { opacity: 1, duration: 0.3 })
          .to("#highlight-link", { opacity: 0, duration: 0.4 }, "+=0.35");
      } else {
        // reduced motion: jump to labeled end-state
        tl.set(
          [
            "#class-box", "#class-text", "#split-arrow-left", "#split-arrow-right", "#ctor-box", "#ctor-text",
            "#proto-box", "#proto-label", "#proto-text", "#new-call", "#instance-box", "#instance-label",
            "#instance-prop", "#link-arrow", "#link-arrowhead", "#link-label",
          ],
          { opacity: 1 },
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
    <svg ref={scope} viewBox="0 0 360 300" className="w-full max-w-md" role="img"
      aria-label="class Dog desugars into a constructor function and a Dog.prototype holding bark, then new Dog creates an instance linked to that prototype">
      <rect id="class-box" x="30" y="10" width="300" height="55" rx="10"
        className="fill-[var(--color-muted)] stroke-[var(--color-border)]" opacity="0" />
      <text id="class-text" x="42" y="42" className="fill-[var(--color-foreground)] text-[11px]" opacity="0">
        class Dog {"{"} constructor(name) {"{"}...{"}"} bark() {"{"}...{"}"} {"}"}
      </text>

      <line id="split-arrow-left" x1="130" y1="65" x2="80" y2="93" className="stroke-[var(--color-muted-foreground)]"
        strokeWidth="2" opacity="0" />
      <line id="split-arrow-right" x1="230" y1="65" x2="280" y2="93" className="stroke-[var(--color-muted-foreground)]"
        strokeWidth="2" opacity="0" />

      <rect id="ctor-box" x="15" y="95" width="150" height="55" rx="10"
        className="fill-[var(--color-muted)] stroke-[var(--color-border)]" opacity="0" />
      <text id="ctor-text" x="25" y="118" className="fill-[var(--color-foreground)] text-[10px]" opacity="0">
        function Dog(name)
      </text>
      <text x="25" y="136" className="fill-[var(--color-muted-foreground)] text-[10px]">
        this.name = name;
      </text>

      <rect id="proto-box" x="195" y="95" width="150" height="55" rx="10"
        className="fill-[var(--color-muted)] stroke-[var(--color-border)]" opacity="0" />
      <text id="proto-label" x="205" y="115" className="fill-[var(--color-muted-foreground)] text-[10px]" opacity="0">
        Dog.prototype
      </text>
      <text id="proto-text" x="205" y="135" className="fill-[var(--color-foreground)] text-[10px]" opacity="0">
        bark() {"{"} ... {"}"}
      </text>

      <text id="new-call" x="180" y="185" textAnchor="middle" opacity="0"
        className="fill-[var(--color-primary)] text-[11px]">
        new Dog(&quot;Rex&quot;)
      </text>

      <rect id="instance-box" x="90" y="200" width="180" height="60" rx="10"
        className="fill-[var(--color-muted)] stroke-[var(--color-border)]" opacity="0" />
      <text id="instance-label" x="100" y="222" className="fill-[var(--color-muted-foreground)] text-[11px]" opacity="0">
        rex (instance)
      </text>
      <text id="instance-prop" x="100" y="244" className="fill-[var(--color-foreground)] text-[11px]" opacity="0">
        name: &quot;Rex&quot;
      </text>

      <line id="link-arrow" x1="245" y1="200" x2="290" y2="152" className="stroke-[var(--color-muted-foreground)]"
        strokeWidth="2" opacity="0" />
      <polygon id="link-arrowhead" points="292,150 283,158 296,164" className="fill-[var(--color-muted-foreground)]"
        opacity="0" />
      <text id="link-label" x="255" y="185" className="fill-[var(--color-muted-foreground)] text-[10px]" opacity="0">
        __proto__
      </text>
      <rect id="highlight-link" x="195" y="95" width="150" height="55" rx="10"
        className="fill-none stroke-[var(--color-primary)]" strokeWidth="3" opacity="0" />
    </svg>
  );
}
