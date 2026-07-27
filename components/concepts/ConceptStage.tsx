"use client";
import { Suspense, useRef, useState, type ComponentType } from "react";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import { getVisual, type ConceptVisualProps } from "./visuals";

export function ConceptStage({ visual }: { visual: string }) {
  const Visual = getVisual(visual) as ComponentType<ConceptVisualProps> | undefined;
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  function register(tl: gsap.core.Timeline) {
    tlRef.current = tl;
    tl.eventCallback("onUpdate", () => setProgress(tl.progress()));
    tl.eventCallback("onComplete", () => setPlaying(false));
  }
  function replay() { tlRef.current?.restart(); setPlaying(true); }
  function toggle() {
    const tl = tlRef.current;
    if (!tl) return;
    if (tl.progress() === 1) { tl.restart(); setPlaying(true); return; }
    if (playing) { tl.pause(); setPlaying(false); } else { tl.play(); setPlaying(true); }
  }
  function scrub(v: number) { tlRef.current?.pause(); setPlaying(false); tlRef.current?.progress(v); }

  if (!Visual) return null;
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="min-h-[260px] flex items-center justify-center overflow-x-auto">
        <Suspense fallback={<p className="text-sm text-muted-foreground">Loading visual…</p>}>
          <Visual register={register} />
        </Suspense>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <Button size="sm" variant="outline" onClick={toggle}>{playing ? "Pause" : "Play"}</Button>
        <Button size="sm" variant="outline" onClick={replay}>Replay</Button>
        <input
          type="range" min={0} max={1} step={0.001} value={progress}
          onChange={(e) => scrub(Number(e.target.value))}
          className="flex-1 accent-[var(--color-primary)]"
          aria-label="Scrub animation"
        />
      </div>
    </div>
  );
}
