"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";
import { Stage, Panel, Frame, Chip, Eyebrow, CodeLine, enter, pop, focusOn, focusOff, travel } from "./kit";

// Two values travel from a "Values" panel into ${} placeholders inside a
// template literal, each placeholder fading out as the real value lands on
// top of it. The fully built string appears below, then a string method
// (includes) runs on that result to show strings and templates work together.
export function TemplateLiteralsAndStringsVisual({ register }: ConceptVisualProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      gsap.set(
        ["#src-name-label", "#src-role-label", "#slot-name-frame", "#slot-role-frame", "#final-code", "#method-label", "#method-code"],
        { opacity: 0, y: 12 },
      );
      gsap.set(["#chip-name", "#chip-role"], { opacity: 0, scale: 0.8 });
      gsap.set("#method-result", { opacity: 0, scale: 0.8 });
      gsap.set(".glow", { opacity: 0 });

      if (animate) {
        enter(tl, ["#src-name-label", "#src-role-label"], undefined, 0.1);
        pop(tl, ["#chip-name", "#chip-role"], "+=0.15");
        enter(tl, ["#slot-name-frame", "#slot-role-frame"], "+=0.2", 0.1);

        travel(tl, "#chip-name", { x: 172, y: 2 }, "+=0.15");
        tl.to("#ph-name", { opacity: 0, duration: 0.2 }, "<");
        travel(tl, "#chip-role", { x: 172, y: 6 }, "+=0.1");
        tl.to("#ph-role", { opacity: 0, duration: 0.2 }, "<");

        enter(tl, "#final-code", "+=0.25");
        focusOn(tl, "#final-code", "+=0.1");
        focusOff(tl, "#final-code", "+=0.4");

        enter(tl, "#method-label", "+=0.2");
        enter(tl, "#method-code", "<");
        pop(tl, "#method-result", "+=0.2");
      } else {
        // reduced motion: jump to labeled end-state (slots filled, string built)
        tl.set(
          ["#src-name-label", "#src-role-label", "#slot-name-frame", "#slot-role-frame", "#final-code", "#method-label", "#method-code"],
          { opacity: 1, y: 0 },
        )
          .set(["#chip-name", "#chip-role"], { opacity: 1, scale: 1 })
          .set("#chip-name", { x: 172, y: 2 })
          .set("#chip-role", { x: 172, y: 6 })
          .set(["#ph-name", "#ph-role"], { opacity: 0 })
          .set("#method-result", { opacity: 1, scale: 1 });
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
      height={260}
      label="The values Ada and engineer travel from a values panel into the ${name} and ${role} placeholders of a template literal, each placeholder fading out as the value lands. The fully built string, Hello, Ada! You are an engineer, appears below, then a string method, includes, checks it for the word engineer and returns true"
    >
      <Panel label="Values" style={{ position: "absolute", left: 0, top: 0, width: 170, height: 100 }} />
      <Eyebrow id="src-name-label" className="absolute" style={{ position: "absolute", left: 16, top: 26 }}>name:</Eyebrow>
      <Chip id="chip-name" className="absolute z-10" style={{ position: "absolute", left: 70, top: 18 }}>&quot;Ada&quot;</Chip>
      <Eyebrow id="src-role-label" className="absolute" style={{ position: "absolute", left: 16, top: 58 }}>role:</Eyebrow>
      <Chip id="chip-role" className="absolute z-10" style={{ position: "absolute", left: 70, top: 50 }}>&quot;engineer&quot;</Chip>

      <Panel label="Template literal" style={{ position: "absolute", left: 210, top: 0, width: 190, height: 100 }} />
      <Frame id="slot-name-frame" className="whitespace-nowrap" style={{ position: "absolute", left: 222, top: 20, width: 166, height: 30 }}>
        <span id="ph-name" className="text-muted-foreground">{"${name}"}</span>
      </Frame>
      <Frame id="slot-role-frame" className="whitespace-nowrap" style={{ position: "absolute", left: 222, top: 56, width: 166, height: 30 }}>
        <span id="ph-role" className="text-muted-foreground">{"${role}"}</span>
      </Frame>

      <CodeLine id="final-code" className="whitespace-nowrap" style={{ position: "absolute", left: 8, top: 112, width: 380 }}>
        msg = `Hello, Ada! You are an engineer.`
      </CodeLine>

      <div className="absolute border-t border-border" style={{ position: "absolute", left: 0, top: 148, width: 400 }} />

      <Eyebrow id="method-label" className="absolute" style={{ position: "absolute", left: 8, top: 160 }}>
        String methods work on the result too
      </Eyebrow>
      <CodeLine id="method-code" className="whitespace-nowrap" style={{ position: "absolute", left: 8, top: 182, width: 260 }}>
        msg.includes(&quot;engineer&quot;)
      </CodeLine>
      <Chip id="method-result" className="absolute !bg-green-500/10 !text-green-600" style={{ position: "absolute", left: 16, top: 216 }}>
        true
      </Chip>
    </Stage>
  );
}
