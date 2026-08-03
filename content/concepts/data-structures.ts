import type { Concept } from "./types";

/**
 * Data Structures concepts. Each entry follows the same shape as the JavaScript
 * concepts: a definition, worked examples, real world use cases, the practice
 * problems it maps to, a bespoke animation, and the recall fields (pitfalls,
 * key takeaways, a self check, and related concepts).
 */
export const dataStructureConcepts: Concept[] = [
  {
    slug: "arrays-two-pointers",
    track: "data-structures",
    topic: "Arrays & Two-Pointers",
    title: "Arrays & Two-Pointers",
    oneLiner:
      "Two indexes sweep an array from either end, or at two different speeds, so a nested loop collapses into a single pass.",
    definition:
      "The two-pointer technique keeps a pair of indexes moving through an array instead of comparing every element to every other element. In the classic converging form, one pointer starts at the front and the other at the back, and each step compares the values they point to before moving whichever pointer needs to change: on a sorted array, that turns an O(n squared) search for a pair into an O(n) walk that only ever moves inward.\n\nA second form, fast and slow pointers, moves both indexes from the same end but at different speeds, one step at a time versus two. That variant is what finds the middle of a sequence or detects a cycle: if a fast pointer ever laps a slow one, there is a loop. Both forms use only two extra variables, so the space cost stays O(1) no matter how large the array is, which is the main reason two pointers beat a hash-map based approach when the input is already sorted or when memory is tight.",
    examples: [
      {
        code: "function twoSumSorted(nums, target) {\n  let left = 0, right = nums.length - 1;\n  while (left < right) {\n    const sum = nums[left] + nums[right];\n    if (sum === target) return [left, right];\n    if (sum < target) left++;\n    else right--;\n  }\n  return [-1, -1];\n}\ntwoSumSorted([1, 2, 5, 7, 9, 10], 9); // [1, 3]",
        explanation:
          "left and right converge from opposite ends. A sum that is too small moves left forward to try a bigger value, a sum that is too big moves right backward to try a smaller one, and the pair is found in a single pass over the sorted array.",
      },
      {
        code: "function reverseInPlace(arr) {\n  let left = 0, right = arr.length - 1;\n  while (left < right) {\n    [arr[left], arr[right]] = [arr[right], arr[left]];\n    left++;\n    right--;\n  }\n  return arr;\n}\nreverseInPlace([1, 2, 3, 4]); // [4, 3, 2, 1]",
        explanation:
          "Swapping the values at left and right and then stepping both pointers inward reverses the array without allocating a second array.",
      },
      {
        code: "function hasCycle(head) {\n  let slow = head, fast = head;\n  while (fast && fast.next) {\n    slow = slow.next;\n    fast = fast.next.next;\n    if (slow === fast) return true;\n  }\n  return false;\n}",
        explanation:
          "Fast moves two steps for every one step of slow. If the list loops back on itself, fast eventually catches up to slow instead of running off the end.",
      },
    ],
    realWorldUseCases: [
      "Finding a pair in a sorted array that sums to a target value without a nested loop.",
      "Reversing an array or checking whether it is a palindrome in place, with no extra array.",
      "Merging two already-sorted arrays by walking one pointer through each.",
      "Detecting a cycle or finding the middle node of a linked list with fast and slow pointers.",
    ],
    relatedProblemIds: ["ds-twopointers-003", "ds-twopointers-004", "ds-twopointers-005", "ds-twopointers-006"],
    visual: "arrays-two-pointers",
    furtherReading: [
      { label: "GeeksforGeeks: Two Pointers Technique", url: "https://www.geeksforgeeks.org/dsa/two-pointers-technique/" },
    ],
    pitfalls: [
      "Running the converging form on an unsorted array; the pointer-movement rule only works because the array is sorted.",
      "Using <= instead of < in the loop condition and reading one pointer past where the other already is.",
      "Moving both pointers on every iteration when only one side needs to move, which can skip over the correct answer.",
    ],
    keyTakeaways: [
      "Two pointers replace many nested loops, turning an O(n squared) scan into a single O(n) pass.",
      "The converging form needs a sorted array and moves whichever pointer is on the side that is too small or too big.",
      "The fast and slow form advances the two pointers at different speeds to find a middle element or detect a cycle.",
      "Both forms use O(1) extra space, unlike an approach that builds an auxiliary set or map.",
    ],
    check: {
      question:
        "In a sorted array, nums[left] + nums[right] comes out greater than the target. Which pointer should move, and why?",
      options: [
        "left++, because increasing the left value increases the sum",
        "right--, because moving to a smaller value on the right side brings the sum down",
        "Both pointers at once, to skip past the pair entirely",
        "Neither pointer; the search should restart from index 0",
      ],
      answerIndex: 1,
      explanation:
        "The sum is too high, and because the array is sorted, stepping right backward swaps in a smaller value, which is the only move that can bring the sum down toward the target.",
    },
    related: ["sorting-arrays", "hash-maps", "linked-lists"],
  },
  {
    slug: "hash-maps",
    track: "data-structures",
    topic: "Hash Maps",
    title: "Hash Maps",
    oneLiner:
      "A hash function turns a key into a bucket index, so storing and finding a value both take constant time on average.",
    definition:
      "A hash map stores key/value pairs by running each key through a hash function that produces a number, then using that number to pick a bucket, a slot in an underlying array, to store the entry. Because the bucket is computed directly from the key instead of found by scanning, both inserting and looking up a value take O(1) time on average, regardless of how many entries are already in the map.\n\nTwo different keys can hash to the same bucket, which is called a collision. Rather than failing, a hash map handles this by chaining: the bucket holds a small list of entries instead of just one, and a lookup that lands in that bucket scans the short chain to find the matching key. As long as the hash function spreads keys out reasonably evenly, chains stay short and the average O(1) behavior holds; a bad hash function or an adversarial set of keys can degrade this toward O(n) in the worst case. JavaScript's `Map` and, with caveats, plain objects are both concrete implementations of this idea.",
    examples: [
      {
        code: "const ages = new Map();\nages.set(\"cat\", 4);\nages.set(\"dog\", 7);\nages.get(\"dog\"); // 7\nages.has(\"fox\"); // false",
        explanation:
          "set hashes the key to pick a bucket and stores the value there; get hashes the same key to jump straight to that bucket instead of scanning every entry.",
      },
      {
        code: "function countChars(str) {\n  const counts = new Map();\n  for (const ch of str) {\n    counts.set(ch, (counts.get(ch) || 0) + 1);\n  }\n  return counts;\n}\ncountChars(\"banana\"); // Map(3) { 'b' => 1, 'a' => 3, 'n' => 2 }",
        explanation:
          "Each character is a key whose bucket is checked and updated in one step, so the whole string is counted in a single O(n) pass.",
      },
      {
        code: "function twoSum(nums, target) {\n  const seen = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const need = target - nums[i];\n    if (seen.has(need)) return [seen.get(need), i];\n    seen.set(nums[i], i);\n  }\n  return [-1, -1];\n}\ntwoSum([2, 7, 11, 15], 9); // [0, 1]",
        explanation:
          "Instead of requiring a sorted array like the two-pointer version, this checks for the needed complement in the map's bucket directly, working on any order of input.",
      },
    ],
    realWorldUseCases: [
      "Deduplicating a list by tracking which values have already been seen.",
      "Caching (memoizing) expensive function results keyed by their arguments.",
      "Counting frequencies of words, characters, or events in a single pass.",
      "Building an index that looks up a record by id without scanning every record.",
    ],
    relatedProblemIds: ["ds-hashmaps-004", "ds-hashmaps-005", "ds-hashmaps-006", "ds-hashmaps-008"],
    visual: "hash-maps",
    furtherReading: [
      {
        label: "MDN: Map",
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map",
      },
    ],
    pitfalls: [
      "Assuming O(1) lookup is guaranteed in the worst case; a poor hash function or heavy collisions can degrade it toward O(n).",
      "Using a plain object as a hash map and forgetting that most keys are coerced to strings, which can silently merge distinct numeric and string keys.",
      "Iterating a plain object with for...in and picking up inherited properties, instead of using Map, which only iterates its own entries.",
    ],
    keyTakeaways: [
      "A hash function converts a key into a bucket index, giving average O(1) insert, lookup, and delete.",
      "Collisions, two keys hashing to the same bucket, are normal and are handled by chaining multiple entries in one bucket.",
      "Map preserves insertion order and accepts any value as a key, while plain objects coerce most keys to strings.",
    ],
    check: {
      question: "Two different keys hash to the same bucket index. What does a hash map do?",
      options: [
        "Overwrites the first entry with the second one",
        "Throws an error, since only one key can live in a bucket",
        "Stores both entries in that bucket, for example by chaining them together",
        "Immediately resizes the whole table to avoid the collision",
      ],
      answerIndex: 2,
      explanation:
        "Collisions are expected and handled by keeping a short chain of entries in the same bucket, so both keys stay retrievable at the cost of scanning that small chain.",
    },
    related: ["maps-and-sets", "arrays-two-pointers", "iterators-generators"],
  },
  {
    slug: "stacks",
    track: "data-structures",
    topic: "Stacks",
    title: "Stacks",
    oneLiner: "A stack only lets you touch the most recently added item: last in, first out.",
    definition:
      "A stack is a collection with a single point of entry and exit, the top. Adding an item is called push, and it always places the new item on top; removing an item is called pop, and it always removes whatever is currently on top. Because both operations only ever touch the top, they run in O(1) time regardless of how many items are underneath, and the order items come back out is the reverse of the order they went in: last in, first out (LIFO).\n\nThis last-in-first-out order is exactly what JavaScript's own call stack uses to track which function is running: calling a function pushes a new frame, and returning from it pops that frame back off, resuming whichever frame is now on top. The same shape shows up anywhere \"undo the most recent thing\" or \"finish the innermost thing first\" is the natural rule, which is why stacks are also the standard tool for matching nested brackets and for backtracking algorithms.",
    examples: [
      {
        code: "const stack = [];\nstack.push(10);\nstack.push(20);\nstack.push(30);\nstack.pop(); // 30\nstack[stack.length - 1]; // 20 (peek)",
        explanation:
          "push adds to the top of the array, pop removes and returns the top, and the last value pushed (30) is the first one to come back off.",
      },
      {
        code: "function isBalanced(str) {\n  const stack = [];\n  const pairs = { \")\": \"(\", \"]\": \"[\", \"}\": \"{\" };\n  for (const ch of str) {\n    if (\"([{\".includes(ch)) stack.push(ch);\n    else if (ch in pairs) {\n      if (stack.pop() !== pairs[ch]) return false;\n    }\n  }\n  return stack.length === 0;\n}\nisBalanced(\"([{}])\"); // true\nisBalanced(\"([)]\"); // false",
        explanation:
          "Every opening bracket is pushed, and every closing bracket must match whatever is currently on top; if it does not, or if brackets are left over at the end, the string is not balanced.",
      },
      {
        code: "class UndoStack {\n  #actions = [];\n  do(action) { this.#actions.push(action); }\n  undo() { return this.#actions.pop(); }\n}\nconst history = new UndoStack();\nhistory.do(\"bold\");\nhistory.do(\"italic\");\nhistory.undo(); // \"italic\"",
        explanation:
          "The most recently applied action is always the first one undone, which is exactly LIFO order.",
      },
    ],
    realWorldUseCases: [
      "The JavaScript call stack itself, tracking which function is currently running.",
      "Undo and redo history in a text or design editor.",
      "Matching brackets, tags, or parentheses when parsing code or markup.",
      "Backtracking algorithms like maze solving or depth-first search, using an explicit stack instead of recursion.",
    ],
    relatedProblemIds: ["ds-stacks-003", "ds-stacks-004", "ds-stacks-005"],
    visual: "stacks",
    furtherReading: [
      { label: "Wikipedia: Stack (abstract data type)", url: "https://en.wikipedia.org/wiki/Stack_(abstract_data_type)" },
    ],
    pitfalls: [
      "Calling pop() on an empty stack and getting undefined back instead of an error, letting the bug propagate silently.",
      "Confusing a stack's last-in-first-out order with a queue's first-in-first-out order when picking a structure for a problem.",
      "Using shift/unshift on an array to implement a stack; those are O(n) operations, unlike the O(1) push/pop at the end.",
    ],
    keyTakeaways: [
      "Stacks only expose the top element: push adds, pop removes, and both run in O(1).",
      "LIFO ordering fits nested or reversible operations, like undo history and bracket matching, naturally.",
      "Pushing and popping at the end of a JavaScript array is the efficient way to implement a stack.",
    ],
    check: {
      question: "You push 1, then 2, then 3 onto a stack. What do two consecutive pop() calls return, in order?",
      options: ["1, then 2", "3, then 2", "3, then 1", "2, then 3"],
      answerIndex: 1,
      explanation:
        "A stack is last in, first out, so the most recently pushed value, 3, comes off first, followed by the next most recent, 2.",
    },
    related: ["execution-context-call-stack", "queues", "linked-lists"],
  },
  {
    slug: "queues",
    track: "data-structures",
    topic: "Queues",
    title: "Queues",
    oneLiner: "A queue only lets you add at the back and remove from the front: first in, first out.",
    definition:
      "A queue is a collection with two distinct ends. Adding an item, enqueue, always happens at the back, and removing an item, dequeue, always happens at the front. That keeps the order items come out matching the order they went in: first in, first out (FIFO), the opposite of a stack's last-in-first-out order.\n\nQueues show up wherever things need to be handled in arrival order. Breadth-first search visits nodes level by level by keeping a queue of nodes still to visit. The event loop's macrotask (callback) queue runs scheduled callbacks in the order they became ready. A naive array-backed queue can dequeue with shift, but that is an O(n) operation because every remaining element has to move down one slot; a queue meant for heavy use is usually backed by a linked list or by tracking a separate front index so dequeue stays O(1).",
    examples: [
      {
        code: "const queue = [];\nqueue.push(1); // enqueue\nqueue.push(2);\nqueue.push(3);\nqueue.shift(); // 1 (dequeue)\nqueue; // [2, 3]",
        explanation:
          "push adds to the back and shift removes from the front, so the first value enqueued, 1, is the first one dequeued.",
      },
      {
        code: "function bfs(graph, start) {\n  const visited = new Set([start]);\n  const queue = [start];\n  const order = [];\n  while (queue.length) {\n    const node = queue.shift();\n    order.push(node);\n    for (const next of graph[node]) {\n      if (!visited.has(next)) {\n        visited.add(next);\n        queue.push(next);\n      }\n    }\n  }\n  return order;\n}\nbfs({ a: [\"b\", \"c\"], b: [\"d\"], c: [], d: [] }, \"a\"); // [\"a\", \"b\", \"c\", \"d\"]",
        explanation:
          "Each node's neighbors are enqueued at the back, so the traversal visits every node one level away before moving on to the next level.",
      },
      {
        code: "class Queue {\n  #items = [];\n  #front = 0;\n  enqueue(v) { this.#items.push(v); }\n  dequeue() {\n    if (this.#front >= this.#items.length) return undefined;\n    return this.#items[this.#front++];\n  }\n}\nconst q = new Queue();\nq.enqueue(\"a\");\nq.enqueue(\"b\");\nq.dequeue(); // \"a\"",
        explanation:
          "Tracking a front index instead of calling shift avoids re-numbering every remaining element, keeping dequeue O(1).",
      },
    ],
    realWorldUseCases: [
      "Breadth-first search, visiting nodes level by level.",
      "Task or job scheduling, processing requests in the order they arrived.",
      "The event loop's macrotask queue, running callbacks in the order they became ready.",
      "Rate limiting or buffering, holding incoming items until they can be processed.",
    ],
    relatedProblemIds: ["ds-queues-001", "ds-queues-002", "ds-queues-003"],
    visual: "queues",
    furtherReading: [
      { label: "Wikipedia: Queue (abstract data type)", url: "https://en.wikipedia.org/wiki/Queue_(abstract_data_type)" },
    ],
    pitfalls: [
      "Using Array.prototype.shift() to dequeue from a large array in a hot loop; shift is O(n) because every remaining element moves down.",
      "Mixing up which end is which; enqueue always adds at the back, dequeue always removes from the front.",
      "Forgetting to check for an empty queue before dequeuing and getting undefined instead of handling the empty case explicitly.",
    ],
    keyTakeaways: [
      "FIFO ordering means the first item added is the first one removed.",
      "Enqueue happens at the back, dequeue happens at the front, and the two ends stay conceptually separate.",
      "An array-backed queue works, but a front-index or linked-list backed queue avoids the O(n) cost of shifting elements.",
    ],
    check: {
      question: "You enqueue 1, then 2, then 3. What does the first dequeue() call return?",
      options: ["3", "1", "2", "undefined"],
      answerIndex: 1,
      explanation:
        "A queue is first in, first out, so the first value enqueued, 1, is also the first one to leave, from the front.",
    },
    related: ["stacks", "the-event-loop", "linked-lists"],
  },
  {
    slug: "linked-lists",
    track: "data-structures",
    topic: "Linked Lists",
    title: "Linked Lists",
    oneLiner:
      "Each node holds a value and a pointer to the next node, so the list can grow or rearrange without shifting anything else.",
    definition:
      "A linked list is a sequence of nodes, where each node bundles a value together with a reference to the next node in the chain. The list itself is just a reference to the first node, the head; there is no single block of memory holding every element the way an array has, so nodes can live anywhere and the chain of `next` references is what actually defines the order.\n\nThat structure changes the cost trade-offs compared to an array. Reaching the nth node means walking `next` pointers one at a time from the head, an O(n) walk, so linked lists give up the O(1) index access arrays have. In exchange, once you are already at a node, inserting or removing right there is O(1): it only means re-pointing a couple of `next` references, with nothing else in the list shifting. Some linked lists are doubly linked, giving each node a `previous` reference too, which makes walking backward or removing a node possible without needing a reference to the one before it.",
    examples: [
      {
        code: "function makeList(values) {\n  let head = null;\n  for (let i = values.length - 1; i >= 0; i--) {\n    head = { value: values[i], next: head };\n  }\n  return head;\n}\nlet node = makeList([1, 2, 3]);\nwhile (node) {\n  console.log(node.value); // 1, then 2, then 3\n  node = node.next;\n}",
        explanation:
          "Each node only knows its own value and the node after it, so reading the whole list means following next references one at a time from the head.",
      },
      {
        code: "function insertAfter(node, value) {\n  node.next = { value, next: node.next };\n}\nconst a = { value: 1, next: { value: 2, next: null } };\ninsertAfter(a, 99); // a -> 99 -> 2",
        explanation:
          "Inserting only re-points a's next reference to the new node, and the new node's next takes over the reference a used to hold; nothing else in the list moves.",
      },
      {
        code: "function hasCycle(head) {\n  let slow = head, fast = head;\n  while (fast && fast.next) {\n    slow = slow.next;\n    fast = fast.next.next;\n    if (slow === fast) return true;\n  }\n  return false;\n}",
        explanation:
          "A slow pointer moving one node at a time and a fast pointer moving two at a time will meet only if the list loops back on itself.",
      },
    ],
    realWorldUseCases: [
      "Implementing undo history, playlists, or browser tab lists that are frequently reordered or spliced in the middle.",
      "Building other data structures on top, such as a stack, queue, or a hash map's collision chains.",
      "Representing a music playlist or browser back/forward history, where sequence matters more than random access.",
      "Detecting cycles or finding the middle element of a sequence using fast and slow pointers.",
    ],
    relatedProblemIds: ["ds-linkedlists-004", "ds-linkedlists-005", "ds-linkedlists-006"],
    visual: "linked-lists",
    furtherReading: [{ label: "Wikipedia: Linked list", url: "https://en.wikipedia.org/wiki/Linked_list" }],
    pitfalls: [
      "Overwriting a node's next reference before saving what it used to point to, losing the rest of the list.",
      "Forgetting to update the head (or tail) reference after inserting or removing the first (or last) node.",
      "Assuming index access is O(1) like an array; reaching the nth node means walking next references one at a time, which is O(n).",
    ],
    keyTakeaways: [
      "A node bundles a value with a reference to the next node, and the chain of references is the list.",
      "Inserting or removing a node only touches the pointers immediately around it, not the rest of the list.",
      "Linked lists trade an array's O(1) random access for O(1) insertion and removal at a known position.",
    ],
    check: {
      question: "Node A currently points to node B. To insert a new node X between them, what has to happen?",
      options: [
        "X.next is set to B first, then A.next is set to X",
        "A.next is set to X first, without ever setting X.next",
        "B.next is set to X",
        "Nothing; the list automatically makes space between A and B",
      ],
      answerIndex: 0,
      explanation:
        "X must point to B before A stops pointing to B, otherwise the reference to B, and everything after it, would be lost; so X.next = B has to happen before A.next = X.",
    },
    related: ["primitives-vs-references", "arrays-two-pointers", "stacks"],
  },
];
