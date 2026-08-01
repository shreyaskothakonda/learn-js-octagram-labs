"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";
import { Stage, Frame, Chip, Eyebrow, pop, focusOn, focusOff } from "./kit";

// Scene: copying a primitive duplicates its value into an independent chip
// that later diverges from the original. Copying an object copies a
// reference instead: two variables end up pointing, via connector lines, at
// one shared box, so mutating through either one updates it for both.
export function PrimitivesVsReferencesVisual({ register }: ConceptVisualProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      gsap.set(["#chipA", "#chipB"], { opacity: 0, scale: 0.8 });
      gsap.set("#copy-line", { opacity: 0 });
      gsap.set(".mutate-label", { opacity: 0 });
      gsap.set("#chipB-value", { textContent: "5" });

      gsap.set(["#obj1", "#obj2", "#shared-box"], { opacity: 0, y: 12 });
      gsap.set(["#ref-line-1", "#ref-line-2"], { opacity: 0 });
      gsap.set(".glow", { opacity: 0 });
      gsap.set("#shared-count", { textContent: "1" });

      if (animate) {
        pop(tl, "#chipA");
        tl.to("#copy-line", { opacity: 1, duration: 0.25 }, "+=0.1");
        pop(tl, "#chipB", "<");
        tl.to(".mutate-label", { opacity: 1, duration: 0.25 }, "+=0.35");
        tl.to("#chipB-value", { textContent: 10, duration: 0.4, snap: { textContent: 1 } }, "<");

        tl.to(["#obj1", "#obj2"], { opacity: 1, y: 0, duration: 0.4, ease: "power3.out", stagger: 0.08 }, "+=0.5");
        tl.to(["#ref-line-1", "#ref-line-2"], { opacity: 1, duration: 0.3 }, "+=0.1");
        tl.to("#shared-box", { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }, "<");
        focusOn(tl, "#shared-box", "+=0.3");
        tl.to("#shared-count", { textContent: 99, duration: 0.4, snap: { textContent: 1 } }, "<");
        focusOff(tl, "#shared-box", "+=0.4");
      } else {
        // reduced motion: jump to labeled end-state
        tl.set(["#chipA", "#chipB"], { opacity: 1, scale: 1 })
          .set("#copy-line", { opacity: 1 })
          .set(".mutate-label", { opacity: 1 })
          .set("#chipB-value", { textContent: "10" })
          .set(["#obj1", "#obj2", "#shared-box"], { opacity: 1, y: 0 })
          .set(["#ref-line-1", "#ref-line-2"], { opacity: 1 })
          .set("#shared-count", { textContent: "99" });
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
      label="Copying a primitive duplicates its value into an independent chip: a stays 5 while b changes to 10. Copying an object copies a reference: obj1 and obj2 both connect to one shared box, and mutating through either one updates its count to 99 for both"
    >
      <Eyebrow className="absolute" style={{ left: 8, top: 12 }}>Primitives</Eyebrow>

      <Chip id="chipA" className="absolute" style={{ left: 40, top: 36, width: 72, height: 40 }}>
        <span className="mr-1.5 text-[9px] font-normal opacity-60">a</span>5
      </Chip>
      <Chip id="chipB" className="absolute" style={{ left: 220, top: 36, width: 72, height: 40 }}>
        <span className="mr-1.5 text-[9px] font-normal opacity-60">b</span>
        <span id="chipB-value">5</span>
      </Chip>
      <Eyebrow className="absolute mutate-label" style={{ left: 220, top: 20 }}>b = 10, a stays 5</Eyebrow>

      <Eyebrow className="absolute" style={{ left: 8, top: 156 }}>Objects</Eyebrow>

      <Frame id="obj1" style={{ left: 40, top: 190, width: 72, height: 36 }}>obj1</Frame>
      <Frame id="obj2" style={{ left: 220, top: 190, width: 72, height: 36 }}>obj2</Frame>
      <Frame id="shared-box" style={{ left: 130, top: 254, width: 150, height: 50 }}>
        {"{ count: "}<span id="shared-count">1</span>{" }"}
      </Frame>

      <svg className="pointer-events-none absolute inset-0" width={400} height={320} viewBox="0 0 400 320">
        <line
          id="copy-line"
          x1={112} y1={56} x2={220} y2={56}
          className="stroke-[var(--color-border)]"
          strokeWidth={2}
        />
        <line
          id="ref-line-1"
          x1={76} y1={226} x2={190} y2={256}
          className="stroke-[var(--color-border)]"
          strokeWidth={2}
        />
        <line
          id="ref-line-2"
          x1={256} y1={226} x2={230} y2={256}
          className="stroke-[var(--color-border)]"
          strokeWidth={2}
        />
      </svg>
    </Stage>
  );
}
