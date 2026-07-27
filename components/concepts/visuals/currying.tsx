"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";

export function CurryingVisual({ register }: ConceptVisualProps) {
  const scope = useRef<SVGSVGElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      // Scene: add(1)(2)(3) as a chain of three boxes. Each call captures one
      // argument and returns a new function waiting for the next one, until
      // the third call meets add's arity of three, and the sum computes.
      gsap.set("#code-label", { opacity: 0 });
      gsap.set(["#box1", "#chip-a", "#wait-b"], { opacity: 0 });
      gsap.set(["#arrow1", "#call2-code"], { opacity: 0 });
      gsap.set(["#box2", "#chip-a2", "#chip-b", "#wait-c"], { opacity: 0 });
      gsap.set(["#arrow2", "#call3-code"], { opacity: 0 });
      gsap.set(["#box3", "#chip-a3", "#chip-b3", "#chip-c"], { opacity: 0 });
      gsap.set("#computing", { opacity: 0 });
      gsap.set("#arrow3", { opacity: 0 });
      gsap.set("#final-result", { opacity: 0, scale: 0.8 });

      if (animate) {
        tl.to("#code-label", { opacity: 1, duration: 0.3 })
          .to("#box1", { opacity: 1, duration: 0.3 }, "+=0.1")
          .to("#chip-a", { opacity: 1, duration: 0.3 }, "+=0.15")
          .to("#wait-b", { opacity: 1, duration: 0.3 }, "+=0.15")
          .to("#arrow1", { opacity: 1, duration: 0.2 }, "+=0.2")
          .to("#call2-code", { opacity: 1, duration: 0.2 }, "<")
          .to("#box2", { opacity: 1, duration: 0.3 }, "+=0.15")
          .to(["#chip-a2", "#chip-b"], { opacity: 1, duration: 0.3 }, "+=0.15")
          .to("#wait-b", { opacity: 0, duration: 0.2 }, "<")
          .to("#wait-c", { opacity: 1, duration: 0.3 }, "+=0.15")
          .to("#arrow2", { opacity: 1, duration: 0.2 }, "+=0.2")
          .to("#call3-code", { opacity: 1, duration: 0.2 }, "<")
          .to("#box3", { opacity: 1, duration: 0.3 }, "+=0.15")
          .to(["#chip-a3", "#chip-b3", "#chip-c"], { opacity: 1, duration: 0.3 }, "+=0.15")
          .to("#wait-c", { opacity: 0, duration: 0.2 }, "<")
          .to("#computing", { opacity: 1, duration: 0.3 }, "+=0.15")
          .to("#computing", { opacity: 0, duration: 0.3 }, "+=0.5")
          .to("#arrow3", { opacity: 1, duration: 0.2 }, "<")
          .to("#final-result", { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2)" }, "+=0.1");
      } else {
        // reduced motion: jump to labeled end-state
        tl.set(["#code-label", "#box1", "#chip-a", "#arrow1", "#call2-code"], { opacity: 1 })
          .set("#wait-b", { opacity: 0 })
          .set(["#box2", "#chip-a2", "#chip-b", "#arrow2", "#call3-code"], { opacity: 1 })
          .set("#wait-c", { opacity: 0 })
          .set(["#box3", "#chip-a3", "#chip-b3", "#chip-c", "#arrow3"], { opacity: 1 })
          .set("#computing", { opacity: 0 })
          .set("#final-result", { opacity: 1, scale: 1 });
      }
      register(tl);
      return tl;
    };
    mm.add("(prefers-reduced-motion: reduce)", () => { build(false); });
    mm.add("(prefers-reduced-motion: no-preference)", () => { build(true); });
    return () => mm.revert();
  }, { scope });

  return (
    <svg ref={scope} viewBox="0 0 380 220" className="w-full max-w-md" role="img"
      aria-label="add(1)(2)(3) shown as a chain of three boxes. Each call captures one argument and returns a function waiting for the next, until the third call meets add's arity of three and the sum computes to 6">
      <text id="code-label" x="15" y="20" opacity="0" className="fill-[var(--color-foreground)] text-[12px] font-mono">
        add(1)(2)(3)
      </text>

      <g id="box1">
        <rect x="10" y="40" width="90" height="90" rx="10" className="fill-[var(--color-muted)] stroke-[var(--color-border)]" />
      </g>
      <g id="chip-a">
        <rect x="20" y="66" width="70" height="26" rx="6" className="fill-[var(--color-primary)] stroke-[var(--color-primary)]" opacity="0.15" />
        <rect x="20" y="66" width="70" height="26" rx="6" className="fill-none stroke-[var(--color-primary)]" />
        <text x="30" y="84" className="fill-[var(--color-foreground)] text-[11px] font-mono">a: 1</text>
      </g>
      <text id="wait-b" x="18" y="115" className="fill-[var(--color-muted-foreground)] text-[9px]">
        waiting for b
      </text>

      <path id="arrow1" d="M 100 85 L 130 85" opacity="0"
        className="stroke-[var(--color-muted-foreground)]" strokeWidth="2" markerEnd="url(#curry-arrowhead)" />
      <text id="call2-code" x="102" y="75" opacity="0" className="fill-[var(--color-muted-foreground)] text-[9px] font-mono">
        (2)
      </text>

      <g id="box2">
        <rect x="130" y="40" width="90" height="90" rx="10" className="fill-[var(--color-muted)] stroke-[var(--color-border)]" />
      </g>
      <g id="chip-a2">
        <rect x="140" y="52" width="70" height="22" rx="6" className="fill-[var(--color-primary)] stroke-[var(--color-primary)]" opacity="0.15" />
        <rect x="140" y="52" width="70" height="22" rx="6" className="fill-none stroke-[var(--color-primary)]" />
        <text x="150" y="68" className="fill-[var(--color-foreground)] text-[10px] font-mono">a: 1</text>
      </g>
      <g id="chip-b">
        <rect x="140" y="80" width="70" height="22" rx="6" className="fill-[var(--color-primary)] stroke-[var(--color-primary)]" opacity="0.15" />
        <rect x="140" y="80" width="70" height="22" rx="6" className="fill-none stroke-[var(--color-primary)]" />
        <text x="150" y="96" className="fill-[var(--color-foreground)] text-[10px] font-mono">b: 2</text>
      </g>
      <text id="wait-c" x="138" y="122" className="fill-[var(--color-muted-foreground)] text-[9px]">
        waiting for c
      </text>

      <path id="arrow2" d="M 220 85 L 250 85" opacity="0"
        className="stroke-[var(--color-muted-foreground)]" strokeWidth="2" markerEnd="url(#curry-arrowhead)" />
      <text id="call3-code" x="222" y="75" opacity="0" className="fill-[var(--color-muted-foreground)] text-[9px] font-mono">
        (3)
      </text>

      <g id="box3">
        <rect x="250" y="40" width="90" height="90" rx="10" className="fill-[var(--color-primary)] stroke-[var(--color-primary)]" opacity="0.12" />
        <rect x="250" y="40" width="90" height="90" rx="10" className="fill-none stroke-[var(--color-primary)]" />
      </g>
      <g id="chip-a3">
        <rect x="258" y="48" width="34" height="20" rx="5" className="fill-none stroke-[var(--color-border)]" />
        <text x="264" y="63" className="fill-[var(--color-muted-foreground)] text-[9px] font-mono">a:1</text>
      </g>
      <g id="chip-b3">
        <rect x="296" y="48" width="34" height="20" rx="5" className="fill-none stroke-[var(--color-border)]" />
        <text x="302" y="63" className="fill-[var(--color-muted-foreground)] text-[9px] font-mono">b:2</text>
      </g>
      <g id="chip-c">
        <rect x="258" y="72" width="34" height="20" rx="5" className="fill-none stroke-[var(--color-border)]" />
        <text x="264" y="87" className="fill-[var(--color-muted-foreground)] text-[9px] font-mono">c:3</text>
      </g>
      <text id="computing" x="264" y="112" opacity="0" className="fill-[var(--color-muted-foreground)] text-[9px]">
        arity met, computing
      </text>

      <path id="arrow3" d="M 340 85 L 355 85" opacity="0"
        className="stroke-[var(--color-primary)]" strokeWidth="2" markerEnd="url(#curry-arrowhead-primary)" />

      <g id="final-result">
        <text x="10" y="170" className="fill-[var(--color-primary)] text-[16px] font-mono">
          a + b + c = 6
        </text>
      </g>

      <defs>
        <marker id="curry-arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" className="fill-[var(--color-muted-foreground)]" />
        </marker>
        <marker id="curry-arrowhead-primary" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" className="fill-[var(--color-primary)]" />
        </marker>
      </defs>
    </svg>
  );
}
