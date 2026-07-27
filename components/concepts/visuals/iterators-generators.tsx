"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";

export function IteratorsGeneratorsVisual({ register }: ConceptVisualProps) {
  const scope = useRef<SVGSVGElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      // Scene: a generator function's frame sits paused at its yield. Three
      // calls to next() each resume the frame, advance its local variable i,
      // and hand out one value at a time to a trail, then pause again.
      gsap.set(["#codeA", "#codeB", "#codeC", "#constLine", "#gen-frame", "#trail-label"], { opacity: 0 });
      gsap.set("#pause-icon", { opacity: 0 });
      gsap.set(".i-value", { textContent: "" });
      gsap.set(["#chip0", "#chip1", "#chip2"], { opacity: 0, x: 95, y: 150 });
      gsap.set("#call-label", { opacity: 0 });
      gsap.set("#result-text", { opacity: 0 });

      if (animate) {
        tl.to(["#codeA", "#codeB", "#codeC", "#constLine"], { opacity: 1, duration: 0.3, stagger: 0.08 })
          .to(["#gen-frame", "#trail-label"], { opacity: 1, duration: 0.4 }, "+=0.2");

        const chips = ["#chip0", "#chip1", "#chip2"];
        const chipX = [210, 270, 330];
        chips.forEach((chipSelector, i) => {
          tl.to("#call-label", { opacity: 1, duration: 0.2 }, "+=0.3")
            .to("#pause-icon", { opacity: 0, duration: 0.15 }, "+=0.1")
            .to(".i-value", { textContent: String(i), duration: 0.15, snap: { textContent: 1 } }, "<")
            .to(chipSelector, { opacity: 1, x: chipX[i], y: 190, duration: 0.5, ease: "power2.inOut" }, "+=0.1")
            .to("#pause-icon", { opacity: 1, duration: 0.15 }, "+=0.1")
            .to("#call-label", { opacity: 0, duration: 0.2 }, "+=0.2");
        });

        tl.to("#result-text", { opacity: 1, duration: 0.3 }, "+=0.3");
      } else {
        // reduced motion: jump to labeled end-state, all three values yielded
        tl.set(["#codeA", "#codeB", "#codeC", "#constLine", "#gen-frame", "#trail-label"], { opacity: 1 })
          .set("#pause-icon", { opacity: 1 })
          .set(".i-value", { textContent: "2" })
          .set("#chip0", { opacity: 1, x: 210, y: 190 })
          .set("#chip1", { opacity: 1, x: 270, y: 190 })
          .set("#chip2", { opacity: 1, x: 330, y: 190 })
          .set("#call-label", { opacity: 0 })
          .set("#result-text", { opacity: 1 });
      }
      register(tl);
      return tl;
    };
    mm.add("(prefers-reduced-motion: reduce)", () => { build(false); });
    mm.add("(prefers-reduced-motion: no-preference)", () => { build(true); });
    return () => mm.revert();
  }, { scope });

  const chip = (id: string, value: string) => (
    <g id={id} key={id} opacity="0">
      <rect x="-18" y="-14" width="36" height="28" rx="6" className="fill-[var(--color-primary)] stroke-[var(--color-primary)]" fillOpacity="0.15" />
      <rect x="-18" y="-14" width="36" height="28" rx="6" className="fill-none stroke-[var(--color-primary)]" />
      <text x="0" y="5" textAnchor="middle" className="fill-[var(--color-foreground)] text-[11px] font-mono">
        {value}
      </text>
    </g>
  );

  return (
    <svg
      ref={scope}
      viewBox="0 0 380 260"
      className="w-full max-w-md"
      role="img"
      aria-label="A generator function's frame pauses at each yield. Three calls to next() each resume it in turn, producing the values 0, 1 and 2 while the paused frame's local variable i is preserved and incremented between calls"
    >
      <text id="codeA" x="20" y="22" opacity="0" className="fill-[var(--color-muted-foreground)] text-[11px] font-mono">
        function* count() {"{"}
      </text>
      <text id="codeB" x="20" y="40" opacity="0" className="fill-[var(--color-muted-foreground)] text-[11px] font-mono">
        {"  while (true) yield i++;"}
      </text>
      <text id="codeC" x="20" y="58" opacity="0" className="fill-[var(--color-muted-foreground)] text-[11px] font-mono">
        {"}"}
      </text>
      <text id="constLine" x="20" y="80" opacity="0" className="fill-[var(--color-muted-foreground)] text-[11px] font-mono">
        const it = count();
      </text>

      <g id="gen-frame" opacity="0">
        <rect x="20" y="100" width="150" height="80" rx="10" className="fill-[var(--color-muted)] stroke-[var(--color-border)]" />
        <text x="32" y="118" className="fill-[var(--color-muted-foreground)] text-[10px]">
          count() frame
        </text>
        <text x="32" y="150" className="fill-[var(--color-foreground)] text-[12px] font-mono">
          i:
        </text>
        <text x="55" y="150" className="i-value fill-[var(--color-foreground)] text-[12px] font-mono" />
        <g id="pause-icon" opacity="0">
          <rect x="138" y="108" width="4" height="14" className="fill-[var(--color-muted-foreground)]" />
          <rect x="148" y="108" width="4" height="14" className="fill-[var(--color-muted-foreground)]" />
        </g>
      </g>

      <text id="trail-label" x="185" y="145" opacity="0" className="fill-[var(--color-muted-foreground)] text-[10px]">
        yielded values
      </text>
      <text id="call-label" x="185" y="95" opacity="0" className="fill-[var(--color-foreground)] text-[11px] font-mono">
        it.next()
      </text>

      {chip("chip0", "0")}
      {chip("chip1", "1")}
      {chip("chip2", "2")}

      <text id="result-text" x="20" y="230" opacity="0" className="fill-[var(--color-muted-foreground)] text-[10px] font-mono">
        it.next() =&gt; {"{"} value: 2, done: false {"}"}
      </text>
    </svg>
  );
}
