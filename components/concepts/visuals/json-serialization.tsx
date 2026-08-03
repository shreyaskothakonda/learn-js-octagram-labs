"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";
import { Stage, Panel, Chip, Eyebrow, enter, exit, focusOn, focusOff, travel } from "./kit";

const JOINED_BEFORE = "joined: Date";
const JOINED_AFTER = 'joined: "2024-01-01..."';

// An object with five fields turns into a JSON string and back. value
// (undefined) and handler (a function) are tinted destructive and drop out
// entirely at JSON.stringify. joined (a Date) survives but its text flips to
// the ISO string toJSON produces, and it stays a string through JSON.parse
// instead of reviving as a Date. id and name pass through unchanged.
export function JsonSerializationVisual({ register }: ConceptVisualProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      gsap.set(["#j-panel-orig", "#j-panel-str", "#j-panel-parsed"], { opacity: 0, y: 12 });
      gsap.set(["#j-id", "#j-name", "#j-value", "#j-handler", "#j-joined"], { opacity: 0, y: 12 });
      gsap.set("#j-joined-text", { textContent: JOINED_BEFORE });
      gsap.set(["#j-arrow-1", "#j-arrow-2"], { opacity: 0, y: 12 });
      gsap.set(".glow", { opacity: 0 });

      if (animate) {
        enter(tl, "#j-panel-orig");
        enter(tl, ["#j-id", "#j-name", "#j-value", "#j-handler", "#j-joined"], "+=0.1", 0.08);

        // undefined and the function are dropped: focus, then fade away for good
        focusOn(tl, "#j-value", "+=0.3");
        exit(tl, "#j-value", "+=0.15");
        focusOn(tl, "#j-handler", "<");
        exit(tl, "#j-handler", "<");

        // the Date survives, but its text becomes the ISO string
        focusOn(tl, "#j-joined", "+=0.15");
        tl.to("#j-joined-text", { opacity: 0.25, duration: 0.15 }, "+=0.1")
          .set("#j-joined-text", { textContent: JOINED_AFTER })
          .to("#j-joined-text", { opacity: 1, duration: 0.15 });
        focusOff(tl, "#j-joined", "+=0.2");

        // JSON.stringify(): id, name, joined travel down into the string panel
        enter(tl, "#j-arrow-1", "+=0.15");
        enter(tl, "#j-panel-str", "<");
        travel(tl, "#j-id", { y: 246 }, "+=0.1");
        travel(tl, "#j-name", { y: 246 }, "<");
        travel(tl, "#j-joined", { y: 174 }, "<");

        // JSON.parse(): the same three fields travel down again, joined stays a string
        enter(tl, "#j-arrow-2", "+=0.3");
        enter(tl, "#j-panel-parsed", "<");
        travel(tl, "#j-id", { y: 414 }, "+=0.1");
        travel(tl, "#j-name", { y: 414 }, "<");
        travel(tl, "#j-joined", { y: 342 }, "<");
      } else {
        tl.set(["#j-panel-orig", "#j-panel-str", "#j-panel-parsed", "#j-arrow-1", "#j-arrow-2"], { opacity: 1, y: 0 })
          .set(["#j-id", "#j-name"], { opacity: 1, y: 0 })
          .set("#j-id", { y: 414 })
          .set("#j-name", { y: 414 })
          .set("#j-joined", { opacity: 1, y: 342 })
          .set("#j-joined-text", { textContent: JOINED_AFTER })
          .set(["#j-value", "#j-handler"], { opacity: 0 });
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
      height={560}
      label="An object with five fields: id 1, name Ada, value undefined, handler a function, and joined a Date. JSON.stringify drops value and handler entirely, shown fading away with a destructive tint, while joined converts to an ISO date string. The resulting JSON string keeps only id, name, and joined as a string. JSON.parse rebuilds an object from that string, still with only those three fields, and joined stays a string instead of reviving as a Date."
    >
      <Panel id="j-panel-orig" label="Original object" style={{ left: 0, top: 0, width: 400, height: 210 }} />
      <Chip id="j-id" style={{ left: 16, top: 20 }}>id: 1</Chip>
      <Chip id="j-name" style={{ left: 16, top: 56 }}>name: &quot;Ada&quot;</Chip>
      <Chip id="j-value" className="!bg-[var(--color-destructive)]/10 !text-[var(--color-destructive)] line-through" style={{ left: 16, top: 92 }}>
        value: undefined
      </Chip>
      <Chip id="j-handler" className="!bg-[var(--color-destructive)]/10 !text-[var(--color-destructive)] line-through" style={{ left: 16, top: 128 }}>
        handler: function
      </Chip>
      <Chip id="j-joined" className="whitespace-nowrap" style={{ left: 16, top: 164 }}>
        <span id="j-joined-text">{JOINED_BEFORE}</span>
      </Chip>

      <Eyebrow id="j-arrow-1" className="text-center" style={{ left: 0, top: 216, width: 400 }}>
        ↓ JSON.stringify() ↓
      </Eyebrow>

      <Panel id="j-panel-str" label="JSON string" style={{ left: 0, top: 246, width: 400, height: 132 }} />

      <Eyebrow id="j-arrow-2" className="text-center" style={{ left: 0, top: 386, width: 400 }}>
        ↓ JSON.parse() ↓
      </Eyebrow>

      <Panel id="j-panel-parsed" label="Parsed object" style={{ left: 0, top: 414, width: 400, height: 132 }} />
    </Stage>
  );
}
