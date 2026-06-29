import type { Problem, CourseRef } from "../types";
const c = (section: number, sectionTitle: string, lecture: number, lectureName: string): CourseRef =>
  ({ section, sectionTitle, lecture, lectureName });

export const interviewProblems: Problem[] = [
  {
    id: "ds-stacks-005", track: "data-structures", topic: "Stacks", difficulty: "medium",
    title: "Design a Min Stack",
    prompt:
      "Design a stack that supports push, pop, top, and retrieving the minimum element, all in O(1) time.\n\nImplement the `MinStack` class:\n- `push(val)` pushes `val` onto the stack.\n- `pop()` removes the element on top.\n- `top()` returns the top element.\n- `getMin()` returns the minimum element currently in the stack.\n\nAll operations are called on a valid (non-empty where required) stack.",
    kind: "harness",
    starterCode:
      "class MinStack {\n  constructor() {\n    // your code here\n  }\n  push(val) {\n    // your code here\n  }\n  pop() {\n    // your code here\n  }\n  top() {\n    // your code here\n  }\n  getMin() {\n    // your code here\n  }\n}",
    solution:
      "class MinStack {\n  constructor() { this.stack = []; this.mins = []; }\n  push(val) {\n    this.stack.push(val);\n    this.mins.push(this.mins.length === 0 ? val : Math.min(val, this.mins[this.mins.length - 1]));\n  }\n  pop() { this.stack.pop(); this.mins.pop(); }\n  top() { return this.stack[this.stack.length - 1]; }\n  getMin() { return this.mins[this.mins.length - 1]; }\n}",
    examples: [
      {
        input: "push(-2), push(0), push(-3), getMin(), pop(), top(), getMin()",
        output: "[-3, 0, -2]",
        explanation: "getMin() is -3 after the three pushes. After pop() removes -3, top() is 0 and getMin() is -2.",
      },
    ],
    testCases: [
      { description: "push(-2), push(0), push(-3), getMin(), pop(), top(), getMin()", run: "const s = new MinStack(); s.push(-2); s.push(0); s.push(-3); const a = s.getMin(); s.pop(); const b = s.top(); const c = s.getMin(); return [a, b, c];", expected: [-3, 0, -2] },
      { description: "push(1), push(2), then getMin() and top()", run: "const s = new MinStack(); s.push(1); s.push(2); return [s.getMin(), s.top()];", expected: [1, 2] },
      { run: "const s = new MinStack(); s.push(5); s.push(3); s.push(4); s.pop(); return s.getMin();", expected: 3, hidden: true },
    ],
    hints: [
      "Keep a second stack that tracks the minimum at each level.",
      "On push, store the smaller of the new value and the current minimum.",
      "pop both stacks together so the minimums stay aligned.",
    ],
    pitfalls: [
      "Scanning the whole stack on getMin is O(n); the auxiliary min-stack keeps it O(1).",
      "Forgetting to pop the min-stack alongside the main stack desynchronizes them.",
    ],
    explanation:
      "An auxiliary stack records the minimum so far at each depth. Pushing stores min(val, currentMin) and popping removes from both, so getMin is always the top of the min-stack in O(1).",
    course: c(11, "Working With Arrays", 149, "Simple Array Methods"),
    resources: [{ label: "Wikipedia: Stack", url: "https://en.wikipedia.org/wiki/Stack_(abstract_data_type)" }],
  },
  {
    id: "ds-hashmaps-006", track: "data-structures", topic: "Hash Maps", difficulty: "medium",
    title: "Design a HashMap",
    prompt:
      "Design a key-value store without using any built-in hash-map library directly in the public API.\n\nImplement the `MyHashMap` class:\n- `put(key, value)` inserts or updates the value for `key`.\n- `get(key)` returns the value for `key`, or `-1` if it is not present.\n- `remove(key)` deletes the mapping for `key` if it exists.",
    kind: "harness",
    starterCode:
      "class MyHashMap {\n  constructor() {\n    // your code here\n  }\n  put(key, value) {\n    // your code here\n  }\n  get(key) {\n    // your code here\n  }\n  remove(key) {\n    // your code here\n  }\n}",
    solution:
      "class MyHashMap {\n  constructor() { this.store = new Map(); }\n  put(key, value) { this.store.set(key, value); }\n  get(key) { return this.store.has(key) ? this.store.get(key) : -1; }\n  remove(key) { this.store.delete(key); }\n}",
    examples: [
      {
        input: "put(1,1), put(2,2), get(1), get(3), put(2,1), get(2), remove(2), get(2)",
        output: "[1, -1, 1, -1]",
        explanation: "get(1) is 1, get(3) is -1 (absent). After put(2,1), get(2) is 1. After remove(2), get(2) is -1.",
      },
    ],
    testCases: [
      { description: "put/get/remove sequence", run: "const m = new MyHashMap(); m.put(1, 1); m.put(2, 2); const a = m.get(1); const b = m.get(3); m.put(2, 1); const c = m.get(2); m.remove(2); const d = m.get(2); return [a, b, c, d];", expected: [1, -1, 1, -1] },
      { description: "put then get", run: "const m = new MyHashMap(); m.put(10, 100); return m.get(10);", expected: 100 },
      { run: "const m = new MyHashMap(); const a = m.get(5); m.put(5, 5); m.remove(5); return [a, m.get(5)];", expected: [-1, -1], hidden: true },
    ],
    hints: [
      "A Map (or a plain object) can back the store.",
      "get must distinguish a missing key from a stored value, returning -1 when absent.",
      "remove should be a safe no-op when the key is missing.",
    ],
    pitfalls: [
      "Returning undefined instead of -1 for missing keys.",
      "Using `key in obj` style checks can be fooled by inherited properties; a Map avoids that.",
    ],
    explanation:
      "Backing the API with a Map gives O(1) average put/get/remove. get checks presence before returning so absent keys yield -1.",
    course: c(9, "Data Structures, Modern Operators and Strings", 124, "Maps: Fundamentals"),
    resources: [{ label: "MDN: Map", url: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map" }],
  },
  {
    id: "js-multi-001", track: "javascript", topic: "A Closer Look at Functions", difficulty: "easy",
    title: "Temperature Conversion Module",
    prompt:
      "Implement two functions that the test driver will call together:\n- `cToF(c)` converts Celsius to Fahrenheit.\n- `fToC(f)` converts Fahrenheit to Celsius.\n\nFormulas: F = C * 9/5 + 32 and C = (F - 32) * 5/9.",
    kind: "harness",
    starterCode:
      "function cToF(c) {\n  // your code here\n}\n\nfunction fToC(f) {\n  // your code here\n}",
    solution:
      "function cToF(c) {\n  return c * 9 / 5 + 32;\n}\n\nfunction fToC(f) {\n  return (f - 32) * 5 / 9;\n}",
    examples: [
      { input: "cToF(0), cToF(100), fToC(32)", output: "[32, 212, 0]", explanation: "0C is 32F, 100C is 212F, and 32F is 0C." },
    ],
    testCases: [
      { description: "cToF(0), cToF(100), fToC(32)", run: "return [cToF(0), cToF(100), fToC(32)];", expected: [32, 212, 0] },
      { description: "cToF(20), fToC(212)", run: "return [cToF(20), fToC(212)];", expected: [68, 100] },
      { run: "return [cToF(40), fToC(50)];", expected: [104, 10], hidden: true },
    ],
    hints: [
      "This problem ships two functions; implement both.",
      "The driver calls them in one scenario and checks all results.",
    ],
    pitfalls: ["Operator precedence: write the multiplication and division before adding 32."],
    explanation:
      "Both conversion functions are exercised together by the driver. This mirrors interview problems where one task involves several cooperating functions.",
    course: c(10, "A Closer Look at Functions", 34, "Functions"),
    resources: [],
  },
];
