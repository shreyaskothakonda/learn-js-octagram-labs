import type { Problem } from "../types";

const R = {
  functions: { label: "MDN: Functions guide", url: "https://developer.mozilla.org/docs/Web/JavaScript/Guide/Functions" },
  closures: { label: "MDN: Closures", url: "https://developer.mozilla.org/docs/Web/JavaScript/Closures" },
  reduce: { label: "MDN: Array.prototype.reduce()", url: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce" },
  classes: { label: "MDN: Classes", url: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Classes" },
  objects: { label: "MDN: Working with objects", url: "https://developer.mozilla.org/docs/Web/JavaScript/Guide/Working_with_objects" },
  recursion: { label: "MDN: Recursion", url: "https://developer.mozilla.org/docs/Web/JavaScript/Guide/Functions#recursion" },
  json: { label: "MDN: JSON.stringify()", url: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify" },
};

export const jsHardExtraProblems: Problem[] = [
  {
    id: "js-curry-001", track: "javascript", topic: "A Closer Look at Functions", difficulty: "hard",
    title: "Implement curry()", kind: "harness",
    prompt:
      "Implement `curry(fn)`, which returns a curried version of `fn`. The curried function should keep returning a new function until at least as many arguments as `fn` declares (`fn.length`) have been supplied, then call `fn` with all of them. It must support any split of arguments: `add(1)(2)(3)`, `add(1, 2)(3)`, and `add(1)(2, 3)` should all work.",
    examples: [
      { input: "const add = curry((a, b, c) => a + b + c); add(1)(2)(3)", output: "6" },
      { input: "add(1, 2)(3)", output: "6", explanation: "Arguments can arrive in any grouping." },
    ],
    starterCode: "function curry(fn) {\n  // your code here\n}",
    solution:
      "function curry(fn) {\n  return function curried(...args) {\n    if (args.length >= fn.length) return fn.apply(this, args);\n    return (...more) => curried.apply(this, args.concat(more));\n  };\n}",
    testCases: [
      { run: "const add = curry((a, b, c) => a + b + c); return add(1)(2)(3);", expected: 6, description: "add(1)(2)(3)" },
      { run: "const add = curry((a, b, c) => a + b + c); return add(1, 2)(3);", expected: 6, description: "add(1, 2)(3)" },
      { run: "const add = curry((a, b, c) => a + b + c); return add(1)(2, 3);", expected: 6, hidden: true },
      { run: "const mul = curry((a, b) => a * b); return mul(4)(5);", expected: 20, hidden: true },
    ],
    hints: [
      "A function's declared arity is available as `fn.length`.",
      "If not enough arguments have arrived, return a function that collects more and recurses with the combined list.",
    ],
    pitfalls: ["Comparing against a hard-coded argument count instead of `fn.length` only works for one specific function.", "Losing earlier arguments — accumulate them with `concat`, do not overwrite."],
    explanation:
      "Currying relies on a closure that remembers the arguments gathered so far. Each call checks whether enough arguments exist to satisfy the original function's arity; if not, it returns another collector closure. Once the threshold is met, the original function runs with the full argument list.",
    resources: [R.closures, R.functions],
  },
  {
    id: "js-memoize-001", track: "javascript", topic: "A Closer Look at Functions", difficulty: "hard",
    title: "Implement memoize()", kind: "harness",
    prompt:
      "Implement `memoize(fn)` that returns a function caching results by argument list, so the underlying `fn` runs at most once per distinct set of arguments. Repeated calls with the same arguments return the cached value without re-invoking `fn`.",
    examples: [
      { input: "let calls = 0; const slow = (n) => { calls++; return n * 2; }; const m = memoize(slow); m(5); m(5); m(6); calls", output: "2", explanation: "m(5) runs once, the second m(5) is cached, m(6) runs once — 2 calls total." },
    ],
    starterCode: "function memoize(fn) {\n  // your code here\n}",
    solution:
      "function memoize(fn) {\n  const cache = new Map();\n  return function (...args) {\n    const key = JSON.stringify(args);\n    if (cache.has(key)) return cache.get(key);\n    const result = fn.apply(this, args);\n    cache.set(key, result);\n    return result;\n  };\n}",
    testCases: [
      { run: "let calls = 0; const slow = (n) => { calls++; return n * 2; }; const m = memoize(slow); m(5); m(5); m(6); return calls;", expected: 2, description: "counts underlying calls" },
      { run: "const m = memoize((n) => n * n); return m(4);", expected: 16, description: "returns the computed value" },
      { run: "let calls = 0; const f = (a, b) => { calls++; return a + b; }; const m = memoize(f); m(1, 2); m(1, 2); m(2, 1); return calls;", expected: 2, hidden: true },
      { run: "const m = memoize((n) => n + 1); m(0); return m(0);", expected: 1, hidden: true },
    ],
    hints: [
      "Build a cache key from the argument list — `JSON.stringify(args)` is a simple, serializable choice.",
      "Check the cache before calling `fn`; store the result the first time.",
    ],
    pitfalls: ["Using only the first argument as the key gives wrong results for multi-argument functions.", "Caching by reference identity misses equal-but-distinct argument arrays."],
    explanation:
      "A closure holds a Map keyed by a serialized form of the arguments. On a cache hit the stored value is returned immediately; on a miss the function runs once and its result is recorded. This trades memory for speed on pure, repeatedly-called functions.",
    resources: [R.closures, R.functions],
  },
  {
    id: "js-pipe-001", track: "javascript", topic: "A Closer Look at Functions", difficulty: "hard",
    title: "Implement pipe()", kind: "harness",
    prompt:
      "Implement `pipe(...fns)` that returns a function composing the given functions left to right: the output of each becomes the input of the next. `pipe(f, g, h)(x)` should compute `h(g(f(x)))`. With no functions, the result is the identity function.",
    examples: [
      { input: "const f = pipe((x) => x + 1, (x) => x * 2, (x) => x - 3); f(5)", output: "9", explanation: "((5 + 1) * 2) - 3 = 9." },
      { input: "pipe()(42)", output: "42", explanation: "An empty pipe returns its input unchanged." },
    ],
    starterCode: "function pipe(...fns) {\n  // your code here\n}",
    solution:
      "function pipe(...fns) {\n  return (x) => fns.reduce((acc, fn) => fn(acc), x);\n}",
    testCases: [
      { run: "const f = pipe((x) => x + 1, (x) => x * 2, (x) => x - 3); return f(5);", expected: 9, description: "left-to-right composition" },
      { run: "const f = pipe((x) => x * 10); return f(7);", expected: 70, description: "single function" },
      { run: "const f = pipe(); return f(42);", expected: 42, hidden: true },
      { run: "const f = pipe((s) => s.toUpperCase(), (s) => s + '!'); return f('hi');", expected: "HI!", hidden: true },
    ],
    hints: [
      "`reduce` threads an accumulator through a list — start it at the input value.",
      "At each step apply the current function to the accumulator.",
    ],
    pitfalls: ["Composing right-to-left gives `compose`, not `pipe` — order matters.", "Forgetting that an empty function list must behave as the identity (reduce with the input as the initial value handles this for free)."],
    explanation:
      "`pipe` is a left fold over the functions, using the input as the seed of the reduction. Each function transforms the running value. Because the seed is the input itself, an empty pipe naturally returns the input unchanged.",
    resources: [R.reduce, R.functions],
  },
  {
    id: "js-emitter-001", track: "javascript", topic: "Object-Oriented Programming", difficulty: "hard",
    title: "Build an EventEmitter", kind: "harness",
    prompt:
      "Implement an `EventEmitter` class with `on(event, callback)` to subscribe, `off(event, callback)` to unsubscribe a specific callback, and `emit(event, ...args)` to call every subscriber of that event in registration order, forwarding the arguments. Multiple callbacks may listen to the same event.",
    examples: [
      { input: 'const e = new EventEmitter(); const out = []; e.on("msg", (x) => out.push(x)); e.emit("msg", 1); e.emit("msg", 2); out', output: "[1, 2]" },
    ],
    starterCode:
      "class EventEmitter {\n  constructor() {\n    // your code here\n  }\n  on(event, callback) {\n    // your code here\n  }\n  off(event, callback) {\n    // your code here\n  }\n  emit(event, ...args) {\n    // your code here\n  }\n}",
    solution:
      "class EventEmitter {\n  constructor() { this.listeners = {}; }\n  on(event, callback) {\n    (this.listeners[event] = this.listeners[event] || []).push(callback);\n    return this;\n  }\n  off(event, callback) {\n    if (this.listeners[event]) {\n      this.listeners[event] = this.listeners[event].filter((cb) => cb !== callback);\n    }\n    return this;\n  }\n  emit(event, ...args) {\n    (this.listeners[event] || []).forEach((cb) => cb(...args));\n    return this;\n  }\n}",
    testCases: [
      { run: "const e = new EventEmitter(); const out = []; e.on('msg', (x) => out.push(x)); e.emit('msg', 1); e.emit('msg', 2); return out;", expected: [1, 2], description: "subscribers receive emitted values" },
      { run: "const e = new EventEmitter(); const out = []; const cb = (x) => out.push(x); e.on('x', cb); e.off('x', cb); e.emit('x', 9); return out;", expected: [], description: "off() removes the listener" },
      { run: "const e = new EventEmitter(); let sum = 0; e.on('add', (a, b) => { sum += a + b; }); e.emit('add', 2, 3); e.emit('add', 4, 1); return sum;", expected: 10, hidden: true },
      { run: "const e = new EventEmitter(); const out = []; e.on('a', () => out.push('a1')); e.on('a', () => out.push('a2')); e.emit('a'); return out;", expected: ["a1", "a2"], hidden: true },
    ],
    hints: [
      "Store listeners in an object (or Map) keyed by event name, each value an array of callbacks.",
      "`off` must remove the exact callback reference — filter the array.",
    ],
    pitfalls: ["Emitting an event that has no listeners should be a no-op, not a crash — default to an empty array.", "Storing a single callback per event instead of an array drops additional subscribers."],
    explanation:
      "The emitter keeps a map from event name to an ordered list of callbacks. `on` appends, `off` filters by reference, and `emit` iterates the list forwarding the arguments. This is the core publish/subscribe pattern behind Node's EventEmitter and browser event targets.",
    resources: [R.classes],
  },
  {
    id: "js-objects-012", track: "javascript", topic: "Data Structures, Operators & Strings", difficulty: "hard",
    title: "Flatten a Nested Object", kind: "function", functionName: "flattenObject",
    prompt:
      "Implement `flattenObject(obj)` that returns a new object with no nesting: each leaf value is keyed by its full dot-separated path. Nested plain objects are flattened; arrays and primitive values are treated as leaves (kept as-is).",
    examples: [
      { input: "{ a: 1, b: { c: 2, d: { e: 3 } } }", output: '{ "a": 1, "b.c": 2, "b.d.e": 3 }' },
      { input: "{ a: [1, 2], b: { c: 3 } }", output: '{ "a": [1, 2], "b.c": 3 }', explanation: "Arrays are leaves, so the array stays under key \"a\"." },
    ],
    starterCode: "function flattenObject(obj) {\n  // your code here\n}",
    solution:
      "function flattenObject(obj) {\n  const result = {};\n  const walk = (cur, prefix) => {\n    for (const key of Object.keys(cur)) {\n      const value = cur[key];\n      const path = prefix ? prefix + '.' + key : key;\n      if (value && typeof value === 'object' && !Array.isArray(value)) {\n        walk(value, path);\n      } else {\n        result[path] = value;\n      }\n    }\n  };\n  walk(obj, '');\n  return result;\n}",
    testCases: [
      { input: [{ a: 1, b: { c: 2, d: { e: 3 } } }], expected: { a: 1, "b.c": 2, "b.d.e": 3 } },
      { input: [{ x: { y: { z: 1 } }, w: 2 }], expected: { "x.y.z": 1, w: 2 } },
      { input: [{ a: [1, 2], b: { c: 3 } }], expected: { a: [1, 2], "b.c": 3 }, hidden: true },
      { input: [{}], expected: {}, hidden: true },
    ],
    hints: [
      "Recurse with a running prefix string; append `.key` as you descend.",
      "Only recurse into values that are objects but not arrays; everything else is a leaf.",
    ],
    pitfalls: ["Treating arrays as nested objects produces keys like `a.0`, which the spec excludes here.", "Prepending a leading dot when the prefix is empty yields keys like `.a`."],
    explanation:
      "A depth-first walk carries the path built so far. Plain objects are descended into; arrays and primitives are written to the result under their full path. Because the walk follows key insertion order, the output keys come out in a predictable order.",
    resources: [R.objects],
  },
  {
    id: "js-recursion-010", track: "javascript", topic: "A Closer Look at Functions", difficulty: "hard",
    title: "Generate All Permutations", kind: "function", functionName: "permutations",
    prompt:
      "Implement `permutations(arr)` that returns an array of all orderings of the input array's elements. For each position, fix one element as the first and recurse on the rest, so the orderings come out in a predictable sequence. Assume the elements are distinct.",
    examples: [
      { input: "[1, 2, 3]", output: "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]" },
      { input: "[1]", output: "[[1]]" },
    ],
    starterCode: "function permutations(arr) {\n  // your code here\n}",
    solution:
      "function permutations(arr) {\n  if (arr.length <= 1) return [arr.slice()];\n  const result = [];\n  for (let i = 0; i < arr.length; i++) {\n    const rest = arr.slice(0, i).concat(arr.slice(i + 1));\n    for (const perm of permutations(rest)) {\n      result.push([arr[i], ...perm]);\n    }\n  }\n  return result;\n}",
    testCases: [
      { input: [[1, 2, 3]], expected: [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]] },
      { input: [[1]], expected: [[1]] },
      { input: [[]], expected: [[]], hidden: true },
      { input: [["a", "b"]], expected: [["a", "b"], ["b", "a"]], hidden: true },
    ],
    hints: [
      "Base case: an array of length 0 or 1 has exactly one permutation — itself.",
      "For each index, take that element out, permute the remainder, and prepend the element to every sub-permutation.",
    ],
    pitfalls: ["Mutating the input array while building `rest` corrupts later iterations — build a fresh array with `slice`/`concat`.", "Returning the original array reference instead of a copy in the base case lets callers mutate shared state."],
    explanation:
      "The number of permutations is n!. Fixing each element as the head and recursively permuting the rest enumerates them all without duplicates (given distinct inputs). Slicing keeps each recursive call working on its own array.",
    resources: [R.recursion],
  },
  {
    id: "js-json-001", track: "javascript", topic: "Beyond the Course", difficulty: "hard",
    title: "Implement JSON.stringify (subset)", kind: "function", functionName: "jsonStringify",
    prompt:
      "Implement `jsonStringify(value)` that serializes a value to a JSON string, matching the built-in `JSON.stringify` for: `null`, numbers, booleans, strings (escaping `\\`, `\"`, and newlines), arrays, and plain objects. Object keys keep their insertion order. You may assume no functions, `undefined`, or circular references appear at the top level.",
    examples: [
      { input: '{ a: 1, b: [2, 3], c: "x" }', output: '{"a":1,"b":[2,3],"c":"x"}' },
      { input: '[1, "two", true, null]', output: '[1,"two",true,null]' },
    ],
    starterCode: "function jsonStringify(value) {\n  // your code here\n}",
    solution:
      "function jsonStringify(value) {\n  if (value === null) return 'null';\n  const type = typeof value;\n  if (type === 'number' || type === 'boolean') return String(value);\n  if (type === 'string') {\n    return '\"' + value.replace(/\\\\/g, '\\\\\\\\').replace(/\"/g, '\\\\\"').replace(/\\n/g, '\\\\n') + '\"';\n  }\n  if (Array.isArray(value)) {\n    return '[' + value.map((v) => jsonStringify(v)).join(',') + ']';\n  }\n  if (type === 'object') {\n    const parts = [];\n    for (const key of Object.keys(value)) {\n      const v = value[key];\n      if (v === undefined || typeof v === 'function') continue;\n      parts.push(jsonStringify(key) + ':' + jsonStringify(v));\n    }\n    return '{' + parts.join(',') + '}';\n  }\n  return undefined;\n}",
    testCases: [
      { input: [{ a: 1, b: [2, 3], c: "x" }], expected: '{"a":1,"b":[2,3],"c":"x"}' },
      { input: [[1, "two", true, null]], expected: '[1,"two",true,null]' },
      { input: [{ nested: { y: [true, false] } }], expected: '{"nested":{"y":[true,false]}}', hidden: true },
      { input: ["a\nb"], expected: '"a\\nb"', hidden: true },
    ],
    hints: [
      "Branch on the value's type: null, number/boolean, string, array, object.",
      "Recurse for array elements and object values; wrap and join with the right delimiters.",
    ],
    pitfalls: ["Forgetting to escape special characters inside strings produces invalid JSON.", "Quoting object keys is required — keys are JSON strings too, so reuse the same string serializer."],
    explanation:
      "JSON serialization is a recursive structural walk. Primitives map to their textual forms (strings need escaping), arrays join their serialized elements in brackets, and objects join `\"key\":value` pairs in braces. Reusing the function for keys and nested values keeps the implementation small and correct.",
    resources: [R.json],
  },
];
