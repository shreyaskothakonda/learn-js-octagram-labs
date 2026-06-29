export type Track = "javascript" | "data-structures" | "react";
export type Difficulty = "easy" | "medium" | "hard";
export type ProblemKind = "function" | "dom";

export type TestCase = {
  // function problems:
  input?: unknown[];
  expected?: unknown;
  // dom problems:
  description?: string;
  assert?: string; // JS expression evaluated in the iframe; must return boolean
  hidden?: boolean;
};

export type Resource = { label: string; url: string };

export type CourseRef = {
  section: number;
  sectionTitle: string;
  lecture: number;
  lectureName: string;
};

export type Problem = {
  id: string;
  track: Track;
  topic: string;
  difficulty: Difficulty;
  title: string;
  prompt: string;
  kind: ProblemKind;
  starterCode: string;
  solution: string;
  functionName?: string;
  html?: string;
  testCases: TestCase[];
  resources: Resource[];
  hints?: string[];
  pitfalls?: string[];
  explanation?: string;
  course?: CourseRef;
};
