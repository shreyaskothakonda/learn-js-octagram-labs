"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";
import { Stage, Panel, Frame, Chip, Eyebrow, CodeLine, enter, pop, travel } from "./kit";

// A user object with name and age properties splits apart: each value chip
// peels off the source and travels into its own named destructuring target,
// ending with const { name, age } = user.
export function DestructuringVisual({ register }: ConceptVisualProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      gsap.set(
        [
          "#source-header",
          "#src-name-label",
          "#src-age-label",
          "#target-name-frame",
          "#target-age-frame",
          "#final-code",
        ],
        { opacity: 0, y: 12 },
      );
      gsap.set(["#chip-name", "#chip-age"], { opacity: 0, scale: 0.8 });
      gsap.set(".glow", { opacity: 0 });

      if (animate) {
        enter(tl, "#source-header");
        enter(tl, ["#src-name-label", "#src-age-label"], "+=0.1", 0.1);
        pop(tl, ["#chip-name", "#chip-age"], "+=0.15");
        enter(tl, ["#target-name-frame", "#target-age-frame"], "+=0.25", 0.1);
        travel(tl, "#chip-name", { x: 230, y: -20 }, "+=0.2");
        travel(tl, "#chip-age", { x: 230, y: 0 }, "+=0.15");
        enter(tl, "#final-code", "+=0.3");
      } else {
        // reduced motion: jump to labeled end-state (both values landed in their targets)
        tl.set(
          [
            "#source-header",
            "#src-name-label",
            "#src-age-label",
            "#target-name-frame",
            "#target-age-frame",
            "#final-code",
          ],
          { opacity: 1, y: 0 },
        )
          .set(["#chip-name", "#chip-age"], { opacity: 1, scale: 1 })
          .set("#chip-name", { x: 230, y: -20 })
          .set("#chip-age", { x: 230, y: 0 });
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
      height={220}
      label="A user object with name and age properties splits apart. The name value Ada and the age value 30 each peel off the source and travel into their own named destructuring target, ending with const name, age equals user"
    >
      <Panel label="Source" style={{ left: 0, top: 0, width: 170, height: 140 }} />
      <CodeLine id="source-header" className="whitespace-nowrap" style={{ left: 12, top: 26, width: 150 }}>
        user = {"{ ... }"}
      </CodeLine>
      <Eyebrow id="src-name-label" className="absolute" style={{ left: 16, top: 68 }}>
        name:
      </Eyebrow>
      <Chip id="chip-name" className="absolute z-10" style={{ left: 70, top: 60 }}>
        &quot;Ada&quot;
      </Chip>
      <Eyebrow id="src-age-label" className="absolute" style={{ left: 16, top: 104 }}>
        age:
      </Eyebrow>
      <Chip id="chip-age" className="absolute z-10" style={{ left: 70, top: 96 }}>
        30
      </Chip>

      <Panel label="Destructured" style={{ left: 210, top: 0, width: 190, height: 140 }} />
      <Frame id="target-name-frame" style={{ left: 222, top: 30, width: 166, height: 44 }}>name =</Frame>
      <Frame id="target-age-frame" style={{ left: 222, top: 86, width: 166, height: 44 }}>age =</Frame>

      <CodeLine id="final-code" className="whitespace-nowrap" style={{ left: 8, top: 182, width: 380 }}>
        const {"{ name, age }"} = user;
      </CodeLine>
    </Stage>
  );
}
