"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";
import { Stage, Frame, Chip, Eyebrow, enter, pop, focusOn, focusOff } from "./kit";

// Inserting "cat" builds a path root -> c -> a -> t. Inserting "car" reuses
// the shared c and a nodes and only branches off a new node at r. A prefix
// lookup for "ca" then walks the shared root -> c -> a path and finds it.
export function TriesVisual({ register }: ConceptVisualProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      gsap.set(["#tr-c", "#tr-a", "#tr-t", "#tr-r"], { opacity: 0, y: 12 });
      gsap.set(["#tr-edge-rc", "#tr-edge-ca", "#tr-edge-at", "#tr-edge-ar"], { opacity: 0 });
      gsap.set(["#tr-end-cat", "#tr-end-car", "#tr-lookup", "#tr-found"], { opacity: 0, scale: 0.8 });
      gsap.set(".glow", { opacity: 0 });

      if (animate) {
        // insert "cat": walk from the root, creating c, then a, then t
        focusOn(tl, "#tr-root", "+=0.2");
        enter(tl, "#tr-c", "+=0.15");
        tl.to("#tr-edge-rc", { opacity: 1, duration: 0.3, ease: "power2.out" }, "<");
        focusOff(tl, "#tr-root", "<");
        focusOn(tl, "#tr-c", "+=0.1");

        enter(tl, "#tr-a", "+=0.2");
        tl.to("#tr-edge-ca", { opacity: 1, duration: 0.3, ease: "power2.out" }, "<");
        focusOff(tl, "#tr-c", "<");
        focusOn(tl, "#tr-a", "+=0.1");

        enter(tl, "#tr-t", "+=0.2");
        tl.to("#tr-edge-at", { opacity: 1, duration: 0.3, ease: "power2.out" }, "<");
        focusOff(tl, "#tr-a", "<");
        focusOn(tl, "#tr-t", "+=0.1");
        pop(tl, "#tr-end-cat", "+=0.1");
        focusOff(tl, "#tr-t", "+=0.3");

        // insert "car": reuse the shared c and a nodes, branch a new node at r
        focusOn(tl, "#tr-root", "+=0.2");
        focusOff(tl, "#tr-root", "<");
        focusOn(tl, "#tr-c", "+=0.1");
        focusOff(tl, "#tr-c", "<");
        focusOn(tl, "#tr-a", "+=0.1");
        focusOff(tl, "#tr-a", "+=0.15");

        enter(tl, "#tr-r", "<");
        tl.to("#tr-edge-ar", { opacity: 1, duration: 0.3, ease: "power2.out" }, "<");
        focusOn(tl, "#tr-r", "+=0.1");
        pop(tl, "#tr-end-car", "+=0.1");
        focusOff(tl, "#tr-r", "+=0.3");

        // prefix lookup for "ca": walk the shared root -> c -> a path
        pop(tl, "#tr-lookup", "+=0.2");
        focusOn(tl, "#tr-root", "+=0.1");
        focusOff(tl, "#tr-root", "<");
        focusOn(tl, "#tr-c", "+=0.1");
        focusOff(tl, "#tr-c", "<");
        focusOn(tl, "#tr-a", "+=0.1");
        pop(tl, "#tr-found", "+=0.1");
      } else {
        tl.set(["#tr-c", "#tr-a", "#tr-t", "#tr-r"], { opacity: 1, y: 0 })
          .set(["#tr-edge-rc", "#tr-edge-ca", "#tr-edge-at", "#tr-edge-ar"], { opacity: 1 })
          .set(["#tr-end-cat", "#tr-end-car", "#tr-lookup", "#tr-found"], { opacity: 1, scale: 1 })
          .set("#tr-a .glow", { opacity: 1 })
          .set("#tr-a", { scale: 1.03 });
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
      height={320}
      label="A trie built from the words cat and car. Inserting cat creates a path from the root through c, a, and t, marked as the end of a word. Inserting car walks the same root, c, and a nodes and branches off only at r, also marked as the end of a word. A prefix lookup for ca then walks the shared root, c, a path and finds it, ending with the a node lit as the matched prefix."
    >
      <svg className="pointer-events-none absolute inset-0" width={400} height={260}>
        <line id="tr-edge-rc" x1={200} y1={46} x2={200} y2={80} className="stroke-[var(--color-border)]" strokeWidth={2} />
        <line id="tr-edge-ca" x1={200} y1={116} x2={200} y2={150} className="stroke-[var(--color-border)]" strokeWidth={2} />
        <line id="tr-edge-at" x1={195} y1={186} x2={130} y2={220} className="stroke-[var(--color-border)]" strokeWidth={2} />
        <line id="tr-edge-ar" x1={205} y1={186} x2={270} y2={220} className="stroke-[var(--color-border)]" strokeWidth={2} />
      </svg>

      <Frame id="tr-root" style={{ left: 180, top: 10, width: 40, height: 36 }}>
        {"•"}
      </Frame>
      <Frame id="tr-c" style={{ left: 180, top: 80, width: 40, height: 36 }}>c</Frame>
      <Frame id="tr-a" style={{ left: 180, top: 150, width: 40, height: 36 }}>a</Frame>
      <Frame id="tr-t" style={{ left: 110, top: 220, width: 40, height: 36 }}>t</Frame>
      <Frame id="tr-r" style={{ left: 250, top: 220, width: 40, height: 36 }}>r</Frame>

      <Chip id="tr-end-cat" style={{ left: 95, top: 262, width: 70, height: 26 }}>cat</Chip>
      <Chip id="tr-end-car" style={{ left: 235, top: 262, width: 70, height: 26 }}>car</Chip>

      <Eyebrow id="tr-lookup" style={{ left: 260, top: 12 }}>
        Lookup: ca
      </Eyebrow>
      <Chip id="tr-found" style={{ left: 240, top: 155, width: 90, height: 26 }}>prefix found</Chip>
    </Stage>
  );
}
