"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";
import { Stage, Eyebrow, Chip, enter, pop, focusOn, focusOff } from "./kit";

// Two 4-bit rows, 1010 (10) and 0110 (6), XOR together one column at a time
// from the highest bit to the lowest: 1 xor 0 is 1, 0 xor 1 is 1, 1 xor 1 is
// 0, 0 xor 0 is 0, producing 1100 (12). The decimal result pops in and stays
// lit as the final answer.
export function BitManipulationVisual({ register }: ConceptVisualProps) {
  const scope = useRef<HTMLDivElement>(null);
  const a = [1, 0, 1, 0];
  const b = [0, 1, 1, 0];
  const r = [1, 1, 0, 0];
  const aIds = a.map((_, i) => `#bit-a-${i}`);
  const bIds = b.map((_, i) => `#bit-b-${i}`);
  const rIds = r.map((_, i) => `#bit-r-${i}`);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      gsap.set([...aIds, ...bIds], { opacity: 0, y: 12 });
      gsap.set(rIds, { opacity: 0, scale: 0.8 });
      gsap.set("#bit-decimal", { opacity: 0, scale: 0.8 });
      gsap.set(".glow", { opacity: 0 });

      if (animate) {
        enter(tl, aIds.join(", "));
        enter(tl, bIds.join(", "), "-=0.2");

        r.forEach((_, i) => {
          focusOn(tl, `#bit-a-${i}`, i === 0 ? "+=0.25" : "+=0.2");
          focusOn(tl, `#bit-b-${i}`, "<");
          pop(tl, `#bit-r-${i}`, "+=0.15");
          focusOff(tl, `#bit-a-${i}`, "<");
          focusOff(tl, `#bit-b-${i}`, "<");
        });

        pop(tl, "#bit-decimal", "+=0.25");
        focusOn(tl, "#bit-decimal", "+=0.1");
      } else {
        tl.set([...aIds, ...bIds], { opacity: 1, y: 0 })
          .set(rIds, { opacity: 1, scale: 1 })
          .set("#bit-decimal", { opacity: 1, scale: 1 })
          .set("#bit-decimal .glow", { opacity: 1 })
          .set("#bit-decimal", { scale: 1.03 });
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
      label="Two 4-bit rows, 1010 which is 10, and 0110 which is 6, XOR together one column at a time from the highest bit to the lowest: 1 xor 0 is 1, 0 xor 1 is 1, 1 xor 1 is 0, 0 xor 0 is 0, producing the result row 1100, which is 12. The decimal result, 12, pops in and stays lit as the final answer."
    >
      <Eyebrow className="absolute" style={{ left: 16, top: 6 }}>A = 1010 (10)</Eyebrow>
      {a.map((v, i) => (
        <Chip key={i} id={`bit-a-${i}`} className="absolute" style={{ left: 16 + i * 46, top: 30, width: 40, height: 36 }}>
          {v}
        </Chip>
      ))}

      <Eyebrow className="absolute" style={{ left: 16, top: 78 }}>B = 0110 (6), XOR</Eyebrow>
      {b.map((v, i) => (
        <Chip key={i} id={`bit-b-${i}`} className="absolute" style={{ left: 16 + i * 46, top: 102, width: 40, height: 36 }}>
          {v}
        </Chip>
      ))}

      <Eyebrow className="absolute" style={{ left: 16, top: 150 }}>Result</Eyebrow>
      {r.map((v, i) => (
        <Chip key={i} id={`bit-r-${i}`} className="absolute" style={{ left: 16 + i * 46, top: 174, width: 40, height: 36 }}>
          {v}
        </Chip>
      ))}

      <div className="absolute flex items-center gap-2" style={{ left: 16, top: 222 }}>
        <Eyebrow>= </Eyebrow>
        <Chip id="bit-decimal" className="h-8 w-14 px-0">12</Chip>
      </div>
    </Stage>
  );
}
