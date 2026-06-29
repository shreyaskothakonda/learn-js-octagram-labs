# Align JavaScript Track to "The Complete JavaScript Course 2025" (Jonas Schmedtmann)

**Date:** 2026-06-30
**Decisions:** Re-map JS topics to course sections; aggressive volume (~250+ JS); course
references across all tracks.

## Course (parsed)
21 sections, 340 lectures. Reference saved at `docs/course-curriculum.json`. Practiceable
sections: 2, 3, 7/13 (DOM), 8, 9, 10, 11, 12, 14, 16, 17. The rest are setup, HTML/CSS,
Git, and large project builds (Bankist/Mapty/Forkify), which are not function-practice.

## Schema
Add an optional `course` reference to `Problem`:
`course?: { section: number; sectionTitle: string; lecture: number; lectureName: string }`.
Rendered in the prompt panel as a "Course" line. Video links are deferred; section +
lecture number + name now.

## JavaScript track topics (course-aligned, ordered)
1. Fundamentals: Part 1 (S2)  2. Fundamentals: Part 2 (S3)  3. Behind the Scenes (S8)
4. Data Structures, Operators & Strings (S9)  5. A Closer Look at Functions (S10)
6. Working With Arrays (S11)  7. Numbers, Dates & Timers (S12)  8. DOM & Events (S7/S13)
9. Object-Oriented Programming (S14)  10. Asynchronous JavaScript (S16)
11. Modern JavaScript (S17)  12. Beyond the Course (Regex, Iterators & Generators — not in this course).

## Re-tag of existing 150 (old topic -> new topic / section / lecture)
Variables & Types, Operators -> Fundamentals: Part 1 (S2). Strings, Objects, ES6+ ->
Data Structures, Operators & Strings (S9). Functions & Scope, Closures, HOF, Recursion ->
A Closer Look at Functions (S10). Arrays, Array Methods -> Working With Arrays (S11).
DOM Manipulation -> DOM & Events (S7). Classes & Prototypes -> OOP (S14). Async & Promises,
Error Handling -> Asynchronous JavaScript (S16). Regex, Iterators & Generators -> Beyond the Course.

## New questions (to reach ~250+)
Fill thin/empty sections: Fundamentals Part 2 (functions intro, arrays/objects intro, loops),
Behind the Scenes (scope, hoisting/TDZ, this, references), Numbers/Dates/Timers, Modern JS
(modules concepts, functional principles), plus more Arrays/OOP/Async. Aggressive target.

## Other tracks
DSA and React keep their own topic structure but gain a `course` reference to the
underlying JS lecture where genuine (e.g., React immutable updates -> S9 spread; DSA array
work -> S11). Where no honest mapping exists, course is omitted.

## Verification
Existing self-test harness (schema, unique ids, function/dom solution self-tests) plus build.
