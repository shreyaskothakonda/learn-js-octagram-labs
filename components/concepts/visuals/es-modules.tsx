"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";
import { Stage, Panel, Frame, Chip, Eyebrow, enter, pop, focusOn, focusOff } from "./kit";

// Two module panels: math.js exports a live `total` binding, app.js imports
// it. A connector arrow bridges the named export to the import; when math.js
// mutates total, the exporter's value chip updates, a pulse travels the
// connector, and the importer's chip updates to match, since an import is a
// live reference to the same binding, not a copy taken at import time.
export function EsModulesVisual({ register }: ConceptVisualProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      gsap.set(["#panel-exporter", "#panel-importer"], { opacity: 0, y: 12 });
      gsap.set(["#export-line", "#mutate-line", "#import-line1", "#import-line2"], { opacity: 0, y: 12 });
      gsap.set(".glow", { opacity: 0 });
      gsap.set(["#chip-exporter", "#chip-importer"], { opacity: 0, scale: 0.8 });
      gsap.set("#arrow-base", { opacity: 0 });
      gsap.set("#arrow-active", { opacity: 0 });
      gsap.set("#arrow-pulse", { opacity: 0, cx: 4 });
      gsap.set("#arrow-eyebrow", { opacity: 0 });
      gsap.set("#val-exporter", { textContent: "0" });
      gsap.set("#val-importer", { textContent: "0" });

      if (animate) {
        enter(tl, "#panel-exporter");
        enter(tl, "#panel-importer", "<");
        enter(tl, ["#export-line", "#import-line1"], "+=0.1");
        enter(tl, ["#mutate-line", "#import-line2"], "+=0.05");
        pop(tl, "#chip-exporter", "+=0.15");
        pop(tl, "#chip-importer", "<");
        tl.to("#arrow-base", { opacity: 1, duration: 0.3 }, "+=0.15")
          .to("#arrow-eyebrow", { opacity: 1, duration: 0.3 }, "<");
        // math.js runs total++: the mutate line lights up and the exporter's
        // chip value updates first.
        focusOn(tl, "#mutate-line", "+=0.25");
        tl.to("#val-exporter", { textContent: "1", duration: 0.2, snap: { textContent: 1 } }, "+=0.1");
        focusOff(tl, "#mutate-line", "+=0.25");
        // the update propagates across the live binding: the connector goes
        // active and a pulse travels from the export to the import.
        tl.to("#arrow-active", { opacity: 1, duration: 0.2 }, "+=0.15")
          .to("#arrow-pulse", { opacity: 1, cx: 4, duration: 0.01 }, "<")
          .to("#arrow-pulse", { cx: 60, duration: 0.5, ease: "power2.inOut" });
        tl.to("#chip-importer", { scale: 1.08, duration: 0.15, ease: "power2.out" }, "-=0.15")
          .to("#val-importer", { textContent: "1", duration: 0.2, snap: { textContent: 1 } }, "<")
          .to("#chip-importer", { scale: 1, duration: 0.2, ease: "power2.out" }, "+=0.1");
        tl.to("#arrow-pulse", { opacity: 0, duration: 0.2 }, "-=0.15");
        tl.to("#arrow-active", { opacity: 0, duration: 0.3 }, "+=0.1");
      } else {
        // reduced motion: jump to labeled end-state, propagation already done
        tl.set(["#panel-exporter", "#panel-importer"], { opacity: 1, y: 0 })
          .set(["#export-line", "#mutate-line", "#import-line1", "#import-line2"], { opacity: 1, y: 0 })
          .set(["#chip-exporter", "#chip-importer"], { opacity: 1, scale: 1 })
          .set("#arrow-base", { opacity: 1 })
          .set("#arrow-active", { opacity: 0 })
          .set("#arrow-eyebrow", { opacity: 1 })
          .set("#arrow-pulse", { opacity: 0 })
          .set("#val-exporter", { textContent: "1" })
          .set("#val-importer", { textContent: "1" });
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
      height={210}
      label="math.js exports a live total binding that app.js imports. When math.js runs total++, the exporter's value chip updates first, a pulse travels the connector between the modules, and the importer's chip updates to match, showing the import is a live reference and not a copy"
    >
      <Panel id="panel-exporter" label="math.js" style={{ left: 0, top: 0, width: 172, height: 190 }} />
      <Panel id="panel-importer" label="app.js" style={{ left: 228, top: 0, width: 172, height: 190 }} />

      <Frame id="export-line" style={{ left: 12, top: 30, width: 148, height: 26 }} className="text-[11px]">
        export let total
      </Frame>
      <Frame id="mutate-line" style={{ left: 12, top: 60, width: 148, height: 26 }} className="text-[11px]">
        total++;
      </Frame>
      <Chip id="chip-exporter" className="absolute" style={{ left: 12, top: 100, width: 148 }}>
        total: <span id="val-exporter" className="ml-1">0</span>
      </Chip>

      <Frame id="import-line1" style={{ left: 240, top: 30, width: 148, height: 26 }} className="text-[11px]">
        import {"{ total }"}
      </Frame>
      <Frame id="import-line2" style={{ left: 240, top: 60, width: 148, height: 26 }} className="text-[11px]">
        {"from \"./math.js\""}
      </Frame>
      <Chip id="chip-importer" className="absolute" style={{ left: 240, top: 100, width: 148 }}>
        total: <span id="val-importer" className="ml-1">0</span>
      </Chip>

      <Eyebrow id="arrow-eyebrow" className="absolute" style={{ left: 172, top: 148, width: 56, textAlign: "center" }}>
        live
      </Eyebrow>

      <svg
        className="absolute overflow-visible"
        style={{ left: 172, top: 104 }}
        width={56}
        height={20}
        viewBox="0 0 56 20"
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
          id="arrow-base"
          x1={0} y1={10} x2={48} y2={10}
          className="stroke-[var(--color-border)]"
          strokeWidth={2}
          markerEnd="url(#es-arrow-head)"
        />
        <line
          id="arrow-active"
          x1={0} y1={10} x2={48} y2={10}
          className="stroke-[var(--color-primary)]"
          strokeWidth={2}
          markerEnd="url(#es-arrow-head-active)"
        />
        <circle id="arrow-pulse" cx={4} cy={10} r={4} className="fill-[var(--color-primary)]" />
      </svg>
    </Stage>
  );
}
