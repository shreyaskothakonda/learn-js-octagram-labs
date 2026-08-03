"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";
import { Stage, Chip, Eyebrow, CodeLine, DUR, EASE, focusOn, focusOff, enter } from "./kit";

const FIND_VALUES = [3, 7, 12, 5, 20];
const EVERY_VALUES = [4, 9, -2, 6, 1];
const ROW_X = FIND_VALUES.map((_, i) => 16 + i * 74);

const findChipIds = FIND_VALUES.map((_, i) => `#find-chip-${i}`);
const everyChipIds = EVERY_VALUES.map((_, i) => `#every-chip-${i}`);

// find scans left to right, dimming each checked-but-unmatched chip, and
// stops the moment it hits a match, leaving the rest of the row untouched
// because they are never reached. every scans the same way but fails fast:
// the first element that breaks the rule stops the scan, again leaving the
// remaining chips untouched.
export function ArraySearchMethodsVisual({ register }: ConceptVisualProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      gsap.set(["#find-label", "#find-code", "#every-label", "#every-code"], { opacity: 0, y: 12 });
      gsap.set([...findChipIds, ...everyChipIds], { opacity: 0, scale: 0.8 });
      gsap.set(["#find-result", "#every-result"], { opacity: 0 });
      gsap.set(".glow", { opacity: 0 });

      if (animate) {
        // find(x => x > 10): checks 3 and 7, dims them, then matches at 12
        enter(tl, ["#find-label", "#find-code"], undefined, 0.1);
        tl.to(findChipIds, { opacity: 1, scale: 1, duration: DUR.pop, ease: EASE.pop, stagger: 0.06 }, "+=0.15");
        focusOn(tl, "#find-chip-0", "+=0.2");
        focusOff(tl, "#find-chip-0", "+=0.25");
        tl.to("#find-chip-0", { opacity: 0.35, duration: 0.25 }, "<");
        focusOn(tl, "#find-chip-1", "<+=0.1");
        focusOff(tl, "#find-chip-1", "+=0.25");
        tl.to("#find-chip-1", { opacity: 0.35, duration: 0.25 }, "<");
        focusOn(tl, "#find-chip-2", "<+=0.1");
        tl.to("#find-result", { opacity: 1, duration: 0.3 }, "+=0.15");

        // every(x => x > 0): 4 and 9 pass, -2 fails and stops the scan
        enter(tl, ["#every-label", "#every-code"], "+=0.4");
        tl.to(everyChipIds, { opacity: 1, scale: 1, duration: DUR.pop, ease: EASE.pop, stagger: 0.06 }, "+=0.15");
        focusOn(tl, "#every-chip-0", "+=0.2");
        focusOff(tl, "#every-chip-0", "+=0.25");
        focusOn(tl, "#every-chip-1", "<+=0.1");
        focusOff(tl, "#every-chip-1", "+=0.25");
        focusOn(tl, "#every-chip-2", "<+=0.1");
        tl.to("#every-result", { opacity: 1, duration: 0.3 }, "+=0.15");
      } else {
        // reduced motion: jump to labeled end-state (both scans resolved)
        tl.set(["#find-label", "#find-code", "#every-label", "#every-code"], { opacity: 1, y: 0 })
          .set([...findChipIds, ...everyChipIds], { opacity: 1, scale: 1 })
          .set("#find-chip-0", { opacity: 0.35 })
          .set("#find-chip-1", { opacity: 0.35 })
          .set("#find-chip-2 .glow", { opacity: 1 })
          .set("#find-chip-2", { scale: 1.03 })
          .set("#every-chip-2 .glow", { opacity: 1 })
          .set("#every-chip-2", { scale: 1.03 })
          .set(["#find-result", "#every-result"], { opacity: 1 });
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
      label="arr.find(x => x greater than 10) scans 3, then 7, dimming each as checked with no match, then matches at 12 and stops, leaving 5 and 20 untouched because they are never reached. Below, arr.every(x => x greater than 0) checks 4 and 9, which pass, then fails at negative 2 and stops right there, leaving 6 and 1 untouched"
    >
      <Eyebrow id="find-label" className="absolute" style={{ position: "absolute", left: 8, top: 4 }}>find stops at the first match</Eyebrow>
      <CodeLine id="find-code" className="whitespace-nowrap" style={{ position: "absolute", left: 16, top: 26, width: 300 }}>
        arr.find(x =&gt; x &gt; 10)
      </CodeLine>
      {FIND_VALUES.map((v, i) => (
        <Chip key={i} id={`find-chip-${i}`} className="absolute" style={{ position: "absolute", left: ROW_X[i], top: 64 }}>
          {v}
        </Chip>
      ))}
      <span id="find-result" className="absolute font-mono text-[12px] font-semibold text-foreground" style={{ position: "absolute", left: 16, top: 104 }}>
        = 12 (index 2)
      </span>

      <div className="absolute border-t border-border" style={{ position: "absolute", left: 0, top: 140, width: 400 }} />

      <Eyebrow id="every-label" className="absolute" style={{ position: "absolute", left: 8, top: 152 }}>every fails fast on the first miss</Eyebrow>
      <CodeLine id="every-code" className="whitespace-nowrap" style={{ position: "absolute", left: 16, top: 174, width: 300 }}>
        arr.every(x =&gt; x &gt; 0)
      </CodeLine>
      {EVERY_VALUES.map((v, i) => (
        <Chip
          key={i}
          id={`every-chip-${i}`}
          className={
            "absolute " +
            (i < 2 ? "!bg-green-500/10 !text-green-600" : i === 2 ? "!bg-[var(--color-destructive)]/10 !text-[var(--color-destructive)]" : "")
          }
          style={{ position: "absolute", left: ROW_X[i], top: 212 }}
        >
          {v}
        </Chip>
      ))}
      <span id="every-result" className="absolute font-mono text-[12px] font-semibold text-foreground" style={{ position: "absolute", left: 16, top: 252 }}>
        = false (stopped at index 2)
      </span>
    </Stage>
  );
}
