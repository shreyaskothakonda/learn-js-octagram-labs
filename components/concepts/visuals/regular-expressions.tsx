"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";
import { Stage, Chip, CodeLine, enter, DUR, EASE } from "./kit";

const CHARS = ["C", "a", "l", "l", " ", "5", "5", "5", "-", "1", "2", "3", "4", " ", "n", "o", "w"];
const CHAR_W = 20;
const START_X = 12;
const ROW_Y = 44;

const MATCH_START = 5;
const MATCH_END = 12; // inclusive, "555-1234"
const GROUP1_START = 5;
const GROUP1_END = 7; // "555"
const GROUP2_START = 9;
const GROUP2_END = 12; // "1234"

const charX = (i: number) => START_X + i * CHAR_W;
const charIds = CHARS.map((_, i) => `#ch-${i}`);

// A scanning cursor steps character by character across the string until it
// reaches the match, then the matched span lights up along with its two
// capture groups, ending in a readout of the match array.
export function RegularExpressionsVisual({ register }: ConceptVisualProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      gsap.set("#pattern-code", { opacity: 0, y: 12 });
      gsap.set(charIds, { opacity: 0, scale: 0.8 });
      gsap.set("#cursor", { opacity: 0, left: charX(0) });
      gsap.set("#match-box", { opacity: 0 });
      gsap.set(["#group1-mark", "#group2-mark"], { opacity: 0 });
      gsap.set(["#group1-label", "#group2-label"], { opacity: 0, y: 8 });
      gsap.set("#result-text", { opacity: 0, y: 8 });

      if (animate) {
        enter(tl, "#pattern-code");
        tl.to(charIds, { opacity: 1, scale: 1, duration: DUR.pop, ease: EASE.pop, stagger: 0.02 }, "+=0.1");
        tl.to("#cursor", { opacity: 1, duration: 0.2 }, "+=0.15");
        for (let i = 1; i <= MATCH_START; i++) {
          tl.to("#cursor", { left: charX(i), duration: 0.12 }, "+=0.04");
        }
        tl.to("#cursor", { opacity: 0, duration: 0.2 }, "+=0.25")
          .to("#match-box", { opacity: 1, duration: 0.3 }, "<");
        tl.to(["#group1-mark", "#group2-mark"], { opacity: 1, duration: 0.3, stagger: 0.15 }, "+=0.2");
        enter(tl, ["#group1-label", "#group2-label"], "+=0.1", 0.15);
        enter(tl, "#result-text", "+=0.25");
      } else {
        // reduced motion: jump to labeled end-state, match already found
        tl.set("#pattern-code", { opacity: 1, y: 0 })
          .set(charIds, { opacity: 1, scale: 1 })
          .set("#cursor", { opacity: 0 })
          .set("#match-box", { opacity: 1 })
          .set(["#group1-mark", "#group2-mark"], { opacity: 1 })
          .set(["#group1-label", "#group2-label"], { opacity: 1, y: 0 })
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
      height={210}
      label="A scanning cursor steps character by character across the string Call 555-1234 now until it reaches the match 555-1234, which lights up along with its two capture groups, 555 and 1234, ending in a result readout of the match array"
    >
      <CodeLine id="pattern-code" className="whitespace-nowrap" style={{ left: 8, top: 0, width: 370 }}>
        {"const re = /(\\d{3})-(\\d{4})/;"}
      </CodeLine>

      <div
        id="match-box"
        className="absolute rounded-md border border-[var(--color-primary)] bg-[var(--color-primary)]/10"
        style={{
          left: charX(MATCH_START) - 2,
          top: ROW_Y - 2,
          width: (MATCH_END - MATCH_START + 1) * CHAR_W,
          height: 30,
        }}
      />
      <div
        id="cursor"
        className="absolute rounded-md bg-[var(--color-muted-foreground)]/20"
        style={{ top: ROW_Y - 2, width: CHAR_W - 2, height: 30 }}
      />

      {CHARS.map((c, i) => (
        <Chip
          key={i}
          id={`ch-${i}`}
          className="px-0"
          style={{ position: "absolute", left: charX(i), top: ROW_Y, width: CHAR_W - 4, height: 26 }}
        >
          {c === " " ? " " : c}
        </Chip>
      ))}

      <div
        id="group1-mark"
        className="absolute h-1 rounded-full bg-[var(--color-secondary)]"
        style={{ left: charX(GROUP1_START), top: ROW_Y + 32, width: (GROUP1_END - GROUP1_START + 1) * CHAR_W - 4 }}
      />
      <div
        id="group2-mark"
        className="absolute h-1 rounded-full bg-[var(--color-primary)]"
        style={{ left: charX(GROUP2_START), top: ROW_Y + 32, width: (GROUP2_END - GROUP2_START + 1) * CHAR_W - 4 }}
      />

      <CodeLine
        id="group1-label"
        className="whitespace-nowrap text-[var(--color-secondary)]"
        style={{ left: 8, top: ROW_Y + 46, width: 200 }}
      >
        $1 (group 1) = &quot;555&quot;
      </CodeLine>
      <CodeLine
        id="group2-label"
        className="whitespace-nowrap text-[var(--color-primary)]"
        style={{ left: 8, top: ROW_Y + 82, width: 220 }}
      >
        $2 (group 2) = &quot;1234&quot;
      </CodeLine>

      <CodeLine id="result-text" className="whitespace-nowrap text-muted-foreground" style={{ left: 8, top: ROW_Y + 118, width: 370 }}>
        re.exec(str) =&gt; [&quot;555-1234&quot;, &quot;555&quot;, &quot;1234&quot;]
      </CodeLine>
    </Stage>
  );
}
