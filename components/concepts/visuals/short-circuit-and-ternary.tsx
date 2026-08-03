"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";
import { Stage, Frame, Chip, Eyebrow, CodeLine, enter, pop, focusOn, focusOff } from "./kit";

// Three short beats. && evaluates its falsy left side and stops there, the
// right side dimming to show it never runs. Then 0 || 5 and 0 ?? 5 are
// evaluated side by side: || treats 0 as missing and replaces it, ?? keeps 0
// because it only checks for null or undefined. Finally a ternary evaluates
// its condition once and lights only the branch it takes, dimming the other.
export function ShortCircuitAndTernaryVisual({ register }: ConceptVisualProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      gsap.set(
        [
          "#and-label", "#and-code", "#and-right",
          "#gate-label", "#or-code", "#nc-code",
          "#ternary-label", "#ternary-code", "#adult-frame", "#minor-frame",
        ],
        { opacity: 0, y: 12 },
      );
      gsap.set(["#and-left", "#chip-or-0", "#chip-or-5", "#chip-nc-0", "#chip-nc-5", "#cond-chip"], {
        opacity: 0,
        scale: 0.8,
      });
      gsap.set(["#gate-or", "#result-or", "#gate-nc", "#result-nc", "#and-result", "#ternary-result"], {
        opacity: 0,
      });
      gsap.set(".glow", { opacity: 0 });

      if (animate) {
        // Beat 1: && stops at the first falsy value
        enter(tl, ["#and-label", "#and-code"], undefined, 0.1);
        pop(tl, "#and-left", "+=0.15");
        enter(tl, "#and-right", "<");
        focusOn(tl, "#and-left", "+=0.15");
        tl.to("#and-right", { opacity: 0.3, duration: 0.3 }, "+=0.1");
        tl.to("#and-result", { opacity: 1, duration: 0.3 }, "+=0.1");
        focusOff(tl, "#and-left", "+=0.3");

        // Beat 2: || replaces any falsy value, ?? only replaces null/undefined
        enter(tl, "#gate-label", "+=0.4");
        enter(tl, ["#or-code", "#nc-code"], "+=0.1", 0.1);
        tl.to(["#chip-or-0", "#chip-or-5", "#gate-or"], { opacity: 1, duration: 0.35, ease: "power2.out", stagger: 0.08 }, "+=0.15");
        tl.to("#result-or", { opacity: 1, duration: 0.3 }, "+=0.15");
        tl.to("#chip-or-0", { opacity: 0.4, duration: 0.3 }, "<");
        tl.to(["#chip-nc-0", "#chip-nc-5", "#gate-nc"], { opacity: 1, duration: 0.35, ease: "power2.out", stagger: 0.08 }, "+=0.3");
        tl.to("#result-nc", { opacity: 1, duration: 0.3 }, "+=0.15");
        tl.to("#chip-nc-5", { opacity: 0.4, duration: 0.3 }, "<");

        // Beat 3: the ternary evaluates the condition once and takes one branch
        enter(tl, "#ternary-label", "+=0.4");
        enter(tl, "#ternary-code", "<");
        pop(tl, "#cond-chip", "+=0.2");
        focusOn(tl, "#cond-chip", "+=0.15");
        enter(tl, ["#adult-frame", "#minor-frame"], "+=0.2", 0.1);
        focusOff(tl, "#cond-chip", "+=0.2");
        tl.to("#minor-frame", { opacity: 0.3, duration: 0.3 }, "<");
        focusOn(tl, "#adult-frame", "<");
        tl.to("#ternary-result", { opacity: 1, duration: 0.3 }, "+=0.15");
        focusOff(tl, "#adult-frame", "+=0.4");
      } else {
        // reduced motion: jump to labeled end-state (all three beats resolved)
        tl.set(
          [
            "#and-label", "#and-code",
            "#gate-label", "#or-code", "#nc-code",
            "#ternary-label", "#ternary-code", "#adult-frame", "#minor-frame",
          ],
          { opacity: 1, y: 0 },
        )
          .set("#and-right", { opacity: 0.3, y: 0 })
          .set(["#and-left", "#chip-or-0", "#chip-or-5", "#chip-nc-0", "#chip-nc-5", "#cond-chip"], { opacity: 1, scale: 1 })
          .set("#chip-or-0", { opacity: 0.4 })
          .set("#chip-nc-5", { opacity: 0.4 })
          .set("#minor-frame", { opacity: 0.3 })
          .set(["#gate-or", "#result-or", "#gate-nc", "#result-nc", "#and-result", "#ternary-result"], { opacity: 1 })
          .set("#adult-frame .glow", { opacity: 1 })
          .set("#adult-frame", { scale: 1.03 });
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
      height={410}
      label="false and expensiveCall stops at the falsy left side, the right side dims to show it never runs, and the result is false. Below, 0 or 5 replaces 0 with 5 because 0 is falsy, while 0 nullish-coalescing 5 keeps 0 because 0 is not null or undefined. Finally, a ternary checks age 20 is greater than or equal to 18, lights only the adult branch, dims the minor branch, and returns adult"
    >
      <Eyebrow id="and-label" className="absolute" style={{ position: "absolute", left: 8, top: 4 }}>&& stops at the first falsy value</Eyebrow>
      <CodeLine id="and-code" className="whitespace-nowrap" style={{ position: "absolute", left: 16, top: 26, width: 300 }}>
        false &amp;&amp; expensiveCall()
      </CodeLine>
      <Chip id="and-left" className="absolute" style={{ position: "absolute", left: 16, top: 60 }}>false</Chip>
      <span className="absolute font-mono text-[11px] text-muted-foreground" style={{ position: "absolute", left: 78, top: 64 }}>&amp;&amp;</span>
      <Frame id="and-right" className="whitespace-nowrap justify-center" style={{ position: "absolute", left: 104, top: 58, width: 140, height: 34 }}>
        expensiveCall()
      </Frame>
      <span id="and-result" className="absolute font-mono text-[12px] font-semibold text-foreground" style={{ position: "absolute", left: 16, top: 100 }}>
        = false
      </span>

      <div className="absolute border-t border-border" style={{ position: "absolute", left: 0, top: 122, width: 400 }} />

      <Eyebrow id="gate-label" className="absolute" style={{ position: "absolute", left: 8, top: 134, width: 384 }}>
        || replaces any falsy value; ?? only replaces null or undefined
      </Eyebrow>

      <CodeLine id="or-code" className="whitespace-nowrap" style={{ position: "absolute", left: 20, top: 178, width: 100 }}>0 || 5</CodeLine>
      <Chip id="chip-or-0" className="absolute" style={{ position: "absolute", left: 20, top: 200 }}>0</Chip>
      <Chip id="chip-or-5" className="absolute !bg-green-500/10 !text-green-600" style={{ position: "absolute", left: 20, top: 232 }}>5</Chip>
      <span id="gate-or" className="absolute font-mono text-[11px] text-muted-foreground" style={{ position: "absolute", left: 72, top: 216 }}>||</span>
      <span id="result-or" className="absolute font-mono text-[12px] font-semibold text-green-600" style={{ position: "absolute", left: 100, top: 216 }}>= 5</span>

      <CodeLine id="nc-code" className="whitespace-nowrap" style={{ position: "absolute", left: 210, top: 178, width: 100 }}>0 ?? 5</CodeLine>
      <Chip id="chip-nc-0" className="absolute !bg-green-500/10 !text-green-600" style={{ position: "absolute", left: 210, top: 200 }}>0</Chip>
      <Chip id="chip-nc-5" className="absolute" style={{ position: "absolute", left: 210, top: 232 }}>5</Chip>
      <span id="gate-nc" className="absolute font-mono text-[11px] text-muted-foreground" style={{ position: "absolute", left: 262, top: 216 }}>??</span>
      <span id="result-nc" className="absolute font-mono text-[12px] font-semibold text-green-600" style={{ position: "absolute", left: 292, top: 216 }}>= 0</span>

      <div className="absolute border-t border-border" style={{ position: "absolute", left: 0, top: 264, width: 400 }} />

      <Eyebrow id="ternary-label" className="absolute" style={{ position: "absolute", left: 8, top: 276 }}>
        Conditional operator: exactly one branch runs
      </Eyebrow>
      <CodeLine id="ternary-code" className="whitespace-nowrap" style={{ position: "absolute", left: 16, top: 298, width: 360 }}>
        age &gt;= 18 ? &quot;adult&quot; : &quot;minor&quot;
      </CodeLine>
      <Chip id="cond-chip" className="absolute" style={{ position: "absolute", left: 16, top: 332 }}>age &gt;= 18</Chip>
      <Frame id="adult-frame" className="justify-center" style={{ position: "absolute", left: 150, top: 330, width: 100, height: 34 }}>
        &quot;adult&quot;
      </Frame>
      <Frame id="minor-frame" className="justify-center" style={{ position: "absolute", left: 262, top: 330, width: 100, height: 34 }}>
        &quot;minor&quot;
      </Frame>
      <span id="ternary-result" className="absolute font-mono text-[12px] font-semibold text-green-600" style={{ position: "absolute", left: 16, top: 374 }}>
        = &quot;adult&quot;
      </span>
    </Stage>
  );
}
