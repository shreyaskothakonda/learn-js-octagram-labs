import type { Concept, ConceptTrack } from "./types";
import { javascriptConcepts } from "./javascript";

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
