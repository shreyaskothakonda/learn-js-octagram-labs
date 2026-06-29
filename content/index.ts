import type { Problem, Track } from "./types";
import { javascriptProblems } from "./problems/javascript";
import { dataStructureProblems } from "./problems/data-structures";
import { algorithmProblems } from "./problems/algorithms";

const ALL: Problem[] = [...javascriptProblems, ...dataStructureProblems, ...algorithmProblems];

export function getAllProblems(): Problem[] {
  return ALL;
}
export function getProblem(id: string): Problem | undefined {
  return ALL.find((p) => p.id === id);
}
export function getProblemsByTrack(track: Track): Problem[] {
  return ALL.filter((p) => p.track === track);
}
export function getProblemsByTopic(track: Track, topic: string): Problem[] {
  return ALL.filter((p) => p.track === track && p.topic === topic);
}
