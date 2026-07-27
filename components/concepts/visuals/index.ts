import { lazy, type ComponentType } from "react";
import type { gsap } from "gsap";

export type ConceptVisualProps = {
  register: (tl: gsap.core.Timeline) => void;
};

const registry: Record<string, ComponentType<ConceptVisualProps>> = {
  closures: lazy(() => import("./closures").then((m) => ({ default: m.ClosuresVisual }))),
  hoisting: lazy(() => import("./hoisting").then((m) => ({ default: m.HoistingVisual }))),
  "scope-chain": lazy(() => import("./scope-chain").then((m) => ({ default: m.ScopeChainVisual }))),
  "the-this-keyword": lazy(() => import("./the-this-keyword").then((m) => ({ default: m.TheThisKeywordVisual }))),
  "execution-context-call-stack": lazy(() =>
    import("./execution-context-call-stack").then((m) => ({ default: m.ExecutionContextCallStackVisual })),
  ),
  "primitives-vs-references": lazy(() =>
    import("./primitives-vs-references").then((m) => ({ default: m.PrimitivesVsReferencesVisual })),
  ),
};

export const visualKeys = Object.keys(registry);
export function getVisual(key: string) {
  return registry[key];
}
