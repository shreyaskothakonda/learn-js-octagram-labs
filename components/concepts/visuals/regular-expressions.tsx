"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";

const CHARS = ["C", "a", "l", "l", " ", "5", "5", "5", "-", "1", "2", "3", "4", " ", "n", "o", "w"];
const CHAR_W = 18;
const START_X = 20;
const CHAR_Y = 75;
const charX = (i: number) => START_X + i * CHAR_W;

const MATCH_START = 5;
const MATCH_END = 12; // inclusive, "555-1234"
const GROUP1_START = 5;
const GROUP1_END = 7; // "555"
const GROUP2_START = 9;
const GROUP2_END = 12; // "1234"

export function RegularExpressionsVisual({ register }: ConceptVisualProps) {
  const scope = useRef<SVGSVGElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      // Scene: a scanning cursor steps character by character across an input
      // string until it reaches a match, then the full matched span lights up,
      // the two capture groups get their own underline marks and labels, and
      // a result readout shows the match array.
      gsap.set("#pattern-code", { opacity: 0 });
      gsap.set(".char", { opacity: 0 });
      gsap.set("#cursor", { opacity: 0, x: charX(0) });
      gsap.set("#match-box", { opacity: 0 });
      gsap.set(["#group1-mark", "#group2-mark"], { opacity: 0 });
      gsap.set(["#group1-label", "#group2-label"], { opacity: 0 });
      gsap.set("#result-text", { opacity: 0 });

      if (animate) {
        tl.to("#pattern-code", { opacity: 1, duration: 0.3 })
          .to(".char", { opacity: 1, duration: 0.3, stagger: 0.02 }, "+=0.1")
          .to("#cursor", { opacity: 1, duration: 0.2 }, "+=0.2");
        for (let i = 1; i <= MATCH_START; i++) {
          tl.to("#cursor", { x: charX(i), duration: 0.12 }, "+=0.05");
        }
        tl.to("#cursor", { opacity: 0, duration: 0.2 }, "+=0.3")
          .to("#match-box", { opacity: 1, duration: 0.3 }, "<")
          .to(["#group1-mark", "#group2-mark"], { opacity: 1, duration: 0.3, stagger: 0.15 }, "+=0.3")
          .to(["#group1-label", "#group2-label"], { opacity: 1, duration: 0.3, stagger: 0.15 }, "+=0.1")
          .to("#result-text", { opacity: 1, duration: 0.3 }, "+=0.3");
      } else {
        // reduced motion: jump to labeled end-state, match already found
        tl.set("#pattern-code", { opacity: 1 })
          .set(".char", { opacity: 1 })
          .set("#cursor", { opacity: 0 })
          .set("#match-box", { opacity: 1 })
          .set(["#group1-mark", "#group2-mark"], { opacity: 1 })
          .set(["#group1-label", "#group2-label"], { opacity: 1 })
          .set("#result-text", { opacity: 1 });
      }
      register(tl);
      return tl;
    };
    mm.add("(prefers-reduced-motion: reduce)", () => { build(false); });
    mm.add("(prefers-reduced-motion: no-preference)", () => { build(true); });
    return () => mm.revert();
  }, { scope });

  return (
    <svg
      ref={scope}
      viewBox="0 0 380 190"
      className="w-full max-w-md"
      role="img"
      aria-label="A scanning cursor steps character by character across the string Call 555-1234 now until it reaches the match 555-1234, which lights up along with its two capture groups, 555 and 1234, ending in a result readout of the match array"
    >
      <text id="pattern-code" x="20" y="25" opacity="0" className="fill-[var(--color-muted-foreground)] text-[11px] font-mono">
        const re = /(\d{3})-(\d{4})/;
      </text>

      {CHARS.map((c, i) => (
        <text
          key={i}
          id={`ch${i}`}
          x={charX(i)}
          y={CHAR_Y}
          opacity="0"
          className="char fill-[var(--color-foreground)] text-[13px] font-mono"
        >
          {c === " " ? " " : c}
        </text>
      ))}

      <rect
        id="cursor"
        y={CHAR_Y - 15}
        width={CHAR_W}
        height="26"
        rx="4"
        opacity="0"
        className="fill-[var(--color-muted-foreground)]"
        fillOpacity="0.2"
      />

      <rect
        id="match-box"
        x={charX(MATCH_START)}
        y={CHAR_Y - 15}
        width={(MATCH_END - MATCH_START + 1) * CHAR_W}
        height="26"
        rx="4"
        opacity="0"
        className="fill-[var(--color-primary)] stroke-[var(--color-primary)]"
        fillOpacity="0.12"
      />

      <rect
        id="group1-mark"
        x={charX(GROUP1_START)}
        y={CHAR_Y + 9}
        width={(GROUP1_END - GROUP1_START + 1) * CHAR_W}
        height="4"
        rx="2"
        opacity="0"
        className="fill-[var(--color-secondary)]"
      />
      <rect
        id="group2-mark"
        x={charX(GROUP2_START)}
        y={CHAR_Y + 9}
        width={(GROUP2_END - GROUP2_START + 1) * CHAR_W}
        height="4"
        rx="2"
        opacity="0"
        className="fill-[var(--color-primary)]"
      />

      <text id="group1-label" x="20" y="120" opacity="0" className="fill-[var(--color-secondary)] text-[11px] font-mono">
        $1 (group 1) = &quot;555&quot;
      </text>
      <text id="group2-label" x="20" y="138" opacity="0" className="fill-[var(--color-primary)] text-[11px] font-mono">
        $2 (group 2) = &quot;1234&quot;
      </text>

      <text id="result-text" x="20" y="168" opacity="0" className="fill-[var(--color-muted-foreground)] text-[10px] font-mono">
        re.exec(str) =&gt; [&quot;555-1234&quot;, &quot;555&quot;, &quot;1234&quot;]
      </text>
    </svg>
  );
}
