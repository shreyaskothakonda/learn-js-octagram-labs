"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";

export function CallApplyBindVisual({ register }: ConceptVisualProps) {
  const scope = useRef<SVGSVGElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      // Scene: the same greet function invoked three ways. call and apply both
      // point this at an object and run immediately, producing a result right
      // away. bind does not run anything, it returns a brand new pre-bound
      // function, which is called later on its own line.
      gsap.set(["#greet-fn"], { opacity: 0 });

      gsap.set(["#call-code", "#call-this-arrow", "#call-this-label", "#call-obj", "#call-result"], { opacity: 0 });
      gsap.set(["#apply-code", "#apply-this-arrow", "#apply-obj", "#apply-result"], { opacity: 0 });
      gsap.set(["#bind-code", "#bind-this-arrow", "#bind-obj"], { opacity: 0 });
      gsap.set("#bound-fn", { opacity: 0, x: 0 });
      gsap.set(["#bind-call-code", "#bind-call-arrow", "#bind-result"], { opacity: 0 });

      if (animate) {
        tl.to("#greet-fn", { opacity: 1, duration: 0.3 })
          .to("#call-code", { opacity: 1, duration: 0.3 }, "+=0.15")
          .to(["#call-obj", "#call-this-arrow", "#call-this-label"], { opacity: 1, duration: 0.3 }, "+=0.15")
          .to("#call-result", { opacity: 1, duration: 0.3 }, "+=0.2")
          .to("#apply-code", { opacity: 1, duration: 0.3 }, "+=0.35")
          .to(["#apply-obj", "#apply-this-arrow"], { opacity: 1, duration: 0.3 }, "+=0.15")
          .to("#apply-result", { opacity: 1, duration: 0.3 }, "+=0.2")
          .to("#bind-code", { opacity: 1, duration: 0.3 }, "+=0.35")
          .to(["#bind-obj", "#bind-this-arrow"], { opacity: 1, duration: 0.3 }, "+=0.15")
          .to("#bound-fn", { opacity: 1, duration: 0.3 }, "+=0.2")
          .to("#bound-fn", { x: 60, duration: 0.6, ease: "power2.inOut" }, "+=0.15")
          .to("#bind-call-code", { opacity: 1, duration: 0.3 }, "+=0.3")
          .to("#bind-call-arrow", { opacity: 1, duration: 0.2 }, "<")
          .to("#bind-result", { opacity: 1, duration: 0.3 }, "+=0.2");
      } else {
        // reduced motion: jump to labeled end-state
        tl.set("#greet-fn", { opacity: 1 })
          .set(["#call-code", "#call-this-arrow", "#call-this-label", "#call-obj", "#call-result"], { opacity: 1 })
          .set(["#apply-code", "#apply-this-arrow", "#apply-obj", "#apply-result"], { opacity: 1 })
          .set(["#bind-code", "#bind-this-arrow", "#bind-obj"], { opacity: 1 })
          .set("#bound-fn", { opacity: 1, x: 60 })
          .set(["#bind-call-code", "#bind-call-arrow", "#bind-result"], { opacity: 1 });
      }
      register(tl);
      return tl;
    };
    mm.add("(prefers-reduced-motion: reduce)", () => { build(false); });
    mm.add("(prefers-reduced-motion: no-preference)", () => { build(true); });
    return () => mm.revert();
  }, { scope });

  return (
    <svg ref={scope} viewBox="0 0 380 260" className="w-full max-w-md" role="img"
      aria-label="The same greet function is invoked three ways. greet.call and greet.apply both point this at an object and run immediately. greet.bind does not run anything, it returns a new pre-bound function, which is called later on its own">
      <g id="greet-fn">
        <rect x="10" y="10" width="90" height="30" rx="8" className="fill-[var(--color-muted)] stroke-[var(--color-border)]" />
        <text x="20" y="30" className="fill-[var(--color-foreground)] text-[11px] font-mono">greet(){"{}"}</text>
      </g>

      <text id="call-code" x="10" y="72" opacity="0" className="fill-[var(--color-foreground)] text-[11px] font-mono">
        greet.call(ada)
      </text>
      <g id="call-obj">
        <rect x="150" y="58" width="60" height="26" rx="6" className="fill-[var(--color-primary)] stroke-[var(--color-primary)]" opacity="0.15" />
        <rect x="150" y="58" width="60" height="26" rx="6" className="fill-none stroke-[var(--color-primary)]" />
        <text x="160" y="76" className="fill-[var(--color-foreground)] text-[10px] font-mono">ada</text>
      </g>
      <path id="call-this-arrow" d="M 110 62 Q 130 40 148 62" opacity="0" fill="none"
        className="stroke-[var(--color-primary)]" strokeWidth="2" markerEnd="url(#cab-arrowhead)" />
      <text id="call-this-label" x="112" y="42" opacity="0" className="fill-[var(--color-muted-foreground)] text-[9px]">this</text>
      <text id="call-result" x="225" y="76" opacity="0" className="fill-[var(--color-primary)] text-[11px] font-mono">
        &quot;Hi, Ada&quot; (runs now)
      </text>

      <text id="apply-code" x="10" y="112" opacity="0" className="fill-[var(--color-foreground)] text-[11px] font-mono">
        greet.apply(grace, [])
      </text>
      <g id="apply-obj">
        <rect x="150" y="98" width="60" height="26" rx="6" className="fill-[var(--color-primary)] stroke-[var(--color-primary)]" opacity="0.15" />
        <rect x="150" y="98" width="60" height="26" rx="6" className="fill-none stroke-[var(--color-primary)]" />
        <text x="158" y="116" className="fill-[var(--color-foreground)] text-[10px] font-mono">grace</text>
      </g>
      <path id="apply-this-arrow" d="M 110 102 Q 130 80 148 102" opacity="0" fill="none"
        className="stroke-[var(--color-primary)]" strokeWidth="2" markerEnd="url(#cab-arrowhead)" />
      <text id="apply-result" x="225" y="116" opacity="0" className="fill-[var(--color-primary)] text-[11px] font-mono">
        &quot;Hi, Grace&quot; (runs now)
      </text>

      <line x1="0" y1="140" x2="380" y2="140" className="stroke-[var(--color-border)]" />

      <text id="bind-code" x="10" y="168" opacity="0" className="fill-[var(--color-foreground)] text-[11px] font-mono">
        greet.bind(alan)
      </text>
      <g id="bind-obj">
        <rect x="150" y="154" width="60" height="26" rx="6" className="fill-[var(--color-secondary)] stroke-[var(--color-secondary)]" opacity="0.2" />
        <rect x="150" y="154" width="60" height="26" rx="6" className="fill-none stroke-[var(--color-secondary)]" />
        <text x="158" y="172" className="fill-[var(--color-foreground)] text-[10px] font-mono">alan</text>
      </g>
      <path id="bind-this-arrow" d="M 110 158 Q 130 136 148 158" opacity="0" fill="none"
        className="stroke-[var(--color-secondary)]" strokeWidth="2" markerEnd="url(#cab-arrowhead-secondary)" />

      <g id="bound-fn">
        <rect x="10" y="188" width="150" height="30" rx="8" className="fill-[var(--color-secondary)] stroke-[var(--color-secondary)]" opacity="0.2" />
        <rect x="10" y="188" width="150" height="30" rx="8" className="fill-none stroke-[var(--color-secondary)]" />
        <text x="18" y="207" className="fill-[var(--color-foreground)] text-[10px] font-mono">boundGreet (pre-bound)</text>
      </g>

      <text id="bind-call-code" x="240" y="230" opacity="0" className="fill-[var(--color-foreground)] text-[11px] font-mono">
        boundGreet()
      </text>
      <path id="bind-call-arrow" d="M 220 208 Q 235 218 238 226" opacity="0" fill="none"
        className="stroke-[var(--color-secondary)]" strokeWidth="2" markerEnd="url(#cab-arrowhead-secondary)" />
      <text id="bind-result" x="240" y="248" opacity="0" className="fill-[var(--color-secondary)] text-[11px] font-mono">
        &quot;Hi, Alan&quot; (runs later)
      </text>

      <defs>
        <marker id="cab-arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" className="fill-[var(--color-primary)]" />
        </marker>
        <marker id="cab-arrowhead-secondary" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" className="fill-[var(--color-secondary)]" />
        </marker>
      </defs>
    </svg>
  );
}
