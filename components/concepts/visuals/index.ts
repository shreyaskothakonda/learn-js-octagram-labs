import { lazy, type ComponentType } from "react";
import type { gsap } from "gsap";

export type ConceptVisualProps = {
  register: (tl: gsap.core.Timeline) => void;
};

const registry: Record<string, ComponentType<ConceptVisualProps>> = {
  closures: lazy(() => import("./closures").then((m) => ({ default: m.ClosuresVisual }))),
};

export const visualKeys = Object.keys(registry);
export function getVisual(key: string) {
  return registry[key];
}
