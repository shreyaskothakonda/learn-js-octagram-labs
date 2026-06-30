import type { Problem } from "../types";

const R = {
  lru: { label: "Wikipedia: Cache replacement policies (LRU)", url: "https://en.wikipedia.org/wiki/Cache_replacement_policies#Least_recently_used_(LRU)" },
  topo: { label: "Wikipedia: Topological sorting", url: "https://en.wikipedia.org/wiki/Topological_sorting" },
  dp: { label: "Wikipedia: Dynamic programming", url: "https://en.wikipedia.org/wiki/Dynamic_programming" },
  bst: { label: "Wikipedia: Lowest common ancestor", url: "https://en.wikipedia.org/wiki/Lowest_common_ancestor" },
};

// A BST used by the LCA problem (LeetCode 235 shape).
const BST = {
  val: 6,
  left: {
    val: 2,
    left: { val: 0, left: null, right: null },
    right: {
      val: 4,
      left: { val: 3, left: null, right: null },
      right: { val: 5, left: null, right: null },
    },
  },
  right: {
    val: 8,
    left: { val: 7, left: null, right: null },
    right: { val: 9, left: null, right: null },
  },
};

export const dsFaangProblems: Problem[] = [
  {
    id: "ds-hashmaps-011", track: "data-structures", topic: "Hash Maps", difficulty: "medium",
    title: "LRU Cache", kind: "harness",
    prompt:
      "Design an `LRUCache` class with a fixed `capacity`. `get(key)` returns the value or `-1` if absent; `put(key, value)` inserts or updates. Both count as a use, marking the key most-recently-used. When `put` would exceed capacity, evict the least-recently-used key first. Aim for O(1) per operation. (Asked at Amazon, Microsoft, and Google.)",
    examples: [
      {
        input: "new LRUCache(2); put(1,1); put(2,2); get(1); put(3,3); get(2); put(4,4); get(1); get(3); get(4)",
        output: "[1, -1, -1, 3, 4]",
        explanation: "put(3) evicts key 2 (LRU). put(4) evicts key 1. So get(2) and get(1) return -1.",
      },
    ],
    starterCode:
      "class LRUCache {\n  constructor(capacity) {\n    // your code here\n  }\n  get(key) {\n    // your code here\n  }\n  put(key, value) {\n    // your code here\n  }\n}",
    solution:
      "class LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n    this.map = new Map();\n  }\n  get(key) {\n    if (!this.map.has(key)) return -1;\n    const val = this.map.get(key);\n    this.map.delete(key);\n    this.map.set(key, val);\n    return val;\n  }\n  put(key, value) {\n    if (this.map.has(key)) this.map.delete(key);\n    this.map.set(key, value);\n    if (this.map.size > this.capacity) {\n      const oldest = this.map.keys().next().value;\n      this.map.delete(oldest);\n    }\n  }\n}",
    testCases: [
      { run: "const c = new LRUCache(2); c.put(1, 1); c.put(2, 2); const a = c.get(1); c.put(3, 3); const b = c.get(2); c.put(4, 4); const d = c.get(1); const e = c.get(3); const f = c.get(4); return [a, b, d, e, f];", expected: [1, -1, -1, 3, 4], description: "evicts least-recently-used" },
      { run: "const c = new LRUCache(1); c.put(1, 10); const a = c.get(1); c.put(2, 20); const b = c.get(1); const d = c.get(2); return [a, b, d];", expected: [10, -1, 20], description: "capacity 1" },
      { run: "const c = new LRUCache(2); c.put(2, 1); c.put(2, 2); const a = c.get(2); c.put(1, 1); c.put(4, 1); const b = c.get(2); return [a, b];", expected: [2, -1], hidden: true },
      { run: "const c = new LRUCache(2); c.put(1, 1); c.put(2, 2); c.put(1, 100); const a = c.get(1); const b = c.get(2); return [a, b];", expected: [100, 2], hidden: true },
    ],
    hints: [
      "A JavaScript `Map` remembers insertion order, so its first key is the least-recently-used.",
      "On every get/put of an existing key, delete then re-insert it to move it to the most-recent end.",
    ],
    pitfalls: ["Updating an existing key without re-inserting it leaves its recency stale.", "Evicting before inserting, or evicting by the wrong end, removes the wrong key."],
    explanation:
      "Backing the cache with a Map gives O(1) lookup plus insertion-order iteration. Re-inserting a touched key moves it to the most-recent position; when size exceeds capacity, the first key from `map.keys()` is the least-recently-used and gets evicted. Production implementations use a hash map plus a doubly linked list for the same O(1) guarantees.",
    resources: [R.lru],
  },
  {
    id: "ds-graphs-009", track: "data-structures", topic: "Graphs", difficulty: "medium",
    title: "Course Schedule", kind: "function", functionName: "canFinish",
    prompt:
      "There are `numCourses` courses labeled `0` to `numCourses - 1`. `prerequisites[i] = [a, b]` means you must take `b` before `a`. Implement `canFinish(numCourses, prerequisites)` returning `true` if you can finish every course, `false` if a cycle makes it impossible. (Asked at Amazon and Google.)",
    examples: [
      { input: "numCourses = 2, prerequisites = [[1, 0]]", output: "true", explanation: "Take course 0, then course 1." },
      { input: "numCourses = 2, prerequisites = [[1, 0], [0, 1]]", output: "false", explanation: "0 and 1 depend on each other — a cycle." },
    ],
    starterCode: "function canFinish(numCourses, prerequisites) {\n  // your code here\n}",
    solution:
      "function canFinish(numCourses, prerequisites) {\n  const adj = Array.from({ length: numCourses }, () => []);\n  const indeg = new Array(numCourses).fill(0);\n  for (const [a, b] of prerequisites) {\n    adj[b].push(a);\n    indeg[a]++;\n  }\n  const queue = [];\n  for (let i = 0; i < numCourses; i++) if (indeg[i] === 0) queue.push(i);\n  let seen = 0;\n  while (queue.length) {\n    const node = queue.shift();\n    seen++;\n    for (const next of adj[node]) {\n      if (--indeg[next] === 0) queue.push(next);\n    }\n  }\n  return seen === numCourses;\n}",
    testCases: [
      { input: [2, [[1, 0]]], expected: true },
      { input: [2, [[1, 0], [0, 1]]], expected: false },
      { input: [4, [[1, 0], [2, 0], [3, 1], [3, 2]]], expected: true, hidden: true },
      { input: [3, [[0, 1], [1, 2], [2, 0]]], expected: false, hidden: true },
    ],
    hints: [
      "Model courses as a directed graph and ask whether it has a valid topological order.",
      "Kahn's algorithm: repeatedly remove a node with no remaining prerequisites; if you can remove them all, there is no cycle.",
    ],
    pitfalls: ["Confusing edge direction — `[a, b]` means an edge from b to a (b unlocks a).", "Concluding success without checking that every course was processed; a leftover cycle never reaches in-degree 0."],
    explanation:
      "Finishing all courses is possible exactly when the prerequisite graph is a DAG. Kahn's algorithm tracks in-degrees, starts from prerequisite-free courses, and peels the graph layer by layer. If the number processed equals `numCourses`, no cycle exists. O(V + E).",
    resources: [R.topo],
  },
  {
    id: "ds-dp-012", track: "data-structures", topic: "Dynamic Programming", difficulty: "medium",
    title: "Coin Change", kind: "function", functionName: "coinChange",
    prompt:
      "Given `coins` (an array of distinct denominations) and a target `amount`, implement `coinChange(coins, amount)` returning the fewest coins that sum to `amount`, or `-1` if it cannot be made. You may use each denomination any number of times. (Asked at Amazon, Microsoft, and Google.)",
    examples: [
      { input: "coins = [1, 2, 5], amount = 11", output: "3", explanation: "5 + 5 + 1 = 11." },
      { input: "coins = [2], amount = 3", output: "-1", explanation: "No combination of 2s makes 3." },
    ],
    starterCode: "function coinChange(coins, amount) {\n  // your code here\n}",
    solution:
      "function coinChange(coins, amount) {\n  const dp = new Array(amount + 1).fill(Infinity);\n  dp[0] = 0;\n  for (let a = 1; a <= amount; a++) {\n    for (const c of coins) {\n      if (c <= a && dp[a - c] + 1 < dp[a]) dp[a] = dp[a - c] + 1;\n    }\n  }\n  return dp[amount] === Infinity ? -1 : dp[amount];\n}",
    testCases: [
      { input: [[1, 2, 5], 11], expected: 3 },
      { input: [[2], 3], expected: -1 },
      { input: [[1], 0], expected: 0, hidden: true },
      { input: [[1, 3, 4, 5], 7], expected: 2, hidden: true },
    ],
    hints: [
      "Let dp[a] be the fewest coins to make amount a; dp[0] = 0.",
      "For each amount, try every coin: dp[a] = 1 + min over coins c of dp[a - c].",
    ],
    pitfalls: ["A greedy 'largest coin first' strategy is wrong for arbitrary denominations (e.g. coins [1,3,4], amount 6).", "Forgetting the unreachable case — leave it as Infinity and convert to -1 at the end."],
    explanation:
      "Bottom-up DP builds the answer for every amount from 0 up to the target. Each amount takes one more coin than the best reachable smaller amount. Unreachable amounts stay Infinity and map to -1. O(amount × coins) time.",
    resources: [R.dp],
  },
  {
    id: "ds-bst-006", track: "data-structures", topic: "BST", difficulty: "medium",
    title: "Lowest Common Ancestor of a BST", kind: "function", functionName: "lca",
    prompt:
      "A binary search tree node is `{ val, left, right }`. Implement `lca(root, p, q)` returning the value of the lowest node that is an ancestor of both values `p` and `q` (a node is an ancestor of itself). Use the BST ordering for an O(height) solution. (Asked at Microsoft and Amazon.)",
    examples: [
      { input: "tree rooted at 6, p = 2, q = 8", output: "6", explanation: "2 is in the left subtree, 8 in the right, so they split at the root." },
      { input: "tree rooted at 6, p = 2, q = 4", output: "2", explanation: "4 lives under 2, so 2 is their lowest common ancestor." },
    ],
    starterCode: "function lca(root, p, q) {\n  // your code here\n}",
    solution:
      "function lca(root, p, q) {\n  let node = root;\n  while (node) {\n    if (p < node.val && q < node.val) node = node.left;\n    else if (p > node.val && q > node.val) node = node.right;\n    else return node.val;\n  }\n  return null;\n}",
    testCases: [
      { input: [BST, 2, 8], expected: 6 },
      { input: [BST, 2, 4], expected: 2 },
      { input: [BST, 3, 5], expected: 4, hidden: true },
      { input: [BST, 7, 9], expected: 8, hidden: true },
    ],
    hints: [
      "Use the BST property: if both targets are smaller than the current node, the answer is in the left subtree; if both larger, the right.",
      "The first node where the targets fall on different sides (or one equals the node) is the split point — the LCA.",
    ],
    pitfalls: ["Ignoring the BST ordering and doing a general-tree LCA search is O(n) instead of O(height).", "Forgetting that a node can be the ancestor of itself when p or q equals the current value."],
    explanation:
      "Descend from the root: while both values lie on the same side, move that way. The moment they diverge — or one matches the current node — that node is the lowest common ancestor. The walk costs O(height), which is O(log n) for a balanced BST.",
    resources: [R.bst],
  },
];
