"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";
import { Stage, Panel, Frame, Chip, Eyebrow, CodeLine, enter, pop, focusOn, focusOff, travel } from "./kit";

// Three short beats. Object destructuring pulls name and age out of a user
// object, matched by property name. Array destructuring pulls first and
// second out of an array, matched by position. The default-value beat shows
// what happens when a property is missing from the source: nothing travels
// from the left, so the fallback value pops in already at the target,
// tinted muted to read as a stand-in rather than a pulled value.
export function DestructuringVisual({ register }: ConceptVisualProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      gsap.set(
        [
          "#obj-header", "#src-name-label", "#src-age-label",
          "#target-name-frame", "#target-age-frame", "#obj-final-code",
          "#arr-header", "#arr-idx0-label", "#arr-idx1-label",
          "#target-first-frame", "#target-second-frame", "#arr-final-code",
          "#cfg-header", "#cfg-missing-label", "#target-role-frame",
          "#default-tag", "#default-final-code",
        ],
        { opacity: 0, y: 12 },
      );
      gsap.set(["#chip-name", "#chip-age", "#chip-first", "#chip-second", "#chip-default"], {
        opacity: 0,
        scale: 0.8,
      });
      gsap.set(".glow", { opacity: 0 });

      if (animate) {
        // Beat 1: object destructuring, matched by property name
        enter(tl, "#obj-header");
        enter(tl, ["#src-name-label", "#src-age-label"], "+=0.1", 0.1);
        pop(tl, ["#chip-name", "#chip-age"], "+=0.15");
        enter(tl, ["#target-name-frame", "#target-age-frame"], "+=0.2", 0.1);
        travel(tl, "#chip-name", { x: 242, y: -3 }, "+=0.15");
        focusOn(tl, "#target-name-frame", "<");
        travel(tl, "#chip-age", { x: 242, y: 9 }, "+=0.1");
        focusOn(tl, "#target-age-frame", "<");
        enter(tl, "#obj-final-code", "+=0.2");
        focusOff(tl, "#target-name-frame", "+=0.1");
        focusOff(tl, "#target-age-frame", "<");

        // Beat 2: array destructuring, matched by position
        enter(tl, "#arr-header", "+=0.4");
        enter(tl, ["#arr-idx0-label", "#arr-idx1-label"], "+=0.1", 0.1);
        pop(tl, ["#chip-first", "#chip-second"], "+=0.15");
        enter(tl, ["#target-first-frame", "#target-second-frame"], "+=0.2", 0.1);
        travel(tl, "#chip-first", { x: 242, y: -3 }, "+=0.15");
        focusOn(tl, "#target-first-frame", "<");
        travel(tl, "#chip-second", { x: 242, y: 9 }, "+=0.1");
        focusOn(tl, "#target-second-frame", "<");
        enter(tl, "#arr-final-code", "+=0.2");
        focusOff(tl, "#target-first-frame", "+=0.1");
        focusOff(tl, "#target-second-frame", "<");

        // Beat 3: default value, the property is missing so nothing travels;
        // the fallback pops in already at the target
        enter(tl, "#cfg-header", "+=0.4");
        enter(tl, "#cfg-missing-label", "<");
        enter(tl, "#target-role-frame", "+=0.2");
        pop(tl, "#default-tag", "+=0.15");
        pop(tl, "#chip-default", "<");
        focusOn(tl, "#target-role-frame", "+=0.1");
        enter(tl, "#default-final-code", "+=0.2");
        focusOff(tl, "#target-role-frame", "+=0.4");
      } else {
        // reduced motion: jump to labeled end-state (all three beats landed)
        tl.set(
          [
            "#obj-header", "#src-name-label", "#src-age-label",
            "#target-name-frame", "#target-age-frame", "#obj-final-code",
            "#arr-header", "#arr-idx0-label", "#arr-idx1-label",
            "#target-first-frame", "#target-second-frame", "#arr-final-code",
            "#cfg-header", "#cfg-missing-label", "#target-role-frame",
            "#default-tag", "#default-final-code",
          ],
          { opacity: 1, y: 0 },
        )
          .set(["#chip-name", "#chip-age", "#chip-first", "#chip-second", "#chip-default"], {
            opacity: 1,
            scale: 1,
          })
          .set("#chip-name", { x: 242, y: -3 })
          .set("#chip-age", { x: 242, y: 9 })
          .set("#chip-first", { x: 242, y: -3 })
          .set("#chip-second", { x: 242, y: 9 });
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
      height={382}
      label="Object destructuring pulls name and age out of a user object by property name into named bindings. Array destructuring pulls first and second out of an array by position. When a property like role is missing from the source, the destructuring default guest is used instead, shown as a muted fallback value rather than one pulled from the source"
    >
      {/* Beat 1: object destructuring */}
      <Panel label="user" style={{ left: 0, top: 0, width: 170, height: 90 }} />
      <CodeLine id="obj-header" className="whitespace-nowrap" style={{ left: 12, top: 10, width: 150 }}>
        user = {"{ ... }"}
      </CodeLine>
      <Eyebrow id="src-name-label" className="absolute" style={{ left: 16, top: 46 }}>
        name:
      </Eyebrow>
      <Chip id="chip-name" className="absolute z-10" style={{ left: 70, top: 38 }}>
        &quot;Ada&quot;
      </Chip>
      <Eyebrow id="src-age-label" className="absolute" style={{ left: 16, top: 70 }}>
        age:
      </Eyebrow>
      <Chip id="chip-age" className="absolute z-10" style={{ left: 70, top: 62 }}>
        30
      </Chip>

      <Panel label="Destructured" style={{ left: 210, top: 0, width: 190, height: 90 }} />
      <Frame id="target-name-frame" style={{ left: 222, top: 20, width: 166, height: 30 }}>name =</Frame>
      <Frame id="target-age-frame" style={{ left: 222, top: 56, width: 166, height: 30 }}>age =</Frame>

      <CodeLine id="obj-final-code" className="whitespace-nowrap" style={{ left: 8, top: 96, width: 380 }}>
        const {"{ name, age }"} = user;
      </CodeLine>

      {/* Beat 2: array destructuring */}
      <Panel label="arr" style={{ left: 0, top: 134, width: 170, height: 90 }} />
      <CodeLine id="arr-header" className="whitespace-nowrap" style={{ left: 12, top: 144, width: 150 }}>
        arr = {"[ ... ]"}
      </CodeLine>
      <Eyebrow id="arr-idx0-label" className="absolute" style={{ left: 16, top: 180 }}>
        [0]:
      </Eyebrow>
      <Chip id="chip-first" className="absolute z-10" style={{ left: 70, top: 172 }}>
        10
      </Chip>
      <Eyebrow id="arr-idx1-label" className="absolute" style={{ left: 16, top: 204 }}>
        [1]:
      </Eyebrow>
      <Chip id="chip-second" className="absolute z-10" style={{ left: 70, top: 196 }}>
        20
      </Chip>

      <Panel label="Destructured" style={{ left: 210, top: 134, width: 190, height: 90 }} />
      <Frame id="target-first-frame" style={{ left: 222, top: 154, width: 166, height: 30 }}>first =</Frame>
      <Frame id="target-second-frame" style={{ left: 222, top: 190, width: 166, height: 30 }}>second =</Frame>

      <CodeLine id="arr-final-code" className="whitespace-nowrap" style={{ left: 8, top: 230, width: 380 }}>
        const [first, second] = arr;
      </CodeLine>

      {/* Beat 3: default value for a missing property */}
      <Panel label="config" style={{ left: 0, top: 268, width: 170, height: 74 }} />
      <CodeLine id="cfg-header" className="whitespace-nowrap" style={{ left: 12, top: 278, width: 150 }}>
        config = {"{ ... }"}
      </CodeLine>
      <Eyebrow id="cfg-missing-label" className="absolute" style={{ left: 16, top: 314 }}>
        role: missing
      </Eyebrow>

      <Panel label="Destructured" style={{ left: 210, top: 268, width: 190, height: 74 }} />
      <Frame id="target-role-frame" style={{ left: 222, top: 292, width: 166, height: 30 }}>role =</Frame>
      <Eyebrow id="default-tag" className="absolute" style={{ left: 300, top: 279 }}>
        default
      </Eyebrow>
      <Chip
        id="chip-default"
        className="absolute z-10 !bg-[var(--color-muted)]/40 !text-muted-foreground"
        style={{ left: 300, top: 296 }}
      >
        &quot;guest&quot;
      </Chip>

      <CodeLine id="default-final-code" className="whitespace-nowrap" style={{ left: 8, top: 344, width: 380 }}>
        const {"{ role = \"guest\" }"} = config;
      </CodeLine>
    </Stage>
  );
}
