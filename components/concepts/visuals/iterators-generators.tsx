"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";
import { Stage, Panel, Frame, Chip, Eyebrow, CodeLine, enter, pop, focusOn, focusOff, DUR, EASE } from "./kit";

const CHIP_IDS = ["#chip0", "#chip1", "#chip2"];

// A generator function's frame sits inside its panel, execution focus settled
// on it for the whole run. Each next() resumes the frame, its local i
// advances, a yielded value pops out as a chip, and the frame pauses at the
// next yield again, with i preserved between calls, until the focus releases
// and a final readout shows the shape next() returns.
export function IteratorsGeneratorsVisual({ register }: ConceptVisualProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      gsap.set(["#code-a", "#code-b", "#code-c", "#const-line"], { opacity: 0, y: 12 });
      gsap.set(["#gen-panel", "#gen-frame", "#status-label"], { opacity: 0, y: 12 });
      gsap.set(".glow", { opacity: 0 });
      gsap.set("#pause-icon", { opacity: 0 });
      gsap.set("#label-idle", { opacity: 1 });
      gsap.set("#label-calling", { opacity: 0 });
      gsap.set("#i-value", { textContent: "" });
      gsap.set(CHIP_IDS, { opacity: 0, scale: 0.8 });
      gsap.set("#result-text", { opacity: 0, y: 12 });

      if (animate) {
        enter(tl, ["#code-a", "#code-b", "#code-c", "#const-line"], undefined, 0.08);
        enter(tl, "#gen-panel", "+=0.15");
        enter(tl, "#gen-frame", "<");
        enter(tl, "#status-label", "<");
        // the focus settles on the generator and stays there for every call
        focusOn(tl, "#gen-frame", "+=0.15");

        CHIP_IDS.forEach((chipSel, i) => {
          tl.to("#label-idle", { opacity: 0, duration: 0.2 }, "+=0.3");
          tl.to("#label-calling", { opacity: 1, duration: 0.2 }, "<");
          tl.to("#pause-icon", { opacity: 0, duration: 0.15 }, "+=0.1");
          tl.to("#i-value", { textContent: String(i), duration: DUR.pop, ease: EASE.pop, snap: { textContent: 1 } }, "<");
          pop(tl, chipSel, "+=0.1");
          tl.to("#pause-icon", { opacity: 1, duration: 0.15 }, "+=0.1");
          tl.to("#label-calling", { opacity: 0, duration: 0.2 }, "+=0.2");
          tl.to("#label-idle", { opacity: 1, duration: 0.2 }, "<");
        });

        focusOff(tl, "#gen-frame", "+=0.3");
        enter(tl, "#result-text", "+=0.2");
      } else {
        // reduced motion: jump to labeled end-state, all three values yielded
        tl.set(["#code-a", "#code-b", "#code-c", "#const-line"], { opacity: 1, y: 0 })
          .set(["#gen-panel", "#gen-frame", "#status-label"], { opacity: 1, y: 0 })
          .set("#pause-icon", { opacity: 1 })
          .set("#label-calling", { opacity: 0 })
          .set("#i-value", { textContent: "2" })
          .set(CHIP_IDS, { opacity: 1, scale: 1 })
          .set("#result-text", { opacity: 1, y: 0 });
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
      height={280}
      label="A generator function's frame pauses at each yield. Three calls to next() each resume it in turn, producing the values 0, 1 and 2 while the paused frame's local variable i is preserved and incremented between calls, with the execution focus staying on the generator the whole time"
    >
      <CodeLine id="code-a" className="whitespace-nowrap" style={{ left: 8, top: 0, width: 220 }}>
        function* count() {"{"}
      </CodeLine>
      <CodeLine id="code-b" className="whitespace-nowrap" style={{ left: 8, top: 28, width: 220 }}>
        {"  while (true) yield i++;"}
      </CodeLine>
      <CodeLine id="code-c" className="whitespace-nowrap" style={{ left: 8, top: 56, width: 60 }}>
        {"}"}
      </CodeLine>
      <CodeLine id="const-line" className="whitespace-nowrap" style={{ left: 8, top: 84, width: 220 }}>
        const it = count();
      </CodeLine>

      <Panel id="gen-panel" label="count() frame" style={{ left: 8, top: 124, width: 180, height: 100 }} />
      <Frame id="gen-frame" style={{ left: 20, top: 156, width: 156, height: 48 }}>
        <span>i:&nbsp;</span>
        <span id="i-value" />
        <span id="pause-icon" className="absolute flex gap-1" style={{ right: 10, top: 10 }}>
          <span className="block h-3.5 w-1 rounded-sm bg-muted-foreground" />
          <span className="block h-3.5 w-1 rounded-sm bg-muted-foreground" />
        </span>
      </Frame>

      <Eyebrow id="status-label" className="absolute" style={{ left: 204, top: 126, width: 180 }}>
        <span id="label-idle" className="text-muted-foreground">yielded values</span>
        <span id="label-calling" className="absolute left-0 top-0 text-foreground">it.next()</span>
      </Eyebrow>
      <Chip id="chip0" style={{ position: "absolute", left: 204, top: 156 }}>0</Chip>
      <Chip id="chip1" style={{ position: "absolute", left: 262, top: 156 }}>1</Chip>
      <Chip id="chip2" style={{ position: "absolute", left: 320, top: 156 }}>2</Chip>

      <CodeLine id="result-text" className="whitespace-nowrap text-muted-foreground" style={{ left: 8, top: 240, width: 370 }}>
        it.next() =&gt; {"{"} value: 2, done: false {"}"}
      </CodeLine>
    </Stage>
  );
}
