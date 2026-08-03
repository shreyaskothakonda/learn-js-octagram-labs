"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";
import { Stage, Frame, Eyebrow, enter, pop, focusOn, focusOff } from "./kit";

// Updating state.user.address.city copies every level on the path: state,
// user, address, and city all get fresh, highlighted frames on the right.
// items never changes, so it keeps a single shared box on the left, tied to
// the new tree by a thin connector instead of being copied.
export function ImmutableUpdatePatternsVisual({ register }: ConceptVisualProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      gsap.set(["#im-title", "#im-before-label", "#im-after-label"], { opacity: 0, y: 12 });
      gsap.set(["#im-state0", "#im-user0", "#im-address0", "#im-city0"], { opacity: 0, y: 12 });
      gsap.set("#im-items0", { opacity: 0, y: 12 });
      gsap.set(["#im-state1", "#im-user1", "#im-address1", "#im-city1"], { opacity: 0, scale: 0.8 });
      gsap.set(["#im-connector", "#im-shared-note"], { opacity: 0 });
      gsap.set(".glow", { opacity: 0 });

      if (animate) {
        enter(tl, "#im-title");
        enter(tl, "#im-before-label", "+=0.1");
        enter(tl, ["#im-state0", "#im-user0", "#im-address0", "#im-city0", "#im-items0"], "+=0.05", 0.08);

        // update the path: state, user, address, city all get new copies
        enter(tl, "#im-after-label", "+=0.3");
        pop(tl, "#im-state1", "+=0.1");
        focusOn(tl, "#im-state1", "<");
        pop(tl, "#im-user1", "+=0.15");
        focusOn(tl, "#im-user1", "<");
        pop(tl, "#im-address1", "+=0.15");
        focusOn(tl, "#im-address1", "<");
        pop(tl, "#im-city1", "+=0.15");
        focusOn(tl, "#im-city1", "<");

        // the old path dims, superseded by the new copies
        tl.to("#im-state0, #im-user0, #im-address0, #im-city0", { opacity: 0.4, duration: 0.3 }, "+=0.2");
        focusOff(tl, "#im-state1", "<");
        focusOff(tl, "#im-user1", "<");
        focusOff(tl, "#im-address1", "<");
        focusOff(tl, "#im-city1", "<");

        // items was never touched: same box, shared by both trees
        focusOn(tl, "#im-items0", "+=0.2");
        tl.to("#im-connector", { opacity: 1, duration: 0.25 }, "<")
          .to("#im-shared-note", { opacity: 1, duration: 0.25 }, "<");
        focusOff(tl, "#im-items0", "+=0.4");
      } else {
        tl.set(["#im-title", "#im-before-label", "#im-after-label", "#im-connector", "#im-shared-note"], { opacity: 1, y: 0 })
          .set(["#im-state0", "#im-user0", "#im-address0", "#im-city0"], { opacity: 0.4, y: 0 })
          .set("#im-items0", { opacity: 1, y: 0 })
          .set(["#im-state1", "#im-user1", "#im-address1", "#im-city1"], { opacity: 1, scale: 1 });
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
      height={310}
      label="Updating state.user.address.city. On the left, the original tree: state, user, address, and city NYC, plus a sibling items array. On the right, the new tree after the update: new copies of state, user, address, and city Boston, each highlighted. The old state, user, address, and city dim, superseded by their new copies. The items box is never copied: a connector line shows the new state still points at that same original items array, shared between both trees."
    >
      <Eyebrow id="im-title" style={{ left: 16, top: 0, width: 368 }}>
        Updating state.user.address.city
      </Eyebrow>
      <Eyebrow id="im-before-label" style={{ left: 16, top: 22 }}>Before</Eyebrow>
      <Eyebrow id="im-after-label" style={{ left: 216, top: 22 }}>After</Eyebrow>

      <Frame id="im-state0" style={{ left: 16, top: 46, width: 150, height: 36 }}>state</Frame>
      <Frame id="im-user0" style={{ left: 36, top: 96, width: 150, height: 36 }}>user</Frame>
      <Frame id="im-address0" style={{ left: 56, top: 146, width: 150, height: 36 }}>address</Frame>
      <Frame id="im-city0" style={{ left: 76, top: 196, width: 150, height: 36 }}>
        city: &quot;NYC&quot;
      </Frame>
      <Frame id="im-items0" className="!bg-green-500/5 !border-green-600 !text-green-600" style={{ left: 36, top: 246, width: 150, height: 36 }}>
        items (array)
      </Frame>

      <Frame id="im-state1" className="!border-[var(--color-primary)] !bg-[var(--color-primary)]/5" style={{ left: 216, top: 46, width: 150, height: 36 }}>
        state&apos;
      </Frame>
      <Frame id="im-user1" className="!border-[var(--color-primary)] !bg-[var(--color-primary)]/5" style={{ left: 236, top: 96, width: 150, height: 36 }}>
        user&apos;
      </Frame>
      <Frame id="im-address1" className="!border-[var(--color-primary)] !bg-[var(--color-primary)]/5" style={{ left: 256, top: 146, width: 150, height: 36 }}>
        address&apos;
      </Frame>
      <Frame id="im-city1" className="!border-[var(--color-primary)] !bg-[var(--color-primary)]/5" style={{ left: 276, top: 196, width: 150, height: 36 }}>
        city: &quot;Boston&quot;
      </Frame>

      <div id="im-connector" className="absolute bg-border" style={{ left: 186, top: 263, width: 50, height: 2 }} />
      <Eyebrow id="im-shared-note" className="!text-green-600" style={{ left: 190, top: 270, width: 200 }}>
        items: same array (not copied)
      </Eyebrow>
    </Stage>
  );
}
