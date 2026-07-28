"use client";
import { Suspense, useCallback, useRef, useState, useSyncExternalStore, type ComponentType } from "react";
import type { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import { getVisual, type ConceptVisualProps } from "./visuals";

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

export function ConceptStage({ visual }: { visual: string }) {
  const Visual = getVisual(visual) as ComponentType<ConceptVisualProps> | undefined;
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const speedRef = useRef(0.5);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(0.5);
  const reduced = usePrefersReducedMotion();

  // `register` is only ever invoked once per visual mount (each visual's
  // useGSAP call has no dependency array, so its timeline is built exactly
  // once regardless of `register`'s identity). Including `reduced` here lets
  // the autoplay decision below use the current value without causing the
  // visual's timeline to rebuild/replay on every render.
  const register = useCallback((tl: gsap.core.Timeline) => {
    tlRef.current = tl;
    tl.timeScale(speedRef.current);
    tl.eventCallback("onUpdate", () => setProgress(tl.progress()));
    tl.eventCallback("onComplete", () => setPlaying(false));
    if (!reduced) {
      tl.play(0);
      setPlaying(true);
    }
  }, [reduced]);
  function changeSpeed(s: number) {
    speedRef.current = s;
    setSpeed(s);
    tlRef.current?.timeScale(s);
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
      {!reduced && (
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Button size="sm" variant="outline" onClick={toggle}>{playing ? "Pause" : "Play"}</Button>
          <Button size="sm" variant="outline" onClick={replay}>Replay</Button>
          <input
            type="range" min={0} max={1} step={0.001} value={progress}
            onChange={(e) => scrub(Number(e.target.value))}
            className="flex-1 min-w-[120px] accent-[var(--color-primary)]"
            aria-label="Scrub animation"
          />
          <div className="flex items-center gap-1" role="group" aria-label="Playback speed">
            {[0.25, 0.5, 1, 1.5, 2].map((s) => (
              <Button
                key={s}
                size="sm"
                variant={speed === s ? "default" : "outline"}
                className="px-2"
                aria-pressed={speed === s}
                onClick={() => changeSpeed(s)}
              >
                {s}x
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
