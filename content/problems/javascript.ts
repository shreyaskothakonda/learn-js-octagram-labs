import type { Problem } from "../types";

export const javascriptProblems: Problem[] = [
  // ── Arrays ────────────────────────────────────────────────────────────────
  {
    id: "js-arrays-001",
    track: "javascript",
    topic: "Arrays",
    difficulty: "easy",
    title: "Sum of an Array",
    prompt:
      "Implement `sum(arr)` that returns the sum of all numbers in `arr`.\n\nReturn `0` for an empty array.",
    kind: "function",
    starterCode: "function sum(arr) {\n  // your code here\n}",
    solution:
      "function sum(arr) {\n  return arr.reduce((a, b) => a + b, 0);\n}",
    functionName: "sum",
    testCases: [
      { input: [[1, 2, 3]], expected: 6 },
      { input: [[]], expected: 0 },
      { input: [[-5, 5]], expected: 0, hidden: true },
      { input: [[10]], expected: 10, hidden: true },
    ],
    pitfalls: [
      "Omitting the initial value breaks on an empty array.",
    ],
    explanation: "reduce with an initial 0 sums every element, returning 0 for an empty array.",
    resources: [
      {
        label: "MDN: Array.prototype.reduce",
        url: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce",
      },
    ],
    hints: ["Reduce accumulates a single value from the array."],
  },
  {
    id: "js-arrays-002",
    track: "javascript",
    topic: "Arrays",
    difficulty: "easy",
    title: "Find the Maximum",
    prompt:
      "Implement `findMax(arr)` that returns the largest number in `arr`.\n\nYou may assume `arr` is non-empty.",
    kind: "function",
    starterCode: "function findMax(arr) {\n  // your code here\n}",
    solution: "function findMax(arr) {\n  return Math.max(...arr);\n}",
    functionName: "findMax",
    testCases: [
      { input: [[3, 1, 4, 1, 5, 9]], expected: 9 },
      { input: [[-1, -5, -2]], expected: -1 },
      { input: [[7]], expected: 7, hidden: true },
    ],
    pitfalls: [
      "Math.max() with no arguments returns -Infinity.",
    ],
    explanation: "Spreading the array into Math.max yields its maximum.",
    resources: [
      {
        label: "MDN: Math.max",
        url: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Math/max",
      },
    ],
    hints: ["Spread the array into Math.max."],
  },
  {
    id: "js-arrays-003",
    track: "javascript",
    topic: "Arrays",
    difficulty: "medium",
    title: "Remove Duplicates",
    prompt:
      "Implement `removeDuplicates(arr)` that returns a new array with duplicate values removed, preserving the original order.",
    kind: "function",
    starterCode: "function removeDuplicates(arr) {\n  // your code here\n}",
    solution:
      "function removeDuplicates(arr) {\n  return [...new Set(arr)];\n}",
    functionName: "removeDuplicates",
    testCases: [
      { input: [[1, 2, 2, 3, 3, 3]], expected: [1, 2, 3] },
      { input: [["a", "b", "a"]], expected: ["a", "b"] },
      { input: [[]], expected: [], hidden: true },
      { input: [[5, 5, 5]], expected: [5], hidden: true },
    ],
    pitfalls: [
      "Objects are compared by reference, so a Set will not dedupe equal-looking objects.",
    ],
    explanation: "new Set keeps first occurrences in order; spreading returns the deduplicated array.",
    resources: [
      {
        label: "MDN: Set",
        url: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Set",
      },
    ],
    hints: ["A Set automatically discards duplicate values."],
  },

  // ── Strings ───────────────────────────────────────────────────────────────
  {
    id: "js-strings-001",
    track: "javascript",
    topic: "Strings",
    difficulty: "easy",
    title: "Reverse a String",
    prompt:
      "Implement `reverse(str)` returning the characters of `str` in reverse order.",
    kind: "function",
    starterCode: "function reverse(str) {\n  // your code here\n}",
    solution:
      "function reverse(str) {\n  return str.split('').reverse().join('');\n}",
    functionName: "reverse",
    testCases: [
      { input: ["hello"], expected: "olleh" },
      { input: [""], expected: "" },
      { input: ["a"], expected: "a", hidden: true },
      { input: ["abcd"], expected: "dcba", hidden: true },
    ],
    pitfalls: [
      "This splits by code unit, so it can mangle characters outside the basic plane (emoji).",
    ],
    explanation: "Splitting to an array lets you reverse and rejoin into the reversed string.",
    resources: [
      {
        label: "MDN: String.prototype.split",
        url: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/split",
      },
    ],
    hints: ["Split into characters, reverse the array, then join back."],
  },
  {
    id: "js-strings-002",
    track: "javascript",
    topic: "Strings",
    difficulty: "easy",
    title: "Count Vowels",
    prompt:
      "Implement `countVowels(str)` that returns the number of vowels (`a e i o u`, case-insensitive) in `str`.",
    kind: "function",
    starterCode: "function countVowels(str) {\n  // your code here\n}",
    solution:
      "function countVowels(str) {\n  return (str.match(/[aeiou]/gi) || []).length;\n}",
    functionName: "countVowels",
    testCases: [
      { input: ["hello"], expected: 2 },
      { input: ["rhythm"], expected: 0 },
      { input: ["AEIOU"], expected: 5, hidden: true },
      { input: [""], expected: 0, hidden: true },
    ],
    pitfalls: [
      "match returns null when nothing matches, which breaks .length.",
    ],
    explanation: "A global case-insensitive vowel match, guarded against null, gives the vowel count.",
    resources: [
      {
        label: "MDN: String.prototype.match",
        url: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/match",
      },
    ],
    hints: ["A regex with the `g` flag matches all occurrences."],
  },
  {
    id: "js-strings-003",
    track: "javascript",
    topic: "Strings",
    difficulty: "medium",
    title: "Is Palindrome",
    prompt:
      "Implement `isPalindrome(str)` that returns `true` if `str` reads the same forwards and backwards (case-insensitive, ignore non-alphanumeric characters).",
    kind: "function",
    starterCode: "function isPalindrome(str) {\n  // your code here\n}",
    solution:
      "function isPalindrome(str) {\n  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');\n  return cleaned === cleaned.split('').reverse().join('');\n}",
    functionName: "isPalindrome",
    testCases: [
      { input: ["racecar"], expected: true },
      { input: ["hello"], expected: false },
      { input: ["A man a plan a canal Panama"], expected: true },
      { input: ["No lemon no melon"], expected: true, hidden: true },
      { input: ["abc"], expected: false, hidden: true },
    ],
    pitfalls: [
      "Skipping case normalization misjudges mixed-case palindromes.",
    ],
    explanation: "Comparing the lowercased string to its reverse checks for a palindrome regardless of case.",
    resources: [
      {
        label: "MDN: String.prototype.replace",
        url: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/replace",
      },
    ],
    hints: [
      "Strip non-alphanumeric characters first.",
      "Compare the cleaned string with its reverse.",
    ],
  },

  // ── Objects ───────────────────────────────────────────────────────────────
  {
    id: "js-objects-001",
    track: "javascript",
    topic: "Objects",
    difficulty: "easy",
    title: "Count Object Keys",
    prompt:
      "Implement `keyCount(obj)` that returns the number of own enumerable keys in `obj`.",
    kind: "function",
    starterCode: "function keyCount(obj) {\n  // your code here\n}",
    solution:
      "function keyCount(obj) {\n  return Object.keys(obj).length;\n}",
    functionName: "keyCount",
    testCases: [
      { input: [{ a: 1, b: 2, c: 3 }], expected: 3 },
      { input: [{}], expected: 0 },
      { input: [{ x: undefined }], expected: 1, hidden: true },
    ],
    pitfalls: [
      "Inherited properties are not included, which is usually intended.",
    ],
    explanation: "Object.keys(obj).length counts the own enumerable properties.",
    resources: [
      {
        label: "MDN: Object.keys",
        url: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/keys",
      },
    ],
    hints: ["Object.keys returns an array of the object's own enumerable keys."],
  },
  {
    id: "js-objects-002",
    track: "javascript",
    topic: "Objects",
    difficulty: "medium",
    title: "Invert an Object",
    prompt:
      "Implement `invertObject(obj)` that swaps every key and value in `obj`. Assume all values are unique strings or numbers.",
    kind: "function",
    starterCode: "function invertObject(obj) {\n  // your code here\n}",
    solution:
      "function invertObject(obj) {\n  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [v, k]));\n}",
    functionName: "invertObject",
    testCases: [
      { input: [{ a: 1, b: 2 }], expected: { 1: "a", 2: "b" } },
      { input: [{ x: "foo", y: "bar" }], expected: { foo: "x", bar: "y" } },
      { input: [{}], expected: {}, hidden: true },
    ],
    pitfalls: [
      "Duplicate values overwrite each other.",
      "Numeric values become string keys.",
    ],
    explanation: "Swapping each entry's key and value produces the inverted object.",
    resources: [
      {
        label: "MDN: Object.fromEntries",
        url: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/fromEntries",
      },
    ],
    hints: ["Object.entries gives you [key, value] pairs you can flip."],
  },

  // ── Functions & Scope ─────────────────────────────────────────────────────
  {
    id: "js-scope-001",
    track: "javascript",
    topic: "Functions & Scope",
    difficulty: "easy",
    title: "Default Parameter Greeting",
    prompt:
      "Implement `greet(name, greeting)` that returns `\"<greeting>, <name>!\"`. If `greeting` is not provided, default to `\"Hello\"`.",
    kind: "function",
    starterCode:
      "function greet(name, greeting) {\n  // your code here\n}",
    solution:
      'function greet(name, greeting = "Hello") {\n  return `${greeting}, ${name}!`;\n}',
    functionName: "greet",
    testCases: [
      { input: ["Alice"], expected: "Hello, Alice!" },
      { input: ["Bob", "Hi"], expected: "Hi, Bob!" },
      { input: ["World", "Hey"], expected: "Hey, World!", hidden: true },
    ],
    pitfalls: [
      "Defaults apply only to undefined, not to empty string or null.",
    ],
    explanation: "The default value supplies a fallback name only when the argument is undefined.",
    resources: [
      {
        label: "MDN: Default parameters",
        url: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Functions/Default_parameters",
      },
    ],
    hints: ["Use a default parameter value in the function signature."],
  },

  // ── Closures ──────────────────────────────────────────────────────────────
  {
    id: "js-closures-001",
    track: "javascript",
    topic: "Closures",
    difficulty: "medium",
    title: "Counter via Closure",
    prompt:
      "Implement `runCounter(start, times)` that creates an internal counter starting at `start`, calls the increment function `times` times, and returns the final counter value.\n\n(This exercises building and using a closure internally.)",
    kind: "function",
    starterCode: "function runCounter(start, times) {\n  // your code here\n}",
    solution:
      "function runCounter(start, times) {\n  let count = start;\n  const increment = function() { count += 1; return count; };\n  let result = start;\n  for (let i = 0; i < times; i++) {\n    result = increment();\n  }\n  return result;\n}",
    functionName: "runCounter",
    testCases: [
      { input: [0, 3], expected: 3 },
      { input: [5, 2], expected: 7 },
      { input: [0, 0], expected: 0, hidden: true },
      { input: [10, 1], expected: 11, hidden: true },
    ],
    pitfalls: [
      "Declaring the counter where it resets each call loses the closed-over state.",
    ],
    explanation: "The inner function captures a private counter by closure, so repeated calls advance the same state.",
    resources: [
      {
        label: "MDN: Closures",
        url: "https://developer.mozilla.org/docs/Web/JavaScript/Closures",
      },
    ],
    hints: [
      "Create an inner function that captures and mutates `count`.",
      "Call the inner function `times` times in a loop.",
    ],
  },
  {
    id: "js-closures-002",
    track: "javascript",
    topic: "Closures",
    difficulty: "medium",
    title: "Multiplier via Closure",
    prompt:
      "Implement `multiplyWith(factor, n)` that uses a closure internally: create a function that multiplies by `factor`, then apply it to `n` and return the result.",
    kind: "function",
    starterCode: "function multiplyWith(factor, n) {\n  // your code here\n}",
    solution:
      "function multiplyWith(factor, n) {\n  const multiplier = function(x) { return x * factor; };\n  return multiplier(n);\n}",
    functionName: "multiplyWith",
    testCases: [
      { input: [3, 4], expected: 12 },
      { input: [5, 0], expected: 0 },
      { input: [2, -7], expected: -14, hidden: true },
      { input: [1, 100], expected: 100, hidden: true },
    ],
    pitfalls: [
      "Reading the factor from outside instead of capturing it.",
    ],
    explanation: "The returned multiplier captures factor by closure and applies it to each value.",
    resources: [
      {
        label: "MDN: Closures",
        url: "https://developer.mozilla.org/docs/Web/JavaScript/Closures",
      },
    ],
    hints: [
      "Define an inner function that closes over `factor`.",
      "Call that inner function with `n` and return the result.",
    ],
  },

  // ── Higher-Order Functions ─────────────────────────────────────────────────
  {
    id: "js-hof-001",
    track: "javascript",
    topic: "Higher-Order Functions",
    difficulty: "easy",
    title: "Apply a Function N Times",
    prompt:
      "Implement `applyN(fn, x, n)` that applies function `fn` to `x` exactly `n` times and returns the final result.\n\nExample: `applyN(x => x + 1, 5, 3)` → `8`.",
    kind: "function",
    starterCode: "function applyN(fn, x, n) {\n  // your code here\n}",
    solution:
      "function applyN(fn, x, n) {\n  let result = x;\n  for (let i = 0; i < n; i++) {\n    result = fn(result);\n  }\n  return result;\n}",
    functionName: "applyN",
    testCases: [
      { input: [(v: number) => v + 1, 5, 3], expected: 8 },
      { input: [(v: number) => v * 2, 1, 4], expected: 16 },
      { input: [(v: number) => v - 1, 10, 0], expected: 10, hidden: true },
      { input: [(v: number) => v * 3, 2, 2], expected: 18, hidden: true },
    ],
    pitfalls: [
      "Off-by-one in how many times the transform is applied.",
    ],
    explanation: "Repeatedly applying the operation n times folds the starting value forward, a higher-order pattern.",
    resources: [
      {
        label: "MDN: Functions as first-class objects",
        url: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Functions",
      },
    ],
    hints: [
      "Functions are values, so you can pass them as arguments.",
      "Use a simple for-loop to apply fn n times.",
    ],
  },
  {
    id: "js-hof-002",
    track: "javascript",
    topic: "Higher-Order Functions",
    difficulty: "medium",
    title: "Pipeline of Transformations",
    prompt:
      "Implement `pipeline(value, fns)` that takes a starting `value` and an array of single-argument functions `fns`, applying them left-to-right and returning the final result.\n\nExample: `pipeline(2, [x => x * 3, x => x + 1])` → `7`.",
    kind: "function",
    starterCode: "function pipeline(value, fns) {\n  // your code here\n}",
    solution:
      "function pipeline(value, fns) {\n  return fns.reduce((acc, fn) => fn(acc), value);\n}",
    functionName: "pipeline",
    testCases: [
      { input: [2, [(x: number) => x * 3, (x: number) => x + 1]], expected: 7 },
      { input: [5, [(x: number) => x - 2, (x: number) => x * 2]], expected: 6 },
      { input: [10, []], expected: 10, hidden: true },
      { input: [1, [(x: number) => x + 1, (x: number) => x + 1, (x: number) => x + 1]], expected: 4, hidden: true },
    ],
    pitfalls: [
      "Applying steps out of order; reduce runs left to right.",
    ],
    explanation: "reduce threads the value through each named transform, composing a pipeline.",
    resources: [
      {
        label: "MDN: Array.prototype.reduce",
        url: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce",
      },
    ],
    hints: [
      "Use Array.prototype.reduce to thread the value through each function.",
    ],
  },

  // ── Array Methods ─────────────────────────────────────────────────────────
  {
    id: "js-arraymethods-001",
    track: "javascript",
    topic: "Array Methods",
    difficulty: "easy",
    title: "Double Every Element",
    prompt:
      "Implement `doubleAll(arr)` that returns a new array where every number has been multiplied by 2.",
    kind: "function",
    starterCode: "function doubleAll(arr) {\n  // your code here\n}",
    solution: "function doubleAll(arr) {\n  return arr.map(x => x * 2);\n}",
    functionName: "doubleAll",
    testCases: [
      { input: [[1, 2, 3]], expected: [2, 4, 6] },
      { input: [[]], expected: [] },
      { input: [[-1, 0, 1]], expected: [-2, 0, 2], hidden: true },
    ],
    pitfalls: [
      "Mutating the source array in a loop instead of mapping.",
    ],
    explanation: "map produces a new array with each value doubled.",
    resources: [
      {
        label: "MDN: Array.prototype.map",
        url: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/map",
      },
    ],
    hints: ["Use Array.prototype.map to transform each element."],
  },
  {
    id: "js-arraymethods-002",
    track: "javascript",
    topic: "Array Methods",
    difficulty: "easy",
    title: "Filter Even Numbers",
    prompt:
      "Implement `filterEvens(arr)` that returns a new array containing only the even numbers from `arr`.",
    kind: "function",
    starterCode: "function filterEvens(arr) {\n  // your code here\n}",
    solution:
      "function filterEvens(arr) {\n  return arr.filter(x => x % 2 === 0);\n}",
    functionName: "filterEvens",
    testCases: [
      { input: [[1, 2, 3, 4, 5, 6]], expected: [2, 4, 6] },
      { input: [[1, 3, 5]], expected: [] },
      { input: [[0, -2, 7]], expected: [0, -2], hidden: true },
    ],
    pitfalls: [
      "Negative evens still qualify; sign does not affect parity.",
    ],
    explanation: "filter on even values returns a new array of the evens.",
    resources: [
      {
        label: "MDN: Array.prototype.filter",
        url: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/filter",
      },
    ],
    hints: ["Use the modulo operator `%` to test for evenness."],
  },
  {
    id: "js-arraymethods-003",
    track: "javascript",
    topic: "Array Methods",
    difficulty: "medium",
    title: "Group By Length",
    prompt:
      "Implement `groupByLength(words)` that groups an array of strings by their character length. Return an object where each key is a length and each value is an array of words with that length.",
    kind: "function",
    starterCode: "function groupByLength(words) {\n  // your code here\n}",
    solution:
      "function groupByLength(words) {\n  return words.reduce((acc, word) => {\n    const len = word.length;\n    if (!acc[len]) acc[len] = [];\n    acc[len].push(word);\n    return acc;\n  }, {});\n}",
    functionName: "groupByLength",
    testCases: [
      {
        input: [["cat", "dog", "elephant", "ox"]],
        expected: { 2: ["ox"], 3: ["cat", "dog"], 8: ["elephant"] },
      },
      { input: [[]], expected: {} },
      {
        input: [["a", "bb", "ccc", "dd"]],
        expected: { 1: ["a"], 2: ["bb", "dd"], 3: ["ccc"] },
        hidden: true,
      },
    ],
    pitfalls: [
      "Forgetting to initialize the group array before pushing.",
    ],
    explanation: "Bucketing each string by its length produces an object mapping length to the matching words.",
    resources: [
      {
        label: "MDN: Array.prototype.reduce",
        url: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce",
      },
    ],
    hints: [
      "Use reduce with an object accumulator.",
      "For each word, use its length as the key.",
    ],
  },

  // ── Recursion ─────────────────────────────────────────────────────────────
  {
    id: "js-recursion-001",
    track: "javascript",
    topic: "Recursion",
    difficulty: "easy",
    title: "Factorial",
    prompt:
      "Implement `factorial(n)` that returns `n!` (n factorial). Assume `n >= 0`. `factorial(0)` is `1`.",
    kind: "function",
    starterCode: "function factorial(n) {\n  // your code here\n}",
    solution:
      "function factorial(n) {\n  if (n === 0) return 1;\n  return n * factorial(n - 1);\n}",
    functionName: "factorial",
    testCases: [
      { input: [0], expected: 1 },
      { input: [1], expected: 1 },
      { input: [5], expected: 120 },
      { input: [6], expected: 720, hidden: true },
    ],
    pitfalls: [
      "No base case causes infinite recursion.",
    ],
    explanation: "Each call multiplies n by the factorial of n-1, bottoming out at 1.",
    resources: [
      {
        label: "MDN: Recursion (glossary)",
        url: "https://developer.mozilla.org/docs/Glossary/Recursion",
      },
    ],
    hints: ["The base case is n === 0, which returns 1."],
  },
  {
    id: "js-recursion-002",
    track: "javascript",
    topic: "Recursion",
    difficulty: "medium",
    title: "Flatten Nested Array",
    prompt:
      "Implement `flattenDeep(arr)` that recursively flattens a deeply nested array into a single flat array.",
    kind: "function",
    starterCode: "function flattenDeep(arr) {\n  // your code here\n}",
    solution:
      "function flattenDeep(arr) {\n  return arr.reduce((acc, val) => {\n    if (Array.isArray(val)) {\n      return acc.concat(flattenDeep(val));\n    }\n    return acc.concat(val);\n  }, []);\n}",
    functionName: "flattenDeep",
    testCases: [
      { input: [[1, [2, [3, [4]]]]], expected: [1, 2, 3, 4] },
      { input: [[1, 2, 3]], expected: [1, 2, 3] },
      { input: [[[]]], expected: [], hidden: true },
      { input: [[1, [2, 3], [4, [5]]]], expected: [1, 2, 3, 4, 5], hidden: true },
    ],
    pitfalls: [
      "Only flattening one level instead of recursing fully.",
    ],
    explanation: "Recursing into nested arrays and gathering non-array values flattens arbitrarily deep structures.",
    resources: [
      {
        label: "MDN: Array.prototype.flat",
        url: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/flat",
      },
    ],
    hints: [
      "Check if the current element is an array using Array.isArray.",
      "Recursively flatten nested arrays.",
    ],
  },

  // ── ES6+ ──────────────────────────────────────────────────────────────────
  {
    id: "js-es6-001",
    track: "javascript",
    topic: "ES6+",
    difficulty: "easy",
    title: "Destructure and Swap",
    prompt:
      "Implement `swap(pair)` that takes a two-element array `[a, b]` and returns `[b, a]` using destructuring.",
    kind: "function",
    starterCode: "function swap(pair) {\n  // your code here\n}",
    solution:
      "function swap(pair) {\n  const [a, b] = pair;\n  return [b, a];\n}",
    functionName: "swap",
    testCases: [
      { input: [[1, 2]], expected: [2, 1] },
      { input: [["hello", "world"]], expected: ["world", "hello"] },
      { input: [[true, false]], expected: [false, true], hidden: true },
    ],
    pitfalls: [
      "Trying to swap in place without a structure to return.",
    ],
    explanation: "Returning the reversed pair is the destructuring swap idiom.",
    resources: [
      {
        label: "MDN: Destructuring assignment",
        url: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment",
      },
    ],
    hints: ["Destructure the array into two variables, then return them swapped."],
  },
  {
    id: "js-es6-002",
    track: "javascript",
    topic: "ES6+",
    difficulty: "medium",
    title: "Merge Objects with Spread",
    prompt:
      "Implement `mergeDefaults(defaults, overrides)` that returns a new object combining both. Properties in `overrides` take precedence over those in `defaults`.",
    kind: "function",
    starterCode:
      "function mergeDefaults(defaults, overrides) {\n  // your code here\n}",
    solution:
      "function mergeDefaults(defaults, overrides) {\n  return { ...defaults, ...overrides };\n}",
    functionName: "mergeDefaults",
    testCases: [
      {
        input: [{ color: "red", size: "large" }, { size: "small" }],
        expected: { color: "red", size: "small" },
      },
      { input: [{ a: 1 }, {}], expected: { a: 1 } },
      { input: [{}, { b: 2 }], expected: { b: 2 }, hidden: true },
    ],
    pitfalls: [
      "Spreading overrides before defaults lets defaults clobber them.",
    ],
    explanation: "Spreading defaults then the override object merges so provided values take precedence.",
    resources: [
      {
        label: "MDN: Spread syntax",
        url: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Spread_syntax",
      },
    ],
    hints: ["The spread operator merges objects; later properties overwrite earlier ones."],
  },

  // ── Recursion (hard) ──────────────────────────────────────────────────────
  {
    id: "js-recursion-003",
    track: "javascript",
    topic: "Recursion",
    difficulty: "hard",
    title: "Permutations of a String",
    prompt:
      "Implement `permutations(str)` that returns an array of **all unique permutations** of `str` in any order.\n\nExample: `permutations('ab')` → `['ab', 'ba']`.",
    kind: "function",
    starterCode: "function permutations(str) {\n  // your code here\n}",
    solution:
      "function permutations(str) {\n  if (str.length <= 1) return [str];\n  const result = new Set();\n  for (let i = 0; i < str.length; i++) {\n    const ch = str[i];\n    const rest = str.slice(0, i) + str.slice(i + 1);\n    for (const perm of permutations(rest)) {\n      result.add(ch + perm);\n    }\n  }\n  return [...result].sort();\n}",
    functionName: "permutations",
    testCases: [
      { input: ["a"], expected: ["a"] },
      { input: ["ab"], expected: ["ab", "ba"] },
      { input: ["abc"], expected: ["abc", "acb", "bac", "bca", "cab", "cba"] },
      { input: ["aa"], expected: ["aa"], hidden: true },
    ],
    pitfalls: [
      "Duplicate characters can produce repeated permutations.",
      "Building permutations without a clear base case.",
    ],
    explanation: "Choosing each character in turn and permuting the remainder generates all orderings recursively.",
    resources: [
      {
        label: "MDN: Recursion (glossary)",
        url: "https://developer.mozilla.org/docs/Glossary/Recursion",
      },
    ],
    hints: [
      "For each character, fix it at the front and recursively generate permutations of the rest.",
      "Use a Set to automatically deduplicate when characters repeat.",
    ],
  },

  // ── DOM Manipulation ──────────────────────────────────────────────────────
  {
    id: "js-dom-001",
    track: "javascript",
    topic: "DOM Manipulation",
    difficulty: "easy",
    title: "Append a List Item",
    prompt:
      "The page has an empty `<ul id=\"list\">`. Write JavaScript that appends exactly one `<li>` with the text `Item` to it.",
    kind: "dom",
    starterCode:
      "// Append an <li>Item</li> to the #list element\n",
    solution:
      "const li = document.createElement('li');\nli.textContent = 'Item';\ndocument.getElementById('list').appendChild(li);",
    html: '<ul id="list"></ul>',
    testCases: [
      {
        description: "exactly one <li> exists",
        assert: "document.querySelectorAll('#list li').length === 1",
      },
      {
        description: "its text is 'Item'",
        assert: "document.querySelector('#list li').textContent === 'Item'",
      },
    ],
    pitfalls: [
      "Building HTML strings instead of creating nodes invites bugs.",
    ],
    explanation: "Creating an element node and appending it adds the list item to the DOM safely.",
    resources: [
      {
        label: "MDN: Document.createElement",
        url: "https://developer.mozilla.org/docs/Web/API/Document/createElement",
      },
    ],
    hints: [
      "Use document.createElement to make the element.",
      "Set textContent before appending.",
    ],
  },
  {
    id: "js-dom-002",
    track: "javascript",
    topic: "DOM Manipulation",
    difficulty: "medium",
    title: "Toggle a CSS Class",
    prompt:
      "The page has `<div id=\"box\" class=\"hidden\">Hello</div>`. Write JavaScript that removes the `hidden` class from `#box` and adds the class `visible`.",
    kind: "dom",
    starterCode:
      "// Toggle classes on #box\n",
    solution:
      "const box = document.getElementById('box');\nbox.classList.remove('hidden');\nbox.classList.add('visible');",
    html: '<div id="box" class="hidden">Hello</div>',
    testCases: [
      {
        description: "#box does not have class 'hidden'",
        assert: "!document.getElementById('box').classList.contains('hidden')",
      },
      {
        description: "#box has class 'visible'",
        assert: "document.getElementById('box').classList.contains('visible')",
      },
    ],
    pitfalls: [
      "Manually checking and editing className is more error-prone than classList.toggle.",
    ],
    explanation: "classList.toggle flips the presence of a class in one call.",
    resources: [
      {
        label: "MDN: Element.classList",
        url: "https://developer.mozilla.org/docs/Web/API/Element/classList",
      },
    ],
    hints: ["classList.remove and classList.add are the direct methods to use."],
  },
];
