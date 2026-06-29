import type { Problem, Track } from "./types";
import { javascriptProblems } from "./problems/javascript";
import { jsFundamentalsProblems } from "./problems/js-fundamentals";
import { jsFunctionsProblems } from "./problems/js-functions";
import { jsModernProblems } from "./problems/js-modern";
import { jsAsyncRegexErrorsProblems } from "./problems/js-async-regex-errors";
import { jsDomProblems } from "./problems/js-dom";
import { reactProblems } from "./problems/react";
import { dataStructureProblems } from "./problems/data-structures";
import { algorithmProblems } from "./problems/algorithms";

const ALL: Problem[] = [
  ...javascriptProblems,
  ...jsFundamentalsProblems,
  ...jsFunctionsProblems,
  ...jsModernProblems,
  ...jsAsyncRegexErrorsProblems,
  ...jsDomProblems,
  ...dataStructureProblems,
  ...algorithmProblems,
  ...reactProblems,
];

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
