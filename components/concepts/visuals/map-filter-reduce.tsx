"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";
import { Stage, Frame, Chip, CodeLine, enter, focusOn, focusOff, travel } from "./kit";

const NUMS = [2, 5, 8, 3, 6];
const MAPPED = NUMS.map((n) => n * 2); // [4, 10, 16, 6, 12]
const KEEP_ABOVE = 8;
const SURVIVOR_INDEXES = MAPPED.reduce<number[]>((acc, v, i) => (v > KEEP_ABOVE ? [...acc, i] : acc), []); // [1, 2, 4]
const DROPPED_INDEXES = MAPPED.map((_, i) => i).filter((i) => !SURVIVOR_INDEXES.includes(i)); // [0, 3]
const TOTAL = SURVIVOR_INDEXES.reduce((sum, i) => sum + MAPPED[i], 0); // 38

const ROW_X = [16, 84, 152, 220, 288];
const ROW3_X = [122, 190, 258];
const ROW1_Y = 40;
const ROW2_Y = 118;
const ROW3_Y = 206;
const ACC_FRAME = { left: 130, top: 284, width: 140, height: 44 };
const ACC_CENTER_X = ACC_FRAME.left + ACC_FRAME.width / 2;
const ACC_CENTER_Y = ACC_FRAME.top + ACC_FRAME.height / 2;

// A row of chips is mapped into doubled values in place (each chip morphs,
// counting up to its new value), filter dims the values at or below the
// threshold and compacts the survivors, and reduce folds them one at a time
// into a single accumulator, with the focus lighting the running total.
export function MapFilterReduceVisual({ register }: ConceptVisualProps) {
  const scope = useRef<HTMLDivElement>(null);
  const nIds = NUMS.map((_, i) => `#n${i}`);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      gsap.set(["#src-code", "#map-code", "#filter-code", "#reduce-code", "#filter-note"], { opacity: 0, y: 12 });
      gsap.set(nIds, { opacity: 0, scale: 0.8 });
      gsap.set("#acc-frame", { opacity: 0, y: 12 });
      gsap.set(".acc-value", { textContent: "0" });
      gsap.set(".glow", { opacity: 0 });

      if (animate) {
        // reveal the source row
        enter(tl, "#src-code");
        tl.to(nIds, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.6)", stagger: 0.07 }, "+=0.1");

        // map: each chip morphs into its doubled value and drops into row 2
        enter(tl, "#map-code", "+=0.3");
        focusOn(tl, "#map-code", "<");
        NUMS.forEach((_, i) => {
          const at = i === 0 ? "+=0.15" : "<+=0.1";
          travel(tl, `#n${i}`, { y: ROW2_Y - ROW1_Y }, at);
          tl.to(`#n${i}`, { textContent: String(MAPPED[i]), duration: 0.4, ease: "power2.inOut", snap: { textContent: 1 } }, "<");
        });
        focusOff(tl, "#map-code", "+=0.3");

        // filter: dim the values at or below the threshold, compact the survivors
        enter(tl, "#filter-code", "+=0.25");
        focusOn(tl, "#filter-code", "<");
        enter(tl, "#filter-note", "<");
        tl.to(
          DROPPED_INDEXES.map((i) => `#n${i}`),
          { opacity: 0.15, scale: 0.85, duration: 0.3, ease: "power2.in" },
          "<+=0.1",
        );
        SURVIVOR_INDEXES.forEach((idx, j) => {
          travel(tl, `#n${idx}`, { x: ROW3_X[j] - ROW_X[idx], y: ROW3_Y - ROW1_Y }, "<");
        });
        focusOff(tl, "#filter-code", "+=0.3");

        // reduce: fold each survivor into the accumulator, one at a time
        enter(tl, "#reduce-code", "+=0.25");
        enter(tl, "#acc-frame", "<+=0.1");
        focusOn(tl, "#acc-frame", "+=0.15");
        let running = 0;
        SURVIVOR_INDEXES.forEach((idx) => {
          const next = running + MAPPED[idx];
          travel(tl, `#n${idx}`, { x: ACC_CENTER_X - ROW_X[idx], y: ACC_CENTER_Y - ROW1_Y }, "+=0.3");
          tl.to(`#n${idx}`, { opacity: 0, duration: 0.6, ease: "power2.inOut" }, "<");
          tl.to(".acc-value", { textContent: String(next), duration: 0.25, snap: { textContent: 1 } }, "-=0.2");
          running = next;
        });
        focusOff(tl, "#acc-frame", "+=0.4");
      } else {
        // reduced motion: jump to labeled end-state (map/filter resolved, reduce complete)
        tl.set(["#src-code", "#map-code", "#filter-code", "#reduce-code", "#filter-note"], { opacity: 1, y: 0 })
          .set(nIds, { opacity: 1, scale: 1 })
          .set("#acc-frame", { opacity: 1, y: 0 })
          .set(".acc-value", { textContent: String(TOTAL) });
        DROPPED_INDEXES.forEach((idx) => {
          tl.set(`#n${idx}`, { y: ROW2_Y - ROW1_Y, opacity: 0.15, scale: 0.85, textContent: String(MAPPED[idx]) });
        });
        SURVIVOR_INDEXES.forEach((idx) => {
          tl.set(`#n${idx}`, { opacity: 0, textContent: String(MAPPED[idx]) });
        });
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
      height={340}
      label="A row of five numbers, 2, 5, 8, 3, and 6, is mapped into doubled values, 4, 10, 16, 6, and 12. Filter keeps only the values above 8, dimming and dropping 4 and 6. Reduce then folds the three survivors, 10, 16, and 12, into a single running total, one at a time, ending at 38"
    >
      <CodeLine id="src-code" gutter={1} style={{ left: 8, top: 8, width: 260 }}>
        const nums = [2, 5, 8, 3, 6]
      </CodeLine>
      {NUMS.map((n, i) => (
        <Chip key={`n${i}`} id={`n${i}`} className="absolute" style={{ left: ROW_X[i], top: ROW1_Y }}>
          {n}
        </Chip>
      ))}

      <CodeLine id="map-code" gutter={2} style={{ left: 8, top: 80, width: 240 }}>
        .map(x =&gt; x * 2)
      </CodeLine>

      <CodeLine id="filter-code" gutter={3} style={{ left: 8, top: 170, width: 240 }}>
        .filter(x =&gt; x &gt; 8)
      </CodeLine>
      <div id="filter-note" className="absolute font-sans text-[10px] font-medium uppercase tracking-wide" style={{ left: 8, top: 150 }}>
        <span className="text-muted-foreground">dims &le; 8</span>
        <span className="mx-2 text-muted-foreground">&middot;</span>
        <span className="text-green-600">keeps &gt; 8</span>
      </div>

      <CodeLine id="reduce-code" gutter={4} style={{ left: 8, top: 246, width: 300 }}>
        .reduce((acc, x) =&gt; acc + x, 0)
      </CodeLine>
      <Frame id="acc-frame" className="justify-center" style={ACC_FRAME}>
        acc: <span className="acc-value ml-1">0</span>
      </Frame>
    </Stage>
  );
}
