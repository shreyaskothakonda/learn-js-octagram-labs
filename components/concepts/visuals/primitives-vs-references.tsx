"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";

export function PrimitivesVsReferencesVisual({ register }: ConceptVisualProps) {
  const scope = useRef<SVGSVGElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      // Scene: top half copies a primitive into an independent chip that later
      // diverges. Bottom half copies an object reference; two variables end up
      // pointing at one shared box, and mutating through either updates it.
      gsap.set("#chipA", { opacity: 0 });
      gsap.set("#chipB", { opacity: 0 });
      gsap.set("#copy-arrow", { opacity: 0 });
      gsap.set("#mutate-label", { opacity: 0 });
      gsap.set("#chipB-value", { textContent: "5" });

      gsap.set(["#tagObj1", "#arrow1", "#sharedBox"], { opacity: 0 });
      gsap.set(["#tagObj2", "#arrow2"], { opacity: 0 });
      gsap.set("#sharedBox-count", { textContent: "1" });
      gsap.set("#shared-flash", { opacity: 0 });

      if (animate) {
        tl.to("#chipA", { opacity: 1, duration: 0.3 })
          .to("#copy-arrow", { opacity: 1, duration: 0.2 }, "+=0.2")
          .to("#chipB", { opacity: 1, duration: 0.3 }, "<")
          .to("#mutate-label", { opacity: 1, duration: 0.2 }, "+=0.3")
          .to("#chipB-value", { textContent: 10, duration: 0.4, snap: { textContent: 1 } }, "<")
          .to(["#tagObj1", "#arrow1", "#sharedBox"], { opacity: 1, duration: 0.3 }, "+=0.4")
          .to(["#tagObj2", "#arrow2"], { opacity: 1, duration: 0.3 }, "+=0.3")
          .to("#sharedBox-count", { textContent: 99, duration: 0.4, snap: { textContent: 1 } }, "+=0.3")
          .to("#shared-flash", { opacity: 1, duration: 0.2 }, "<")
          .to("#shared-flash", { opacity: 0, duration: 0.3 }, "+=0.2");
      } else {
        // reduced motion: jump to labeled end-state
        tl.set(["#chipA", "#chipB", "#copy-arrow", "#mutate-label"], { opacity: 1 })
          .set("#chipB-value", { textContent: "10" })
          .set(["#tagObj1", "#arrow1", "#sharedBox", "#tagObj2", "#arrow2"], { opacity: 1 })
          .set("#sharedBox-count", { textContent: "99" });
      }
      register(tl);
      return tl;
    };
    mm.add("(prefers-reduced-motion: reduce)", () => { build(false); });
    mm.add("(prefers-reduced-motion: no-preference)", () => { build(true); });
    return () => mm.revert();
  }, { scope });

  return (
    <svg ref={scope} viewBox="0 0 380 300" className="w-full max-w-md" role="img"
      aria-label="Copying a primitive duplicates its value into an independent chip, a and b end at 5 and 10. Copying an object copies a reference, obj1 and obj2 both point at one shared box whose count updates to 99">
      <text x="10" y="25" className="fill-[var(--color-muted-foreground)] text-[10px]">Primitives</text>

      <g id="chipA">
        <rect x="30" y="35" width="70" height="36" rx="6"
          className="fill-[var(--color-primary)] stroke-[var(--color-primary)]" opacity="0.15" />
        <rect x="30" y="35" width="70" height="36" rx="6" className="fill-none stroke-[var(--color-primary)]" />
        <text x="38" y="49" className="fill-[var(--color-muted-foreground)] text-[9px]">a</text>
        <text x="55" y="65" className="fill-[var(--color-foreground)] text-[12px]">5</text>
      </g>

      <line id="copy-arrow" x1="100" y1="53" x2="168" y2="53"
        className="stroke-[var(--color-muted-foreground)]" strokeWidth="2" />

      <g id="chipB">
        <rect x="170" y="35" width="70" height="36" rx="6"
          className="fill-[var(--color-primary)] stroke-[var(--color-primary)]" opacity="0.15" />
        <rect x="170" y="35" width="70" height="36" rx="6" className="fill-none stroke-[var(--color-primary)]" />
        <text x="178" y="49" className="fill-[var(--color-muted-foreground)] text-[9px]">b</text>
        <text id="chipB-value" x="195" y="65" className="fill-[var(--color-foreground)] text-[12px]">5</text>
      </g>

      <text id="mutate-label" x="170" y="24" className="fill-[var(--color-muted-foreground)] text-[9px]">
        b = 10 (a stays 5)
      </text>

      <line x1="10" y1="95" x2="370" y2="95" className="stroke-[var(--color-border)]" />
      <text x="10" y="120" className="fill-[var(--color-muted-foreground)] text-[10px]">Objects</text>

      <g id="tagObj1">
        <rect x="30" y="135" width="60" height="28" rx="6"
          className="fill-[var(--color-muted)] stroke-[var(--color-border)]" />
        <text x="42" y="153" className="fill-[var(--color-foreground)] text-[10px]">obj1</text>
      </g>
      <g id="tagObj2">
        <rect x="170" y="135" width="60" height="28" rx="6"
          className="fill-[var(--color-muted)] stroke-[var(--color-border)]" />
        <text x="182" y="153" className="fill-[var(--color-foreground)] text-[10px]">obj2</text>
      </g>

      <line id="arrow1" x1="60" y1="163" x2="150" y2="200"
        className="stroke-[var(--color-muted-foreground)]" strokeWidth="2" />
      <line id="arrow2" x1="200" y1="163" x2="190" y2="200"
        className="stroke-[var(--color-muted-foreground)]" strokeWidth="2" />

      <g id="sharedBox">
        <rect x="110" y="205" width="140" height="50" rx="8"
          className="fill-[var(--color-primary)] stroke-[var(--color-primary)]" opacity="0.15" />
        <rect x="110" y="205" width="140" height="50" rx="8" className="fill-none stroke-[var(--color-primary)]" />
        <text x="122" y="235" className="fill-[var(--color-foreground)] text-[10px]">{"{ count:"}</text>
        <text id="sharedBox-count" x="187" y="235" className="fill-[var(--color-foreground)] text-[10px]">1</text>
        <text x="203" y="235" className="fill-[var(--color-foreground)] text-[10px]">{"}"}</text>
      </g>
      <rect id="shared-flash" x="105" y="200" width="150" height="60" rx="10"
        className="fill-none stroke-[var(--color-primary)]" strokeWidth="3" opacity="0" />
    </svg>
  );
}
