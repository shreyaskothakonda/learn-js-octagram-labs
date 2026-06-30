import type { Problem, Track } from "./types";
import { javascriptProblems } from "./problems/javascript";
import { jsFundamentalsProblems } from "./problems/js-fundamentals";
import { jsFunctionsProblems } from "./problems/js-functions";
import { jsModernProblems } from "./problems/js-modern";
import { jsAsyncRegexErrorsProblems } from "./problems/js-async-regex-errors";
import { jsDomProblems } from "./problems/js-dom";
import { jsCourseExtraProblems } from "./problems/js-course-extra";
import { jsCourseExtra2Problems } from "./problems/js-course-extra-2";
import { jsCourseExtra3Problems } from "./problems/js-course-extra-3";
import { jsHardExtraProblems } from "./problems/js-hard-extra";
import { reactProblems } from "./problems/react";
import { dataStructureProblems } from "./problems/data-structures";
import { algorithmProblems } from "./problems/algorithms";
import { dsExtraProblems } from "./problems/ds-extra";
import { dsExtra2Problems } from "./problems/ds-extra-2";
import { dsExtra3Problems } from "./problems/ds-extra-3";
import { interviewProblems } from "./problems/interview";
import { interview2Problems } from "./problems/interview-2";
import { reactDesignProblems } from "./problems/react-design";

const ALL: Problem[] = [
  ...javascriptProblems,
  ...jsFundamentalsProblems,
  ...jsFunctionsProblems,
  ...jsModernProblems,
  ...jsAsyncRegexErrorsProblems,
  ...jsDomProblems,
  ...jsCourseExtraProblems,
  ...jsCourseExtra2Problems,
  ...jsCourseExtra3Problems,
  ...jsHardExtraProblems,
  ...dataStructureProblems,
  ...algorithmProblems,
  ...dsExtraProblems,
  ...dsExtra2Problems,
  ...dsExtra3Problems,
  ...interviewProblems,
  ...interview2Problems,
  ...reactDesignProblems,
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
