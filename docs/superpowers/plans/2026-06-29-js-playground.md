# JavaScript Playground Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a deployable HackerRank-style in-browser JavaScript & Data Structures learning playground on Next.js, with a Monaco editor, client-side test execution, and Supabase-backed attempts/progress.

**Architecture:** Next.js 16 App Router app deployed on Vercel. Problems are static typed data in the repo. User code runs entirely client-side — `function` problems in a Web Worker, `dom` problems in a sandboxed iframe with a live HTML preview. Supabase (Auth + Postgres with RLS) stores only user data (attempts, progress). The runner, content loader, and storage layer are isolated modules testable independently of React.

**Tech Stack:** Next.js 16, TypeScript, Tailwind CSS, shadcn/ui, `@monaco-editor/react`, Web Worker + sandboxed iframe, Supabase (`@supabase/ssr`), Vitest for unit tests.

## Global Constraints

- Next.js **16** App Router, TypeScript strict mode, deployed on Vercel.
- Node.js **24** LTS (Vercel default).
- All user code executes **client-side only** — never POST user code to the server.
- Question bank lives in `content/` as typed data, **never** in the database.
- Supabase tables (`profiles`, `attempts`, `progress`) are **RLS-protected**; every row scoped to `auth.uid()`.
- Two problem kinds: `"function"` (Web Worker) and `"dom"` (sandboxed iframe, `sandbox="allow-scripts"`).
- Right panel tabs: `Tests | Console | HTML View` — HTML View shown only for `dom` problems.
- Unit tests use **Vitest**. Pure logic (runner, deep-equal, content validation) must be testable without a browser/React.
- Tracks: `"javascript"` (target 250) and `"data-structures"` (target 150). v1 seeds ~30 problems.

---

### Task 1: Project scaffold

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `.gitignore`, `vitest.config.ts`, `.env.local.example`

**Interfaces:**
- Consumes: nothing (first task).
- Produces: a running Next.js app with Tailwind, TypeScript, and Vitest configured; `npm run dev`, `npm run build`, `npm test` all work.

- [ ] **Step 1: Scaffold Next.js app**

Run in the project root:
```bash
npx create-next-app@latest . --typescript --tailwind --app --eslint --no-src-dir --import-alias "@/*" --use-npm --yes
```
Expected: Next.js files created in the current directory.

- [ ] **Step 2: Add Vitest and testing deps**

```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom
```

- [ ] **Step 3: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
  },
  resolve: { alias: { "@": path.resolve(__dirname, ".") } },
});
```

Create `vitest.setup.ts`:
```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 4: Add test script to `package.json`**

Add to `"scripts"`:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 5: Create `.env.local.example`**

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

- [ ] **Step 6: Verify build and dev**

Run: `npm run build`
Expected: build succeeds.
Run: `npm test`
Expected: "No test files found" (exit 0) — Vitest configured.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js app with Tailwind, TypeScript, Vitest"
```

---

### Task 2: Problem type & content schema validator

**Files:**
- Create: `content/types.ts`, `content/validate.ts`, `content/validate.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `type Problem` (and supporting `TestCase`, `Track`, `Difficulty`, `ProblemKind` types) exported from `content/types.ts`.
  - `validateProblem(p: Problem): string[]` in `content/validate.ts` — returns an array of error strings (empty = valid).

- [ ] **Step 1: Write the failing test**

`content/validate.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { validateProblem } from "./validate";
import type { Problem } from "./types";

const fnProblem: Problem = {
  id: "js-arrays-001",
  track: "javascript",
  topic: "Arrays",
  difficulty: "easy",
  title: "Sum array",
  prompt: "Return the sum.",
  kind: "function",
  starterCode: "function sum(arr){}",
  solution: "function sum(arr){return arr.reduce((a,b)=>a+b,0)}",
  functionName: "sum",
  testCases: [{ input: [[1, 2, 3]], expected: 6 }],
  resources: [{ label: "MDN reduce", url: "https://mdn" }],
};

const domProblem: Problem = {
  id: "js-dom-001",
  track: "javascript",
  topic: "DOM Manipulation",
  difficulty: "easy",
  title: "Add item",
  prompt: "Append a list item.",
  kind: "dom",
  starterCode: "document.querySelector('ul').innerHTML += '<li>x</li>'",
  solution: "document.querySelector('ul').innerHTML += '<li>x</li>'",
  html: "<ul></ul>",
  testCases: [{ description: "one li exists", assert: "document.querySelectorAll('li').length === 1" }],
  resources: [],
};

describe("validateProblem", () => {
  it("accepts a valid function problem", () => {
    expect(validateProblem(fnProblem)).toEqual([]);
  });
  it("accepts a valid dom problem", () => {
    expect(validateProblem(domProblem)).toEqual([]);
  });
  it("rejects a function problem missing functionName", () => {
    const bad = { ...fnProblem, functionName: undefined };
    expect(validateProblem(bad as Problem)).toContain("function problem missing functionName");
  });
  it("rejects a dom problem missing html", () => {
    const bad = { ...domProblem, html: undefined };
    expect(validateProblem(bad as Problem)).toContain("dom problem missing html");
  });
  it("rejects a problem with no test cases", () => {
    const bad = { ...fnProblem, testCases: [] };
    expect(validateProblem(bad)).toContain("problem has no test cases");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- content/validate.test.ts`
Expected: FAIL — `validate` / `types` modules not found.

- [ ] **Step 3: Create `content/types.ts`**

```ts
export type Track = "javascript" | "data-structures";
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
};
```

- [ ] **Step 4: Create `content/validate.ts`**

```ts
import type { Problem } from "./types";

export function validateProblem(p: Problem): string[] {
  const errors: string[] = [];
  if (!p.id) errors.push("problem missing id");
  if (!p.title) errors.push("problem missing title");
  if (!p.testCases || p.testCases.length === 0) errors.push("problem has no test cases");

  if (p.kind === "function") {
    if (!p.functionName) errors.push("function problem missing functionName");
    for (const tc of p.testCases ?? []) {
      if (tc.input === undefined) errors.push("function test case missing input");
    }
  }
  if (p.kind === "dom") {
    if (!p.html) errors.push("dom problem missing html");
    for (const tc of p.testCases ?? []) {
      if (!tc.assert) errors.push("dom test case missing assert");
    }
  }
  return errors;
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test -- content/validate.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 6: Commit**

```bash
git add content/
git commit -m "feat: add Problem type and content schema validator"
```

---

### Task 3: Topic manifest & content loader

**Files:**
- Create: `content/manifest.ts`, `content/index.ts`, `content/index.test.ts`

**Interfaces:**
- Consumes: `Problem` from `content/types.ts`, `validateProblem` from `content/validate.ts`.
- Produces:
  - `TOPICS: Record<Track, { topic: string; label: string }[]>` from `content/manifest.ts`.
  - From `content/index.ts`: `getAllProblems(): Problem[]`, `getProblem(id: string): Problem | undefined`, `getProblemsByTrack(track: Track): Problem[]`, `getProblemsByTopic(track: Track, topic: string): Problem[]`.

- [ ] **Step 1: Write the failing test**

`content/index.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { getAllProblems, getProblem, getProblemsByTrack } from "./index";
import { validateProblem } from "./validate";

