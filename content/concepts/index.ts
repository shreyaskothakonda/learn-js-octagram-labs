import type { Concept, ConceptTrack } from "./types";
import { javascriptConcepts } from "./javascript";
import { dataStructureConcepts } from "./data-structures";
import { TOPICS } from "../manifest";

const ALL: Concept[] = [...javascriptConcepts, ...dataStructureConcepts];

export function getAllConcepts(): Concept[] {
  return ALL;
}
export function getConcept(slug: string): Concept | undefined {
  return ALL.find((c) => c.slug === slug);
}
export function getConceptsByTrack(track: ConceptTrack): Concept[] {
  return ALL.filter((c) => c.track === track);
}
export function getConceptsByTopic(track: ConceptTrack, topic: string): Concept[] {
  return ALL.filter((c) => c.track === track && c.topic === topic);
}
export function getConceptForProblem(problemId: string): Concept | undefined {
  return ALL.find((c) => c.relatedProblemIds.includes(problemId));
}
/** The order tracks appear in the concept library and in prev/next navigation. */
export const TRACK_ORDER: ConceptTrack[] = ["javascript", "data-structures", "react"];

export function getOrderedConcepts(): Concept[] {
  return [...ALL].sort((a, b) => {
    const byTrack = TRACK_ORDER.indexOf(a.track) - TRACK_ORDER.indexOf(b.track);
    if (byTrack !== 0) return byTrack;
    const order = TOPICS[a.track].map((t) => t.topic);
    return order.indexOf(a.topic) - order.indexOf(b.topic);
  });
}
export function getConceptNeighbors(slug: string): { prev?: Concept; next?: Concept } {
  const ordered = getOrderedConcepts();
  const index = ordered.findIndex((c) => c.slug === slug);
  if (index === -1) return {};
  return {
    prev: index > 0 ? ordered[index - 1] : undefined,
    next: index < ordered.length - 1 ? ordered[index + 1] : undefined,
  };
}
