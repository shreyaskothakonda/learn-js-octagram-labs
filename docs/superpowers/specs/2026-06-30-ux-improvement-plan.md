# Platform UX Improvement Plan

**Date:** 2026-06-30
**Goal:** Raise the whole platform from "functional" to a polished, LeetCode/Codecademy-grade
learning experience, without changing the problem content or the in-browser execution model.

## Method
Audited the live UI and compared against established practice-platform patterns
(LeetCode, HackerRank, Exercism, Codecademy). Findings are grounded in the actual
components, not generic advice.

## Current-state audit (key gaps)
- **Problem lists** (`components/ProblemList.tsx`): no solved/attempted status, difficulty
  is plain gray text, no search or filtering, no per-topic or track progress.
- **Playground** (`components/playground/Playground.tsx`): fixed, non-resizable 3-pane
  grid; Monaco hardcoded to `vs-dark` regardless of app theme; no keyboard shortcuts;
  loading shown only as disabled buttons; no success celebration or next-problem nav;
  editor code is lost on refresh; weak on small screens.
- **Theme** (`app/globals.css`): `body` font forced to Arial, overriding the loaded Geist
  fonts; dark mode is `prefers-color-scheme` only with no toggle; Monaco and the DOM
  HTML-View iframe don't follow the theme.
- **Dashboard** (`app/dashboard/page.tsx`): flat counters + a plain list; no progress
  bars, no difficulty breakdown, no streak/activity, attempts don't link to problems.
- **Navigation** (`components/Nav.tsx`): no active-link highlight, no mobile menu.
- **Global**: no toast/notification system, no loading skeletons, limited focus-visible
  and ARIA coverage.

## Prioritized improvements

### P0 — High impact, moderate effort (do first)
1. **Solved/attempted status on every list row.** Fetch the user's progress (Supabase,
   server-side) and show a green check (solved) / amber dot (attempted) per problem.
2. **Difficulty as colored badges.** easy=green, medium=amber, hard=red, used in lists,
   the playground header, and the dashboard.
3. **Search + filters on track pages.** Title search, difficulty filter, and status filter
   (all / unsolved / solved). Client component over the track's problems.
4. **Theme fix + light/dark toggle.** Remove the Arial override so Geist applies; add a
   persisted theme toggle in the nav; drive Monaco (`vs-dark`/`vs`) and the HTML-View
   iframe background from it.
5. **Playground feedback loop.** Cmd/Ctrl+Enter = Run, Cmd/Ctrl+Enter+Shift = Submit; a
   "Running…" spinner; a clear "Solved!" success banner on all-pass Submit with a
   **Next problem** button.
6. **Persist editor code per problem** in localStorage so a refresh never loses work
   (with a Reset that clears it).

### P1 — Strong polish
7. **Per-topic and per-track progress bars** (e.g., "3 / 8 solved") on track pages, plus a
   track progress summary on the landing page.
8. **Dashboard upgrade:** per-track progress bars, solved-by-difficulty breakdown, a
   simple activity streak from `attempts.created_at`, and attempt rows that link to the
   problem and show the title (not just the id).
9. **Resizable playground panes** (draggable dividers) and a **responsive layout** that
   collapses to Prompt / Code / Results tabs on small screens.
10. **Toast notifications** for non-blocking feedback (submit saved, run error, save
    failed) instead of silent or inline-only messaging.
11. **Active nav highlighting + a mobile nav** (hamburger on small screens).

### P2 — Refinement
12. **Accessibility pass:** focus-visible rings, ARIA labels on icon controls, keyboard
    navigation for the results tabs, `aria-live` on test results, contrast check.
13. **Loading skeletons + route `loading.tsx`** for list, dashboard, and problem pages;
    Monaco lazy-load placeholder.
14. **Landing-page polish:** clearer hero, per-track solved/total, and a "continue where
    you left off" / recommended-next card.

## Implementation notes
- Status/progress data: read `progress` via the server Supabase client where pages are
  server components (track list, dashboard); the playground already records attempts.
- Reusable primitives to add: `DifficultyBadge`, `ProgressBar`, `StatusIcon`, a `Toast`
  provider, a `ThemeToggle` (+ `theme` cookie/localStorage), and `Filters` for lists.
- Keep all changes presentation-only; no problem schema or runner changes required
  (Monaco theme is a prop; iframe background is a CSS var).

## Out of scope
Problem content, the execution model (Web Worker / iframe / harness), auth, and the
Supabase schema. No new tracks or problems.

## Suggested sequencing
Ship P0 as 2-3 reviewable batches (lists+badges+filters; theme+toggle; playground
feedback+persistence), then P1, then P2. Each batch ends green (build + tests) and is
committed/pushed independently.
