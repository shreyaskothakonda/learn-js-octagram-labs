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
  "data-types-and-coercion": lazy(() =>
    import("./data-types-and-coercion").then((m) => ({ default: m.DataTypesAndCoercionVisual })),
  ),
  "let-const-var-tdz": lazy(() =>
    import("./let-const-var-tdz").then((m) => ({ default: m.LetConstVarTdzVisual })),
  ),
  "truthy-falsy": lazy(() => import("./truthy-falsy").then((m) => ({ default: m.TruthyFalsyVisual }))),
  "operators-precedence": lazy(() =>
    import("./operators-precedence").then((m) => ({ default: m.OperatorsPrecedenceVisual })),
  ),
  destructuring: lazy(() => import("./destructuring").then((m) => ({ default: m.DestructuringVisual }))),
  "spread-and-rest": lazy(() =>
    import("./spread-and-rest").then((m) => ({ default: m.SpreadAndRestVisual })),
  ),
  "optional-chaining-nullish": lazy(() =>
    import("./optional-chaining-nullish").then((m) => ({ default: m.OptionalChainingNullishVisual })),
  ),
  "maps-and-sets": lazy(() => import("./maps-and-sets").then((m) => ({ default: m.MapsAndSetsVisual }))),
  "higher-order-functions": lazy(() =>
    import("./higher-order-functions").then((m) => ({ default: m.HigherOrderFunctionsVisual })),
  ),
  currying: lazy(() => import("./currying").then((m) => ({ default: m.CurryingVisual }))),
  "call-apply-bind": lazy(() =>
    import("./call-apply-bind").then((m) => ({ default: m.CallApplyBindVisual })),
  ),
  "map-filter-reduce": lazy(() =>
    import("./map-filter-reduce").then((m) => ({ default: m.MapFilterReduceVisual })),
  ),
  "sorting-arrays": lazy(() =>
    import("./sorting-arrays").then((m) => ({ default: m.SortingArraysVisual })),
  ),
  "prototypes-inheritance": lazy(() =>
    import("./prototypes-inheritance").then((m) => ({ default: m.PrototypesInheritanceVisual })),
  ),
  "es6-classes": lazy(() => import("./es6-classes").then((m) => ({ default: m.Es6ClassesVisual }))),
  "getters-setters": lazy(() =>
    import("./getters-setters").then((m) => ({ default: m.GettersSettersVisual })),
  ),
  "the-event-loop": lazy(() =>
    import("./the-event-loop").then((m) => ({ default: m.TheEventLoopVisual })),
  ),
  promises: lazy(() => import("./promises").then((m) => ({ default: m.PromisesVisual }))),
  "async-await": lazy(() =>
    import("./async-await").then((m) => ({ default: m.AsyncAwaitVisual })),
  ),
  "microtasks-vs-macrotasks": lazy(() =>
    import("./microtasks-vs-macrotasks").then((m) => ({ default: m.MicrotasksVsMacrotasksVisual })),
  ),
  "es-modules": lazy(() => import("./es-modules").then((m) => ({ default: m.EsModulesVisual }))),
  "regular-expressions": lazy(() =>
    import("./regular-expressions").then((m) => ({ default: m.RegularExpressionsVisual })),
  ),
  "iterators-generators": lazy(() =>
    import("./iterators-generators").then((m) => ({ default: m.IteratorsGeneratorsVisual })),
  ),
  "arrays-two-pointers": lazy(() =>
    import("./arrays-two-pointers").then((m) => ({ default: m.ArraysTwoPointersVisual })),
  ),
  "hash-maps": lazy(() => import("./hash-maps").then((m) => ({ default: m.HashMapsVisual }))),
  stacks: lazy(() => import("./stacks").then((m) => ({ default: m.StacksVisual }))),
  queues: lazy(() => import("./queues").then((m) => ({ default: m.QueuesVisual }))),
  "linked-lists": lazy(() => import("./linked-lists").then((m) => ({ default: m.LinkedListsVisual }))),
  trees: lazy(() => import("./trees").then((m) => ({ default: m.TreesVisual }))),
  "binary-search-trees": lazy(() =>
    import("./binary-search-trees").then((m) => ({ default: m.BinarySearchTreesVisual })),
  ),
  "graph-traversal": lazy(() =>
    import("./graph-traversal").then((m) => ({ default: m.GraphTraversalVisual })),
  ),
  heaps: lazy(() => import("./heaps").then((m) => ({ default: m.HeapsVisual }))),
  tries: lazy(() => import("./tries").then((m) => ({ default: m.TriesVisual }))),
  "sorting-algorithms": lazy(() =>
    import("./sorting-algorithms").then((m) => ({ default: m.SortingAlgorithmsVisual })),
  ),
  "binary-search": lazy(() =>
    import("./binary-search").then((m) => ({ default: m.BinarySearchVisual })),
  ),
  "sliding-window": lazy(() =>
    import("./sliding-window").then((m) => ({ default: m.SlidingWindowVisual })),
  ),
  "dynamic-programming": lazy(() =>
    import("./dynamic-programming").then((m) => ({ default: m.DynamicProgrammingVisual })),
  ),
  "recursion-and-backtracking": lazy(() =>
    import("./recursion-and-backtracking").then((m) => ({ default: m.RecursionAndBacktrackingVisual })),
  ),
  "greedy-algorithms": lazy(() =>
    import("./greedy-algorithms").then((m) => ({ default: m.GreedyAlgorithmsVisual })),
  ),
  "bit-manipulation": lazy(() =>
    import("./bit-manipulation").then((m) => ({ default: m.BitManipulationVisual })),
  ),
  "error-handling": lazy(() =>
    import("./error-handling").then((m) => ({ default: m.ErrorHandlingVisual })),
  ),
  "template-literals-and-strings": lazy(() =>
    import("./template-literals-and-strings").then((m) => ({ default: m.TemplateLiteralsAndStringsVisual })),
  ),
  "short-circuit-and-ternary": lazy(() =>
    import("./short-circuit-and-ternary").then((m) => ({ default: m.ShortCircuitAndTernaryVisual })),
  ),
  "array-search-methods": lazy(() =>
    import("./array-search-methods").then((m) => ({ default: m.ArraySearchMethodsVisual })),
  ),
  "object-keys-values-entries": lazy(() =>
    import("./object-keys-values-entries").then((m) => ({ default: m.ObjectKeysValuesEntriesVisual })),
  ),
};

export const visualKeys = Object.keys(registry);
export function getVisual(key: string) {
  return registry[key];
}
