"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";

export function OptionalChainingNullishVisual({ register }: ConceptVisualProps) {
  const scope = useRef<SVGSVGElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      // Scene, top half: a lookup token walks user -> address -> city. Address
      // is null, so ?. short-circuits there, the rest of the chain is skipped
      // (marked with an x), and the result is undefined, not a crash. Scene,
      // bottom half: 0 ?? 5 keeps 0 because 0 is not null/undefined, while
      // 0 || 5 swaps to 5 because 0 is falsy, showing the two operators diverge.
      gsap.set(
        ["#oc-label", "#user-box", "#user-text", "#arrow1", "#arrow1-label", "#address-box", "#address-text"],
        { opacity: 0 },
      );
      gsap.set(["#arrow2", "#arrow2-label", "#city-box", "#city-text"], { opacity: 0.35 });
      gsap.set("#address-highlight", { opacity: 0 });
      gsap.set("#skip-mark", { opacity: 0 });
      gsap.set("#token", { x: 50, y: 68, opacity: 0 });
      gsap.set(["#undefined-result", "#oc-code"], { opacity: 0 });

      gsap.set(["#nc-label", "#nc-code-left", "#nc-code-right"], { opacity: 0 });
      gsap.set(["#chip-nc0", "#chip-nc5", "#gate-nc", "#result-nc"], { opacity: 0 });
      gsap.set(["#chip-or0", "#chip-or5", "#gate-or", "#result-or"], { opacity: 0 });
      gsap.set("#final-note", { opacity: 0 });

      if (animate) {
        tl.to(["#oc-label", "#user-box", "#user-text"], { opacity: 1, duration: 0.3 })
          .to(["#arrow1", "#arrow1-label"], { opacity: 1, duration: 0.2 }, "+=0.1")
          .to(["#address-box", "#address-text"], { opacity: 1, duration: 0.3 }, "+=0.1")
          .to("#token", { opacity: 1, duration: 0.2 }, "+=0.2")
          .to("#token", { x: 180, y: 68, duration: 0.6, ease: "power2.inOut" }, "+=0.1")
          .to("#address-highlight", { opacity: 1, duration: 0.2 }, "+=0.1")
          .to("#token", { opacity: 0, duration: 0.2 }, "+=0.2")
          .to("#skip-mark", { opacity: 1, duration: 0.2 }, "<")
          .to("#undefined-result", { opacity: 1, duration: 0.3 }, "+=0.15")
          .to("#oc-code", { opacity: 1, duration: 0.3 }, "+=0.2")
          .to("#nc-label", { opacity: 1, duration: 0.3 }, "+=0.4")
          .to("#nc-code-left", { opacity: 1, duration: 0.3 }, "+=0.1")
          .to(["#chip-nc0", "#chip-nc5", "#gate-nc"], { opacity: 1, duration: 0.3 }, "+=0.1")
          .to("#chip-nc5", { opacity: 0.3, duration: 0.3 }, "+=0.2")
          .to("#result-nc", { opacity: 1, duration: 0.3 }, "<")
          .to("#nc-code-right", { opacity: 1, duration: 0.3 }, "+=0.35")
          .to(["#chip-or0", "#chip-or5", "#gate-or"], { opacity: 1, duration: 0.3 }, "+=0.1")
          .to("#chip-or0", { opacity: 0.3, duration: 0.3 }, "+=0.2")
          .to("#result-or", { opacity: 1, duration: 0.3 }, "<")
          .to("#final-note", { opacity: 1, duration: 0.4 }, "+=0.3");
      } else {
        // reduced motion: jump to labeled end-state
        tl.set(
          ["#oc-label", "#user-box", "#user-text", "#arrow1", "#arrow1-label", "#address-box", "#address-text"],
          { opacity: 1 },
        )
          .set("#address-highlight", { opacity: 1 })
          .set("#token", { opacity: 0 })
          .set("#skip-mark", { opacity: 1 })
          .set(["#undefined-result", "#oc-code"], { opacity: 1 })
          .set(["#nc-label", "#nc-code-left", "#nc-code-right"], { opacity: 1 })
          .set(["#chip-nc0", "#gate-nc", "#result-nc"], { opacity: 1 })
          .set("#chip-nc5", { opacity: 0.3 })
          .set(["#chip-or5", "#gate-or", "#result-or"], { opacity: 1 })
          .set("#chip-or0", { opacity: 0.3 })
          .set("#final-note", { opacity: 1 });
      }
      register(tl);
      return tl;
    };
    mm.add("(prefers-reduced-motion: reduce)", () => { build(false); });
    mm.add("(prefers-reduced-motion: no-preference)", () => { build(true); });
    return () => mm.revert();
  }, { scope });

  return (
    <svg ref={scope} viewBox="0 0 380 320" className="w-full max-w-md" role="img"
      aria-label="A lookup walks user then address then city. Address is null, so optional chaining short-circuits there, skips city, and returns undefined instead of throwing. Below, 0 nullish-coalescing 5 keeps 0 because 0 is not null or undefined, while 0 or 5 swaps to 5 because 0 is falsy">
      <text id="oc-label" x="15" y="20" opacity="0" className="fill-[var(--color-muted-foreground)] text-[10px]">
        Optional chaining
      </text>

      <g id="user-box">
        <rect x="15" y="50" width="70" height="36" rx="8" className="fill-[var(--color-muted)] stroke-[var(--color-border)]" />
      </g>
      <text id="user-text" x="30" y="73" className="fill-[var(--color-foreground)] text-[11px] font-mono">user</text>

      <line id="arrow1" x1="85" y1="68" x2="120" y2="68" className="stroke-[var(--color-muted-foreground)]" strokeWidth="2" />
      <text id="arrow1-label" x="90" y="60" className="fill-[var(--color-muted-foreground)] text-[9px]">?.</text>

      <g id="address-box">
        <rect x="120" y="50" width="115" height="36" rx="8" className="fill-[var(--color-muted)] stroke-[var(--color-border)]" />
      </g>
      <rect id="address-highlight" x="120" y="50" width="115" height="36" rx="8"
        className="fill-none stroke-[var(--color-destructive)]" strokeWidth="3" opacity="0" />
      <text id="address-text" x="128" y="73" className="fill-[var(--color-foreground)] text-[11px] font-mono">
        address: null
      </text>

      <line id="arrow2" x1="235" y1="68" x2="270" y2="68"
        className="stroke-[var(--color-muted-foreground)]" strokeWidth="2" strokeDasharray="4 3" />
      <text id="arrow2-label" x="240" y="60" className="fill-[var(--color-muted-foreground)] text-[9px]">?.</text>
      <text id="skip-mark" x="245" y="83" opacity="0" className="fill-[var(--color-destructive)] text-[11px]">
        &#10005;
      </text>

      <g id="city-box">
        <rect x="270" y="50" width="80" height="36" rx="8" className="fill-none stroke-[var(--color-border)]" />
      </g>
      <text id="city-text" x="285" y="73" className="fill-[var(--color-muted-foreground)] text-[11px] font-mono">
        city
      </text>

      <circle id="token" r="9" className="fill-[var(--color-primary)]" />

      <text id="undefined-result" x="15" y="115" opacity="0"
        className="fill-[var(--color-primary)] text-[13px] font-mono">
        undefined
      </text>
      <text id="oc-code" x="15" y="135" opacity="0"
        className="fill-[var(--color-muted-foreground)] text-[10px] font-mono">
        user?.address?.city // no crash
      </text>

      <line x1="10" y1="150" x2="370" y2="150" className="stroke-[var(--color-border)]" />

      <text id="nc-label" x="15" y="172" opacity="0" className="fill-[var(--color-muted-foreground)] text-[10px]">
        Nullish coalescing vs. OR
      </text>

      <text id="nc-code-left" x="20" y="192" opacity="0" className="fill-[var(--color-foreground)] text-[11px] font-mono">
        0 ?? 5
      </text>
      <g id="chip-nc0">
        <rect x="20" y="205" width="40" height="26" rx="6" className="fill-[var(--color-primary)] stroke-[var(--color-primary)]" opacity="0.15" />
        <rect x="20" y="205" width="40" height="26" rx="6" className="fill-none stroke-[var(--color-primary)]" />
        <text x="34" y="223" className="fill-[var(--color-foreground)] text-[11px] font-mono">0</text>
      </g>
      <g id="chip-nc5">
        <rect x="20" y="240" width="40" height="26" rx="6" className="fill-[var(--color-muted)] stroke-[var(--color-border)]" />
        <text x="34" y="258" className="fill-[var(--color-foreground)] text-[11px] font-mono">5</text>
      </g>
      <text id="gate-nc" x="75" y="230" opacity="0" className="fill-[var(--color-muted-foreground)] text-[11px] font-mono">
        ??
      </text>
      <text id="result-nc" x="105" y="223" opacity="0" className="fill-[var(--color-primary)] text-[12px] font-mono">
        = 0
      </text>

      <text id="nc-code-right" x="205" y="192" opacity="0" className="fill-[var(--color-foreground)] text-[11px] font-mono">
        0 || 5
      </text>
      <g id="chip-or0">
        <rect x="205" y="205" width="40" height="26" rx="6" className="fill-[var(--color-muted)] stroke-[var(--color-border)]" />
        <text x="219" y="223" className="fill-[var(--color-foreground)] text-[11px] font-mono">0</text>
      </g>
      <g id="chip-or5">
        <rect x="205" y="240" width="40" height="26" rx="6" className="fill-[var(--color-primary)] stroke-[var(--color-primary)]" opacity="0.15" />
        <rect x="205" y="240" width="40" height="26" rx="6" className="fill-none stroke-[var(--color-primary)]" />
        <text x="219" y="258" className="fill-[var(--color-foreground)] text-[11px] font-mono">5</text>
      </g>
      <text id="gate-or" x="260" y="230" opacity="0" className="fill-[var(--color-muted-foreground)] text-[11px] font-mono">
        ||
      </text>
      <text id="result-or" x="290" y="253" opacity="0" className="fill-[var(--color-primary)] text-[12px] font-mono">
        = 5
      </text>

      <text id="final-note" x="20" y="300" opacity="0" className="fill-[var(--color-muted-foreground)] text-[10px]">
        ?? only replaces null/undefined; || replaces any falsy value
      </text>
    </svg>
  );
}
