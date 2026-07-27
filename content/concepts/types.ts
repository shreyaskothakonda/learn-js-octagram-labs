import type { CourseRef, Resource } from "../types";

export type ConceptTrack = "javascript" | "data-structures" | "react";

export type ConceptExample = {
  code: string;
  explanation: string;
};

export type Concept = {
  slug: string;
  track: ConceptTrack;
  topic: string;
  title: string;
  oneLiner: string;
  definition: string;
  examples: ConceptExample[];
  realWorldUseCases: string[];
  relatedProblemIds: string[];
  visual: string;
  furtherReading?: Resource[];
  course?: CourseRef;
};
