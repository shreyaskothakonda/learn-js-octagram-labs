"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";
import { Stage, Panel, Frame, Chip, Eyebrow, enter, pop, focusOn, focusOff } from "./kit";

// One exporter, two importers. math.js exports a live total binding; app.js
// and stats.js both import the SAME binding. Connector arrows fan out from
// the exporter to each importer. When math.js runs total++, the exporter's
// value chip updates first, a pulse travels each connector at once, and BOTH
// importers update together, since a module is evaluated once and every
// importer shares that one live binding, not a copy taken at import time.
export function EsModulesVisual({ register }: ConceptVisualProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      gsap.set(["#panel-exporter", "#panel-importer", "#panel-importer2"], { opacity: 0, y: 12 });
      gsap.set(
        [
          "#export-line", "#mutate-line",
          "#import-line1", "#import-line2",
          "#import2-line1", "#import2-line2",
        ],
        { opacity: 0, y: 12 },
      );
      gsap.set(".glow", { opacity: 0 });
      gsap.set(["#chip-exporter", "#chip-importer", "#chip-importer2"], { opacity: 0, scale: 0.8 });
      gsap.set(["#arrow-base-1", "#arrow-base-2"], { opacity: 0 });
      gsap.set(["#arrow-active-1", "#arrow-active-2"], { opacity: 0 });
      gsap.set("#arrow-pulse-1", { opacity: 0, cx: 114, cy: 0 });
      gsap.set("#arrow-pulse-2", { opacity: 0, cx: 0, cy: 0 });
      gsap.set("#arrow-eyebrow", { opacity: 0 });
      gsap.set("#val-exporter", { textContent: "0" });
      gsap.set("#val-importer", { textContent: "0" });
      gsap.set("#val-importer2", { textContent: "0" });

      if (animate) {
        enter(tl, "#panel-exporter");
        enter(tl, ["#panel-importer", "#panel-importer2"], "<");
        enter(tl, ["#export-line", "#import-line1", "#import2-line1"], "+=0.1");
        enter(tl, ["#mutate-line", "#import-line2", "#import2-line2"], "+=0.05");
        pop(tl, "#chip-exporter", "+=0.15");
        pop(tl, ["#chip-importer", "#chip-importer2"], "<");
        tl.to(["#arrow-base-1", "#arrow-base-2"], { opacity: 1, duration: 0.3 }, "+=0.15")
          .to("#arrow-eyebrow", { opacity: 1, duration: 0.3 }, "<");
        // math.js runs total++: the mutate line lights up and the exporter's
        // chip value updates first.
        focusOn(tl, "#mutate-line", "+=0.25");
        tl.to("#val-exporter", { textContent: "1", duration: 0.2, snap: { textContent: 1 } }, "+=0.1");
        focusOff(tl, "#mutate-line", "+=0.25");
        // the update propagates across the live binding: both connectors go
        // active and a pulse travels from the export to each import at once.
        tl.to(["#arrow-active-1", "#arrow-active-2"], { opacity: 1, duration: 0.2 }, "+=0.15")
          .to("#arrow-pulse-1", { opacity: 1, cx: 114, cy: 0, duration: 0.01 }, "<")
          .to("#arrow-pulse-2", { opacity: 1, cx: 0, cy: 0, duration: 0.01 }, "<")
          .to("#arrow-pulse-1", { cx: 6, cy: 38, duration: 0.5, ease: "power2.inOut" }, "<")
          .to("#arrow-pulse-2", { cx: 108, cy: 38, duration: 0.5, ease: "power2.inOut" }, "<");
        tl.to(["#chip-importer", "#chip-importer2"], { scale: 1.08, duration: 0.15, ease: "power2.out" }, "-=0.15")
          .to(["#val-importer", "#val-importer2"], { textContent: "1", duration: 0.2, snap: { textContent: 1 } }, "<")
          .to(["#chip-importer", "#chip-importer2"], { scale: 1, duration: 0.2, ease: "power2.out" }, "+=0.1");
        tl.to(["#arrow-pulse-1", "#arrow-pulse-2"], { opacity: 0, duration: 0.2 }, "-=0.15");
        tl.to(["#arrow-active-1", "#arrow-active-2"], { opacity: 0, duration: 0.3 }, "+=0.1");
      } else {
        // reduced motion: jump to labeled end-state, propagation already done
        tl.set(["#panel-exporter", "#panel-importer", "#panel-importer2"], { opacity: 1, y: 0 })
          .set(
            [
              "#export-line", "#mutate-line",
              "#import-line1", "#import-line2",
              "#import2-line1", "#import2-line2",
            ],
            { opacity: 1, y: 0 },
          )
          .set(["#chip-exporter", "#chip-importer", "#chip-importer2"], { opacity: 1, scale: 1 })
          .set(["#arrow-base-1", "#arrow-base-2"], { opacity: 1 })
          .set(["#arrow-active-1", "#arrow-active-2"], { opacity: 0 })
          .set("#arrow-eyebrow", { opacity: 1 })
          .set(["#arrow-pulse-1", "#arrow-pulse-2"], { opacity: 0 })
          .set("#val-exporter", { textContent: "1" })
          .set("#val-importer", { textContent: "1" })
          .set("#val-importer2", { textContent: "1" });
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
      height={352}
      label="math.js exports a live total binding that both app.js and stats.js import. When math.js runs total++, the exporter's value chip updates first, a pulse travels along each connector at once, and both importers' chips update together to match, showing a module is evaluated once and every importer shares that one live binding, not a copy taken at import time"
    >
      <Panel id="panel-exporter" label="math.js" style={{ left: 114, top: 0, width: 172, height: 132 }} />
      <Frame id="export-line" style={{ left: 126, top: 26, width: 148, height: 26 }} className="text-[11px]">
        export let total
      </Frame>
      <Frame id="mutate-line" style={{ left: 126, top: 56, width: 148, height: 26 }} className="text-[11px]">
        total++;
      </Frame>
      <Chip id="chip-exporter" className="absolute" style={{ left: 126, top: 94, width: 148 }}>
        total: <span id="val-exporter" className="ml-1">0</span>
      </Chip>

      <Panel id="panel-importer" label="app.js" style={{ left: 0, top: 190, width: 172, height: 132 }} />
      <Frame id="import-line1" style={{ left: 12, top: 216, width: 148, height: 26 }} className="text-[11px]">
        import {"{ total }"}
      </Frame>
      <Frame id="import-line2" style={{ left: 12, top: 246, width: 148, height: 26 }} className="text-[11px]">
        {"from \"./math.js\""}
      </Frame>
      <Chip id="chip-importer" className="absolute" style={{ left: 12, top: 284, width: 148 }}>
        total: <span id="val-importer" className="ml-1">0</span>
      </Chip>

      <Panel id="panel-importer2" label="stats.js" style={{ left: 228, top: 190, width: 172, height: 132 }} />
      <Frame id="import2-line1" style={{ left: 240, top: 216, width: 148, height: 26 }} className="text-[11px]">
        import {"{ total }"}
      </Frame>
      <Frame id="import2-line2" style={{ left: 240, top: 246, width: 148, height: 26 }} className="text-[11px]">
        {"from \"./math.js\""}
      </Frame>
      <Chip id="chip-importer2" className="absolute" style={{ left: 240, top: 284, width: 148 }}>
        total: <span id="val-importer2" className="ml-1">0</span>
      </Chip>

      <Eyebrow id="arrow-eyebrow" className="absolute" style={{ left: 178, top: 154, width: 44, textAlign: "center" }}>
        live
      </Eyebrow>

      {/* Connector to app.js: exporter bottom-center fans down-left */}
      <svg
        className="absolute overflow-visible"
        style={{ left: 86, top: 132 }}
        width={114}
        height={38}
        viewBox="0 0 114 38"
      >
        <defs>
          <marker id="es-arrow-head" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" className="fill-[var(--color-border)]" />
          </marker>
          <marker id="es-arrow-head-active" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" className="fill-[var(--color-primary)]" />
          </marker>
        </defs>
        <line
          id="arrow-base-1"
          x1={114} y1={0} x2={6} y2={38}
          className="stroke-[var(--color-border)]"
          strokeWidth={2}
          markerEnd="url(#es-arrow-head)"
        />
        <line
          id="arrow-active-1"
          x1={114} y1={0} x2={6} y2={38}
          className="stroke-[var(--color-primary)]"
          strokeWidth={2}
          markerEnd="url(#es-arrow-head-active)"
        />
        <circle id="arrow-pulse-1" cx={114} cy={0} r={4} className="fill-[var(--color-primary)]" />
      </svg>

      {/* Connector to stats.js: exporter bottom-center fans down-right */}
      <svg
        className="absolute overflow-visible"
        style={{ left: 200, top: 132 }}
        width={114}
        height={38}
        viewBox="0 0 114 38"
      >
        <line
          id="arrow-base-2"
          x1={0} y1={0} x2={108} y2={38}
          className="stroke-[var(--color-border)]"
          strokeWidth={2}
          markerEnd="url(#es-arrow-head)"
        />
        <line
          id="arrow-active-2"
          x1={0} y1={0} x2={108} y2={38}
          className="stroke-[var(--color-primary)]"
          strokeWidth={2}
          markerEnd="url(#es-arrow-head-active)"
        />
        <circle id="arrow-pulse-2" cx={0} cy={0} r={4} className="fill-[var(--color-primary)]" />
      </svg>
    </Stage>
  );
}
