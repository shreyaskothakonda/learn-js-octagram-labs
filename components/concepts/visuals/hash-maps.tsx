"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";
import { Stage, Panel, Frame, Chip, Eyebrow, enter, exit, pop, focusOn, focusOff, travel } from "./kit";

// Three keys travel through a hash function and settle into indexed buckets:
// cat and bat both hash into bucket 1 and chain together as a collision, dog
// settles alone in bucket 0. A lookup then travels through the same hash
// function and jumps straight down to bucket 0, skipping the others entirely.
export function HashMapsVisual({ register }: ConceptVisualProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      gsap.set(["#hm-key-cat", "#hm-key-dog", "#hm-key-bat"], { opacity: 0, y: 12 });
      gsap.set("#hm-query", { opacity: 0, y: 12 });
      gsap.set("#hm-out", { opacity: 0, scale: 0.8 });
      gsap.set(".glow", { opacity: 0 });

      if (animate) {
        enter(tl, "#hm-key-cat, #hm-key-dog, #hm-key-bat");

        // cat -> hash(key) -> bucket 1 (first entry)
        travel(tl, "#hm-key-cat", { x: 117, y: 51 }, "+=0.2");
        focusOn(tl, "#hm-fn", "<");
        travel(tl, "#hm-key-cat", { x: 110, y: 134 }, "+=0.3");
        focusOff(tl, "#hm-fn", "<");

        // dog -> hash(key) -> bucket 0
        travel(tl, "#hm-key-dog", { x: -3, y: 51 }, "+=0.2");
        focusOn(tl, "#hm-fn", "<");
        travel(tl, "#hm-key-dog", { x: -138, y: 128 }, "+=0.3");
        focusOff(tl, "#hm-fn", "<");

        // bat -> hash(key) -> bucket 1 too: a collision, chained under cat
        travel(tl, "#hm-key-bat", { x: -123, y: 51 }, "+=0.2");
        focusOn(tl, "#hm-fn", "<");
        travel(tl, "#hm-key-bat", { x: -130, y: 172 }, "+=0.3");
        focusOff(tl, "#hm-fn", "<");
        focusOn(tl, "#hm-key-cat", "+=0.1");
        focusOn(tl, "#hm-key-bat", "<");
        focusOff(tl, "#hm-key-cat", "+=0.5");
        focusOff(tl, "#hm-key-bat", "<");

        // lookup: get("dog") jumps straight to bucket 0
        enter(tl, "#hm-query", "+=0.2");
        travel(tl, "#hm-query", { x: -20, y: 51 }, "+=0.2");
        focusOn(tl, "#hm-fn", "<");
        travel(tl, "#hm-query", { x: -70, y: 88 }, "+=0.3");
        focusOff(tl, "#hm-fn", "<");
        exit(tl, "#hm-query", "-=0.1");
        focusOn(tl, "#hm-key-dog", "-=0.1");
        pop(tl, "#hm-out", "+=0.15");
      } else {
        tl.set("#hm-key-cat", { opacity: 1, x: 110, y: 134 })
          .set("#hm-key-bat", { opacity: 1, x: -130, y: 172 })
          .set("#hm-key-dog", { opacity: 1, x: -138, y: 128 })
          .set("#hm-query", { opacity: 0 })
          .set("#hm-key-dog .glow", { opacity: 1 })
          .set("#hm-key-dog", { scale: 1.03 })
          .set("#hm-out", { opacity: 1, scale: 1 });
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
      height={300}
      label="Keys cat, dog, and bat each travel through a hash function and land in an indexed bucket below: cat and bat both hash into bucket 1, chaining together as a collision, while dog lands alone in bucket 0. A lookup for dog then travels through the same hash function and jumps straight down to bucket 0, skipping the other buckets, and returns dog's value."
    >
      <Chip id="hm-key-cat" style={{ left: 55, top: 6, width: 56, height: 32 }}>cat</Chip>
      <Chip id="hm-key-dog" style={{ left: 175, top: 6, width: 56, height: 32 }}>dog</Chip>
      <Chip id="hm-key-bat" style={{ left: 295, top: 6, width: 56, height: 32 }}>bat</Chip>
      <Chip id="hm-query" style={{ left: 175, top: 6, width: 90, height: 32 }}>get(&quot;dog&quot;)</Chip>

      <Frame id="hm-fn" style={{ left: 140, top: 56, width: 120, height: 34 }}>hash(key)</Frame>

      <Panel label="Bucket 0" style={{ left: 10, top: 110, width: 110, height: 150 }} />
      <Panel label="Bucket 1" style={{ left: 145, top: 110, width: 110, height: 150 }} />
      <Panel label="Bucket 2" style={{ left: 280, top: 110, width: 110, height: 150 }} />

      <div className="absolute flex items-center gap-2" style={{ left: 10, top: 272 }}>
        <Eyebrow>Lookup result</Eyebrow>
        <Chip id="hm-out" className="h-6 w-16 px-0">dog: 4</Chip>
      </div>
    </Stage>
  );
}
