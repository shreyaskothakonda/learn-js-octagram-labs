"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";
import { Stage, Panel, Frame, Chip, Eyebrow, enter, exit, pop, focusOn, focusOff, EASE, DUR } from "./kit";

// Beat one: 2 + 3 * 4 collapses in precedence order, the execution focus
// landing on the sub-expression that evaluates next (multiplication binds
// tighter than addition, so it goes first). Beat two: 2 ** 3 ** 2 collapses
// in associativity order instead of precedence order, since ** is right
// associative, the rightmost pair (3 ** 2) evaluates first, leaving 2 ** 9,
// which then evaluates to the final result. A compact precedence-tiers
// legend sits underneath as a static reference throughout.
export function OperatorsPrecedenceVisual({ register }: ConceptVisualProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      gsap.set(["#tok-2", "#sub-mul", "#sub-add", "#result-final"], { opacity: 0, y: 12 });
      gsap.set("#plus", { opacity: 0 });
      gsap.set(["#note-a", "#note-b", "#note-c"], { opacity: 0, y: 12 });
      gsap.set(["#tok-2b", "#pow-1", "#sub-pow-right", "#sub-pow-outer", "#result-final-2"], { opacity: 0, y: 12 });
      gsap.set(["#note-d", "#note-e", "#note-f"], { opacity: 0, y: 12 });
      gsap.set(".glow", { opacity: 0 });

      if (animate) {
        // beat one: 2 + 3 * 4
        pop(tl, "#tok-2");
        tl.to("#plus", { opacity: 1, duration: DUR.enter, ease: EASE.enter }, "<");
        enter(tl, "#sub-mul", "<");
        enter(tl, "#note-a", "+=0.1");
        focusOn(tl, "#sub-mul", "+=0.25");
        focusOff(tl, "#sub-mul", "+=0.6");
        exit(tl, "#sub-mul", "-=0.1");
        exit(tl, "#note-a", "<");

        enter(tl, "#sub-add", "+=0.1");
        enter(tl, "#note-b", "<");
        focusOn(tl, "#sub-add", "+=0.25");
        focusOff(tl, "#sub-add", "+=0.6");
        exit(tl, ["#tok-2", "#plus", "#sub-add", "#note-b"], "-=0.1");

        pop(tl, "#result-final", "+=0.15");
        enter(tl, "#note-c", "+=0.1");

        // hold beat one's result, then clear the stage for beat two
        focusOn(tl, "#result-final", "+=0.4");
        focusOff(tl, "#result-final", "+=0.5");
        exit(tl, ["#result-final", "#note-c"], "-=0.1");

        // beat two: 2 ** 3 ** 2, right-associative, rightmost pair first
        pop(tl, "#tok-2b", "+=0.15");
        tl.to("#pow-1", { opacity: 1, duration: DUR.enter, ease: EASE.enter }, "<");
        enter(tl, "#sub-pow-right", "<");
        enter(tl, "#note-d", "+=0.1");
        focusOn(tl, "#sub-pow-right", "+=0.25");
        focusOff(tl, "#sub-pow-right", "+=0.6");
        exit(tl, "#sub-pow-right", "-=0.1");
        exit(tl, "#note-d", "<");

        enter(tl, "#sub-pow-outer", "+=0.1");
        enter(tl, "#note-e", "<");
        focusOn(tl, "#sub-pow-outer", "+=0.25");
        focusOff(tl, "#sub-pow-outer", "+=0.6");
        exit(tl, ["#tok-2b", "#pow-1", "#sub-pow-outer", "#note-e"], "-=0.1");

        pop(tl, "#result-final-2", "+=0.15");
        enter(tl, "#note-f", "+=0.1");
      } else {
        // reduced motion: jump to labeled end-state (beat two's final result)
        tl.set(["#result-final-2", "#note-f"], { opacity: 1, y: 0 });
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
      height={230}
      label="Two expressions collapse in order. First, 2 plus 3 times 4: the multiplication 3 times 4 takes the execution focus first, since it binds tighter, evaluating to 12, leaving 2 plus 12, which evaluates to 14. Second, 2 to the power of 3 to the power of 2: since the exponent operator is right-associative, the rightmost pair 3 to the power of 2 takes the focus first, evaluating to 9, leaving 2 to the power of 9, which evaluates to the final result, 512. A precedence legend below lists the tiers from highest to lowest: exponent, then multiplication division and remainder, then addition and subtraction, then comparisons, then logical and, then logical or"
    >
      {/* beat one: 2 + 3 * 4 */}
      <Chip id="tok-2" className="absolute" style={{ left: 16, top: 42 }}>2</Chip>
      <span id="plus" className="absolute font-mono text-[16px] text-foreground" style={{ left: 52, top: 42 }}>+</span>
      <Frame id="sub-mul" style={{ left: 76, top: 34, width: 84, height: 32 }} className="justify-center text-[13px]">
        3 * 4
      </Frame>
      <Eyebrow id="note-a" className="absolute" style={{ left: 16, top: 84 }}>
        * binds tighter than +: evaluate first
      </Eyebrow>

      <Frame id="sub-add" style={{ left: 76, top: 34, width: 84, height: 32 }} className="justify-center text-[13px]">
        12
      </Frame>
      <Eyebrow id="note-b" className="absolute" style={{ left: 16, top: 84 }}>
        one operator left: evaluate the addition
      </Eyebrow>

      <Frame id="result-final" style={{ left: 16, top: 30, width: 84, height: 40 }} className="justify-center text-[20px] font-semibold text-[var(--color-primary)]">
        14
      </Frame>
      <Eyebrow id="note-c" className="absolute" style={{ left: 16, top: 84 }}>
        = 14 (final result)
      </Eyebrow>

      {/* beat two: 2 ** 3 ** 2, right-associative */}
      <Chip id="tok-2b" className="absolute" style={{ left: 16, top: 42 }}>2</Chip>
      <span id="pow-1" className="absolute font-mono text-[16px] text-foreground" style={{ left: 52, top: 42 }}>**</span>
      <Frame id="sub-pow-right" style={{ left: 84, top: 34, width: 92, height: 32 }} className="justify-center text-[13px]">
        3 ** 2
      </Frame>
      <Eyebrow id="note-d" className="absolute" style={{ left: 16, top: 84 }}>
        ** is right-associative: rightmost pair evaluates first
      </Eyebrow>

      <Frame id="sub-pow-outer" style={{ left: 16, top: 30, width: 160, height: 40 }} className="justify-center text-[16px]">
        2 ** 9
      </Frame>
      <Eyebrow id="note-e" className="absolute" style={{ left: 16, top: 84 }}>
        one operator left: evaluate 2 to the 9th
      </Eyebrow>

      <Frame id="result-final-2" style={{ left: 16, top: 30, width: 84, height: 40 }} className="justify-center text-[20px] font-semibold text-[var(--color-primary)]">
        512
      </Frame>
      <Eyebrow id="note-f" className="absolute" style={{ left: 16, top: 84 }}>
        = 512 (final result)
      </Eyebrow>

      {/* compact precedence-tiers legend, static reference throughout */}
      <Panel label="Precedence (high to low)" style={{ left: 0, top: 128, width: 400, height: 64 }} />
      <div
        className="absolute flex flex-wrap items-center gap-x-1 gap-y-1 font-mono text-[11px] text-foreground"
        style={{ left: 12, top: 152, width: 376 }}
      >
        <span className="font-semibold text-[var(--color-primary)]">**</span>
        <span className="text-muted-foreground">&gt;</span>
        <span>* / %</span>
        <span className="text-muted-foreground">&gt;</span>
        <span>+ -</span>
        <span className="text-muted-foreground">&gt;</span>
        <span>comparisons</span>
        <span className="text-muted-foreground">&gt;</span>
        <span>&amp;&amp;</span>
        <span className="text-muted-foreground">&gt;</span>
        <span>||</span>
      </div>
    </Stage>
  );
}
