"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";
import { Stage, Frame, Chip, Eyebrow, CodeLine, enter, pop, focusOn, focusOff } from "./kit";

// add(1)(2)(3) as a row of three frames. Each call captures one more argument
// chip, and the execution focus advances frame1 -> frame2 -> frame3 until the
// arity of three is met and the sum chip pops.
export function CurryingVisual({ register }: ConceptVisualProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      gsap.set("#code-label", { opacity: 0, y: 12 });
      gsap.set("#frame1", { opacity: 0, y: 12 });
      gsap.set(["#chip-a1", "#wait-b"], { opacity: 0 });
      gsap.set("#call2-note", { opacity: 0 });
      gsap.set("#frame2", { opacity: 0, y: 12 });
      gsap.set(["#chip-a2", "#chip-b", "#wait-c"], { opacity: 0 });
      gsap.set("#call3-note", { opacity: 0 });
      gsap.set("#frame3", { opacity: 0, y: 12 });
      gsap.set(["#chip-a3", "#chip-b3", "#chip-c"], { opacity: 0 });
      gsap.set("#sum-label", { opacity: 0, y: 12 });
      gsap.set("#sum-chip", { opacity: 0, scale: 0.8 });
      gsap.set(".glow", { opacity: 0 });

      if (animate) {
        enter(tl, "#code-label");
        enter(tl, "#frame1", "+=0.15");
        tl.to("#chip-a1", { opacity: 1, duration: 0.3 }, "+=0.1");
        tl.to("#wait-b", { opacity: 1, duration: 0.3 }, "+=0.1");
        focusOn(tl, "#frame1", "+=0.2");

        tl.to("#call2-note", { opacity: 1, duration: 0.2 }, "+=0.2");
        enter(tl, "#frame2", "+=0.15");
        tl.to(["#chip-a2", "#chip-b"], { opacity: 1, duration: 0.3 }, "+=0.1");
        tl.to("#wait-b", { opacity: 0, duration: 0.2 }, "<");
        tl.to("#wait-c", { opacity: 1, duration: 0.3 }, "+=0.1");
        focusOff(tl, "#frame1", "+=0.1");
        focusOn(tl, "#frame2", "<");

        tl.to("#call3-note", { opacity: 1, duration: 0.2 }, "+=0.2");
        enter(tl, "#frame3", "+=0.15");
        tl.to(["#chip-a3", "#chip-b3", "#chip-c"], { opacity: 1, duration: 0.3 }, "+=0.1");
        tl.to("#wait-c", { opacity: 0, duration: 0.2 }, "<");
        focusOff(tl, "#frame2", "+=0.1");
        focusOn(tl, "#frame3", "<");

        enter(tl, "#sum-label", "+=0.25");
        focusOff(tl, "#frame3", "+=0.4");
        pop(tl, "#sum-chip", "<");
      } else {
        // reduced motion: jump to labeled end-state (all three args gathered, sum computed)
        tl.set("#code-label", { opacity: 1, y: 0 })
          .set(["#frame1", "#frame2", "#frame3"], { opacity: 1, y: 0 })
          .set(["#chip-a1", "#chip-a2", "#chip-b", "#chip-a3", "#chip-b3", "#chip-c"], { opacity: 1 })
          .set(["#wait-b", "#wait-c"], { opacity: 0 })
          .set(["#call2-note", "#call3-note"], { opacity: 1 })
          .set("#sum-label", { opacity: 1, y: 0 })
          .set("#sum-chip", { opacity: 1, scale: 1 });
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
      label="add(1)(2)(3) shown as a chain of three frames. Each call captures one more argument and the execution focus advances along the chain, until the third call meets add's arity of three and the sum computes to 6"
    >
      <CodeLine id="code-label" className="whitespace-nowrap" style={{ left: 8, top: 0, width: 200 }}>
        add(1)(2)(3)
      </CodeLine>

      <Frame id="frame1" style={{ left: 8, top: 34, width: 110, height: 96 }}>
        <div className="flex flex-col items-start gap-1">
          <Chip id="chip-a1">a: 1</Chip>
          <Eyebrow id="wait-b">next: b</Eyebrow>
        </div>
      </Frame>
      <Eyebrow id="call2-note" className="absolute" style={{ left: 122, top: 74 }}>(2)</Eyebrow>

      <Frame id="frame2" style={{ left: 146, top: 34, width: 110, height: 96 }}>
        <div className="flex flex-col items-start gap-1">
          <Chip id="chip-a2">a: 1</Chip>
          <Chip id="chip-b">b: 2</Chip>
          <Eyebrow id="wait-c">next: c</Eyebrow>
        </div>
      </Frame>
      <Eyebrow id="call3-note" className="absolute" style={{ left: 260, top: 74 }}>(3)</Eyebrow>

      <Frame id="frame3" style={{ left: 284, top: 34, width: 110, height: 96 }}>
        <div className="flex flex-col items-start gap-1">
          <Chip id="chip-a3">a: 1</Chip>
          <Chip id="chip-b3">b: 2</Chip>
          <Chip id="chip-c">c: 3</Chip>
        </div>
      </Frame>

      <Eyebrow id="sum-label" className="absolute" style={{ left: 8, top: 152, width: 300 }}>
        arity met, a + b + c computes
      </Eyebrow>
      <Chip id="sum-chip" className="absolute" style={{ left: 8, top: 174 }}>= 6</Chip>
    </Stage>
  );
}
