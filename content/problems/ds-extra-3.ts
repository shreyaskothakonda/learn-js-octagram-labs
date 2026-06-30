import type { Problem } from "../types";

const R = {
  arr: { label: "Wikipedia: Array data structure", url: "https://en.wikipedia.org/wiki/Array_(data_structure)" },
  hash: { label: "Wikipedia: Hash table", url: "https://en.wikipedia.org/wiki/Hash_table" },
  heap: { label: "Wikipedia: Binary heap", url: "https://en.wikipedia.org/wiki/Binary_heap" },
  search: { label: "Wikipedia: Binary search algorithm", url: "https://en.wikipedia.org/wiki/Binary_search_algorithm" },
  graph: { label: "Wikipedia: Depth-first search", url: "https://en.wikipedia.org/wiki/Depth-first_search" },
  dp: { label: "Wikipedia: Edit distance", url: "https://en.wikipedia.org/wiki/Edit_distance" },
  stack: { label: "Wikipedia: Stack (abstract data type)", url: "https://en.wikipedia.org/wiki/Stack_(abstract_data_type)" },
  queens: { label: "Wikipedia: Eight queens puzzle", url: "https://en.wikipedia.org/wiki/Eight_queens_puzzle" },
};

export const dsExtra3Problems: Problem[] = [
  // ===================== MEDIUM (5) =====================
  {
    id: "ds-twopointers-006", track: "data-structures", topic: "Arrays & Two-Pointers", difficulty: "medium",
    title: "Product of Array Except Self", kind: "function", functionName: "productExceptSelf",
    prompt:
      "Implement `productExceptSelf(nums)` that returns an array `out` where `out[i]` is the product of every element of `nums` except `nums[i]`. Solve it in O(n) time **without using division**.",
    examples: [
      { input: "[1, 2, 3, 4]", output: "[24, 12, 8, 6]", explanation: "out[0] = 2*3*4 = 24, out[1] = 1*3*4 = 12, and so on." },
      { input: "[2, 3, 4]", output: "[12, 8, 6]" },
    ],
    starterCode: "function productExceptSelf(nums) {\n  // your code here\n}",
    solution:
      "function productExceptSelf(nums) {\n  const n = nums.length;\n  const res = new Array(n).fill(1);\n  let pre = 1;\n  for (let i = 0; i < n; i++) {\n    res[i] = pre;\n    pre *= nums[i];\n  }\n  let post = 1;\n  for (let i = n - 1; i >= 0; i--) {\n    res[i] *= post;\n    post *= nums[i];\n  }\n  return res;\n}",
    testCases: [
      { input: [[1, 2, 3, 4]], expected: [24, 12, 8, 6] },
      { input: [[2, 3, 4]], expected: [12, 8, 6] },
      { input: [[5]], expected: [1], hidden: true },
      { input: [[3, 0, 2]], expected: [0, 6, 0], hidden: true },
    ],
    hints: [
      "Make one left-to-right pass storing the product of everything to the left of each index.",
      "Then a right-to-left pass multiplies in the product of everything to the right.",
    ],
    pitfalls: ["Reaching for division breaks when any element is 0.", "Allocating an O(n) prefix and an O(n) suffix array works but the two-pass approach needs only the output array."],
    explanation:
      "The product of all-but-i equals (product of everything left of i) times (product of everything right of i). One forward pass fills the left products into the result, and one backward pass multiplies in the right products using a running accumulator. O(n) time, O(1) extra space.",
    resources: [R.arr],
  },
  {
    id: "ds-sorting-007", track: "data-structures", topic: "Sorting", difficulty: "medium",
    title: "Sort Colors (Dutch National Flag)", kind: "function", functionName: "sortColors",
    prompt:
      "An array contains only the integers `0`, `1`, and `2`. Implement `sortColors(nums)` that sorts it in a single pass and returns the sorted array. (This is the Dutch national flag problem.)",
    examples: [
      { input: "[2, 0, 2, 1, 1, 0]", output: "[0, 0, 1, 1, 2, 2]" },
      { input: "[1, 0]", output: "[0, 1]" },
    ],
    starterCode: "function sortColors(nums) {\n  // your code here\n}",
    solution:
      "function sortColors(nums) {\n  let low = 0, mid = 0, high = nums.length - 1;\n  while (mid <= high) {\n    if (nums[mid] === 0) {\n      [nums[low], nums[mid]] = [nums[mid], nums[low]];\n      low++; mid++;\n    } else if (nums[mid] === 1) {\n      mid++;\n    } else {\n      [nums[mid], nums[high]] = [nums[high], nums[mid]];\n      high--;\n    }\n  }\n  return nums;\n}",
    testCases: [
      { input: [[2, 0, 2, 1, 1, 0]], expected: [0, 0, 1, 1, 2, 2] },
      { input: [[1, 0]], expected: [0, 1] },
      { input: [[0]], expected: [0], hidden: true },
      { input: [[2, 2, 1, 1, 0, 0]], expected: [0, 0, 1, 1, 2, 2], hidden: true },
    ],
    hints: [
      "Keep three pointers: everything before `low` is 0, everything after `high` is 2, the middle is being scanned.",
      "When you swap a 2 to the end, do not advance `mid` — the swapped-in value still needs checking.",
    ],
    pitfalls: ["Incrementing `mid` after swapping with `high` skips an unexamined element."],
    explanation:
      "Three pointers partition the array into 0s, 1s, and 2s in one pass. A 0 is swapped to the low region, a 2 is swapped to the high region, and a 1 stays in place. O(n) time, O(1) space — faster than a comparison sort because the value range is fixed.",
    resources: [R.arr],
  },
  {
    id: "ds-heaps-005", track: "data-structures", topic: "Heaps", difficulty: "medium",
    title: "Top K Frequent Elements", kind: "function", functionName: "topKFrequent",
    prompt:
      "Implement `topKFrequent(nums, k)` that returns the `k` most frequent elements. Return them ordered by frequency (highest first); break ties by the smaller value first.",
    examples: [
      { input: "nums = [1, 1, 1, 2, 2, 3], k = 2", output: "[1, 2]", explanation: "1 appears 3 times, 2 appears twice." },
      { input: "nums = [4, 4, 5, 5, 6], k = 1", output: "[4]", explanation: "4 and 5 tie at 2 occurrences; the smaller value 4 wins." },
    ],
    starterCode: "function topKFrequent(nums, k) {\n  // your code here\n}",
    solution:
      "function topKFrequent(nums, k) {\n  const count = new Map();\n  for (const n of nums) count.set(n, (count.get(n) || 0) + 1);\n  return [...count.keys()]\n    .sort((a, b) => count.get(b) - count.get(a) || a - b)\n    .slice(0, k);\n}",
    testCases: [
      { input: [[1, 1, 1, 2, 2, 3], 2], expected: [1, 2] },
      { input: [[4, 4, 5, 5, 6], 1], expected: [4] },
      { input: [[7, 7, 7], 1], expected: [7], hidden: true },
      { input: [[1, 2, 3, 1, 2, 1], 3], expected: [1, 2, 3], hidden: true },
    ],
    hints: [
      "First build a frequency map with a single pass.",
      "Then order the distinct keys by frequency descending, breaking ties on value, and take the first k.",
    ],
    pitfalls: ["Relying on Map/object key insertion order instead of an explicit sort gives inconsistent results across inputs."],
    explanation:
      "A hash map counts occurrences in O(n). Sorting the distinct keys by frequency (then by value to make the order deterministic) and slicing the first k yields the answer. A real interview answer can replace the full sort with a size-k heap for O(n log k).",
    resources: [R.heap, R.hash],
  },
  {
    id: "ds-searching-007", track: "data-structures", topic: "Searching", difficulty: "medium",
    title: "Search in Rotated Sorted Array", kind: "function", functionName: "search",
    prompt:
      "A sorted array of **distinct** integers has been rotated at an unknown pivot (e.g. `[0,1,2,4,5,6,7]` might become `[4,5,6,7,0,1,2]`). Implement `search(nums, target)` returning the index of `target`, or `-1` if it is absent. Aim for O(log n).",
    examples: [
      { input: "nums = [4, 5, 6, 7, 0, 1, 2], target = 0", output: "4" },
      { input: "nums = [4, 5, 6, 7, 0, 1, 2], target = 3", output: "-1" },
    ],
    starterCode: "function search(nums, target) {\n  // your code here\n}",
    solution:
      "function search(nums, target) {\n  let lo = 0, hi = nums.length - 1;\n  while (lo <= hi) {\n    const mid = (lo + hi) >> 1;\n    if (nums[mid] === target) return mid;\n    if (nums[lo] <= nums[mid]) {\n      if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;\n      else lo = mid + 1;\n    } else {\n      if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;\n      else hi = mid - 1;\n    }\n  }\n  return -1;\n}",
    testCases: [
      { input: [[4, 5, 6, 7, 0, 1, 2], 0], expected: 4 },
      { input: [[4, 5, 6, 7, 0, 1, 2], 3], expected: -1 },
      { input: [[1], 1], expected: 0, hidden: true },
      { input: [[5, 1, 3], 5], expected: 0, hidden: true },
    ],
    hints: [
      "At each step, one half of the array (relative to mid) is still sorted — check which by comparing nums[lo] and nums[mid].",
      "If the target lies within the sorted half's range, search there; otherwise search the other half.",
    ],
    pitfalls: ["Using `<` instead of `<=` when testing `nums[lo] <= nums[mid]` mishandles the two-element case."],
    explanation:
      "Even after rotation, a binary-search step always has at least one sorted half. Determine which half is sorted, test whether the target falls inside its range, and discard the other half. O(log n).",
    resources: [R.search],
  },
  {
    id: "ds-graphs-008", track: "data-structures", topic: "Graphs", difficulty: "medium",
    title: "Number of Islands", kind: "function", functionName: "numIslands",
    prompt:
      "Given a `grid` of `1`s (land) and `0`s (water), implement `numIslands(grid)` returning the number of islands. An island is a group of `1`s connected horizontally or vertically.",
    examples: [
      { input: "[[1,1,0],[0,1,0],[0,0,1]]", output: "2", explanation: "The top-left L-shape is one island; the bottom-right cell is another." },
      { input: "[[0,0],[0,0]]", output: "0" },
    ],
    starterCode: "function numIslands(grid) {\n  // your code here\n}",
    solution:
      "function numIslands(grid) {\n  if (!grid.length) return 0;\n  const rows = grid.length, cols = grid[0].length;\n  let count = 0;\n  const sink = (r, c) => {\n    if (r < 0 || c < 0 || r >= rows || c >= cols || grid[r][c] !== 1) return;\n    grid[r][c] = 0;\n    sink(r + 1, c); sink(r - 1, c); sink(r, c + 1); sink(r, c - 1);\n  };\n  for (let r = 0; r < rows; r++) {\n    for (let c = 0; c < cols; c++) {\n      if (grid[r][c] === 1) { count++; sink(r, c); }\n    }\n  }\n  return count;\n}",
    testCases: [
      { input: [[[1, 1, 0], [0, 1, 0], [0, 0, 1]]], expected: 2 },
      { input: [[[0, 0], [0, 0]]], expected: 0 },
      { input: [[[1]]], expected: 1, hidden: true },
      { input: [[[1, 1, 1], [0, 1, 0], [1, 1, 1]]], expected: 1, hidden: true },
    ],
    hints: [
      "Scan every cell. When you find an unvisited `1`, that is a new island.",
      "Flood-fill (DFS or BFS) from it, sinking all connected land to `0` so it is not counted again.",
    ],
    pitfalls: ["Forgetting to mark visited cells turns one island into an infinite loop or an over-count."],
    explanation:
      "Each time the scan meets land that has not been flooded, it is the start of a fresh island; a DFS then sinks the whole connected component. Every cell is visited a constant number of times, so it runs in O(rows × cols).",
    resources: [R.graph],
  },

  // ===================== HARD (8) =====================
  {
    id: "ds-twopointers-007", track: "data-structures", topic: "Arrays & Two-Pointers", difficulty: "hard",
    title: "Trapping Rain Water", kind: "function", functionName: "trap",
    prompt:
      "Given `height`, an array of non-negative bar heights each 1 unit wide, implement `trap(height)` returning how many units of water are trapped after raining.",
    examples: [
      { input: "[0,1,0,2,1,0,1,3,2,1,2,1]", output: "6" },
      { input: "[4,2,0,3,2,5]", output: "9" },
    ],
    starterCode: "function trap(height) {\n  // your code here\n}",
    solution:
      "function trap(height) {\n  let l = 0, r = height.length - 1, lMax = 0, rMax = 0, water = 0;\n  while (l < r) {\n    if (height[l] < height[r]) {\n      lMax = Math.max(lMax, height[l]);\n      water += lMax - height[l];\n      l++;\n    } else {\n      rMax = Math.max(rMax, height[r]);\n      water += rMax - height[r];\n      r--;\n    }\n  }\n  return water;\n}",
    testCases: [
      { input: [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]], expected: 6 },
      { input: [[4, 2, 0, 3, 2, 5]], expected: 9 },
      { input: [[1, 2, 3]], expected: 0, hidden: true },
      { input: [[5, 4, 1, 2]], expected: 1, hidden: true },
    ],
    hints: [
      "Water above a bar is bounded by the shorter of the tallest bar to its left and the tallest to its right.",
      "Two pointers moving inward, each tracking the max it has seen, let you settle each bar from the smaller side.",
    ],
    pitfalls: ["Recomputing left/right maxima inside a loop gives an O(n^2) solution that may time out on large inputs."],
    explanation:
      "Move two pointers inward from both ends. The side with the smaller current height is the limiting wall, so the water over that bar equals its running max minus its own height. This computes the answer in one O(n) pass with O(1) space.",
    resources: [R.arr],
  },
  {
    id: "ds-hashmaps-010", track: "data-structures", topic: "Hash Maps", difficulty: "hard",
    title: "Longest Consecutive Sequence", kind: "function", functionName: "longestConsecutive",
    prompt:
      "Implement `longestConsecutive(nums)` returning the length of the longest run of consecutive integers present in the array (order in the array does not matter). Aim for O(n) time.",
    examples: [
      { input: "[100, 4, 200, 1, 3, 2]", output: "4", explanation: "The run 1, 2, 3, 4 has length 4." },
      { input: "[0, 3, 7, 2, 5, 8, 4, 6, 0, 1]", output: "9", explanation: "0 through 8 is a run of 9." },
    ],
    starterCode: "function longestConsecutive(nums) {\n  // your code here\n}",
    solution:
      "function longestConsecutive(nums) {\n  const set = new Set(nums);\n  let best = 0;\n  for (const n of set) {\n    if (!set.has(n - 1)) {\n      let len = 1;\n      while (set.has(n + len)) len++;\n      best = Math.max(best, len);\n    }\n  }\n  return best;\n}",
    testCases: [
      { input: [[100, 4, 200, 1, 3, 2]], expected: 4 },
      { input: [[0, 3, 7, 2, 5, 8, 4, 6, 0, 1]], expected: 9 },
      { input: [[]], expected: 0, hidden: true },
      { input: [[1, 2, 0, 1]], expected: 3, hidden: true },
    ],
    hints: [
      "Put every number in a set for O(1) membership checks.",
      "Only start counting a run from a number whose predecessor (n − 1) is absent — that guarantees you count each run once.",
    ],
    pitfalls: ["Sorting first is O(n log n), not the required O(n).", "Counting upward from every element (not just run starts) is O(n^2)."],
    explanation:
      "A set gives constant-time lookups. Each run is counted exactly once because counting only begins at a value with no predecessor in the set, so the inner while loop visits every element at most once overall. O(n) time.",
    resources: [R.hash],
  },
  {
    id: "ds-searching-008", track: "data-structures", topic: "Searching", difficulty: "hard",
    title: "Median of Two Sorted Arrays", kind: "function", functionName: "findMedianSortedArrays",
    prompt:
      "Given two sorted arrays `a` and `b`, implement `findMedianSortedArrays(a, b)` returning the median of the combined set. Aim for O(log(min(m, n))).",
    examples: [
      { input: "a = [1, 3], b = [2]", output: "2", explanation: "Merged: [1, 2, 3], median 2." },
      { input: "a = [1, 2], b = [3, 4]", output: "2.5", explanation: "Merged: [1, 2, 3, 4], median (2+3)/2." },
    ],
    starterCode: "function findMedianSortedArrays(a, b) {\n  // your code here\n}",
    solution:
      "function findMedianSortedArrays(a, b) {\n  if (a.length > b.length) [a, b] = [b, a];\n  const m = a.length, n = b.length, half = (m + n + 1) >> 1;\n  let lo = 0, hi = m;\n  while (lo <= hi) {\n    const i = (lo + hi) >> 1;\n    const j = half - i;\n    const aLeft = i > 0 ? a[i - 1] : -Infinity;\n    const aRight = i < m ? a[i] : Infinity;\n    const bLeft = j > 0 ? b[j - 1] : -Infinity;\n    const bRight = j < n ? b[j] : Infinity;\n    if (aLeft <= bRight && bLeft <= aRight) {\n      if ((m + n) % 2 === 1) return Math.max(aLeft, bLeft);\n      return (Math.max(aLeft, bLeft) + Math.min(aRight, bRight)) / 2;\n    } else if (aLeft > bRight) {\n      hi = i - 1;\n    } else {\n      lo = i + 1;\n    }\n  }\n  return 0;\n}",
    testCases: [
      { input: [[1, 3], [2]], expected: 2 },
      { input: [[1, 2], [3, 4]], expected: 2.5 },
      { input: [[], [1]], expected: 1, hidden: true },
      { input: [[1, 2, 3, 4, 5], [6, 7, 8]], expected: 4.5, hidden: true },
    ],
    hints: [
      "Binary-search a partition of the smaller array; the partition of the larger array is then fixed so the left side holds exactly half the elements.",
      "A correct partition has every left element ≤ every right element: aLeft ≤ bRight and bLeft ≤ aRight.",
    ],
    pitfalls: ["Always binary-search the smaller array, or the partition index can go out of range.", "Use ±Infinity sentinels for empty partition sides to avoid special-casing the edges."],
    explanation:
      "Partition the two arrays so the combined left half has ⌈(m+n)/2⌉ elements. The partition is valid when the largest left element does not exceed the smallest right element on the opposite side. Binary searching the smaller array for that cut runs in O(log(min(m, n))).",
    resources: [R.search],
  },
  {
    id: "ds-dp-011", track: "data-structures", topic: "Dynamic Programming", difficulty: "hard",
    title: "Edit Distance", kind: "function", functionName: "editDistance",
    prompt:
      "Implement `editDistance(a, b)` returning the minimum number of single-character insertions, deletions, or substitutions needed to turn string `a` into string `b` (the Levenshtein distance).",
    examples: [
      { input: 'a = "horse", b = "ros"', output: "3", explanation: "horse → rorse → rose → ros." },
      { input: 'a = "intention", b = "execution"', output: "5" },
    ],
    starterCode: "function editDistance(a, b) {\n  // your code here\n}",
    solution:
      "function editDistance(a, b) {\n  const m = a.length, n = b.length;\n  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));\n  for (let i = 0; i <= m; i++) dp[i][0] = i;\n  for (let j = 0; j <= n; j++) dp[0][j] = j;\n  for (let i = 1; i <= m; i++) {\n    for (let j = 1; j <= n; j++) {\n      dp[i][j] = a[i - 1] === b[j - 1]\n        ? dp[i - 1][j - 1]\n        : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);\n    }\n  }\n  return dp[m][n];\n}",
    testCases: [
      { input: ["horse", "ros"], expected: 3 },
      { input: ["intention", "execution"], expected: 5 },
      { input: ["", "abc"], expected: 3, hidden: true },
      { input: ["abc", "abc"], expected: 0, hidden: true },
    ],
    hints: [
      "Let dp[i][j] be the edit distance between the first i chars of a and the first j chars of b.",
      "If the current characters match, dp[i][j] = dp[i-1][j-1]; otherwise add 1 to the best of substitute, delete, or insert.",
    ],
    pitfalls: ["Forgetting to seed the first row and column (transforming to/from the empty string) breaks the recurrence."],
    explanation:
      "Classic two-dimensional DP. The base row/column encode turning a prefix into the empty string. Each cell either inherits the diagonal on a match or adds one operation to the cheapest neighbour. O(m × n) time and space.",
    resources: [R.dp],
  },
  {
    id: "ds-stacks-007", track: "data-structures", topic: "Stacks", difficulty: "hard",
    title: "Largest Rectangle in Histogram", kind: "function", functionName: "largestRectangle",
    prompt:
      "Given `heights`, the bar heights of a histogram (each bar 1 unit wide), implement `largestRectangle(heights)` returning the area of the largest rectangle that fits entirely within the bars.",
    examples: [
      { input: "[2, 1, 5, 6, 2, 3]", output: "10", explanation: "Bars of heights 5 and 6 form a 5×2 = 10 rectangle." },
      { input: "[2, 4]", output: "4", explanation: "The single bar of height 4 (width 1) loses to the 2×2 rectangle." },
    ],
    starterCode: "function largestRectangle(heights) {\n  // your code here\n}",
    solution:
      "function largestRectangle(heights) {\n  const stack = [];\n  let max = 0;\n  const h = [...heights, 0];\n  for (let i = 0; i < h.length; i++) {\n    while (stack.length && h[stack[stack.length - 1]] > h[i]) {\n      const top = stack.pop();\n      const width = stack.length ? i - stack[stack.length - 1] - 1 : i;\n      max = Math.max(max, h[top] * width);\n    }\n    stack.push(i);\n  }\n  return max;\n}",
    testCases: [
      { input: [[2, 1, 5, 6, 2, 3]], expected: 10 },
      { input: [[2, 4]], expected: 4 },
      { input: [[1]], expected: 1, hidden: true },
      { input: [[6, 2, 5, 4, 5, 1, 6]], expected: 12, hidden: true },
    ],
    hints: [
      "Keep a stack of bar indices whose heights are increasing.",
      "When a shorter bar arrives, pop taller bars and compute the rectangle each can form, using the stack to find how far left it extends.",
    ],
    pitfalls: ["Forgetting the sentinel `0` appended at the end leaves bars on the stack uncounted.", "Computing the width from popped indices instead of the new stack top after popping."],
    explanation:
      "A monotonic increasing stack of indices lets each bar be the limiting height of a rectangle exactly when a shorter bar forces it off the stack. The width spans from the element now on top (exclusive) to the current index (exclusive). Appending a trailing 0 flushes the stack. O(n).",
    resources: [R.stack],
  },
  {
    id: "ds-heaps-006", track: "data-structures", topic: "Heaps", difficulty: "hard",
    title: "Merge K Sorted Arrays", kind: "function", functionName: "mergeKSorted",
    prompt:
      "Given `lists`, an array of individually sorted (ascending) integer arrays, implement `mergeKSorted(lists)` returning one sorted array containing all the elements. Use a min-heap for an O(N log k) merge.",
    examples: [
      { input: "[[1, 4, 5], [1, 3, 4], [2, 6]]", output: "[1, 1, 2, 3, 4, 4, 5, 6]" },
      { input: "[[], [1]]", output: "[1]" },
    ],
    starterCode: "function mergeKSorted(lists) {\n  // your code here\n}",
    solution:
      "function mergeKSorted(lists) {\n  const heap = []; // each entry: [value, listIndex, elemIndex]\n  const up = (i) => {\n    while (i > 0) {\n      const p = (i - 1) >> 1;\n      if (heap[p][0] <= heap[i][0]) break;\n      [heap[p], heap[i]] = [heap[i], heap[p]];\n      i = p;\n    }\n  };\n  const down = (i) => {\n    const n = heap.length;\n    while (true) {\n      let s = i; const l = 2 * i + 1, r = 2 * i + 2;\n      if (l < n && heap[l][0] < heap[s][0]) s = l;\n      if (r < n && heap[r][0] < heap[s][0]) s = r;\n      if (s === i) break;\n      [heap[s], heap[i]] = [heap[i], heap[s]];\n      i = s;\n    }\n  };\n  const push = (x) => { heap.push(x); up(heap.length - 1); };\n  const pop = () => {\n    const top = heap[0];\n    const last = heap.pop();\n    if (heap.length) { heap[0] = last; down(0); }\n    return top;\n  };\n  for (let i = 0; i < lists.length; i++) {\n    if (lists[i].length) push([lists[i][0], i, 0]);\n  }\n  const res = [];\n  while (heap.length) {\n    const [val, li, ei] = pop();\n    res.push(val);\n    if (ei + 1 < lists[li].length) push([lists[li][ei + 1], li, ei + 1]);\n  }\n  return res;\n}",
    testCases: [
      { input: [[[1, 4, 5], [1, 3, 4], [2, 6]]], expected: [1, 1, 2, 3, 4, 4, 5, 6] },
      { input: [[[], [1]]], expected: [1] },
      { input: [[[]]], expected: [], hidden: true },
      { input: [[[1, 2, 3], [1, 2, 3], [1, 2, 3]]], expected: [1, 1, 1, 2, 2, 2, 3, 3, 3], hidden: true },
    ],
    hints: [
      "Seed a min-heap with the first element of each non-empty list, tagged with which list it came from.",
      "Pop the smallest, append it, then push the next element from that same list.",
    ],
    pitfalls: ["Concatenating then sorting is O(N log N) and ignores that the inputs are already sorted.", "Pushing the next element from the wrong list breaks the merge — carry the list index with each heap entry."],
    explanation:
      "The heap always holds at most one candidate per list — the current frontier — so its smallest entry is the next element of the merged output. Each of the N elements is pushed and popped once, each operation O(log k). O(N log k) time.",
    resources: [R.heap],
  },
  {
    id: "ds-slidingwindow-007", track: "data-structures", topic: "Sliding Window", difficulty: "hard",
    title: "Sliding Window Maximum", kind: "function", functionName: "maxSlidingWindow",
    prompt:
      "Implement `maxSlidingWindow(nums, k)` that returns an array of the maximum value within each contiguous window of size `k` as the window slides left to right. Aim for O(n).",
    examples: [
      { input: "nums = [1, 3, -1, -3, 5, 3, 6, 7], k = 3", output: "[3, 3, 5, 5, 6, 7]" },
      { input: "nums = [9, 8, 7], k = 2", output: "[9, 8]" },
    ],
    starterCode: "function maxSlidingWindow(nums, k) {\n  // your code here\n}",
    solution:
      "function maxSlidingWindow(nums, k) {\n  const res = [], dq = []; // dq holds indices, values decreasing\n  for (let i = 0; i < nums.length; i++) {\n    while (dq.length && dq[0] <= i - k) dq.shift();\n    while (dq.length && nums[dq[dq.length - 1]] <= nums[i]) dq.pop();\n    dq.push(i);\n    if (i >= k - 1) res.push(nums[dq[0]]);\n  }\n  return res;\n}",
    testCases: [
      { input: [[1, 3, -1, -3, 5, 3, 6, 7], 3], expected: [3, 3, 5, 5, 6, 7] },
      { input: [[9, 8, 7], 2], expected: [9, 8] },
      { input: [[1], 1], expected: [1], hidden: true },
      { input: [[4, 4, 4, 4], 2], expected: [4, 4, 4], hidden: true },
    ],
    hints: [
      "Maintain a deque of indices whose values are strictly decreasing from front to back; the front is always the current window's max.",
      "Before reading the max, drop indices that have slid out of the window from the front.",
    ],
    pitfalls: ["Storing values instead of indices makes it impossible to know when an entry leaves the window.", "Only recording results once `i >= k - 1` — earlier the first window is incomplete."],
    explanation:
      "A monotonic deque keeps candidate maxima in decreasing order. Smaller trailing values are discarded because a later, larger value dominates them for the rest of their lifetime. Each index enters and leaves the deque once, so the whole pass is O(n).",
    resources: [R.arr],
  },
  {
    id: "ds-backtracking-007", track: "data-structures", topic: "Recursion & Backtracking", difficulty: "hard",
    title: "N-Queens (Count Solutions)", kind: "function", functionName: "totalNQueens",
    prompt:
      "Implement `totalNQueens(n)` returning the number of distinct ways to place `n` queens on an `n × n` board so that no two attack each other (no shared row, column, or diagonal).",
    examples: [
      { input: "n = 4", output: "2" },
      { input: "n = 1", output: "1" },
    ],
    starterCode: "function totalNQueens(n) {\n  // your code here\n}",
    solution:
      "function totalNQueens(n) {\n  let count = 0;\n  const cols = new Set(), diag1 = new Set(), diag2 = new Set();\n  const place = (row) => {\n    if (row === n) { count++; return; }\n    for (let c = 0; c < n; c++) {\n      if (cols.has(c) || diag1.has(row - c) || diag2.has(row + c)) continue;\n      cols.add(c); diag1.add(row - c); diag2.add(row + c);\n      place(row + 1);\n      cols.delete(c); diag1.delete(row - c); diag2.delete(row + c);\n    }\n  };\n  place(0);\n  return count;\n}",
    testCases: [
      { input: [4], expected: 2 },
      { input: [1], expected: 1 },
      { input: [2], expected: 0, hidden: true },
      { input: [8], expected: 92, hidden: true },
    ],
    hints: [
      "Place one queen per row, recursing row by row.",
      "Track used columns and both diagonal families with sets: cells on the same ↘ diagonal share (row − col), and same ↙ diagonal share (row + col).",
    ],
    pitfalls: ["Forgetting to undo the set additions after recursing (the backtracking step) corrupts later branches."],
    explanation:
      "Each row gets exactly one queen, so the search tries every safe column per row. Three sets give O(1) attack checks for columns and the two diagonal directions, and removing the marks on the way back out restores state for sibling branches. Counting completed placements yields the total.",
    resources: [R.queens],
  },
];
