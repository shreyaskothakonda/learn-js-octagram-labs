import type { Concept, ConceptTrack } from "./types";
import { javascriptConcepts } from "./javascript";
import { TOPICS } from "../manifest";

const ALL: Concept[] = [...javascriptConcepts];

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
export function getOrderedConcepts(): Concept[] {
  const order = TOPICS.javascript.map((t) => t.topic);
  return [...ALL].sort((a, b) => order.indexOf(a.topic) - order.indexOf(b.topic));
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
