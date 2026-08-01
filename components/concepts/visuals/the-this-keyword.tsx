"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";
import { Stage, Panel, Frame, Chip, enter, travel, focusOn, focusOff } from "./kit";

// Scene: four panels (method, standalone, call/bind, arrow) share one call-site
// frame and one "this ->" target chip. The frame travels into each panel in
// turn; the execution focus lights it while the chip re-points to show what
// `this` resolves to for that form of invocation.
export function TheThisKeywordVisual({ register }: ConceptVisualProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      gsap.set(["#call-site", "#this-target"], { opacity: 0, y: 12, x: 0 });
      gsap.set(".glow", { opacity: 0 });
      gsap.set("#call-site-text", { textContent: "person.showThis()" });
      gsap.set("#this-target-text", { textContent: "this -> person" });

      if (animate) {
        enter(tl, ["#call-site", "#this-target"]);
        focusOn(tl, "#call-site", "+=0.1");
        focusOff(tl, "#call-site", "+=0.4");
        // travels to the standalone-call panel
        travel(tl, "#call-site", { x: 210, y: 0 }, "+=0.1");
        travel(tl, "#this-target", { x: 210, y: 0 }, "<");
        tl.set("#call-site-text", { textContent: "showThis()" })
          .set("#this-target-text", { textContent: "this -> undefined" });
        focusOn(tl, "#call-site", "+=0.1");
        focusOff(tl, "#call-site", "+=0.4");
        // travels to the call/bind panel
        travel(tl, "#call-site", { x: -210, y: 150 }, "+=0.1");
        travel(tl, "#this-target", { x: -210, y: 150 }, "<");
        tl.set("#call-site-text", { textContent: "showThis.call(user)" })
          .set("#this-target-text", { textContent: "this -> user" });
        focusOn(tl, "#call-site", "+=0.1");
        focusOff(tl, "#call-site", "+=0.4");
        // travels to the arrow-function panel
        travel(tl, "#call-site", { x: 210, y: 0 }, "+=0.1");
        travel(tl, "#this-target", { x: 210, y: 0 }, "<");
        tl.set("#call-site-text", { textContent: "() => this" })
          .set("#this-target-text", { textContent: "this -> enclosing" });
        focusOn(tl, "#call-site", "+=0.1");
      } else {
        // reduced motion: jump to labeled end-state (arrow panel, lexical this)
        tl.set(["#call-site", "#this-target"], { opacity: 1, y: 0, x: 210 })
          .set("#call-site", { y: 150 })
          .set("#this-target", { y: 150 })
          .set("#call-site-text", { textContent: "() => this" })
          .set("#this-target-text", { textContent: "this -> enclosing" })
          .set("#call-site .glow", { opacity: 1 })
          .set("#call-site", { scale: 1.03 });
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
      label="One call-site frame travels through four panels, method, standalone, call or bind, and arrow, while a this-> target chip re-points to show what this resolves to for each: person, undefined, user, and the enclosing scope"
    >
      <Panel label="Method" style={{ left: 0, top: 0, width: 190, height: 130 }} />
      <Panel label="Standalone" style={{ left: 210, top: 0, width: 190, height: 130 }} />
      <Panel label="Call / bind" style={{ left: 0, top: 150, width: 190, height: 130 }} />
      <Panel label="Arrow (lexical)" style={{ left: 210, top: 150, width: 190, height: 130 }} />

      <Frame id="call-site" style={{ left: 14, top: 40, width: 162, height: 40 }}>
        <span id="call-site-text">person.showThis()</span>
      </Frame>

      <Chip id="this-target" className="absolute" style={{ left: 14, top: 88, width: 162 }}>
        <span id="this-target-text">this -&gt; person</span>
      </Chip>
    </Stage>
  );
}
