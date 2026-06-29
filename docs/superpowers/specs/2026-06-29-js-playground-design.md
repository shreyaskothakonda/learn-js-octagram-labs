# learn.octagramlabs.com — JavaScript Playground (v1) Design

**Date:** 2026-06-29
**Status:** Approved
**Target:** A HackerRank/Codewars-style learning playground for JavaScript and Data
Structures in JS, deployed on Vercel.

## 1. Goal & Scope

Build a working, deployable in-browser coding playground for learning and practicing
JavaScript. Users read a problem, write code in a VS Code-like editor, run it against
test cases, see output, and read learning resources. Progress and every attempt are
persisted per authenticated user.

**Content targets (data-driven, grown incrementally):**
- **JavaScript track:** 250 questions, categorized by topic.
- **Data Structures in JS track:** 150 questions, categorized by topic.

**v1 deliverable:** the complete platform plus a seed of ~30 polished questions across
the early topics of both tracks. Remaining questions are added later as pure data files
with no code changes.

### Out of scope for v1 (YAGNI)
Leaderboards, discussion/comments, code sharing, multi-language support, server-side
code execution, the full 400-question bank (pipeline-fed later), and a mobile-optimized
editor. The progress/auth layer is abstracted so adding these later is not a rewrite.

## 2. Architecture Overview

```
Next.js 16 (App Router, TypeScript) on Vercel
  - Topic navigation (sidebar)
  - Monaco editor (VS Code-like), center pane
  - Right panel: tabbed Tests | Console | HTML View
  - Execution happens entirely client-side:
      * function problems -> Web Worker sandbox
      * dom problems      -> sandboxed <iframe>
  - On Submit: results written to Supabase via @supabase/ssr
Question bank = static typed data files in /content (in repo, NOT in DB)
Supabase = Auth + Postgres (RLS) for user data only (attempts, progress)
```

Key principles:
- **Questions are static repo data**, not DB rows — fast, versioned, free, easy to grow.
- **Supabase stores only user data** (auth, attempts, progress) — tiny DB.
- **User code never reaches the server** — runs in a Web Worker or sandboxed iframe, so
  it is safe and costs nothing to run.

## 3. Tech Stack

- **Next.js 16** (App Router, TypeScript), deployed on Vercel.
- **Monaco Editor** via `@monaco-editor/react` — the real VS Code editor component with
  JS syntax highlighting and IntelliSense.
- **Tailwind CSS + shadcn/ui** — clean, dark-mode-first UI.
- **Web Worker** — sandboxed execution + test-runner harness for `function` problems.
- **Sandboxed `<iframe>`** (`sandbox="allow-scripts"`) — execution + HTML preview for
  `dom` problems.
- **Supabase** — `@supabase/ssr` for auth (email magic-link + GitHub/Google OAuth),
  Postgres with Row-Level Security.

## 4. Content Model

Each problem is one typed object. The question bank is a set of these objects plus a
topic manifest.

```ts
type Problem = {
  id: string;                 // "js-arrays-002"
  track: "javascript" | "data-structures";
  topic: string;              // "Arrays", "Closures", "Linked Lists", "DOM Manipulation"...
  difficulty: "easy" | "medium" | "hard";
  title: string;
  prompt: string;             // markdown
  kind: "function" | "dom";   // function -> Web Worker; dom -> sandboxed iframe
  starterCode: string;        // pre-filled function signature / DOM script skeleton
  solution: string;           // reference solution (hidden, revealed via "Show Solution")
  functionName?: string;      // function problems: entry point the runner calls
  html?: string;              // dom problems: starting HTML scaffold
  testCases: {
    // function problems: input/expected for deep-equal on return value
    input?: unknown[];
    expected?: unknown;
    // dom problems: a human-readable description + an assertion expression
    // (string of JS evaluated inside the iframe against the live DOM, must
    //  return a boolean), e.g. "document.querySelectorAll('.todo').length === 3"
    description?: string;
    assert?: string;
    hidden?: boolean;
  }[];
  resources: { label: string; url: string }[];  // e.g. MDN links
  hints?: string[];
};
```

### Topics

**JavaScript track (target 250):** Variables & Types · Operators · Strings · Arrays ·
Objects · Functions & Scope · Closures · Higher-Order Functions · Array Methods
(map/filter/reduce) · Recursion · ES6+ (destructuring, spread, modules) · Async &
Promises · Regex · Error Handling · **DOM Manipulation**.

**Data Structures track (target 150):** Arrays & Two-Pointers · Hash Maps/Sets · Stacks ·
Queues · Linked Lists · Trees · BST · Graphs (BFS/DFS) · Heaps · Tries · Sorting ·
Searching · Sliding Window · Dynamic Programming.

