"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";
import { Stage, Frame, Chip, Eyebrow, enter, pop, focusOn, focusOff } from "./kit";

const EVENT_OFFSETS = [0, 1, 2, 3, 4, 5];

// Two identical bursts of six rapid events, one debounced and one throttled,
// so the contrast is visible at a glance. The debounced row dims every event
// and only pops a single handler() call after the burst goes quiet. The
// throttled row keeps two events lit (green, at a fixed cadence) while
// dimming the ones in between, firing steadily through the whole burst.
export function DebounceAndThrottleVisual({ register }: ConceptVisualProps) {
  const scope = useRef<HTMLDivElement>(null);
  const dbIds = EVENT_OFFSETS.map((i) => `#db-e${i}`);
  const thIds = EVENT_OFFSETS.map((i) => `#th-e${i}`);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      gsap.set(["#dt-title", "#db-title", "#th-title", "#db-note", "#th-note"], { opacity: 0, y: 12 });
      gsap.set(dbIds, { opacity: 0, y: 12 });
      gsap.set(thIds, { opacity: 0, y: 12 });
      gsap.set("#db-fire", { opacity: 0, scale: 0.8 });
      gsap.set(".glow", { opacity: 0 });

      if (animate) {
        enter(tl, "#dt-title");
        enter(tl, "#db-title", "+=0.1");
        enter(tl, dbIds.join(", "), "+=0.05", 0.05);
        // the burst settles: every event dims, only one call fires afterward
        tl.to(dbIds.join(", "), { opacity: 0.35, duration: 0.3 }, "+=0.3");
        pop(tl, "#db-fire", "+=0.2");
        focusOn(tl, "#db-fire", "<");
        enter(tl, "#db-note", "+=0.15");
        focusOff(tl, "#db-fire", "+=0.3");

        enter(tl, "#th-title", "+=0.3");
        enter(tl, thIds.join(", "), "+=0.05", 0.05);
        // fixed cadence: e0 and e3 fire, their neighbors dim instead
        focusOn(tl, "#th-e0", "+=0.2");
        tl.to("#th-e1, #th-e2", { opacity: 0.35, duration: 0.25 }, "<");
        focusOff(tl, "#th-e0", "+=0.3");
        focusOn(tl, "#th-e3", "+=0.15");
        tl.to("#th-e4, #th-e5", { opacity: 0.35, duration: 0.25 }, "<");
        focusOff(tl, "#th-e3", "+=0.3");
        enter(tl, "#th-note", "+=0.15");
      } else {
        tl.set(["#dt-title", "#db-title", "#th-title", "#db-note", "#th-note"], { opacity: 1, y: 0 })
          .set(dbIds, { opacity: 0.35, y: 0 })
          .set(thIds, { opacity: 1, y: 0 })
          .set(["#th-e1", "#th-e2", "#th-e4", "#th-e5"], { opacity: 0.35 })
          .set("#db-fire", { opacity: 1, scale: 1 });
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
      height={250}
      label="The same burst of six rapid events plays out twice. In the debounced row, all six events dim as the burst settles, and only after that a single handler() call fires. In the throttled row, the first and fourth events stay lit and fire, while the events between them dim and are skipped, so handler() runs repeatedly at a steady cadence through the whole burst instead of waiting for it to end."
    >
      <Eyebrow id="dt-title" style={{ left: 16, top: 0, width: 368 }}>
        Six rapid events, handled two ways
      </Eyebrow>

      <Eyebrow id="db-title" style={{ left: 16, top: 22 }}>Debounce</Eyebrow>
      {EVENT_OFFSETS.map((i) => (
        <Chip key={i} id={`db-e${i}`} style={{ left: 16 + i * 52, top: 46, width: 40, height: 28 }}>
          {i + 1}
        </Chip>
      ))}
      <Frame id="db-fire" style={{ left: 140, top: 82, width: 140, height: 36 }}>handler()</Frame>
      <Eyebrow id="db-note" style={{ left: 16, top: 122, width: 368 }}>
        fires once, after the burst goes quiet
      </Eyebrow>

      <Eyebrow id="th-title" style={{ left: 16, top: 152 }}>Throttle</Eyebrow>
      {EVENT_OFFSETS.map((i) => (
        <Chip
          key={i}
          id={`th-e${i}`}
          className={i === 0 || i === 3 ? "!bg-green-500/10 !text-green-600" : ""}
          style={{ left: 16 + i * 52, top: 176, width: 40, height: 28 }}
        >
          {i + 1}
        </Chip>
      ))}
      <Eyebrow id="th-note" style={{ left: 16, top: 216, width: 368 }}>
        fires on a steady cadence, all through the burst
      </Eyebrow>
    </Stage>
  );
}
