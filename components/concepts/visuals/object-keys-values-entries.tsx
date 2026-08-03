"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";
import { Stage, Panel, Chip, Eyebrow, CodeLine, enter, travel } from "./kit";

// A user object expands into three chip rows. Keys travel down from each
// property's label, values travel down from each property's stored chip, and
// entries travel down from between the two, each landing as a [key, value]
// pair. All three rows walk the same three properties in the same order.
export function ObjectKeysValuesEntriesVisual({ register }: ConceptVisualProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      gsap.set(["#keys-code", "#values-code", "#entries-code"], { opacity: 0, y: 12 });
      gsap.set(
        ["#key-id", "#key-name", "#key-active", "#val-id", "#val-name", "#val-active", "#entry-id", "#entry-name", "#entry-active"],
        { opacity: 0, scale: 0.8 },
      );
      gsap.set(".glow", { opacity: 0 });

      if (animate) {
        // Object.keys(obj): a key chip pops in at each label, then travels down
        enter(tl, "#keys-code");
        tl.to(["#key-id", "#key-name", "#key-active"], { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.6)", stagger: 0.08 }, "+=0.15");
        travel(tl, "#key-id", { x: 0, y: 122 }, "+=0.15");
        travel(tl, "#key-name", { x: 90, y: 98 }, "<+=0.08");
        travel(tl, "#key-active", { x: 180, y: 74 }, "<+=0.08");

        // Object.values(obj): a value chip pops in at each stored value, then travels down
        enter(tl, "#values-code", "+=0.35");
        tl.to(["#val-id", "#val-name", "#val-active"], { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.6)", stagger: 0.08 }, "+=0.15");
        travel(tl, "#val-id", { x: -74, y: 194 }, "+=0.15");
        travel(tl, "#val-name", { x: 16, y: 170 }, "<+=0.08");
        travel(tl, "#val-active", { x: 106, y: 146 }, "<+=0.08");

        // Object.entries(obj): a [key, value] pair pops in between the two, then travels down
        enter(tl, "#entries-code", "+=0.35");
        tl.to(["#entry-id", "#entry-name", "#entry-active"], { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.6)", stagger: 0.08 }, "+=0.15");
        travel(tl, "#entry-id", { x: -37, y: 258 }, "+=0.15");
        travel(tl, "#entry-name", { x: -37, y: 262 }, "<+=0.08");
        travel(tl, "#entry-active", { x: -37, y: 266 }, "<+=0.08");
      } else {
        // reduced motion: jump to labeled end-state (all three rows landed)
        tl.set(["#keys-code", "#values-code", "#entries-code"], { opacity: 1, y: 0 })
          .set(["#key-id", "#key-name", "#key-active", "#val-id", "#val-name", "#val-active", "#entry-id", "#entry-name", "#entry-active"], {
            opacity: 1,
            scale: 1,
          })
          .set("#key-id", { x: 0, y: 122 })
          .set("#key-name", { x: 90, y: 98 })
          .set("#key-active", { x: 180, y: 74 })
          .set("#val-id", { x: -74, y: 194 })
          .set("#val-name", { x: 16, y: 170 })
          .set("#val-active", { x: 106, y: 146 })
          .set("#entry-id", { x: -37, y: 258 })
          .set("#entry-name", { x: -37, y: 262 })
          .set("#entry-active", { x: -37, y: 266 });
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
      height={390}
      label="A user object with id 1, name Ada, and active true expands into three rows. Object.keys produces id, name, active, one chip travelling down from each property label. Object.values produces 1, Ada, true, one chip travelling down from each stored value. Object.entries produces the pairs id 1, name Ada, and active true, one chip travelling down from between each label and value. All three walk the same three properties in the same order"
    >
      <Panel label="user" style={{ position: "absolute", left: 0, top: 0, width: 220, height: 100 }} />
      <Eyebrow className="absolute" style={{ position: "absolute", left: 16, top: 22 }}>id:</Eyebrow>
      <Chip className="absolute" style={{ position: "absolute", left: 90, top: 14 }}>1</Chip>
      <Eyebrow className="absolute" style={{ position: "absolute", left: 16, top: 46 }}>name:</Eyebrow>
      <Chip className="absolute" style={{ position: "absolute", left: 90, top: 38 }}>&quot;Ada&quot;</Chip>
      <Eyebrow className="absolute" style={{ position: "absolute", left: 16, top: 70 }}>active:</Eyebrow>
      <Chip className="absolute" style={{ position: "absolute", left: 90, top: 62 }}>true</Chip>

      <CodeLine id="keys-code" className="whitespace-nowrap" style={{ position: "absolute", left: 8, top: 112, width: 250 }}>
        Object.keys(obj)
      </CodeLine>
      <Chip id="key-id" className="absolute" style={{ position: "absolute", left: 16, top: 22 }}>&quot;id&quot;</Chip>
      <Chip id="key-name" className="absolute" style={{ position: "absolute", left: 16, top: 46 }}>&quot;name&quot;</Chip>
      <Chip id="key-active" className="absolute" style={{ position: "absolute", left: 16, top: 70 }}>&quot;active&quot;</Chip>

      <CodeLine id="values-code" className="whitespace-nowrap" style={{ position: "absolute", left: 8, top: 180, width: 250 }}>
        Object.values(obj)
      </CodeLine>
      <Chip id="val-id" className="absolute" style={{ position: "absolute", left: 90, top: 18 }}>1</Chip>
      <Chip id="val-name" className="absolute" style={{ position: "absolute", left: 90, top: 42 }}>&quot;Ada&quot;</Chip>
      <Chip id="val-active" className="absolute" style={{ position: "absolute", left: 90, top: 66 }}>true</Chip>

      <CodeLine id="entries-code" className="whitespace-nowrap" style={{ position: "absolute", left: 8, top: 248, width: 280 }}>
        Object.entries(obj)
      </CodeLine>
      <Chip id="entry-id" className="absolute whitespace-nowrap" style={{ position: "absolute", left: 53, top: 22 }}>
        [&quot;id&quot;, 1]
      </Chip>
      <Chip id="entry-name" className="absolute whitespace-nowrap" style={{ position: "absolute", left: 53, top: 46 }}>
        [&quot;name&quot;, &quot;Ada&quot;]
      </Chip>
      <Chip id="entry-active" className="absolute whitespace-nowrap" style={{ position: "absolute", left: 53, top: 70 }}>
        [&quot;active&quot;, true]
      </Chip>
    </Stage>
  );
}