A topic manifest defines display order, labels, and per-topic problem counts.

## 5. Execution & Test-Runner

Two execution paths share one playground UI. The `kind` field selects the path.

### `function` problems (Web Worker)
1. User clicks Run (visible tests) or Submit (all tests). Editor code + test cases are
   posted to a Web Worker.
2. The worker wraps the code, calls `functionName(...input)` per test case inside a
   try/catch with a **timeout guard** that kills infinite loops.
3. Result is deep-equal compared against `expected`.
4. Worker returns `{ caseResults[], consoleLogs[], error? }`. The right panel renders
   pass/fail per case, captured `console.log`, and errors with line info.

### `dom` problems (sandboxed iframe)
1. The iframe loads the problem's `html` scaffold with the user's JS injected.
2. The iframe renders -> the **HTML View** pane shows the live result. `console.log` is
   piped out to the **Console** pane via `postMessage`.
3. After scripts run, a test harness inside the iframe runs each assertion against the
   live DOM (e.g. `document.querySelectorAll('.todo').length === 3`, text/attribute
   checks) and posts pass/fail per case back to the app.
4. Timeout guard still applies. The iframe is fully sandboxed (`allow-scripts` only, no
   same-origin access to the host app).

### Run vs Submit
- **Run** executes visible (non-hidden) test cases only; no DB write.
- **Submit** executes all test cases; writes one `attempts` row and upserts `progress`
  (status -> `solved` if all pass, else `attempted`).

## 6. Database Schema (Supabase, RLS-protected)

```sql
profiles (
  id uuid primary key references auth.users(id),
  username text,
  created_at timestamptz default now()
);

attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  problem_id text not null,
  code text not null,
  passed boolean not null,
  tests_passed int not null,
  tests_total int not null,
  runtime_ms int,
  created_at timestamptz default now()
);

progress (
  user_id uuid references auth.users(id) not null,
  problem_id text not null,
  status text not null check (status in ('attempted','solved')),
  best_attempt_id uuid references attempts(id),
  updated_at timestamptz default now(),
  primary key (user_id, problem_id)
);
```

- **Attempts = one row per Submit**, giving full history + counts.
- **Progress = rolled-up current state per problem.**
- Every row is scoped to `auth.uid()` via Row-Level Security policies (select/insert/
  update restricted to the owning user).

## 7. Pages / UI

- `/` — landing: two track cards (JavaScript / Data Structures) + progress summary.
- `/learn/[track]` — topic list with per-topic solved counts and difficulty filters.
- `/problem/[id]` — the **3-pane playground**:
  - Left: prompt (markdown) + learning resources + hints.
  - Center: Monaco editor with Run / Submit / Reset / Show Solution buttons.
  - Right: tabbed **Tests | Console | HTML View** (HTML View tab only shown for `dom`
    problems).
- `/login` — Supabase auth (magic-link + GitHub/Google OAuth).
- `/dashboard` — attempts history, solved/attempted stats, streak.

## 8. Component / Module Boundaries

- `content/` — problem data files + topic manifest + a typed loader. No UI, no DB.
- `lib/runner/` — Web Worker harness, iframe harness, deep-equal, timeout guard.
  Pure execution logic, independent of React and Supabase.
- `lib/supabase/` — typed client (server + browser), auth helpers.
- `lib/progress/` — small interface over Supabase for reading/writing attempts and
  progress, so the storage backend can change without touching UI.
- `components/playground/` — editor, results tabs, HTML view, prompt panel.
- `app/` — routes/pages composing the above.

Each unit has a single purpose, a clear interface, and is testable independently of the
others (e.g. the runner can be unit-tested without React; the content loader without
Supabase).

## 9. Error Handling

- **User code errors** (syntax/runtime) are caught in the worker/iframe and surfaced in
  the Console pane with message and, where available, line info — never crash the app.
- **Infinite loops / long runs** are killed by the timeout guard; the UI reports a
  timeout.
- **Supabase failures** on Submit do not lose the user's result locally; the UI shows a
  non-blocking error and the run results remain visible.
- **Auth-required actions** (Submit, dashboard) redirect to `/login` when signed out;
  reading problems and using Run is allowed without auth.

## 10. Testing Strategy

- **Runner unit tests:** deep-equal correctness, timeout guard, console capture, DOM
  assertion harness — exercised without the browser UI where possible.
- **Content validation test:** every problem object conforms to the schema; `function`
  problems have `functionName` + `input`/`expected`; `dom` problems have `html` +
  assertion test cases; the reference `solution` passes all of its own test cases.
- **Component tests** for the playground panels (render prompt, switch tabs, show
  pass/fail states).
- **Auth/DB:** RLS policies verified so a user cannot read another user's attempts.
```
