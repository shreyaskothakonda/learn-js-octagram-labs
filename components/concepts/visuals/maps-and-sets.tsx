"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";

export function MapsAndSetsVisual({ register }: ConceptVisualProps) {
  const scope = useRef<SVGSVGElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      // Scene, top half: a Set already holding 1, 2, 3. Adding 2 again bounces
      // off (rejected, size stays 3); adding 4 lands inside (size becomes 4).
      // Scene, bottom half: a Map of name to score. A lookup for "grace"
      // highlights that one entry directly, an O(1) jump, not a scan through
      // every row, and pops the matching value out beside the map.
      gsap.set(["#set-label", "#set-box", "#chip-s1", "#chip-s2", "#chip-s3"], { opacity: 0 });
      gsap.set(["#size-label", "#size-num"], { opacity: 0 });
      gsap.set("#size-num", { textContent: "3" });
      gsap.set("#chip-dup", { x: 310, y: 62, opacity: 0 });
      gsap.set("#reject-mark", { opacity: 0 });
      gsap.set("#reject-label", { opacity: 0 });
      gsap.set("#chip-new", { x: 310, y: 62, opacity: 0 });
      gsap.set("#accept-label", { opacity: 0 });

      gsap.set(["#map-label", "#map-box", "#row1", "#row2", "#row3"], { opacity: 0 });
      gsap.set("#highlight-row2", { opacity: 0 });
      gsap.set("#result-chip", { opacity: 0, x: 250, y: 237 });
      gsap.set("#lookup-code", { opacity: 0 });

      if (animate) {
        tl.to(["#set-label", "#set-box"], { opacity: 1, duration: 0.3 })
          .to(["#chip-s1", "#chip-s2", "#chip-s3"], { opacity: 1, duration: 0.3, stagger: 0.08 }, "+=0.1")
          .to(["#size-label", "#size-num"], { opacity: 1, duration: 0.3 }, "+=0.1")
          .to("#chip-dup", { opacity: 1, duration: 0.25 }, "+=0.3")
          .to("#chip-dup", { x: 225, duration: 0.5, ease: "power2.out" }, "+=0.1")
          .to("#reject-mark", { opacity: 1, duration: 0.2 }, "+=0.05")
          .to("#chip-dup", { x: 310, opacity: 0, duration: 0.4, ease: "power2.in" }, "+=0.1")
          .to("#reject-label", { opacity: 1, duration: 0.3 }, "<")
          .to("#chip-new", { opacity: 1, duration: 0.25 }, "+=0.35")
          .to("#chip-new", { x: 145, duration: 0.5, ease: "power2.inOut" }, "+=0.1")
          .to("#size-num", { textContent: 4, duration: 0.3, snap: { textContent: 1 } }, "+=0.1")
          .to("#accept-label", { opacity: 1, duration: 0.3 }, "<")
          .to(["#map-label", "#map-box"], { opacity: 1, duration: 0.3 }, "+=0.4")
          .to(["#row1", "#row2", "#row3"], { opacity: 1, duration: 0.3, stagger: 0.1 }, "+=0.1")
          .to("#highlight-row2", { opacity: 1, duration: 0.25 }, "+=0.3")
          .to("#result-chip", { opacity: 1, x: 285, duration: 0.4, ease: "power2.out" }, "+=0.1")
          .to("#lookup-code", { opacity: 1, duration: 0.3 }, "+=0.2");
      } else {
        // reduced motion: jump to labeled end-state
        tl.set(["#set-label", "#set-box", "#chip-s1", "#chip-s2", "#chip-s3"], { opacity: 1 })
          .set(["#size-label", "#size-num"], { opacity: 1 })
          .set("#size-num", { textContent: "4" })
          .set("#chip-dup", { opacity: 0 })
          .set("#reject-mark", { opacity: 0 })
          .set("#reject-label", { opacity: 1 })
          .set("#chip-new", { x: 145, opacity: 1 })
          .set("#accept-label", { opacity: 1 })
          .set(["#map-label", "#map-box", "#row1", "#row2", "#row3"], { opacity: 1 })
          .set("#highlight-row2", { opacity: 1 })
          .set("#result-chip", { x: 285, opacity: 1 })
          .set("#lookup-code", { opacity: 1 });
      }
      register(tl);
      return tl;
    };
    mm.add("(prefers-reduced-motion: reduce)", () => { build(false); });
    mm.add("(prefers-reduced-motion: no-preference)", () => { build(true); });
    return () => mm.revert();
  }, { scope });

  return (
    <svg ref={scope} viewBox="0 0 380 320" className="w-full max-w-md" role="img"
      aria-label="A Set already holding 1, 2, 3 rejects a second add of 2, size stays 3, then accepts a new add of 4, size becomes 4. A Map of names to scores highlights the grace entry directly on lookup and pops out its value 95, an O(1) jump rather than a scan through every entry">
      <text id="set-label" x="15" y="20" opacity="0" className="fill-[var(--color-muted-foreground)] text-[10px]">
        Set — rejects duplicates
      </text>
      <g id="set-box">
        <rect x="20" y="40" width="230" height="44" rx="10" className="fill-[var(--color-muted)] stroke-[var(--color-border)]" />
      </g>

      <g id="chip-s1">
        <rect x="30" y="50" width="32" height="24" rx="6" className="fill-[var(--color-primary)] stroke-[var(--color-primary)]" opacity="0.15" />
        <rect x="30" y="50" width="32" height="24" rx="6" className="fill-none stroke-[var(--color-primary)]" />
        <text x="46" y="67" textAnchor="middle" className="fill-[var(--color-foreground)] text-[11px] font-mono">1</text>
      </g>
      <g id="chip-s2">
        <rect x="70" y="50" width="32" height="24" rx="6" className="fill-[var(--color-primary)] stroke-[var(--color-primary)]" opacity="0.15" />
        <rect x="70" y="50" width="32" height="24" rx="6" className="fill-none stroke-[var(--color-primary)]" />
        <text x="86" y="67" textAnchor="middle" className="fill-[var(--color-foreground)] text-[11px] font-mono">2</text>
      </g>
      <g id="chip-s3">
        <rect x="110" y="50" width="32" height="24" rx="6" className="fill-[var(--color-primary)] stroke-[var(--color-primary)]" opacity="0.15" />
        <rect x="110" y="50" width="32" height="24" rx="6" className="fill-none stroke-[var(--color-primary)]" />
        <text x="126" y="67" textAnchor="middle" className="fill-[var(--color-foreground)] text-[11px] font-mono">3</text>
      </g>

      <text id="size-label" x="255" y="67" opacity="0" className="fill-[var(--color-muted-foreground)] text-[10px]">
        size =
      </text>
      <text id="size-num" x="298" y="67" opacity="0" className="fill-[var(--color-foreground)] text-[11px] font-mono">3</text>

      <g id="chip-dup">
        <rect x="-18" y="-12" width="36" height="24" rx="6" className="fill-[var(--color-destructive)] stroke-[var(--color-destructive)]" opacity="0.15" />
        <rect x="-18" y="-12" width="36" height="24" rx="6" className="fill-none stroke-[var(--color-destructive)]" />
        <text x="0" y="5" textAnchor="middle" className="fill-[var(--color-foreground)] text-[11px] font-mono">2</text>
      </g>
      <text id="reject-mark" x="215" y="35" opacity="0" className="fill-[var(--color-destructive)] text-[13px]">&#10005;</text>
      <text id="reject-label" x="20" y="100" opacity="0" className="fill-[var(--color-muted-foreground)] text-[10px] font-mono">
        .add(2) &#8594; already in the set, size stays 3
      </text>

      <g id="chip-new">
        <rect x="-18" y="-12" width="36" height="24" rx="6" className="fill-[var(--color-primary)] stroke-[var(--color-primary)]" opacity="0.15" />
        <rect x="-18" y="-12" width="36" height="24" rx="6" className="fill-none stroke-[var(--color-primary)]" />
        <text x="0" y="5" textAnchor="middle" className="fill-[var(--color-foreground)] text-[11px] font-mono">4</text>
      </g>
      <text id="accept-label" x="20" y="125" opacity="0" className="fill-[var(--color-muted-foreground)] text-[10px] font-mono">
        .add(4) &#8594; new value, size becomes 4
      </text>

      <line x1="10" y1="150" x2="370" y2="150" className="stroke-[var(--color-border)]" />

      <text id="map-label" x="15" y="178" opacity="0" className="fill-[var(--color-muted-foreground)] text-[10px]">
        Map — O(1) key lookup
      </text>
      <g id="map-box">
        <rect x="20" y="190" width="230" height="95" rx="10" className="fill-[var(--color-muted)] stroke-[var(--color-border)]" />
      </g>

      <g id="row1">
        <text x="32" y="212" className="fill-[var(--color-foreground)] text-[11px] font-mono">ada</text>
        <text x="80" y="212" className="fill-[var(--color-muted-foreground)] text-[11px]">&#8594;</text>
        <text x="100" y="212" className="fill-[var(--color-foreground)] text-[11px] font-mono">90</text>
      </g>
      <g id="row2">
        <text x="32" y="237" className="fill-[var(--color-foreground)] text-[11px] font-mono">grace</text>
        <text x="80" y="237" className="fill-[var(--color-muted-foreground)] text-[11px]">&#8594;</text>
        <text x="100" y="237" className="fill-[var(--color-foreground)] text-[11px] font-mono">95</text>
      </g>
      <g id="row3">
        <text x="32" y="262" className="fill-[var(--color-foreground)] text-[11px] font-mono">linus</text>
        <text x="80" y="262" className="fill-[var(--color-muted-foreground)] text-[11px]">&#8594;</text>
        <text x="100" y="262" className="fill-[var(--color-foreground)] text-[11px] font-mono">88</text>
      </g>
      <rect id="highlight-row2" x="25" y="225" width="220" height="24" rx="6"
        className="fill-none stroke-[var(--color-primary)]" strokeWidth="2" opacity="0" />

      <g id="result-chip">
        <rect x="-24" y="-13" width="48" height="26" rx="6" className="fill-[var(--color-primary)] stroke-[var(--color-primary)]" opacity="0.15" />
        <rect x="-24" y="-13" width="48" height="26" rx="6" className="fill-none stroke-[var(--color-primary)]" />
        <text x="0" y="5" textAnchor="middle" className="fill-[var(--color-primary)] text-[12px] font-mono">95</text>
      </g>

      <text id="lookup-code" x="20" y="305" opacity="0" className="fill-[var(--color-muted-foreground)] text-[10px] font-mono">
        map.get(&quot;grace&quot;) &#8594; 95
      </text>
    </svg>
  );
}
