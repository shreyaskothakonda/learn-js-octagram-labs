"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";
import { Stage, Panel, Chip, Eyebrow, enter, pop, focusOn, focusOff } from "./kit";

// Coins of 4, 3, and 1 are available to make change for 6. Greedy always
// takes the biggest coin that still fits the remaining amount: 4 first
// (remaining 2), then 3 is too big so it takes 1 (remaining 1), then 1 again
// (remaining 0). That is 3 coins. The optimal answer, 3 plus 3, only needs 2
// coins: greedy's locally-best choices do not always add up to the best
// overall answer.
export function GreedyAlgorithmsVisual({ register }: ConceptVisualProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      gsap.set(["#g-den-4", "#g-den-3", "#g-den-1"], { opacity: 0, y: 12 });
      gsap.set(["#g-remain-0", "#g-remain-1", "#g-remain-2", "#g-remain-3"], { opacity: 0 });
      gsap.set(["#g-pick-0", "#g-pick-1", "#g-pick-2"], { opacity: 0, scale: 0.8 });
      gsap.set(["#g-line-0", "#g-line-1", "#g-line-2"], { opacity: 0 });
      gsap.set(["#g-tally", "#g-optimal"], { opacity: 0, scale: 0.8 });
      gsap.set("#g-optimal-line", { opacity: 0 });
      gsap.set(".glow", { opacity: 0 });

      if (animate) {
        enter(tl, "#g-den-4, #g-den-3, #g-den-1");
        tl.to("#g-remain-0", { opacity: 1, duration: 0.3 }, "+=0.2");
        tl.to("#g-line-0", { opacity: 1, duration: 0.3 }, "<");

        // pick 4, remaining 6 -> 2
        focusOn(tl, "#g-den-4", "+=0.2");
        pop(tl, "#g-pick-0", "<");
        focusOff(tl, "#g-den-4", "+=0.3");
        tl.to("#g-remain-0", { opacity: 0, duration: 0.2 }, "<");
        tl.to("#g-remain-1", { opacity: 1, duration: 0.2 }, "<");
        tl.to("#g-line-0", { opacity: 0, duration: 0.2 }, "<");
        tl.to("#g-line-1", { opacity: 1, duration: 0.2 }, "<");

        // 3 is too big for remaining 2, pick 1, remaining 2 -> 1
        focusOn(tl, "#g-den-1", "+=0.35");
        pop(tl, "#g-pick-1", "<");
        focusOff(tl, "#g-den-1", "+=0.3");
        tl.to("#g-remain-1", { opacity: 0, duration: 0.2 }, "<");
        tl.to("#g-remain-2", { opacity: 1, duration: 0.2 }, "<");
        tl.to("#g-line-1", { opacity: 0, duration: 0.2 }, "<");
        tl.to("#g-line-2", { opacity: 1, duration: 0.2 }, "<");

        // pick 1 again, remaining 1 -> 0
        focusOn(tl, "#g-den-1", "+=0.35");
        pop(tl, "#g-pick-2", "<");
        focusOff(tl, "#g-den-1", "+=0.3");
        tl.to("#g-remain-2", { opacity: 0, duration: 0.2 }, "<");
        tl.to("#g-remain-3", { opacity: 1, duration: 0.2 }, "<");
        tl.to("#g-line-2", { opacity: 0, duration: 0.2 }, "<");

        pop(tl, "#g-tally", "+=0.3");
        tl.to("#g-optimal-line", { opacity: 1, duration: 0.3 }, "+=0.3");
        pop(tl, "#g-optimal", "<");
        focusOn(tl, "#g-optimal", "+=0.1");
      } else {
        tl.set(["#g-den-4", "#g-den-3", "#g-den-1"], { opacity: 1, y: 0 })
          .set(["#g-remain-0", "#g-remain-1", "#g-remain-2"], { opacity: 0 })
          .set("#g-remain-3", { opacity: 1 })
          .set(["#g-pick-0", "#g-pick-1", "#g-pick-2"], { opacity: 1, scale: 1 })
          .set(["#g-line-0", "#g-line-1", "#g-line-2"], { opacity: 0 })
          .set("#g-tally", { opacity: 1, scale: 1 })
          .set("#g-optimal-line", { opacity: 1 })
          .set("#g-optimal", { opacity: 1, scale: 1 })
          .set("#g-optimal .glow", { opacity: 1 })
          .set("#g-optimal", { scale: 1.03 });
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
      height={360}
      label="Coins of 4, 3, and 1 are available to make 6. Greedy takes the biggest coin that fits the remaining amount each time: 4, leaving 2; then 3 is too big so it takes 1, leaving 1; then 1 again, leaving 0, for a total of 3 coins. A final line shows the optimal answer, 3 plus 3, needs only 2 coins, lit up to show greedy did not find the best answer here."
    >
      <Panel label="Coins available" style={{ left: 0, top: 0, width: 400, height: 90 }} />
      <Chip id="g-den-4" className="absolute" style={{ left: 20, top: 40, width: 44, height: 36 }}>4</Chip>
      <Chip id="g-den-3" className="absolute" style={{ left: 80, top: 40, width: 44, height: 36 }}>3</Chip>
      <Chip id="g-den-1" className="absolute" style={{ left: 140, top: 40, width: 44, height: 36 }}>1</Chip>

      <Eyebrow className="absolute" style={{ left: 240, top: 20 }}>Remaining</Eyebrow>
      <div className="absolute" style={{ left: 240, top: 40 }}>
        <Chip id="g-remain-0" className="absolute h-8 w-16 px-0">6</Chip>
        <Chip id="g-remain-1" className="absolute h-8 w-16 px-0">2</Chip>
        <Chip id="g-remain-2" className="absolute h-8 w-16 px-0">1</Chip>
        <Chip id="g-remain-3" className="absolute h-8 w-16 px-0">0</Chip>
      </div>

      <div className="absolute font-mono text-[12px] text-foreground" style={{ left: 16, top: 100 }}>
        <span id="g-line-0">remaining 6, biggest coin that fits is 4</span>
        <span id="g-line-1" className="absolute left-0 top-0">remaining 2, 3 is too big, pick 1</span>
        <span id="g-line-2" className="absolute left-0 top-0">remaining 1, pick 1</span>
      </div>

      <Eyebrow className="absolute" style={{ left: 16, top: 140 }}>Greedy picks</Eyebrow>
      <Chip id="g-pick-0" className="absolute" style={{ left: 16, top: 160, width: 44, height: 36 }}>4</Chip>
      <Chip id="g-pick-1" className="absolute" style={{ left: 76, top: 160, width: 44, height: 36 }}>1</Chip>
      <Chip id="g-pick-2" className="absolute" style={{ left: 136, top: 160, width: 44, height: 36 }}>1</Chip>

      <Eyebrow className="absolute" style={{ left: 16, top: 214 }}>Greedy total</Eyebrow>
      <Chip id="g-tally" className="absolute !bg-[var(--color-destructive)]/10 !text-[var(--color-destructive)]" style={{ left: 16, top: 234, width: 90, height: 36 }}>
        3 coins
      </Chip>

      <div className="absolute font-mono text-[12px] text-foreground" style={{ left: 16, top: 284 }}>
        <span id="g-optimal-line">optimal: 3 + 3 uses fewer coins</span>
      </div>
      <Chip id="g-optimal" className="absolute" style={{ left: 16, top: 306, width: 90, height: 36 }}>
        2 coins
      </Chip>
    </Stage>
  );
}
