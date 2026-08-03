"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";
import { Stage, Panel, Frame, Chip, Eyebrow, enter, exit, pop, focusOn, focusOff, travel } from "./kit";

// A small graph: A connects to B and C, both B and C connect to D, and D
// connects to E. BFS from A fills and drains a queue panel, visiting nodes
// level by level (A, B, C, D, E); a second chip row then contrasts the DFS
// order (A, B, D, C, E), which dives down B's branch before backtracking.
export function GraphTraversalVisual({ register }: ConceptVisualProps) {
  const scope = useRef<HTMLDivElement>(null);
  const slot0 = 40;
  const slot1 = 110;

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const nodeIds = ["#gr-a", "#gr-b", "#gr-c", "#gr-d", "#gr-e"];
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      gsap.set(nodeIds, { opacity: 0, y: 12 });
      gsap.set("#gr-edges", { opacity: 0 });
      gsap.set(["#gq-a", "#gq-b", "#gq-c", "#gq-d", "#gq-e"], { opacity: 0, y: 12 });
      gsap.set(["#bfs-0", "#bfs-1", "#bfs-2", "#bfs-3", "#bfs-4"], { opacity: 0, scale: 0.8 });
      gsap.set(["#dfs-0", "#dfs-1", "#dfs-2", "#dfs-3", "#dfs-4"], { opacity: 0, scale: 0.8 });
      gsap.set(".glow", { opacity: 0 });

      if (animate) {
        enter(tl, nodeIds.join(", "));
        tl.to("#gr-edges", { opacity: 1, duration: 0.3, ease: "power2.out" }, "-=0.15");

        // enqueue A, then visit it: dequeue A, enqueue its neighbors B and C
        enter(tl, "#gq-a", "+=0.2");
        focusOn(tl, "#gr-a", "+=0.1");
        exit(tl, "#gq-a", "+=0.2");
        pop(tl, "#bfs-0", "<");
        enter(tl, "#gq-b", "<");
        enter(tl, "#gq-c", "<");

        // visit B: dequeue B, enqueue its unvisited neighbor D
        focusOff(tl, "#gr-a", "+=0.3");
        focusOn(tl, "#gr-b", "<");
        exit(tl, "#gq-b", "+=0.2");
        travel(tl, "#gq-c", { x: -(slot1 - slot0) }, "<");
        pop(tl, "#bfs-1", "<");
        enter(tl, "#gq-d", "+=0.05");

        // visit C: dequeue C, D already queued so nothing new is enqueued
        focusOff(tl, "#gr-b", "+=0.3");
        focusOn(tl, "#gr-c", "<");
        exit(tl, "#gq-c", "+=0.2");
        travel(tl, "#gq-d", { x: -(slot1 - slot0) }, "<");
        pop(tl, "#bfs-2", "<");

        // visit D: dequeue D, enqueue its unvisited neighbor E
        focusOff(tl, "#gr-c", "+=0.3");
        focusOn(tl, "#gr-d", "<");
        exit(tl, "#gq-d", "+=0.2");
        pop(tl, "#bfs-3", "<");
        enter(tl, "#gq-e", "+=0.05");

        // visit E: dequeue E, queue is now empty
        focusOff(tl, "#gr-d", "+=0.3");
        focusOn(tl, "#gr-e", "<");
        exit(tl, "#gq-e", "+=0.2");
        pop(tl, "#bfs-4", "<");

        // contrast: reveal the DFS order as a second chip row
        pop(tl, "#dfs-0, #dfs-1, #dfs-2, #dfs-3, #dfs-4", "+=0.3");
      } else {
        tl.set(nodeIds, { opacity: 1, y: 0 })
          .set("#gr-edges", { opacity: 1 })
          .set(["#gq-a", "#gq-b", "#gq-c", "#gq-d", "#gq-e"], { opacity: 0 })
          .set(["#bfs-0", "#bfs-1", "#bfs-2", "#bfs-3", "#bfs-4", "#dfs-0", "#dfs-1", "#dfs-2", "#dfs-3", "#dfs-4"], {
            opacity: 1,
            scale: 1,
          })
          .set("#gr-e .glow", { opacity: 1 })
          .set("#gr-e", { scale: 1.03 });
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
      height={480}
      label="A graph where A connects to B and C, B and C both connect to D, and D connects to E. A breadth-first search from A fills and drains a queue panel, visiting A, then B and C, then D, then E, one level at a time, building a BFS order row of A, B, C, D, E. A DFS order row then appears beside it for contrast, reading A, B, D, C, E, since depth-first search dives down B's branch to D before backtracking to visit C."
    >
      <svg id="gr-edges" className="pointer-events-none absolute inset-0" width={400} height={290}>
        <line x1={195} y1={50} x2={110} y2={90} className="stroke-[var(--color-border)]" strokeWidth={2} />
        <line x1={220} y1={50} x2={290} y2={90} className="stroke-[var(--color-border)]" strokeWidth={2} />
        <line x1={100} y1={130} x2={185} y2={170} className="stroke-[var(--color-border)]" strokeWidth={2} />
        <line x1={300} y1={130} x2={210} y2={170} className="stroke-[var(--color-border)]" strokeWidth={2} />
        <line x1={195} y1={210} x2={195} y2={250} className="stroke-[var(--color-border)]" strokeWidth={2} />
      </svg>

      <Frame id="gr-a" style={{ left: 170, top: 10, width: 50, height: 40 }}>A</Frame>
      <Frame id="gr-b" style={{ left: 70, top: 90, width: 50, height: 40 }}>B</Frame>
      <Frame id="gr-c" style={{ left: 270, top: 90, width: 50, height: 40 }}>C</Frame>
      <Frame id="gr-d" style={{ left: 170, top: 170, width: 50, height: 40 }}>D</Frame>
      <Frame id="gr-e" style={{ left: 170, top: 250, width: 50, height: 40 }}>E</Frame>

      <Panel label="Queue" style={{ left: 20, top: 300, width: 200, height: 50 }} />
      <Chip id="gq-a" style={{ left: slot0, top: 316, width: 50, height: 26 }}>A</Chip>
      <Chip id="gq-b" style={{ left: slot0, top: 316, width: 50, height: 26 }}>B</Chip>
      <Chip id="gq-c" style={{ left: slot1, top: 316, width: 50, height: 26 }}>C</Chip>
      <Chip id="gq-d" style={{ left: slot1, top: 316, width: 50, height: 26 }}>D</Chip>
      <Chip id="gq-e" style={{ left: slot0, top: 316, width: 50, height: 26 }}>E</Chip>

      <Eyebrow style={{ left: 20, top: 364 }}>BFS order</Eyebrow>
      <Chip id="bfs-0" style={{ left: 20, top: 382, width: 50, height: 30 }}>A</Chip>
      <Chip id="bfs-1" style={{ left: 80, top: 382, width: 50, height: 30 }}>B</Chip>
      <Chip id="bfs-2" style={{ left: 140, top: 382, width: 50, height: 30 }}>C</Chip>
      <Chip id="bfs-3" style={{ left: 200, top: 382, width: 50, height: 30 }}>D</Chip>
      <Chip id="bfs-4" style={{ left: 260, top: 382, width: 50, height: 30 }}>E</Chip>

      <Eyebrow style={{ left: 20, top: 420 }}>DFS order</Eyebrow>
      <Chip id="dfs-0" style={{ left: 20, top: 438, width: 50, height: 30 }}>A</Chip>
      <Chip id="dfs-1" style={{ left: 80, top: 438, width: 50, height: 30 }}>B</Chip>
      <Chip id="dfs-2" style={{ left: 140, top: 438, width: 50, height: 30 }}>D</Chip>
      <Chip id="dfs-3" style={{ left: 200, top: 438, width: 50, height: 30 }}>C</Chip>
      <Chip id="dfs-4" style={{ left: 260, top: 438, width: 50, height: 30 }}>E</Chip>
    </Stage>
  );
}