describe("content loader", () => {
  it("loads problems", () => {
    expect(getAllProblems().length).toBeGreaterThan(0);
  });
  it("every problem is schema-valid", () => {
    for (const p of getAllProblems()) {
      expect(validateProblem(p), `${p.id} invalid`).toEqual([]);
    }
  });
  it("has unique ids", () => {
    const ids = getAllProblems().map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it("finds a problem by id", () => {
    const first = getAllProblems()[0];
    expect(getProblem(first.id)?.id).toBe(first.id);
  });
  it("filters by track", () => {
    expect(getProblemsByTrack("javascript").every((p) => p.track === "javascript")).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- content/index.test.ts`
Expected: FAIL — modules / problems not found.

- [ ] **Step 3: Create `content/manifest.ts`**

```ts
import type { Track } from "./types";

export const TOPICS: Record<Track, { topic: string; label: string }[]> = {
  javascript: [
    { topic: "Variables & Types", label: "Variables & Types" },
    { topic: "Strings", label: "Strings" },
    { topic: "Arrays", label: "Arrays" },
    { topic: "Objects", label: "Objects" },
    { topic: "Functions & Scope", label: "Functions & Scope" },
    { topic: "Closures", label: "Closures" },
    { topic: "Higher-Order Functions", label: "Higher-Order Functions" },
    { topic: "Array Methods", label: "Array Methods (map/filter/reduce)" },
    { topic: "Recursion", label: "Recursion" },
    { topic: "ES6+", label: "ES6+" },
    { topic: "Async & Promises", label: "Async & Promises" },
    { topic: "Regex", label: "Regex" },
    { topic: "Error Handling", label: "Error Handling" },
    { topic: "DOM Manipulation", label: "DOM Manipulation" },
  ],
  "data-structures": [
    { topic: "Arrays & Two-Pointers", label: "Arrays & Two-Pointers" },
    { topic: "Hash Maps", label: "Hash Maps / Sets" },
    { topic: "Stacks", label: "Stacks" },
    { topic: "Queues", label: "Queues" },
    { topic: "Linked Lists", label: "Linked Lists" },
    { topic: "Trees", label: "Trees" },
    { topic: "BST", label: "Binary Search Trees" },
    { topic: "Graphs", label: "Graphs (BFS/DFS)" },
    { topic: "Heaps", label: "Heaps" },
    { topic: "Tries", label: "Tries" },
    { topic: "Sorting", label: "Sorting" },
    { topic: "Searching", label: "Searching" },
    { topic: "Sliding Window", label: "Sliding Window" },
    { topic: "Dynamic Programming", label: "Dynamic Programming" },
  ],
};
```

- [ ] **Step 4: Create `content/index.ts` (loads from problem data files added in Task 4)**

```ts
import type { Problem, Track } from "./types";
import { javascriptProblems } from "./problems/javascript";
import { dataStructureProblems } from "./problems/data-structures";

const ALL: Problem[] = [...javascriptProblems, ...dataStructureProblems];

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
```

- [ ] **Step 5: Create empty problem barrels so this compiles**

`content/problems/javascript.ts`:
```ts
import type { Problem } from "../types";
export const javascriptProblems: Problem[] = [];
```
`content/problems/data-structures.ts`:
```ts
import type { Problem } from "../types";
export const dataStructureProblems: Problem[] = [];
```

- [ ] **Step 6: Run test to verify it fails on "loads problems"**

Run: `npm test -- content/index.test.ts`
Expected: FAIL on "loads problems" (length 0). This is expected — Task 4 adds the seed data. Other structural tests pass.

- [ ] **Step 7: Commit**

```bash
git add content/
git commit -m "feat: add topic manifest and content loader"
```

---

### Task 4: Seed problem data (~30 problems)

**Files:**
- Modify: `content/problems/javascript.ts`, `content/problems/data-structures.ts`
- Create: `content/solutions.test.ts`

**Interfaces:**
- Consumes: `Problem` type; an in-test `runSolution` helper (defined inline in `solutions.test.ts`) for reference-solution verification.
- Produces: populated `javascriptProblems` (~20 across Arrays, Strings, Closures, Higher-Order Functions, Recursion, DOM Manipulation) and `dataStructureProblems` (~10 across Arrays & Two-Pointers, Hash Maps, Stacks, Linked Lists). Each `function` problem's reference `solution` passes its own test cases.

- [ ] **Step 1: Write the failing solution-verification test**

`content/solutions.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { getAllProblems } from "./index";

// Runs a function problem's reference solution against its own test cases in-process.
function runSolution(code: string, fnName: string, input: unknown[]): unknown {
  const factory = new Function(`${code}; return ${fnName};`);
  const fn = factory() as (...a: unknown[]) => unknown;
  return fn(...input);
}

function deepEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

describe("reference solutions pass their own tests", () => {
  for (const p of getAllProblems().filter((p) => p.kind === "function")) {
    it(`${p.id} solution passes`, () => {
      for (const tc of p.testCases) {
        const out = runSolution(p.solution, p.functionName!, tc.input!);
        expect(deepEqual(out, tc.expected), `${p.id} case ${JSON.stringify(tc.input)}`).toBe(true);
      }
    });
  }
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- content/solutions.test.ts`
Expected: FAIL or no problems (empty arrays) — drives adding seed data.

- [ ] **Step 3: Populate `content/problems/javascript.ts`**

Add ~20 problems. Example entries (follow this exact shape; fill out the rest across the listed topics with easy/medium/hard spread):
```ts
import type { Problem } from "../types";

export const javascriptProblems: Problem[] = [
  {
    id: "js-arrays-001",
    track: "javascript",
    topic: "Arrays",
    difficulty: "easy",
    title: "Sum of an Array",
    prompt: "Implement `sum(arr)` that returns the sum of all numbers in `arr`.",
    kind: "function",
    starterCode: "function sum(arr) {\n  // your code here\n}",
    solution: "function sum(arr) {\n  return arr.reduce((a, b) => a + b, 0);\n}",
    functionName: "sum",
    testCases: [
      { input: [[1, 2, 3]], expected: 6 },
      { input: [[]], expected: 0 },
      { input: [[-5, 5]], expected: 0, hidden: true },
    ],
    resources: [
      { label: "MDN: Array.prototype.reduce", url: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce" },
    ],
    hints: ["Reduce accumulates a single value from the array."],
  },
  {
    id: "js-strings-001",
    track: "javascript",
    topic: "Strings",
    difficulty: "easy",
    title: "Reverse a String",
    prompt: "Implement `reverse(str)` returning the string reversed.",
    kind: "function",
    starterCode: "function reverse(str) {\n  // your code here\n}",
    solution: "function reverse(str) {\n  return str.split('').reverse().join('');\n}",
    functionName: "reverse",
    testCases: [
      { input: ["hello"], expected: "olleh" },
      { input: [""], expected: "" },
      { input: ["a"], expected: "a", hidden: true },
    ],
    resources: [
      { label: "MDN: String.prototype.split", url: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/split" },
    ],
  },
  {
    id: "js-dom-001",
    track: "javascript",
    topic: "DOM Manipulation",
    difficulty: "easy",
    title: "Append a List Item",
    prompt: "The page has an empty `<ul id=\"list\">`. Append exactly one `<li>` with text `Item`.",
    kind: "dom",
    starterCode: "// Append an <li>Item</li> to the #list element\n",
    solution: "const li = document.createElement('li');\nli.textContent = 'Item';\ndocument.getElementById('list').appendChild(li);",
    html: "<ul id=\"list\"></ul>",
    testCases: [
      { description: "exactly one <li> exists", assert: "document.querySelectorAll('#list li').length === 1" },
      { description: "its text is 'Item'", assert: "document.querySelector('#list li').textContent === 'Item'" },
    ],
    resources: [
      { label: "MDN: Document.createElement", url: "https://developer.mozilla.org/docs/Web/API/Document/createElement" },
    ],
  },
  // ... add ~17 more across Closures, Higher-Order Functions, Recursion,
  //     Array Methods, Objects, with easy/medium/hard difficulty spread.
];
```

- [ ] **Step 4: Populate `content/problems/data-structures.ts`**

Add ~10 problems. Example:
```ts
import type { Problem } from "../types";

export const dataStructureProblems: Problem[] = [
  {
    id: "ds-twopointers-001",
    track: "data-structures",
    topic: "Arrays & Two-Pointers",
    difficulty: "easy",
    title: "Two Sum (sorted)",
    prompt: "Given a sorted array `nums` and `target`, return the 0-based indices `[i, j]` of the two numbers that add up to `target`. Exactly one solution exists.",
    kind: "function",
    starterCode: "function twoSum(nums, target) {\n  // your code here\n}",
    solution: "function twoSum(nums, target) {\n  let l = 0, r = nums.length - 1;\n  while (l < r) {\n    const s = nums[l] + nums[r];\n    if (s === target) return [l, r];\n    if (s < target) l++; else r--;\n  }\n  return [];\n}",
    functionName: "twoSum",
    testCases: [
      { input: [[1, 2, 4, 7], 6], expected: [1, 2] },
      { input: [[2, 3, 4], 6], expected: [0, 2], hidden: true },
    ],
    resources: [
      { label: "MDN: Arrays", url: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array" },
    ],
  },
  // ... add ~9 more across Hash Maps, Stacks, Linked Lists.
];
```

- [ ] **Step 5: Run all content tests to verify they pass**

Run: `npm test -- content/`
Expected: PASS — `index.test.ts` (>0 problems, unique ids, all valid) and `solutions.test.ts` (every function solution passes its own cases).

- [ ] **Step 6: Commit**

```bash
git add content/
git commit -m "feat: seed ~30 JavaScript and data-structure problems"
```

---

### Task 5: Deep-equal & result types

**Files:**
- Create: `lib/runner/types.ts`, `lib/runner/deep-equal.ts`, `lib/runner/deep-equal.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `lib/runner/types.ts`: `type CaseResult = { index: number; passed: boolean; expected?: unknown; actual?: unknown; description?: string; error?: string }` and `type RunResult = { caseResults: CaseResult[]; consoleLogs: string[]; error?: string; runtimeMs: number }`.
  - `lib/runner/deep-equal.ts`: `deepEqual(a: unknown, b: unknown): boolean`.

- [ ] **Step 1: Write the failing test**

`lib/runner/deep-equal.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { deepEqual } from "./deep-equal";

describe("deepEqual", () => {
  it("compares primitives", () => {
    expect(deepEqual(1, 1)).toBe(true);
    expect(deepEqual("a", "b")).toBe(false);
  });
  it("compares arrays deeply", () => {
    expect(deepEqual([1, [2, 3]], [1, [2, 3]])).toBe(true);
    expect(deepEqual([1, 2], [1, 2, 3])).toBe(false);
  });
  it("compares objects regardless of key order", () => {
    expect(deepEqual({ a: 1, b: 2 }, { b: 2, a: 1 })).toBe(true);
  });
  it("distinguishes null and undefined", () => {
    expect(deepEqual(null, undefined)).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- lib/runner/deep-equal.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Create `lib/runner/types.ts`**

```ts
export type CaseResult = {
  index: number;
  passed: boolean;
  expected?: unknown;
  actual?: unknown;
  description?: string;
  error?: string;
};

export type RunResult = {
  caseResults: CaseResult[];
  consoleLogs: string[];
  error?: string;
  runtimeMs: number;
};
```

- [ ] **Step 4: Create `lib/runner/deep-equal.ts`**

```ts
export function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (a === null || b === null) return a === b;
  if (typeof a !== "object") return false;

  const ao = a as Record<string, unknown>;
  const bo = b as Record<string, unknown>;
  if (Array.isArray(a) !== Array.isArray(b)) return false;

  const ak = Object.keys(ao);
  const bk = Object.keys(bo);
  if (ak.length !== bk.length) return false;
  return ak.every((k) => deepEqual(ao[k], bo[k]));
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test -- lib/runner/deep-equal.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 6: Commit**

```bash
git add lib/runner/
git commit -m "feat: add deep-equal and runner result types"
```

---

### Task 6: Function-problem test executor (pure, in-process)

**Files:**
- Create: `lib/runner/run-function.ts`, `lib/runner/run-function.test.ts`

**Interfaces:**
- Consumes: `deepEqual`, `CaseResult`/`RunResult` types, `TestCase` from `content/types.ts`.
- Produces: `runFunctionCode(code: string, functionName: string, testCases: TestCase[]): RunResult` — the pure execution core that the Web Worker (Task 7) will call. Captures `console.log`, catches per-case errors, deep-equals actual vs expected.

- [ ] **Step 1: Write the failing test**

`lib/runner/run-function.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { runFunctionCode } from "./run-function";

describe("runFunctionCode", () => {
  it("passes a correct solution", () => {
    const r = runFunctionCode("function add(a,b){return a+b}", "add", [
      { input: [1, 2], expected: 3 },
      { input: [0, 0], expected: 0 },
    ]);
    expect(r.caseResults.every((c) => c.passed)).toBe(true);
    expect(r.error).toBeUndefined();
  });
  it("fails an incorrect solution and records actual", () => {
    const r = runFunctionCode("function add(a,b){return a-b}", "add", [
      { input: [1, 2], expected: 3 },
    ]);
    expect(r.caseResults[0].passed).toBe(false);
    expect(r.caseResults[0].actual).toBe(-1);
  });
  it("captures console.log output", () => {
    const r = runFunctionCode("function f(){console.log('hi');return 1}", "f", [
      { input: [], expected: 1 },
    ]);
    expect(r.consoleLogs).toContain("hi");
  });
  it("reports a syntax error without throwing", () => {
    const r = runFunctionCode("function f({", "f", [{ input: [], expected: 1 }]);
    expect(r.error).toBeTruthy();
  });
  it("records a runtime error per case", () => {
    const r = runFunctionCode("function f(){throw new Error('boom')}", "f", [
      { input: [], expected: 1 },
    ]);
    expect(r.caseResults[0].passed).toBe(false);
    expect(r.caseResults[0].error).toContain("boom");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- lib/runner/run-function.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Create `lib/runner/run-function.ts`**

```ts
import { deepEqual } from "./deep-equal";
import type { CaseResult, RunResult } from "./types";
import type { TestCase } from "@/content/types";

export function runFunctionCode(
  code: string,
  functionName: string,
  testCases: TestCase[],
): RunResult {
  const start = Date.now();
  const consoleLogs: string[] = [];
  const fakeConsole = {
    log: (...args: unknown[]) =>
      consoleLogs.push(args.map((a) => (typeof a === "string" ? a : JSON.stringify(a))).join(" ")),
  };

  let fn: (...a: unknown[]) => unknown;
  try {
    const factory = new Function("console", `${code}; return ${functionName};`);
    fn = factory(fakeConsole) as (...a: unknown[]) => unknown;
    if (typeof fn !== "function") {
      return { caseResults: [], consoleLogs, error: `${functionName} is not defined`, runtimeMs: Date.now() - start };
    }
  } catch (e) {
    return { caseResults: [], consoleLogs, error: (e as Error).message, runtimeMs: Date.now() - start };
  }

  const caseResults: CaseResult[] = testCases.map((tc, index) => {
    try {
      const actual = fn(...(tc.input ?? []));
      return { index, passed: deepEqual(actual, tc.expected), expected: tc.expected, actual };
    } catch (e) {
      return { index, passed: false, expected: tc.expected, error: (e as Error).message };
    }
  });

  return { caseResults, consoleLogs, runtimeMs: Date.now() - start };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- lib/runner/run-function.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/runner/
git commit -m "feat: add pure function-problem executor with console capture"
```

---

### Task 7: Web Worker harness + client API with timeout

**Files:**
- Create: `public/runner-worker.js`, `lib/runner/run-in-worker.ts`

**Interfaces:**
- Consumes: the executor logic from Task 6 (re-implemented in the worker, which cannot import TS) and `RunResult`/`TestCase` types.
- Produces: `runInWorker(code, functionName, testCases, timeoutMs?): Promise<RunResult>` — posts to the worker, enforces a timeout (default 3000ms) by terminating a hung worker and resolving with `error: "Execution timed out"`.

**Note:** This task has no Vitest unit test (Web Workers need a browser). It is verified manually in Task 11 when wired to the UI. Keep the worker logic a thin mirror of `run-function.ts`.

- [ ] **Step 1: Create `public/runner-worker.js`**

```js
// Mirrors lib/runner/run-function.ts but as plain JS for the Worker context.
function deepEqual(a, b) {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (a === null || b === null) return a === b;
  if (typeof a !== "object") return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const ak = Object.keys(a), bk = Object.keys(b);
  if (ak.length !== bk.length) return false;
  return ak.every((k) => deepEqual(a[k], b[k]));
}

self.onmessage = (e) => {
  const { code, functionName, testCases } = e.data;
  const start = Date.now();
  const consoleLogs = [];
  const fakeConsole = {
    log: (...args) => consoleLogs.push(args.map((a) => (typeof a === "string" ? a : JSON.stringify(a))).join(" ")),
  };
  let fn;
  try {
    fn = new Function("console", `${code}; return ${functionName};`)(fakeConsole);
    if (typeof fn !== "function") {
      self.postMessage({ caseResults: [], consoleLogs, error: `${functionName} is not defined`, runtimeMs: Date.now() - start });
      return;
    }
  } catch (err) {
    self.postMessage({ caseResults: [], consoleLogs, error: String(err && err.message || err), runtimeMs: Date.now() - start });
    return;
  }
  const caseResults = testCases.map((tc, index) => {
    try {
      const actual = fn(...(tc.input || []));
      return { index, passed: deepEqual(actual, tc.expected), expected: tc.expected, actual };
    } catch (err) {
      return { index, passed: false, expected: tc.expected, error: String(err && err.message || err) };
    }
  });
  self.postMessage({ caseResults, consoleLogs, runtimeMs: Date.now() - start });
};
```

- [ ] **Step 2: Create `lib/runner/run-in-worker.ts`**

```ts
import type { RunResult } from "./types";
import type { TestCase } from "@/content/types";

export function runInWorker(
  code: string,
  functionName: string,
  testCases: TestCase[],
  timeoutMs = 3000,
): Promise<RunResult> {
  return new Promise((resolve) => {
    const worker = new Worker("/runner-worker.js");
    const timer = setTimeout(() => {
      worker.terminate();
      resolve({ caseResults: [], consoleLogs: [], error: "Execution timed out", runtimeMs: timeoutMs });
    }, timeoutMs);

    worker.onmessage = (e: MessageEvent<RunResult>) => {
      clearTimeout(timer);
      worker.terminate();
      resolve(e.data);
    };
    worker.onerror = (e) => {
      clearTimeout(timer);
      worker.terminate();
      resolve({ caseResults: [], consoleLogs: [], error: e.message, runtimeMs: 0 });
    };
    worker.postMessage({ code, functionName, testCases });
  });
}
```

- [ ] **Step 3: Verify build compiles**

Run: `npm run build`
Expected: build succeeds (type-checks).

- [ ] **Step 4: Commit**

```bash
git add public/runner-worker.js lib/runner/run-in-worker.ts
git commit -m "feat: add Web Worker harness with timeout guard"
```

---

### Task 8: DOM iframe harness

**Files:**
- Create: `lib/runner/run-in-iframe.ts`

**Interfaces:**
- Consumes: `RunResult`/`CaseResult` types, `TestCase` from `content/types.ts`.
- Produces: `runInIframe(html, code, testCases, timeoutMs?): Promise<{ result: RunResult; srcdoc: string }>` — builds an iframe `srcdoc` that renders `html`, runs user `code`, evaluates each `assert` expression against the live DOM, captures `console.log`, and `postMessage`s results back. Returns both the structured result and the `srcdoc` so the UI can show the live HTML View.

**Note:** No Vitest unit test (needs a real iframe). Verified manually in Task 11.

- [ ] **Step 1: Create `lib/runner/run-in-iframe.ts`**

```ts
import type { CaseResult, RunResult } from "./types";
import type { TestCase } from "@/content/types";

export function buildSrcdoc(html: string, code: string, testCases: TestCase[]): string {
  const asserts = testCases.map((tc) => ({ description: tc.description ?? "", assert: tc.assert ?? "false" }));
  return `<!doctype html><html><head><meta charset="utf-8"></head><body>
${html}
<script>
(function () {
  var logs = [];
  var _log = console.log;
  console.log = function () {
    logs.push(Array.prototype.slice.call(arguments).map(function (a) {
      return typeof a === "string" ? a : JSON.stringify(a);
    }).join(" "));
    _log.apply(console, arguments);
  };
  var fatal;
  try { ${code} } catch (e) { fatal = String(e && e.message || e); }
  var cases = ${JSON.stringify(asserts)};
  var caseResults = cases.map(function (c, i) {
    try {
      var passed = !!eval(c.assert);
      return { index: i, passed: passed, description: c.description };
    } catch (e) {
      return { index: i, passed: false, description: c.description, error: String(e && e.message || e) };
    }
  });
  parent.postMessage({ __runner: true, caseResults: caseResults, consoleLogs: logs, error: fatal }, "*");
})();
</script>
</body></html>`;
}

export function runInIframe(
  html: string,
  code: string,
  testCases: TestCase[],
  timeoutMs = 3000,
): Promise<{ result: RunResult; srcdoc: string }> {
  const srcdoc = buildSrcdoc(html, code, testCases);
  return new Promise((resolve) => {
    const iframe = document.createElement("iframe");
    iframe.setAttribute("sandbox", "allow-scripts");
    iframe.style.display = "none";
    const start = Date.now();

    const timer = setTimeout(() => {
      cleanup();
      resolve({ result: { caseResults: [], consoleLogs: [], error: "Execution timed out", runtimeMs: timeoutMs }, srcdoc });
    }, timeoutMs);

    function onMessage(e: MessageEvent) {
      if (!e.data || !e.data.__runner) return;
      cleanup();
      const caseResults = e.data.caseResults as CaseResult[];
      resolve({
        result: { caseResults, consoleLogs: e.data.consoleLogs ?? [], error: e.data.error, runtimeMs: Date.now() - start },
        srcdoc,
      });
    }
    function cleanup() {
      clearTimeout(timer);
      window.removeEventListener("message", onMessage);
      iframe.remove();
    }

    window.addEventListener("message", onMessage);
    iframe.srcdoc = srcdoc;
    document.body.appendChild(iframe);
  });
}
```

- [ ] **Step 2: Verify build compiles**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add lib/runner/run-in-iframe.ts
git commit -m "feat: add sandboxed iframe harness for DOM problems"
```

---

### Task 9: Supabase schema & RLS migration

**Files:**
- Create: `supabase/migrations/0001_init.sql`, `docs/supabase-setup.md`

**Interfaces:**
- Consumes: nothing in-repo (run against a Supabase project).
- Produces: SQL that creates `profiles`, `attempts`, `progress` with RLS policies scoping every row to `auth.uid()`. `docs/supabase-setup.md` documents how to apply it and which env vars to set.

**Note:** Verified by applying in the Supabase SQL editor / CLI, not by Vitest.

- [ ] **Step 1: Create `supabase/migrations/0001_init.sql`**

```sql
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text,
  created_at timestamptz default now()
);

create table if not exists attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  problem_id text not null,
  code text not null,
  passed boolean not null,
  tests_passed int not null,
  tests_total int not null,
  runtime_ms int,
  created_at timestamptz default now()
);
create index if not exists attempts_user_problem_idx on attempts (user_id, problem_id);

create table if not exists progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  problem_id text not null,
  status text not null check (status in ('attempted','solved')),
  best_attempt_id uuid references attempts(id) on delete set null,
  updated_at timestamptz default now(),
  primary key (user_id, problem_id)
);

alter table profiles enable row level security;
alter table attempts enable row level security;
alter table progress enable row level security;

create policy "own profile" on profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "own attempts" on attempts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own progress" on progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
```

- [ ] **Step 2: Create `docs/supabase-setup.md`**

```markdown
# Supabase Setup

1. Create a project at supabase.com.
2. In Project Settings → API, copy the Project URL and anon public key into `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. In the SQL Editor, run `supabase/migrations/0001_init.sql`.
4. In Authentication → Providers, enable Email (magic link) and optionally GitHub/Google
   (add their OAuth client id/secret). Set the Site URL and redirect URLs to your
   local (`http://localhost:3000`) and production domains.
```

- [ ] **Step 3: Commit**

```bash
git add supabase/ docs/supabase-setup.md
git commit -m "feat: add Supabase schema, RLS policies, and setup docs"
```

---

### Task 10: Supabase clients & auth

**Files:**
- Create: `lib/supabase/client.ts`, `lib/supabase/server.ts`, `middleware.ts`, `app/login/page.tsx`, `app/auth/callback/route.ts`

**Interfaces:**
- Consumes: env vars `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Produces:
  - `createBrowserClient()` from `lib/supabase/client.ts`.
  - `createServerClient()` (async, cookie-aware) from `lib/supabase/server.ts`.
  - Session-refreshing `middleware.ts`.
  - `/login` page (magic-link + OAuth buttons) and `/auth/callback` route exchanging the code for a session.

- [ ] **Step 1: Install Supabase deps**

```bash
npm install @supabase/supabase-js @supabase/ssr
```

- [ ] **Step 2: Create `lib/supabase/client.ts`**

```ts
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
```

- [ ] **Step 3: Create `lib/supabase/server.ts`**

```ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (toSet) => {
          try {
            toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // called from a Server Component — middleware refreshes the session
          }
        },
      },
    },
  );
}
```

- [ ] **Step 4: Create `middleware.ts`**

```ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (toSet) => {
          toSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          toSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );
  await supabase.auth.getUser();
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
```

- [ ] **Step 5: Create `app/auth/callback/route.ts`**

```ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";
  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }
  return NextResponse.redirect(`${origin}${next}`);
}
```

- [ ] **Step 6: Create `app/login/page.tsx`**

```tsx
"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const supabase = createClient();

  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault();
    await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    });
    setSent(true);
  }
  async function oauth(provider: "github" | "google") {
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
  }

  return (
    <div className="mx-auto max-w-sm p-8 space-y-4">
      <h1 className="text-2xl font-bold">Sign in</h1>
      {sent ? (
        <p>Check your email for a magic link.</p>
      ) : (
        <form onSubmit={sendMagicLink} className="space-y-2">
          <input className="w-full border rounded px-3 py-2 bg-transparent" type="email"
            placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <button className="w-full rounded bg-blue-600 text-white py-2" type="submit">Send magic link</button>
        </form>
      )}
      <div className="flex gap-2">
        <button onClick={() => oauth("github")} className="flex-1 rounded border py-2">GitHub</button>
        <button onClick={() => oauth("google")} className="flex-1 rounded border py-2">Google</button>
      </div>
    </div>
  );
}
```

- [ ] **Step 7: Verify build compiles**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 8: Commit**

```bash
git add lib/supabase/ middleware.ts app/login app/auth
git commit -m "feat: add Supabase clients, auth middleware, and login flow"
```

---

### Task 11: Progress/attempts storage layer

**Files:**
- Create: `lib/progress/store.ts`, `lib/progress/types.ts`

**Interfaces:**
- Consumes: `createClient` from `lib/supabase/client.ts`, `RunResult` from `lib/runner/types.ts`.
- Produces:
  - `recordAttempt(input: RecordAttemptInput): Promise<void>` — inserts an `attempts` row and upserts `progress`.
  - `getProgressForUser(): Promise<Record<string, "attempted" | "solved">>` — problem_id → status map.
  - `getAttemptsForProblem(problemId: string): Promise<AttemptRow[]>`.
  - Types in `lib/progress/types.ts`.

- [ ] **Step 1: Create `lib/progress/types.ts`**

```ts
export type ProgressStatus = "attempted" | "solved";

export type RecordAttemptInput = {
  problemId: string;
  code: string;
  passed: boolean;
  testsPassed: number;
  testsTotal: number;
  runtimeMs: number;
};

export type AttemptRow = {
  id: string;
  problem_id: string;
  passed: boolean;
  tests_passed: number;
  tests_total: number;
  created_at: string;
};
```

- [ ] **Step 2: Create `lib/progress/store.ts`**

```ts
import { createClient } from "@/lib/supabase/client";
import type { AttemptRow, ProgressStatus, RecordAttemptInput } from "./types";

export async function recordAttempt(input: RecordAttemptInput): Promise<void> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: attempt, error } = await supabase
    .from("attempts")
    .insert({
      user_id: user.id,
      problem_id: input.problemId,
      code: input.code,
      passed: input.passed,
      tests_passed: input.testsPassed,
      tests_total: input.testsTotal,
      runtime_ms: input.runtimeMs,
    })
    .select("id")
    .single();
  if (error) throw error;

  const status: ProgressStatus = input.passed ? "solved" : "attempted";
  await supabase.from("progress").upsert(
    { user_id: user.id, problem_id: input.problemId, status, best_attempt_id: attempt.id, updated_at: new Date().toISOString() },
    { onConflict: "user_id,problem_id" },
  );
}

export async function getProgressForUser(): Promise<Record<string, ProgressStatus>> {
  const supabase = createClient();
  const { data } = await supabase.from("progress").select("problem_id,status");
  const map: Record<string, ProgressStatus> = {};
  (data ?? []).forEach((r) => (map[r.problem_id] = r.status as ProgressStatus));
  return map;
}

export async function getAttemptsForProblem(problemId: string): Promise<AttemptRow[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("attempts")
    .select("id,problem_id,passed,tests_passed,tests_total,created_at")
    .eq("problem_id", problemId)
    .order("created_at", { ascending: false });
  return (data ?? []) as AttemptRow[];
}
```

- [ ] **Step 3: Verify build compiles**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 4: Commit**

```bash
git add lib/progress/
git commit -m "feat: add Supabase-backed attempts/progress store"
```

---

### Task 12: Landing & track/topic pages

**Files:**
- Create: `app/page.tsx` (replace default), `app/learn/[track]/page.tsx`, `components/ProblemList.tsx`
- Modify: `app/layout.tsx` (title/metadata, nav)

**Interfaces:**
- Consumes: `getProblemsByTrack`, `TOPICS`, `Track` from content modules.
- Produces: `/` with two track cards; `/learn/javascript` and `/learn/data-structures` listing topics with their problems (title, difficulty, link to `/problem/[id]`).

- [ ] **Step 1: Replace `app/page.tsx`**

```tsx
import Link from "next/link";
import { getProblemsByTrack } from "@/content";

export default function Home() {
  const js = getProblemsByTrack("javascript").length;
  const ds = getProblemsByTrack("data-structures").length;
  const cards = [
    { href: "/learn/javascript", title: "JavaScript", desc: "Core language: arrays, closures, async, DOM & more.", count: js },
    { href: "/learn/data-structures", title: "Data Structures in JS", desc: "Stacks, queues, linked lists, trees, graphs & more.", count: ds },
  ];
  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="text-4xl font-bold mb-2">Octagram Labs — Learn JavaScript</h1>
      <p className="text-gray-500 mb-8">Practice in the browser. Run code, pass tests, track progress.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className="rounded-xl border p-6 hover:border-blue-500 transition">
            <h2 className="text-xl font-semibold">{c.title}</h2>
            <p className="text-sm text-gray-500 mt-1">{c.desc}</p>
            <p className="text-xs text-gray-400 mt-3">{c.count} problems</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Create `components/ProblemList.tsx`**

```tsx
import Link from "next/link";
import { TOPICS } from "@/content/manifest";
import { getProblemsByTopic } from "@/content";
import type { Track } from "@/content/types";

export function ProblemList({ track }: { track: Track }) {
  return (
    <div className="space-y-8">
      {TOPICS[track].map((t) => {
        const problems = getProblemsByTopic(track, t.topic);
        if (problems.length === 0) return null;
        return (
          <section key={t.topic}>
            <h2 className="text-lg font-semibold mb-2">{t.label}</h2>
            <ul className="divide-y rounded-lg border">
              {problems.map((p) => (
                <li key={p.id}>
                  <Link href={`/problem/${p.id}`} className="flex justify-between px-4 py-3 hover:bg-gray-500/5">
                    <span>{p.title}</span>
                    <span className="text-xs uppercase text-gray-400">{p.difficulty}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 3: Create `app/learn/[track]/page.tsx`**

```tsx
import { notFound } from "next/navigation";
import { ProblemList } from "@/components/ProblemList";
import type { Track } from "@/content/types";

const VALID: Track[] = ["javascript", "data-structures"];

export default async function TrackPage({ params }: { params: Promise<{ track: string }> }) {
  const { track } = await params;
  if (!VALID.includes(track as Track)) notFound();
  const title = track === "javascript" ? "JavaScript" : "Data Structures in JS";
  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-3xl font-bold mb-6">{title}</h1>
      <ProblemList track={track as Track} />
    </main>
  );
}
```

- [ ] **Step 4: Verify in browser**

Run: `npm run dev`
Visit `http://localhost:3000` → two cards with counts. Click JavaScript → topic-grouped problem list. Click a problem → 404 for now (playground added next).

- [ ] **Step 5: Commit**

```bash
git add app/ components/
git commit -m "feat: add landing and track/topic listing pages"
```

---

### Task 13: Results panel components

**Files:**
- Create: `components/playground/ResultsTabs.tsx`, `components/playground/TestResults.tsx`, `components/playground/ConsoleOutput.tsx`, `components/playground/HtmlView.tsx`

**Interfaces:**
- Consumes: `RunResult`/`CaseResult` from `lib/runner/types.ts`, `Problem` from content.
- Produces: `<ResultsTabs problem result srcdoc />` rendering tabs `Tests | Console | HTML View` (HTML View only when `problem.kind === "dom"`), composed of `TestResults`, `ConsoleOutput`, `HtmlView`.

- [ ] **Step 1: Create `components/playground/TestResults.tsx`**

```tsx
import type { RunResult } from "@/lib/runner/types";

export function TestResults({ result }: { result: RunResult | null }) {
  if (!result) return <p className="p-4 text-sm text-gray-400">Run your code to see results.</p>;
  if (result.error) return <pre className="p-4 text-sm text-red-500 whitespace-pre-wrap">{result.error}</pre>;
  return (
    <ul className="p-4 space-y-2">
      {result.caseResults.map((c) => (
        <li key={c.index} className={`text-sm rounded px-3 py-2 ${c.passed ? "bg-green-500/10" : "bg-red-500/10"}`}>
          <span className="font-medium">{c.passed ? "✓" : "✗"} Case {c.index + 1}</span>
          {c.description && <span className="ml-2 text-gray-400">{c.description}</span>}
          {!c.passed && c.error && <div className="text-red-500 mt-1">{c.error}</div>}
          {!c.passed && !c.error && "expected" in c && (
            <div className="text-gray-400 mt-1">expected {JSON.stringify(c.expected)}, got {JSON.stringify(c.actual)}</div>
          )}
        </li>
      ))}
    </ul>
  );
}
```

- [ ] **Step 2: Create `components/playground/ConsoleOutput.tsx`**

```tsx
import type { RunResult } from "@/lib/runner/types";

export function ConsoleOutput({ result }: { result: RunResult | null }) {
  const logs = result?.consoleLogs ?? [];
  if (logs.length === 0) return <p className="p-4 text-sm text-gray-400">No console output.</p>;
  return (
    <pre className="p-4 text-sm font-mono whitespace-pre-wrap">{logs.join("\n")}</pre>
  );
}
```

- [ ] **Step 3: Create `components/playground/HtmlView.tsx`**

```tsx
export function HtmlView({ srcdoc }: { srcdoc: string | null }) {
  if (!srcdoc) return <p className="p-4 text-sm text-gray-400">Run your code to see the rendered HTML.</p>;
  return (
    <iframe title="HTML preview" sandbox="allow-scripts" srcDoc={srcdoc} className="w-full h-full min-h-[300px] bg-white" />
  );
}
```

- [ ] **Step 4: Create `components/playground/ResultsTabs.tsx`**

```tsx
"use client";
import { useState } from "react";
import type { RunResult } from "@/lib/runner/types";
import type { Problem } from "@/content/types";
import { TestResults } from "./TestResults";
import { ConsoleOutput } from "./ConsoleOutput";
import { HtmlView } from "./HtmlView";

export function ResultsTabs({ problem, result, srcdoc }: { problem: Problem; result: RunResult | null; srcdoc: string | null }) {
  const tabs = problem.kind === "dom" ? (["Tests", "Console", "HTML View"] as const) : (["Tests", "Console"] as const);
  const [active, setActive] = useState<string>("Tests");
  return (
    <div className="flex flex-col h-full border-l">
      <div className="flex border-b">
        {tabs.map((t) => (
          <button key={t} onClick={() => setActive(t)}
            className={`px-4 py-2 text-sm ${active === t ? "border-b-2 border-blue-500 font-medium" : "text-gray-400"}`}>
            {t}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-auto">
        {active === "Tests" && <TestResults result={result} />}
        {active === "Console" && <ConsoleOutput result={result} />}
        {active === "HTML View" && <HtmlView srcdoc={srcdoc} />}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Verify build compiles**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 6: Commit**

```bash
git add components/playground/
git commit -m "feat: add results tabs (Tests/Console/HTML View)"
```

---

### Task 14: Playground page (Monaco + wiring)

**Files:**
- Create: `app/problem/[id]/page.tsx`, `components/playground/Playground.tsx`, `components/playground/PromptPanel.tsx`
- Install: `@monaco-editor/react`

**Interfaces:**
- Consumes: `getProblem` (server), `runInWorker`, `runInIframe`, `recordAttempt`, `ResultsTabs`, Monaco editor.
- Produces: `/problem/[id]` — a 3-pane playground. Run executes visible cases; Submit executes all cases and calls `recordAttempt` (redirects to `/login` if signed out). Reset restores starter code; Show Solution loads the reference solution into the editor.

- [ ] **Step 1: Install Monaco**

```bash
npm install @monaco-editor/react
```

- [ ] **Step 2: Create `components/playground/PromptPanel.tsx`**

```tsx
import type { Problem } from "@/content/types";

export function PromptPanel({ problem }: { problem: Problem }) {
  return (
    <div className="p-5 overflow-auto space-y-4">
      <div>
        <h1 className="text-xl font-bold">{problem.title}</h1>
        <span className="text-xs uppercase text-gray-400">{problem.topic} · {problem.difficulty}</span>
      </div>
      <p className="whitespace-pre-wrap text-sm">{problem.prompt}</p>
      {problem.hints && problem.hints.length > 0 && (
        <details className="text-sm">
          <summary className="cursor-pointer text-blue-500">Hints</summary>
          <ul className="list-disc pl-5 mt-2">{problem.hints.map((h, i) => <li key={i}>{h}</li>)}</ul>
        </details>
      )}
      {problem.resources.length > 0 && (
        <div className="text-sm">
          <h3 className="font-semibold mb-1">Learning resources</h3>
          <ul className="list-disc pl-5">
            {problem.resources.map((r) => (
              <li key={r.url}><a className="text-blue-500 underline" href={r.url} target="_blank" rel="noreferrer">{r.label}</a></li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Create `components/playground/Playground.tsx`**

```tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Editor from "@monaco-editor/react";
import type { Problem } from "@/content/types";
import type { RunResult } from "@/lib/runner/types";
import { runInWorker } from "@/lib/runner/run-in-worker";
import { runInIframe } from "@/lib/runner/run-in-iframe";
import { recordAttempt } from "@/lib/progress/store";
import { createClient } from "@/lib/supabase/client";
import { PromptPanel } from "./PromptPanel";
import { ResultsTabs } from "./ResultsTabs";

export function Playground({ problem }: { problem: Problem }) {
  const router = useRouter();
  const [code, setCode] = useState(problem.starterCode);
  const [result, setResult] = useState<RunResult | null>(null);
  const [srcdoc, setSrcdoc] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function execute(onlyVisible: boolean): Promise<RunResult> {
    const cases = onlyVisible ? problem.testCases.filter((t) => !t.hidden) : problem.testCases;
    if (problem.kind === "dom") {
      const { result, srcdoc } = await runInIframe(problem.html!, code, cases);
      setSrcdoc(srcdoc);
      return result;
    }
    return runInWorker(code, problem.functionName!, cases);
  }

  async function onRun() {
    setBusy(true);
    setResult(await execute(true));
    setBusy(false);
  }

  async function onSubmit() {
    setBusy(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }
    const r = await execute(false);
    setResult(r);
    const passedCount = r.caseResults.filter((c) => c.passed).length;
    const total = r.caseResults.length;
    try {
      await recordAttempt({
        problemId: problem.id, code,
        passed: total > 0 && passedCount === total && !r.error,
        testsPassed: passedCount, testsTotal: total, runtimeMs: r.runtimeMs,
      });
    } catch { /* non-blocking: results stay visible */ }
    setBusy(false);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr_1fr] h-[calc(100vh-3rem)]">
      <div className="border-r overflow-auto"><PromptPanel problem={problem} /></div>
      <div className="flex flex-col">
        <div className="flex-1 min-h-0">
          <Editor height="100%" defaultLanguage="javascript" theme="vs-dark"
            value={code} onChange={(v) => setCode(v ?? "")} options={{ minimap: { enabled: false }, fontSize: 14 }} />
        </div>
        <div className="flex gap-2 p-2 border-t">
          <button disabled={busy} onClick={onRun} className="rounded border px-4 py-1.5 text-sm">Run</button>
          <button disabled={busy} onClick={onSubmit} className="rounded bg-blue-600 text-white px-4 py-1.5 text-sm">Submit</button>
          <button onClick={() => setCode(problem.starterCode)} className="rounded border px-4 py-1.5 text-sm">Reset</button>
          <button onClick={() => setCode(problem.solution)} className="ml-auto rounded border px-4 py-1.5 text-sm">Show Solution</button>
        </div>
      </div>
      <ResultsTabs problem={problem} result={result} srcdoc={srcdoc} />
    </div>
  );
}
```

- [ ] **Step 4: Create `app/problem/[id]/page.tsx`**

```tsx
import { notFound } from "next/navigation";
import { getProblem } from "@/content";
import { Playground } from "@/components/playground/Playground";

export default async function ProblemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const problem = getProblem(id);
  if (!problem) notFound();
  return <Playground problem={problem} />;
}
```

- [ ] **Step 5: Manual verification (function + DOM + timeout)**

Run: `npm run dev`. Then:
- Open `/problem/js-arrays-001`. Click **Run** → all visible cases pass in the Tests tab.
- Break the code (e.g. `return arr.length`), Run → cases show expected vs got.
- Add `console.log("debug")` → Console tab shows it.
- Open `/problem/js-dom-001`. Run → Tests pass and the **HTML View** tab renders the `<li>`.
- Write `while(true){}` in a function problem, Run → after ~3s, Tests shows "Execution timed out".
- Click **Submit** while signed out → redirected to `/login`.

Expected: all behaviors as described.

- [ ] **Step 6: Commit**

```bash
git add app/problem components/playground app/ package.json package-lock.json
git commit -m "feat: add Monaco playground page with run/submit/reset/solution"
```

---

### Task 15: Dashboard, nav, and deploy config

**Files:**
- Create: `app/dashboard/page.tsx`, `components/Nav.tsx`, `vercel.ts`
- Modify: `app/layout.tsx` (mount `Nav`)

**Interfaces:**
- Consumes: `createClient` (server) for the signed-in user, `getProgressForUser`, `getAllProblems`.
- Produces: `/dashboard` showing solved/attempted counts and recent attempts; a top nav with track links + sign-in/out; `vercel.ts` setting the Next.js framework and build command.

- [ ] **Step 1: Create `components/Nav.tsx`**

```tsx
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export async function Nav() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return (
    <nav className="flex items-center gap-4 px-6 h-12 border-b text-sm">
      <Link href="/" className="font-semibold">Octagram Labs</Link>
      <Link href="/learn/javascript">JavaScript</Link>
      <Link href="/learn/data-structures">Data Structures</Link>
      <div className="ml-auto flex gap-4">
        {user ? <Link href="/dashboard">Dashboard</Link> : <Link href="/login">Sign in</Link>}
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Mount `Nav` in `app/layout.tsx`**

Inside `<body>`, above `{children}`:
```tsx
import { Nav } from "@/components/Nav";
// ...
<Nav />
{children}
```

- [ ] **Step 3: Create `app/dashboard/page.tsx`**

```tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAllProblems } from "@/content";

export default async function Dashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: progress } = await supabase.from("progress").select("problem_id,status");
  const { data: attempts } = await supabase
    .from("attempts").select("problem_id,passed,created_at")
    .order("created_at", { ascending: false }).limit(20);

  const solved = (progress ?? []).filter((p) => p.status === "solved").length;
  const attempted = (progress ?? []).length;
  const total = getAllProblems().length;

  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-2xl font-bold mb-4">Your progress</h1>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Stat label="Solved" value={solved} />
        <Stat label="Attempted" value={attempted} />
        <Stat label="Total problems" value={total} />
      </div>
      <h2 className="font-semibold mb-2">Recent attempts</h2>
      <ul className="divide-y border rounded-lg">
        {(attempts ?? []).map((a, i) => (
          <li key={i} className="flex justify-between px-4 py-2 text-sm">
            <span>{a.problem_id}</span>
            <span className={a.passed ? "text-green-500" : "text-red-500"}>{a.passed ? "Passed" : "Failed"}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border p-4 text-center">
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-xs text-gray-400">{label}</div>
    </div>
  );
}
```

- [ ] **Step 4: Create `vercel.ts`**

```ts
import type { VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
  framework: "nextjs",
  buildCommand: "next build",
};
```

Install the config type:
```bash
npm install -D @vercel/config
```

- [ ] **Step 5: Verify build + manual check**

Run: `npm run build`
Expected: build succeeds.
Run: `npm run dev`, sign in via magic link, solve `js-arrays-001` (Submit), open `/dashboard` → Solved = 1, the attempt appears under Recent attempts.

- [ ] **Step 6: Commit**

```bash
git add app/ components/Nav.tsx vercel.ts package.json package-lock.json
git commit -m "feat: add dashboard, nav, and Vercel config"
```

---

## Notes for the implementer

- **Adding more problems** (toward 250 + 150): append objects to `content/problems/javascript.ts` / `content/problems/data-structures.ts`. The `content/solutions.test.ts` and `content/index.test.ts` tests automatically validate every new problem — run `npm test -- content/` after adding.
- **Keep `public/runner-worker.js` in sync** with `lib/runner/run-function.ts` if you change execution semantics; they intentionally mirror each other (the worker can't import TS).
- **Supabase env**: the app builds without env vars but auth/Submit/dashboard need a real Supabase project configured per `docs/supabase-setup.md`. Set the same `NEXT_PUBLIC_*` vars in the Vercel project.
- **Deploy**: push to GitHub, import the repo in Vercel, add the two env vars, deploy. Set the Supabase Auth Site URL / redirect URLs to the production domain.
```
