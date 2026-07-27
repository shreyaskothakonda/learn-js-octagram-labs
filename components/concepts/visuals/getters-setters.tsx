"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";

export function GettersSettersVisual({ register }: ConceptVisualProps) {
  const scope = useRef<SVGSVGElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      // Scene: an account object holds a private _age field. Reading obj.age
      // routes through a get box and returns the value. Writing obj.age = -5
      // routes through a set box, fails validation, and the field does not
      // change. Writing obj.age = 30 routes through the same set box, passes
      // validation, and the field updates.
      gsap.set(["#object-box", "#object-label", "#age-label", "#age-chip"], { opacity: 0 });
      gsap.set(["#get-box", "#get-text", "#get-body", "#set-box", "#set-text", "#set-body"], { opacity: 0 });
      gsap.set(["#read-call", "#read-arrow", "#read-result"], { opacity: 0 });
      gsap.set(["#write1-call", "#write1-arrow", "#write1-mark"], { opacity: 0 });
      gsap.set(["#write2-call", "#write2-arrow", "#write2-mark"], { opacity: 0 });
      gsap.set(["#highlight-get", "#highlight-set"], { opacity: 0 });
      gsap.set("#age-chip", { textContent: "25" });

      if (animate) {
        tl.to(["#object-box", "#object-label", "#age-label", "#age-chip"], { opacity: 1, duration: 0.4 })
          .to(["#get-box", "#get-text", "#get-body", "#set-box", "#set-text", "#set-body"], { opacity: 1, duration: 0.3 }, "+=0.15")
          .to(["#read-call", "#read-arrow"], { opacity: 1, duration: 0.3 }, "+=0.25")
          .to("#highlight-get", { opacity: 1, duration: 0.2 })
          .to("#read-result", { opacity: 1, duration: 0.3 })
          .to("#highlight-get", { opacity: 0, duration: 0.3 }, "+=0.25")
          .to(["#write1-call", "#write1-arrow"], { opacity: 1, duration: 0.3 }, "+=0.15")
          .to("#highlight-set", { opacity: 1, duration: 0.2 })
          .to("#write1-mark", { opacity: 1, duration: 0.3 })
          .to("#highlight-set", { opacity: 0, duration: 0.3 }, "+=0.3")
          .to(["#write2-call", "#write2-arrow"], { opacity: 1, duration: 0.3 }, "+=0.15")
          .to("#highlight-set", { opacity: 1, duration: 0.2 })
          .to("#write2-mark", { opacity: 1, duration: 0.3 })
          .to("#age-chip", { textContent: "30", duration: 0.2, snap: { textContent: 1 } }, "<")
          .to("#highlight-set", { opacity: 0, duration: 0.3 }, "+=0.3");
      } else {
        // reduced motion: jump to labeled end-state
        tl.set(
          [
            "#object-box", "#object-label", "#age-label", "#age-chip", "#get-box", "#get-text", "#get-body",
            "#set-box", "#set-text", "#set-body", "#read-call", "#read-arrow", "#read-result",
            "#write1-call", "#write1-arrow", "#write1-mark", "#write2-call", "#write2-arrow", "#write2-mark",
          ],
          { opacity: 1 },
        )
          .set("#age-chip", { textContent: "30" });
      }
      register(tl);
      return tl;
    };
    mm.add("(prefers-reduced-motion: reduce)", () => { build(false); });
    mm.add("(prefers-reduced-motion: no-preference)", () => { build(true); });
    return () => mm.revert();
  }, { scope });

  return (
    <svg ref={scope} viewBox="0 0 360 300" className="w-full max-w-md" role="img"
      aria-label="Reading obj.age runs a getter that returns _age. Assigning obj.age = -5 runs a setter that rejects the value. Assigning obj.age = 30 runs the setter, passes validation, and updates _age"
    >
      <rect id="object-box" x="90" y="10" width="180" height="55" rx="10"
        className="fill-[var(--color-muted)] stroke-[var(--color-border)]" opacity="0" />
      <text id="object-label" x="100" y="30" className="fill-[var(--color-muted-foreground)] text-[11px]" opacity="0">
        account
      </text>
      <text id="age-label" x="100" y="52" className="fill-[var(--color-foreground)] text-[11px]" opacity="0">
        _age:
      </text>
      <text id="age-chip" x="140" y="52" className="fill-[var(--color-foreground)] text-[11px]" opacity="0">
        25
      </text>

      <rect id="get-box" x="15" y="90" width="150" height="55" rx="10"
        className="fill-[var(--color-muted)] stroke-[var(--color-border)]" opacity="0" />
      <text id="get-text" x="25" y="110" className="fill-[var(--color-foreground)] text-[10px]" opacity="0">
        get age()
      </text>
      <text id="get-body" x="25" y="131" className="fill-[var(--color-muted-foreground)] text-[10px]" opacity="0">
        return this._age
      </text>
      <rect id="highlight-get" x="15" y="90" width="150" height="55" rx="10"
        className="fill-none stroke-[var(--color-primary)]" strokeWidth="3" opacity="0" />

      <rect id="set-box" x="195" y="90" width="150" height="55" rx="10"
        className="fill-[var(--color-muted)] stroke-[var(--color-border)]" opacity="0" />
      <text id="set-text" x="205" y="110" className="fill-[var(--color-foreground)] text-[10px]" opacity="0">
        set age(v)
      </text>
      <text id="set-body" x="205" y="131" className="fill-[var(--color-muted-foreground)] text-[10px]" opacity="0">
        if (v &lt; 0) reject
      </text>
      <rect id="highlight-set" x="195" y="90" width="150" height="55" rx="10"
        className="fill-none stroke-[var(--color-primary)]" strokeWidth="3" opacity="0" />

      <text id="read-call" x="15" y="188" className="fill-[var(--color-foreground)] text-[10px]" opacity="0">
        obj.age
      </text>
      <line id="read-arrow" x1="55" y1="182" x2="80" y2="148" className="stroke-[var(--color-muted-foreground)]"
        strokeWidth="2" opacity="0" />
      <text id="read-result" x="135" y="188" className="fill-[var(--color-primary)] text-[10px]" opacity="0">
        returns 25
      </text>

      <text id="write1-call" x="15" y="222" className="fill-[var(--color-foreground)] text-[10px]" opacity="0">
        obj.age = -5
      </text>
      <line id="write1-arrow" x1="75" y1="216" x2="255" y2="150" className="stroke-[var(--color-muted-foreground)]"
        strokeWidth="2" opacity="0" />
      <text id="write1-mark" x="135" y="222" className="fill-[var(--color-destructive)] text-[10px]" opacity="0">
        rejected, _age unchanged
      </text>

      <text id="write2-call" x="15" y="256" className="fill-[var(--color-foreground)] text-[10px]" opacity="0">
        obj.age = 30
      </text>
      <line id="write2-arrow" x1="80" y1="250" x2="255" y2="150" className="stroke-[var(--color-muted-foreground)]"
        strokeWidth="2" opacity="0" />
      <text id="write2-mark" x="135" y="256" className="fill-[var(--color-primary)] text-[10px]" opacity="0">
        accepted, _age updates
      </text>
    </svg>
  );
}
