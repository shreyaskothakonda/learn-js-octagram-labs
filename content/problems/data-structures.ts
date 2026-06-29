import type { Problem } from "../types";

export const dataStructureProblems: Problem[] = [
  // ── Arrays & Two-Pointers ─────────────────────────────────────────────────
  {
    id: "ds-twopointers-001",
    track: "data-structures",
    topic: "Arrays & Two-Pointers",
    difficulty: "easy",
    title: "Two Sum (Sorted Array)",
    prompt:
      "Given a **sorted** array `nums` and a `target`, return the 0-based indices `[i, j]` of the two numbers that add up to `target`. Exactly one solution exists.\n\nExample: `twoSum([1, 2, 4, 7], 6)` → `[1, 2]`.",
    kind: "function",
    starterCode: "function twoSum(nums, target) {\n  // your code here\n}",
    solution:
      "function twoSum(nums, target) {\n  let l = 0, r = nums.length - 1;\n  while (l < r) {\n    const s = nums[l] + nums[r];\n    if (s === target) return [l, r];\n    if (s < target) l++; else r--;\n  }\n  return [];\n}",
    functionName: "twoSum",
    testCases: [
      { input: [[1, 2, 4, 7], 6], expected: [1, 2] },
      { input: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { input: [[2, 3, 4], 6], expected: [0, 2], hidden: true },
      { input: [[-3, 0, 1, 4], 1], expected: [0, 3], hidden: true },
    ],
    pitfalls: [
      "A nested loop is O(n^2); the sorted order is what lets you avoid it.",
    ],
    explanation: "Two pointers start at the ends and move inward based on the sum versus target. O(n) time, O(1) space.",
    resources: [
      {
        label: "MDN: Arrays",
        url: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array",
      },
    ],
    hints: [
      "Start one pointer at the left end and one at the right end.",
      "If the sum is too large, move the right pointer left; if too small, move the left pointer right.",
    ],
  },
  {
    id: "ds-twopointers-002",
    track: "data-structures",
    topic: "Arrays & Two-Pointers",
    difficulty: "medium",
    title: "Container With Most Water",
    prompt:
      "Given an array `heights` where `heights[i]` is the height of a vertical line at index `i`, find two lines that together with the x-axis form a container that holds the most water. Return the maximum water volume.\n\nVolume = min(heights[i], heights[j]) × (j − i).",
    kind: "function",
    starterCode:
      "function maxWater(heights) {\n  // your code here\n}",
    solution:
      "function maxWater(heights) {\n  let l = 0, r = heights.length - 1, max = 0;\n  while (l < r) {\n    const water = Math.min(heights[l], heights[r]) * (r - l);\n    if (water > max) max = water;\n    if (heights[l] < heights[r]) l++; else r--;\n  }\n  return max;\n}",
    functionName: "maxWater",
    testCases: [
      { input: [[1, 8, 6, 2, 5, 4, 8, 3, 7]], expected: 49 },
      { input: [[1, 1]], expected: 1 },
      { input: [[4, 3, 2, 1, 4]], expected: 16, hidden: true },
      { input: [[1, 2, 1]], expected: 2, hidden: true },
    ],
    pitfalls: [
      "Brute force checks every pair in O(n^2).",
      "Moving the taller side never increases the area, so always move the shorter one.",
    ],
    explanation: "Two pointers from both ends, always advancing the shorter wall, find the max area in O(n) time, O(1) space.",
    resources: [
      {
        label: "MDN: Math.min",
        url: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Math/min",
      },
    ],
    hints: [
      "Use two pointers starting at each end.",
      "Move the pointer on the shorter side inward each iteration.",
    ],
  },

  // ── Hash Maps ─────────────────────────────────────────────────────────────
  {
    id: "ds-hashmaps-001",
    track: "data-structures",
    topic: "Hash Maps",
    difficulty: "easy",
    title: "Frequency Counter",
    prompt:
      "Implement `frequency(arr)` that returns an object mapping each unique element of `arr` to the number of times it appears.\n\nExample: `frequency(['a','b','a','c','b','a'])` → `{ a: 3, b: 2, c: 1 }`.",
    kind: "function",
    starterCode: "function frequency(arr) {\n  // your code here\n}",
    solution:
      "function frequency(arr) {\n  const map = {};\n  for (const item of arr) {\n    map[item] = (map[item] || 0) + 1;\n  }\n  return map;\n}",
    functionName: "frequency",
    testCases: [
      {
        input: [["a", "b", "a", "c", "b", "a"]],
        expected: { a: 3, b: 2, c: 1 },
      },
      { input: [[]], expected: {} },
      { input: [[1, 2, 1, 3, 2, 1]], expected: { 1: 3, 2: 2, 3: 1 }, hidden: true },
    ],
    pitfalls: [
      "Counting with nested loops is O(n^2); a map makes it linear.",
    ],
    explanation: "A hash map tallies each value in one pass. O(n) time and space.",
    resources: [
      {
        label: "MDN: Map",
        url: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map",
      },
    ],
    hints: [
      "Use a plain object as a counter.",
      "For each element, increment its count in the map (defaulting to 0 if missing).",
    ],
  },
  {
    id: "ds-hashmaps-002",
    track: "data-structures",
    topic: "Hash Maps",
    difficulty: "medium",
    title: "Two Sum (Unsorted)",
    prompt:
      "Given an **unsorted** array `nums` and a `target`, return the 0-based indices `[i, j]` (i < j) of the two numbers that add up to `target`. Exactly one solution exists.\n\nExample: `twoSumUnsorted([2, 7, 11, 15], 9)` → `[0, 1]`.",
    kind: "function",
    starterCode:
      "function twoSumUnsorted(nums, target) {\n  // your code here\n}",
    solution:
      "function twoSumUnsorted(nums, target) {\n  const seen = {};\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (seen[complement] !== undefined) {\n      return [seen[complement], i];\n    }\n    seen[nums[i]] = i;\n  }\n  return [];\n}",
    functionName: "twoSumUnsorted",
    testCases: [
      { input: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { input: [[3, 2, 4], 6], expected: [1, 2] },
      { input: [[3, 3], 6], expected: [0, 1], hidden: true },
      { input: [[1, 4, 3, 2], 5], expected: [0, 1], hidden: true },
    ],
    pitfalls: [
      "The brute-force pair check is O(n^2).",
      "Look up the complement before inserting the current value to avoid using an element twice.",
    ],
    explanation: "Store each value-to-index as you scan and look up the complement. O(n) time and space.",
    resources: [
      {
        label: "MDN: Map",
        url: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map",
      },
    ],
    hints: [
      "Use a hash map to store each number's index as you scan.",
      "For each number, check if its complement (target − number) is already in the map.",
    ],
  },
  {
    id: "ds-hashmaps-003",
    track: "data-structures",
    topic: "Hash Maps",
    difficulty: "medium",
    title: "First Non-Repeating Character",
    prompt:
      "Implement `firstUnique(str)` that returns the index of the first character in `str` that appears only once. Return `-1` if none exists.",
    kind: "function",
    starterCode: "function firstUnique(str) {\n  // your code here\n}",
    solution:
      "function firstUnique(str) {\n  const count = {};\n  for (const ch of str) {\n    count[ch] = (count[ch] || 0) + 1;\n  }\n  for (let i = 0; i < str.length; i++) {\n    if (count[str[i]] === 1) return i;\n  }\n  return -1;\n}",
    functionName: "firstUnique",
    testCases: [
      { input: ["leetcode"], expected: 0 },
      { input: ["loveleetcode"], expected: 2 },
      { input: ["aabb"], expected: -1 },
      { input: ["z"], expected: 0, hidden: true },
      { input: ["aab"], expected: 2, hidden: true },
    ],
    pitfalls: [
      "Returning the first not-yet-seen character is wrong; you need count exactly one.",
    ],
    explanation: "Count characters, then scan again for the first with count one. O(n) time and space.",
    resources: [
      {
        label: "MDN: Map",
        url: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map",
      },
    ],
    hints: [
      "Two-pass approach: first count all characters, then find the first with count 1.",
    ],
  },

  // ── Stacks ────────────────────────────────────────────────────────────────
  {
    id: "ds-stacks-001",
    track: "data-structures",
    topic: "Stacks",
    difficulty: "easy",
    title: "Valid Parentheses",
    prompt:
      "Implement `isValid(s)` that returns `true` if every opening bracket `(`, `[`, `{` in string `s` is closed by the correct closing bracket in the correct order.\n\nExample: `isValid(\"()[]{}\")` → `true`, `isValid(\"(]\")` → `false`.",
    kind: "function",
    starterCode: "function isValid(s) {\n  // your code here\n}",
    solution:
      "function isValid(s) {\n  const stack = [];\n  const map = { ')': '(', ']': '[', '}': '{' };\n  for (const ch of s) {\n    if ('([{'.includes(ch)) {\n      stack.push(ch);\n    } else {\n      if (stack.pop() !== map[ch]) return false;\n    }\n  }\n  return stack.length === 0;\n}",
    functionName: "isValid",
    testCases: [
      { input: ["()"], expected: true },
      { input: ["()[]{}"], expected: true },
      { input: ["(]"], expected: false },
      { input: ["([)]"], expected: false, hidden: true },
      { input: ["{[]}"], expected: true, hidden: true },
    ],
    pitfalls: [
      "Forgetting to require an empty stack at the end accepts unclosed brackets.",
      "Matching only by count ignores bracket type mismatches.",
    ],
    explanation: "Push openers, pop and check the matching type on closers, and require an empty stack at the end. O(n) time and space.",
    resources: [
      {
        label: "MDN: Array.prototype.push / pop",
        url: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/push",
      },
    ],
    hints: [
      "Use an array as a stack.",
      "Push opening brackets; for closing brackets, pop and verify it matches.",
    ],
  },
  {
    id: "ds-stacks-002",
    track: "data-structures",
    topic: "Stacks",
    difficulty: "medium",
    title: "Evaluate Reverse Polish Notation",
    prompt:
      "Implement `evalRPN(tokens)` that evaluates an expression in **Reverse Polish Notation**. Tokens are strings: either numbers or one of `+`, `-`, `*`, `/`. Division truncates toward zero.\n\nExample: `evalRPN([\"2\",\"1\",\"+\",\"3\",\"*\"])` → `9`.",
    kind: "function",
    starterCode: "function evalRPN(tokens) {\n  // your code here\n}",
    solution:
      "function evalRPN(tokens) {\n  const stack = [];\n  for (const token of tokens) {\n    if (['+', '-', '*', '/'].includes(token)) {\n      const b = stack.pop();\n      const a = stack.pop();\n      if (token === '+') stack.push(a + b);\n      else if (token === '-') stack.push(a - b);\n      else if (token === '*') stack.push(a * b);\n      else stack.push(Math.trunc(a / b));\n    } else {\n      stack.push(Number(token));\n    }\n  }\n  return stack[0];\n}",
    functionName: "evalRPN",
    testCases: [
      { input: [["2", "1", "+", "3", "*"]], expected: 9 },
      { input: [["4", "13", "5", "/", "+"]], expected: 6 },
      { input: [["10", "6", "9", "3", "+", "-11", "*", "/", "*", "17", "+", "5", "+"]], expected: 22, hidden: true },
    ],
    pitfalls: [
      "Operand order matters for subtraction and division.",
      "Division must truncate toward zero, not floor.",
    ],
    explanation: "A stack holds operands; each operator pops two and pushes the result. O(n) time and space.",
    resources: [
      {
        label: "MDN: Array.prototype.push / pop",
        url: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/push",
      },
    ],
    hints: [
      "Push operands onto the stack.",
      "When you see an operator, pop two values, apply the operator, and push the result.",
    ],
  },

  // ── Linked Lists ──────────────────────────────────────────────────────────
  {
    id: "ds-linkedlists-001",
    track: "data-structures",
    topic: "Linked Lists",
    difficulty: "easy",
    title: "Linked List: Array to List",
    prompt:
      "A linked list node is represented as a plain object `{ val, next }`. Implement `arrayToList(arr)` that converts an array into a linked list and returns the head node.\n\nExample: `arrayToList([1,2,3])` → `{ val:1, next:{ val:2, next:{ val:3, next:null } } }`.",
    kind: "function",
    starterCode: "function arrayToList(arr) {\n  // your code here\n}",
    solution:
      "function arrayToList(arr) {\n  if (arr.length === 0) return null;\n  const head = { val: arr[0], next: null };\n  let curr = head;\n  for (let i = 1; i < arr.length; i++) {\n    curr.next = { val: arr[i], next: null };\n    curr = curr.next;\n  }\n  return head;\n}",
    functionName: "arrayToList",
    testCases: [
      {
        input: [[1, 2, 3]],
        expected: { val: 1, next: { val: 2, next: { val: 3, next: null } } },
      },
      { input: [[42]], expected: { val: 42, next: null } },
      { input: [[]], expected: null, hidden: true },
    ],
    pitfalls: [
      "Losing the head reference while advancing the tail.",
    ],
    explanation: "Build nodes left to right, linking each to the next, and keep the head. O(n) time and space.",
    resources: [
      {
        label: "MDN: Objects",
        url: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object",
      },
    ],
    hints: [
      "Create a head node, then chain subsequent nodes by setting `curr.next`.",
    ],
  },
  {
    id: "ds-linkedlists-002",
    track: "data-structures",
    topic: "Linked Lists",
    difficulty: "medium",
    title: "Reverse a Linked List",
    prompt:
      "Nodes are `{ val, next }` objects. Implement `reverseList(head)` that reverses a linked list in-place and returns the new head.\n\nExample: `1→2→3→null` becomes `3→2→1→null`.",
    kind: "function",
    starterCode: "function reverseList(head) {\n  // your code here\n}",
    solution:
      "function reverseList(head) {\n  let prev = null;\n  let curr = head;\n  while (curr !== null) {\n    const next = curr.next;\n    curr.next = prev;\n    prev = curr;\n    curr = next;\n  }\n  return prev;\n}",
    functionName: "reverseList",
    testCases: [
      {
        input: [{ val: 1, next: { val: 2, next: { val: 3, next: null } } }],
        expected: { val: 3, next: { val: 2, next: { val: 1, next: null } } },
      },
      { input: [{ val: 1, next: null }], expected: { val: 1, next: null } },
      { input: [null], expected: null, hidden: true },
    ],
    pitfalls: [
      "Reassigning next before saving the following node loses the rest of the list.",
    ],
    explanation: "Walk the list re-pointing each node to its predecessor, saving the next node first. O(n) time, O(1) extra space.",
    resources: [
      {
        label: "MDN: while statement",
        url: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/while",
      },
    ],
    hints: [
      "Keep track of `prev`, `curr`, and `next` as you traverse.",
      "At each step: save `curr.next`, point `curr.next` to `prev`, then advance both pointers.",
    ],
  },
  {
    id: "ds-linkedlists-003",
    track: "data-structures",
    topic: "Linked Lists",
    difficulty: "medium",
    title: "Remove Nth Node From End",
    prompt:
      "A linked list is given as an array of values in order (e.g. `[1,2,3,4,5]`). Implement `removeNthFromEnd(arr, n)` that removes the **n-th node from the end** of the list and returns the resulting array.\n\n`n` is always valid (1 ≤ n ≤ arr.length).\n\nExample: `removeNthFromEnd([1,2,3,4,5], 2)` → `[1,2,3,5]` (the 2nd from end, which is `4`, is removed).",
    kind: "function",
    starterCode:
      "function removeNthFromEnd(arr, n) {\n  // your code here\n}",
    solution:
      "function removeNthFromEnd(arr, n) {\n  const result = [...arr];\n  const removeIdx = result.length - n;\n  result.splice(removeIdx, 1);\n  return result;\n}",
    functionName: "removeNthFromEnd",
    testCases: [
      { input: [[1, 2, 3, 4, 5], 2], expected: [1, 2, 3, 5] },
      { input: [[1, 2, 3, 4, 5], 1], expected: [1, 2, 3, 4] },
      { input: [[1, 2, 3, 4, 5], 5], expected: [2, 3, 4, 5] },
      { input: [[1, 2], 1], expected: [1], hidden: true },
      { input: [[1], 1], expected: [], hidden: true },
    ],
    pitfalls: [
      "Off-by-one when translating n-from-the-end into a forward index.",
    ],
    explanation: "With an array representation the n-th from the end is at index length minus n, removed in O(n) time.",
    resources: [
      {
        label: "MDN: Array.prototype.splice",
        url: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/splice",
      },
    ],
    hints: [
      "The n-th from end has index `length - n` in the array.",
      "Use two pointers separated by n steps to find this position in a single pass over a real linked list. Here you can compute it directly from the array length.",
    ],
  },
];
