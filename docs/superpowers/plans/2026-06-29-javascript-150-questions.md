# JavaScript Track: 150 Questions Plan

**Date:** 2026-06-29
**Goal:** Grow the JavaScript track to 150 problems covering every major JS topic.
**Status:** Proposed (23 problems exist today; this plan adds 127).

> Target note: the original design set 250 for JavaScript. This plan revises that to
> 150 to match the Data Structures track and keep the two balanced. The schema still
> supports growing past 150 later with no code changes.

## Global Constraints (every problem must satisfy)

- Conforms to the existing `Problem` type in `content/types.ts`.
- `function` problems: `functionName` + `input`/`expected` per case; reference `solution`
  passes all its own cases (enforced by `content/solutions.test.ts`).
- `dom` problems: `html` scaffold + `assert` expressions returning boolean per case;
  reference solution verified in jsdom by `content/dom-solutions.test.ts`.
- Deterministic outputs only. Where an algorithm could emit results in varying order
  (e.g. object key walks, backtracking), the solution fixes a canonical order and
  `expected` matches it.
- Closures / higher-order problems return data values, not function references (the
  JSON-based deep-equal cannot compare functions); prompts state the shape returned.
- Each problem: clear markdown `prompt`, `starterCode` stub, 3+ test cases with 1+
  `hidden`, at least one real MDN/Wikipedia `resources` link, optional `hints`.
- No em dashes in any copy (project style).
- IDs: `js-<topic-slug>-NNN`, zero-padded, continuing from existing numbers per topic.
- Unique IDs across the whole bank (enforced by `content/index.test.ts`).

## Topic Distribution (target = 150)

| # | Topic | Kind | Target | Exists | To add | Difficulty mix (E/M/H) |
|---|-------|------|-------:|------:|------:|------------------------|
| 1 | Variables & Types | function | 8 | 0 | 8 | 5 / 3 / 0 |
| 2 | Operators *(new topic)* | function | 7 | 0 | 7 | 5 / 2 / 0 |
| 3 | Strings | function | 11 | 3 | 8 | 4 / 5 / 2 |
| 4 | Arrays | function | 11 | 3 | 8 | 4 / 5 / 2 |
| 5 | Array Methods (map/filter/reduce) | function | 13 | 3 | 10 | 4 / 7 / 2 |
| 6 | Objects | function | 11 | 2 | 9 | 4 / 5 / 2 |
| 7 | Functions & Scope | function | 9 | 1 | 8 | 4 / 4 / 1 |
| 8 | Closures | function | 8 | 2 | 6 | 2 / 5 / 1 |
| 9 | Higher-Order Functions | function | 8 | 2 | 6 | 2 / 5 / 1 |
| 10 | Recursion | function | 9 | 3 | 6 | 3 / 4 / 2 |
| 11 | ES6+ (destructuring, spread, etc.) | function | 9 | 2 | 7 | 4 / 4 / 1 |
| 12 | Classes & Prototypes *(new topic)* | function | 8 | 0 | 8 | 3 / 4 / 1 |
| 13 | Async & Promises | function | 9 | 0 | 9 | 2 / 5 / 2 |
| 14 | Iterators & Generators *(new topic)* | function | 5 | 0 | 5 | 1 / 3 / 1 |
| 15 | Regex | function | 7 | 0 | 7 | 3 / 3 / 1 |
| 16 | Error Handling | function | 5 | 0 | 5 | 3 / 2 / 0 |
| 17 | DOM Manipulation | dom | 12 | 2 | 10 | 5 / 5 / 2 |
| | **Total** | | **150** | **23** | **127** | ~58 / 67 / 20 |

Three new topics are added to `content/manifest.ts` (under `javascript`): **Operators**,
**Classes & Prototypes**, **Iterators & Generators**. The other 14 already exist.

Async problems return resolved values: each `solution` is an `async function` (or returns
a Promise) and the test harness `await`s it. (Harness note: `solutions.test.ts` currently
calls solutions synchronously; Task 0 below adds Promise-aware handling so async problems
can self-verify.)

## File Organization

Keep files focused instead of one giant file. New problems are grouped into themed files,
each exporting a `Problem[]`; `content/index.ts` aggregates them.

- `content/problems/javascript.ts` — existing 23 (unchanged).
- `content/problems/js-fundamentals.ts` — Variables & Types, Operators, Strings, Arrays, Objects.
- `content/problems/js-functions.ts` — Functions & Scope, Closures, Higher-Order Functions, Array Methods, Recursion.
- `content/problems/js-modern.ts` — ES6+, Classes & Prototypes, Iterators & Generators.
- `content/problems/js-async-regex-errors.ts` — Async & Promises, Regex, Error Handling.
- `content/problems/js-dom.ts` — DOM Manipulation.

## Build Sequence (each task ends green: `npm test` + `npm run build`)

- **Task 0 — Harness + manifest prep.** Add the 3 new topics to `manifest.ts`. Make
  `content/solutions.test.ts` await async solutions (so Promise-returning problems verify).
  Create the five empty themed files and wire their exports into `content/index.ts`.
  Verify suite still green. Commit.
- **Task 1 — Fundamentals (42 new).** Fill `js-fundamentals.ts`. Run `npm test -- content/`
  until every solution self-verifies. Commit + push.
- **Task 2 — Functions & logic (36 new).** Fill `js-functions.ts`. Verify. Commit + push.
- **Task 3 — Modern JS (20 new).** Fill `js-modern.ts`. Verify. Commit + push.
- **Task 4 — Async, Regex, Errors (21 new).** Fill `js-async-regex-errors.ts`. Verify. Commit + push.
- **Task 5 — DOM (10 new).** Fill `js-dom.ts` (kind `dom`). Verify with `dom-solutions.test.ts`. Commit + push.
- **Task 6 — Final sweep.** Confirm JS total = 150, all 17 topics non-empty, full suite
  green, build clean, landing page count reads 150. Commit + push.

## Verification Gates (automatic, per task)

- `content/index.test.ts` — all problems schema-valid, IDs unique.
- `content/solutions.test.ts` — every `function` solution passes its own cases.
- `content/dom-solutions.test.ts` — every `dom` solution passes its asserts in jsdom.
- `npm run build` — type-checks and compiles.

## Out of Scope

No editor/runner/UI changes (the platform already supports all of this). No changes to
the DSA track. Topics beyond the 17 listed (e.g. dates, modules tooling) are deferred.
