"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";
import { Stage, Panel, Chip, Eyebrow, CodeLine, enter, pop, focusOn, focusOff, travel, DUR, EASE } from "./kit";

// Top half: a Set already holding 1, 2, 3 rejects a second add of 2 (the
// duplicate bounces off, destructive-tinted, size stays 3), then accepts a
// new add of 4 (size becomes 4). Bottom half: a Map from names to scores; an
// O(1) lookup focus lands directly on the grace entry and pops its value out.
export function MapsAndSetsVisual({ register }: ConceptVisualProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      gsap.set(["#set-label", "#set-panel"], { opacity: 0, y: 12 });
      gsap.set(["#chip-s1", "#chip-s2", "#chip-s3"], { opacity: 0, scale: 0.8 });
      gsap.set(["#size-label", "#size-num"], { opacity: 0, y: 12 });
      gsap.set("#size-num", { textContent: "3" });
      gsap.set("#chip-dup", { opacity: 0 });
      gsap.set("#reject-mark", { opacity: 0 });
      gsap.set("#reject-label", { opacity: 0, y: 12 });
      gsap.set("#chip-new", { opacity: 0, scale: 0.8 });
      gsap.set("#accept-label", { opacity: 0, y: 12 });

      gsap.set(["#map-label", "#map-panel", "#row-ada", "#row-grace", "#row-linus"], { opacity: 0, y: 12 });
      gsap.set("#result-chip", { opacity: 0, scale: 0.8 });
      gsap.set("#lookup-code", { opacity: 0, y: 12 });
      gsap.set(".glow", { opacity: 0 });

      if (animate) {
        enter(tl, ["#set-label", "#set-panel"], undefined, 0.1);
        pop(tl, ["#chip-s1", "#chip-s2", "#chip-s3"], "+=0.15");
        enter(tl, ["#size-label", "#size-num"], "+=0.15");

        // attempt to add a duplicate: it bounces off and fades, size unchanged
        tl.to("#chip-dup", { opacity: 1, duration: DUR.pop, ease: EASE.pop }, "+=0.3");
        travel(tl, "#chip-dup", { x: -85, y: 0 }, "+=0.1");
        tl.to("#reject-mark", { opacity: 1, duration: DUR.focus, ease: EASE.focus }, "+=0.05");
        travel(tl, "#chip-dup", { x: 0, y: 0 }, "+=0.1");
        tl.to("#chip-dup", { opacity: 0, duration: DUR.exit, ease: EASE.exit }, "<");
        enter(tl, "#reject-label", "+=0.05");
        tl.to("#reject-mark", { opacity: 0, duration: DUR.exit, ease: EASE.exit }, "+=0.2");

        // add a genuinely new value: it lands in the set, size increments
        tl.to("#chip-new", { opacity: 1, scale: 1, duration: DUR.pop, ease: EASE.pop }, "+=0.3");
        travel(tl, "#chip-new", { x: -174, y: 0 }, "+=0.1");
        tl.to("#size-num", { textContent: 4, duration: 0.3, snap: { textContent: 1 } }, "+=0.1");
        enter(tl, "#accept-label", "<");

        enter(tl, ["#map-label", "#map-panel"], "+=0.4", 0.1);
        enter(tl, ["#row-ada", "#row-grace", "#row-linus"], "+=0.15", 0.1);
        focusOn(tl, "#row-grace", "+=0.25");
        pop(tl, "#result-chip", "+=0.15");
        focusOff(tl, "#row-grace", "+=0.5");
        enter(tl, "#lookup-code", "+=0.2");
      } else {
        // reduced motion: jump to labeled end-state
        tl.set(["#set-label", "#set-panel"], { opacity: 1, y: 0 })
          .set(["#chip-s1", "#chip-s2", "#chip-s3"], { opacity: 1, scale: 1 })
          .set(["#size-label", "#size-num"], { opacity: 1, y: 0 })
          .set("#size-num", { textContent: "4" })
          .set("#chip-dup", { opacity: 0 })
          .set("#reject-mark", { opacity: 0 })
          .set("#reject-label", { opacity: 1, y: 0 })
          .set("#chip-new", { opacity: 1, scale: 1, x: -174, y: 0 })
          .set("#accept-label", { opacity: 1, y: 0 })
          .set(["#map-label", "#map-panel", "#row-ada", "#row-grace", "#row-linus"], { opacity: 1, y: 0 })
          .set("#result-chip", { opacity: 1, scale: 1 })
          .set("#lookup-code", { opacity: 1, y: 0 });
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
      height={340}
      label="A Set already holding 1, 2, 3 rejects a second add of 2: the duplicate bounces off and size stays 3. Adding 4 is accepted and size becomes 4. Below, a Map from names to scores: a lookup for grace lands directly on that entry, an O(1) jump rather than a scan through every row, and pops out its value 95"
    >
      <Eyebrow id="set-label" className="absolute" style={{ left: 8, top: 4 }}>
        Set rejects duplicates
      </Eyebrow>
      <Panel id="set-panel" label="Set" style={{ left: 0, top: 20, width: 260, height: 60 }} />
      <Chip id="chip-s1" className="absolute" style={{ left: 16, top: 40 }}>1</Chip>
      <Chip id="chip-s2" className="absolute" style={{ left: 56, top: 40 }}>2</Chip>
      <Chip id="chip-s3" className="absolute" style={{ left: 96, top: 40 }}>3</Chip>

      <Eyebrow id="size-label" className="absolute" style={{ left: 270, top: 44 }}>size =</Eyebrow>
      <span id="size-num" className="absolute font-mono text-[12px] font-semibold text-foreground" style={{ left: 320, top: 44 }}>
        3
      </span>

      <span
        id="chip-dup"
        className="absolute rounded-md bg-[var(--color-destructive)]/10 px-2 py-1 font-mono text-[12px] font-semibold text-[var(--color-destructive)]"
        style={{ left: 310, top: 40 }}
      >
        2
      </span>
      <span id="reject-mark" className="absolute font-mono text-[13px] text-[var(--color-destructive)]" style={{ left: 214, top: 20 }}>
        &#10005;
      </span>
      <Eyebrow id="reject-label" className="absolute" style={{ left: 16, top: 92, width: 380 }}>
        .add(2) is already in the set, size stays 3
      </Eyebrow>

      <Chip id="chip-new" className="absolute" style={{ left: 310, top: 40 }}>4</Chip>
      <Eyebrow id="accept-label" className="absolute" style={{ left: 16, top: 114, width: 380 }}>
        .add(4) is new, size becomes 4
      </Eyebrow>

      <div className="absolute border-t border-border" style={{ left: 0, top: 140, width: 400 }} />

      <Eyebrow id="map-label" className="absolute" style={{ left: 8, top: 152 }}>
        Map: O(1) key lookup
      </Eyebrow>
      <Panel id="map-panel" label="Map" style={{ left: 0, top: 170, width: 260, height: 96 }} />
      <CodeLine id="row-ada" className="whitespace-nowrap" style={{ left: 16, top: 192, width: 220 }}>ada &#8594; 90</CodeLine>
      <CodeLine id="row-grace" className="whitespace-nowrap" style={{ left: 16, top: 218, width: 220 }}>grace &#8594; 95</CodeLine>
      <CodeLine id="row-linus" className="whitespace-nowrap" style={{ left: 16, top: 244, width: 220 }}>linus &#8594; 88</CodeLine>

      <Chip id="result-chip" className="absolute" style={{ left: 280, top: 218 }}>95</Chip>

      <CodeLine id="lookup-code" className="whitespace-nowrap" style={{ left: 16, top: 300, width: 360 }}>
        map.get(&quot;grace&quot;) &#8594; 95, an O(1) jump, not a scan
      </CodeLine>
    </Stage>
  );
}
