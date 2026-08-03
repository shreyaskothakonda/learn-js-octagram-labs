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
  {
    slug: "trees",
    track: "data-structures",
    topic: "Trees",
    title: "Trees",
    oneLiner:
      "A tree branches from a single root into parent and child nodes, so data naturally nests instead of sitting in a flat line.",
    definition:
      "A tree is made of nodes connected by edges, starting from a single root node at the top. Every node except the root has exactly one parent, and a node can have any number of children (in a binary tree, at most two, usually called left and right). A node with no children is a leaf. The depth of a node is how many edges separate it from the root, and the height of the tree is the depth of its deepest leaf, so a tree with just a root has height 0 and a tree branching three levels deep has height 2.\n\nBecause each child is itself the root of its own smaller tree, trees are naturally processed with recursion: a function that handles one node and then calls itself on that node's children walks the whole structure without any special-casing for how deep it goes. Visiting every node in a tree is called a traversal, and there are two families of traversal. Depth-first traversals (pre-order, in-order, post-order) follow one branch all the way down before backtracking, usually implemented with recursion or an explicit stack. Breadth-first traversal (level-order) visits every node at the current depth before moving to the next depth, which needs a queue instead of a stack. The traversal you pick changes the order values come out in, even though every traversal visits the same set of nodes exactly once.",
    examples: [
      {
        code: "function treeSum(node) {\n  if (!node) return 0;\n  return node.value + treeSum(node.left) + treeSum(node.right);\n}\nconst tree = { value: 1, left: { value: 2, left: null, right: null }, right: { value: 3, left: null, right: null } };\ntreeSum(tree); // 6",
        explanation:
          "Each call handles one node's own value and then recurses on its left and right children, so the whole tree is summed without tracking depth explicitly.",
      },
      {
        code: "function preOrder(node, out = []) {\n  if (!node) return out;\n  out.push(node.value);\n  preOrder(node.left, out);\n  preOrder(node.right, out);\n  return out;\n}\npreOrder(tree); // [1, 2, 3] for the tree above",
        explanation:
          "The node's own value is recorded before either child is visited, which is what makes this a pre-order (root, then left, then right) traversal.",
      },
      {
        code: "function levelOrder(root) {\n  const queue = [root];\n  const order = [];\n  while (queue.length) {\n    const node = queue.shift();\n    if (!node) continue;\n    order.push(node.value);\n    queue.push(node.left, node.right);\n  }\n  return order;\n}",
        explanation:
          "A queue instead of recursion makes the traversal breadth-first: every node at the current depth is dequeued and its children enqueued before any node at the next depth is visited.",
      },
    ],
    realWorldUseCases: [
      "The DOM is a tree of nested HTML elements, and rendering walks it from the root down.",
      "File systems nest folders inside folders, each folder a node with files and subfolders as children.",
      "JSON and other nested data, and the abstract syntax trees parsers build from source code.",
      "Org charts and category hierarchies, where each item has exactly one parent above it.",
    ],
    relatedProblemIds: ["ds-trees-001", "ds-trees-002", "ds-trees-003", "ds-trees-004"],
    visual: "trees",
    furtherReading: [
      { label: "Wikipedia: Tree (data structure)", url: "https://en.wikipedia.org/wiki/Tree_(data_structure)" },
    ],
    pitfalls: [
      "Forgetting the base case (a null child) in a recursive traversal, causing infinite recursion or a crash.",
      "Assuming every traversal returns values in the same order; pre-order, in-order, post-order, and level-order all produce different sequences from the same tree.",
      "Mixing up depth (distance from the root) and height (distance to the deepest leaf); they are measured from opposite ends.",
    ],
    keyTakeaways: [
      "A tree branches from one root into parent and child nodes, with leaves as the nodes that have no children.",
      "Depth-first traversals use recursion or a stack; breadth-first traversal uses a queue and visits level by level.",
      "Because every subtree is itself a tree, recursive functions are the natural way to process one.",
    ],
    check: {
      question:
        "A binary tree's traversal visits the root, then its left subtree, then its right subtree. What is that traversal called?",
      options: ["In-order", "Pre-order", "Post-order", "Level-order"],
      answerIndex: 1,
      explanation:
        "Visiting the root before either subtree, root first then left then right, is exactly the definition of pre-order.",
    },
    related: ["binary-search-trees", "linked-lists", "graph-traversal"],
  },
  {
    slug: "binary-search-trees",
    track: "data-structures",
    topic: "BST",
    title: "Binary Search Trees",
    oneLiner:
      "Every node keeps smaller values to its left and larger values to its right, so a search can throw away half the tree at every step.",
    definition:
      "A binary search tree is a binary tree with one extra rule: for every node, every value in its left subtree is smaller than the node's own value, and every value in its right subtree is larger. That single ordering rule is what makes the tree searchable. To look for a value, start at the root and compare: if the target is smaller, the whole right subtree can be ignored and the search moves left; if it is larger, the whole left subtree can be ignored and the search moves right; if it matches, the search is done. Each comparison throws away one whole half of what is left to check, the same idea as binary search on a sorted array, except the tree shape lets values also stay in the middle of a growing structure instead of a fixed array.\n\nThe cost of a search, insert, or delete is proportional to the tree's height, not the number of nodes in it. A balanced tree keeps its height close to log2(n), so those operations run in O(log n). But nothing about a plain binary search tree forces it to stay balanced: inserting values that already come in sorted order builds a tree that leans entirely to one side, node after node with only a right child, which degenerates into a straight line and turns every operation into an O(n) walk, the same cost as searching an unsorted list. Self-balancing variants like AVL trees and red-black trees exist specifically to guarantee the O(log n) case regardless of insertion order.",
    examples: [
      {
        code: "function bstSearch(node, target) {\n  if (!node) return null;\n  if (target === node.value) return node;\n  return target < node.value ? bstSearch(node.left, target) : bstSearch(node.right, target);\n}",
        explanation:
          "Comparing target against the current node rules out an entire subtree with each call, so the search only ever walks one path from the root to the target's position.",
      },
      {
        code: "function bstInsert(node, value) {\n  if (!node) return { value, left: null, right: null };\n  if (value < node.value) node.left = bstInsert(node.left, value);\n  else node.right = bstInsert(node.right, value);\n  return node;\n}",
        explanation:
          "The same left-smaller, right-larger comparison used for searching decides which side the new value belongs on, all the way down until it finds an empty spot.",
      },
      {
        code: "function inOrder(node, out = []) {\n  if (!node) return out;\n  inOrder(node.left, out);\n  out.push(node.value);\n  inOrder(node.right, out);\n  return out;\n}\n// for a BST, inOrder always returns values in ascending sorted order",
        explanation:
          "Visiting left, then the node, then right always yields smaller values before larger ones, so an in-order traversal of a BST reads the values back out in sorted order for free.",
      },
    ],
    realWorldUseCases: [
      "Implementing an ordered set or map that supports fast lookup, insert, and range queries.",
      "Databases and file systems use balanced search trees (B-trees, a wide variant) to index records.",
      "Autocomplete and spell-check style range lookups, finding all values between two bounds.",
      "Any place that needs sorted order maintained incrementally, without re-sorting after every insert.",
    ],
    relatedProblemIds: ["ds-bst-001", "ds-bst-002", "ds-bst-003", "ds-bst-004"],
    visual: "binary-search-trees",
    furtherReading: [
      { label: "Wikipedia: Binary search tree", url: "https://en.wikipedia.org/wiki/Binary_search_tree" },
    ],
    pitfalls: [
      "Inserting already-sorted data into a plain BST and ending up with a degenerate, linked-list-shaped tree with O(n) operations.",
      "Comparing values with the wrong direction (going right instead of left for a smaller value), which searches or inserts into the wrong subtree.",
      "Assuming a BST is always balanced; balance is only guaranteed by self-balancing variants like AVL or red-black trees.",
    ],
    keyTakeaways: [
      "Left subtree smaller, right subtree larger: that single rule is what makes a BST searchable.",
      "Search, insert, and delete all run in O(height), which is O(log n) when the tree is balanced and O(n) when it degenerates into a line.",
      "An in-order traversal of a BST always produces values in sorted order.",
    ],
    check: {
      question: "Searching a BST for a value that turns out to be larger than the current node. Which way does the search go?",
      options: [
        "Left, to check smaller values",
        "Right, to check larger values",
        "It restarts from the root",
        "It checks both children",
      ],
      answerIndex: 1,
      explanation:
        "Because every value in the right subtree is larger than the current node, a target larger than the current node can only be in the right subtree.",
    },
    related: ["trees", "sorting-arrays", "hash-maps"],
  },
  {
    slug: "graph-traversal",
    track: "data-structures",
    topic: "Graphs",
    title: "Graph Traversal (BFS & DFS)",
    oneLiner:
      "A graph connects nodes with edges in any pattern, and BFS explores it level by level while DFS dives down one path at a time.",
    definition:
      "A graph is a set of nodes (often called vertices) connected by edges, and unlike a tree, a graph places no restriction on how those edges connect: a node can have any number of neighbors, edges can point both ways or just one way, and following edges can lead back to a node that was already visited, forming a cycle. A common way to represent a graph in code is an adjacency list, an object or map where each node's key holds an array of the neighbors it connects to directly.\n\nTraversing a graph means visiting every reachable node, and because cycles are allowed, every traversal needs a visited set to avoid processing the same node twice or looping forever. Breadth-first search (BFS) uses a queue: it visits the starting node, enqueues its neighbors, then repeatedly dequeues a node and enqueues whichever of its neighbors have not been seen yet, which visits every node one edge away before any node two edges away, the same level-by-level shape as a tree's level-order traversal. Depth-first search (DFS) uses a stack, whether an explicit one or the implicit call stack from recursion: it follows one path as far as it can before backtracking, which is well suited to questions like whether a path exists between two nodes at all, rather than the shortest one. Because BFS explores in order of distance, it is the standard way to find the shortest path in an unweighted graph.",
    examples: [
      {
        code: "function bfs(graph, start) {\n  const visited = new Set([start]);\n  const queue = [start];\n  const order = [];\n  while (queue.length) {\n    const node = queue.shift();\n    order.push(node);\n    for (const next of graph[node]) {\n      if (!visited.has(next)) {\n        visited.add(next);\n        queue.push(next);\n      }\n    }\n  }\n  return order;\n}\nconst graph = { A: [\"B\", \"C\"], B: [\"A\", \"D\"], C: [\"A\", \"D\"], D: [\"B\", \"C\", \"E\"], E: [\"D\"] };\nbfs(graph, \"A\"); // [\"A\", \"B\", \"C\", \"D\", \"E\"]",
        explanation:
          "Each node is enqueued the first time it is seen, so the queue drains in order of distance from A, visiting B and C (one edge away) before D (two edges away) and E (three edges away).",
      },
      {
        code: "function dfs(graph, node, visited = new Set(), order = []) {\n  visited.add(node);\n  order.push(node);\n  for (const next of graph[node]) {\n    if (!visited.has(next)) dfs(graph, next, visited, order);\n  }\n  return order;\n}\ndfs(graph, \"A\"); // [\"A\", \"B\", \"D\", \"C\", \"E\"]",
        explanation:
          "The recursive call dives into the first unvisited neighbor completely, using the call stack as the stack, before ever returning to try A's other neighbor, C, which is why the order differs from BFS.",
      },
      {
        code: "function dfsIterative(graph, start) {\n  const visited = new Set();\n  const stack = [start];\n  const order = [];\n  while (stack.length) {\n    const node = stack.pop();\n    if (visited.has(node)) continue;\n    visited.add(node);\n    order.push(node);\n    for (const next of graph[node]) stack.push(next);\n  }\n  return order;\n}",
        explanation:
          "Popping from the end of an array, instead of shifting from the front, is what turns this into a depth-first walk: the most recently discovered node is explored next.",
      },
    ],
    realWorldUseCases: [
      "Finding the shortest number of hops between two people in a social network (BFS).",
      "Web crawlers exploring links from a page, or dependency resolvers walking a package graph.",
      "Checking whether a maze or map has a path between two points at all (DFS).",
      "Detecting cycles in a graph, such as a circular dependency between modules.",
    ],
    relatedProblemIds: ["ds-graphs-001", "ds-graphs-002", "ds-graphs-003", "ds-graphs-004"],
    visual: "graph-traversal",
    furtherReading: [
      { label: "Wikipedia: Breadth-first search", url: "https://en.wikipedia.org/wiki/Breadth-first_search" },
    ],
    pitfalls: [
      "Forgetting the visited set and re-processing (or infinitely looping on) a node that a cycle leads back to.",
      "Marking a node visited when it dequeues instead of when it enqueues in BFS, which can enqueue the same node multiple times.",
      "Reaching for DFS when the shortest path is what actually matters; only BFS guarantees the fewest edges on an unweighted graph.",
    ],
    keyTakeaways: [
      "A graph allows any pattern of connections, including cycles, so traversals need a visited set that a tree traversal does not.",
      "BFS uses a queue and explores level by level, finding the shortest path in an unweighted graph.",
      "DFS uses a stack, explicit or via recursion, and dives down one path before backtracking.",
    ],
    check: {
      question: "You need the fewest number of edges between two nodes in an unweighted graph. Which traversal guarantees that?",
      options: [
        "DFS, because it explores deeply first",
        "BFS, because it visits nodes in order of distance from the start",
        "Either one, they always agree on shortest path",
        "Neither; shortest path needs a different algorithm entirely",
      ],
      answerIndex: 1,
      explanation:
        "BFS visits every node one edge away before any node two edges away, so the first time it reaches a node is guaranteed to be via the fewest possible edges.",
    },
    related: ["queues", "stacks", "trees"],
  },
  {
    slug: "heaps",
    track: "data-structures",
    topic: "Heaps",
    title: "Heaps",
    oneLiner:
      "A heap keeps the smallest (or largest) value at the root of a complete binary tree, so that one value is always O(1) to read.",
    definition:
      "A heap is a complete binary tree, meaning every level is filled left to right with no gaps, that also satisfies the heap property: in a min-heap, every parent is less than or equal to both of its children, and in a max-heap every parent is greater than or equal to both. That property only constrains parent-child pairs, not siblings or cousins, so a heap is not fully sorted, but it does guarantee that the smallest (or largest) value in the whole structure always sits at the root, where it can be read in O(1) time. Because a heap is complete, it can be stored compactly in a plain array instead of needing node objects with pointers: a node at index i has children at indexes 2i + 1 and 2i + 2, and a parent at index floor((i - 1) / 2).\n\nAdding a value means placing it in the next open array slot, the next position that keeps the tree complete, and then bubbling it up: repeatedly comparing it with its parent and swapping while it is smaller (in a min-heap) than that parent, until it either reaches the root or finds a parent it does not need to swap with. Removing the root, extract-min, means taking the root's value out, moving the very last element in the array into the root position to keep the tree complete, and then sifting it down: repeatedly swapping it with whichever of its children is smaller, until it is smaller than both children or has none. Both operations only ever travel along one path from root to leaf, so each costs O(log n), the height of a complete tree with n nodes; a priority queue, where the highest-priority item needs to come out first, is usually built directly on top of a heap for exactly this reason.",
    examples: [
      {
        code: "class MinHeap {\n  #a = [];\n  insert(v) {\n    this.#a.push(v);\n    let i = this.#a.length - 1;\n    while (i > 0) {\n      const parent = Math.floor((i - 1) / 2);\n      if (this.#a[parent] <= this.#a[i]) break;\n      [this.#a[parent], this.#a[i]] = [this.#a[i], this.#a[parent]];\n      i = parent;\n    }\n  }\n}\nconst h = new MinHeap();\n[5, 3, 8, 1].forEach(v => h.insert(v));",
        explanation:
          "Each new value is pushed to the end of the array, then swapped upward with its parent as long as it is smaller, which is bubbling up in array form.",
      },
      {
        code: "class MinHeap {\n  #a = [];\n  extractMin() {\n    const min = this.#a[0];\n    const last = this.#a.pop();\n    if (this.#a.length) {\n      this.#a[0] = last;\n      let i = 0;\n      while (true) {\n        const l = 2 * i + 1, r = 2 * i + 2;\n        let smallest = i;\n        if (l < this.#a.length && this.#a[l] < this.#a[smallest]) smallest = l;\n        if (r < this.#a.length && this.#a[r] < this.#a[smallest]) smallest = r;\n        if (smallest === i) break;\n        [this.#a[i], this.#a[smallest]] = [this.#a[smallest], this.#a[i]];\n        i = smallest;\n      }\n    }\n    return min;\n  }\n}",
        explanation:
          "The last element takes the root's place to keep the tree complete, then repeatedly swaps down with its smaller child until both children are at least as large, restoring the heap property.",
      },
      {
        code: "// pushing tasks with a priority number, always popping the lowest one next\nconst tasks = new MinHeap();\ntasks.insert(3); // priority 3\ntasks.insert(1); // priority 1, most urgent\ntasks.insert(2);\ntasks.extractMin(); // 1",
        explanation:
          "A priority queue only needs the next-most-urgent item quickly, which is exactly the one operation, extractMin, that a heap gives for free at the root.",
      },
    ],
    realWorldUseCases: [
      "Priority queues for task schedulers, where the most urgent job should always run next.",
      "Dijkstra's shortest path and Prim's minimum spanning tree algorithms, both built on a min-heap.",
      "Finding the k largest or k smallest values in a stream of data without sorting everything.",
      "Heap sort, which repeatedly extracts the minimum (or maximum) to build a sorted array.",
    ],
    relatedProblemIds: ["ds-heaps-001", "ds-heaps-002", "ds-heaps-003", "ds-heaps-004"],
    visual: "heaps",
    furtherReading: [{ label: "Wikipedia: Binary heap", url: "https://en.wikipedia.org/wiki/Binary_heap" }],
    pitfalls: [
      "Assuming a heap is fully sorted; the heap property only orders each parent against its own children, not across the whole array.",
      "Forgetting to move the last element to the root before sifting down during extract, which breaks the complete-tree shape.",
      "Using the wrong comparison direction and building a max-heap when a min-heap (or vice versa) was needed.",
    ],
    keyTakeaways: [
      "A heap keeps the smallest (min-heap) or largest (max-heap) value at the root, readable in O(1).",
      "Insert bubbles a new value up; extract-min moves the last element to the root and sifts it down; both are O(log n).",
      "Because a heap is complete, it stores efficiently in a plain array using index math instead of node pointers.",
    ],
    check: {
      question: "In a min-heap, where is the largest value guaranteed to be?",
      options: [
        "Always at the root",
        "At one of the leaves, though not any particular one",
        "Always in the left subtree",
        "Nowhere in particular, it could be an internal node",
      ],
      answerIndex: 1,
      explanation:
        "If the maximum value sat at an internal node, the heap property would require its children to be at least as large, which is impossible since it is already the largest value, so the maximum must always end up at some leaf.",
    },
    related: ["queues", "trees", "sorting-arrays"],
  },
  {
    slug: "tries",
    track: "data-structures",
    topic: "Tries",
    title: "Tries",
    oneLiner: "A trie stores strings one character per edge, so words that share a prefix share the same path through the tree.",
    definition:
      "A trie, short for retrieval tree and usually pronounced like 'try', stores a set of strings by turning each one into a path from the root, one character per edge. The root represents the empty string, and following an edge labeled with a character moves to the node representing the string built so far plus that character. Because the path is shared, any two words that start with the same letters share that same prefix path through the tree and only branch apart at the first character where they differ; each node also needs some marker, often a boolean flag, saying whether the string ending at that node is actually a complete word that was inserted, rather than just a prefix of a longer one.\n\nBoth inserting and searching a trie cost O(L), where L is the length of the string being processed, and that cost does not grow with however many other words are already stored, unlike scanning a list of strings one at a time. This is what makes tries well suited to prefix-based queries: checking whether any stored word starts with a given prefix, or listing every word that does, only means walking down to the node for that prefix and, for listing, exploring everything below it. The trade-off is memory: a trie can use noticeably more space than a plain hash set of the same strings, because every distinct prefix, not just every complete word, gets its own node.",
    examples: [
      {
        code: "class TrieNode {\n  children = {};\n  isWord = false;\n}\nclass Trie {\n  root = new TrieNode();\n  insert(word) {\n    let node = this.root;\n    for (const ch of word) {\n      node.children[ch] ??= new TrieNode();\n      node = node.children[ch];\n    }\n    node.isWord = true;\n  }\n}\nconst trie = new Trie();\ntrie.insert(\"cat\");\ntrie.insert(\"car\");",
        explanation:
          "Inserting car walks the same c and a nodes that cat already created, only branching off into a new node at r, so the shared prefix ca is stored once.",
      },
      {
        code: "search(word) {\n  let node = this.root;\n  for (const ch of word) {\n    if (!node.children[ch]) return false;\n    node = node.children[ch];\n  }\n  return node.isWord;\n}",
        explanation:
          "The walk fails early the moment a needed character edge is missing, and even reaching the end successfully only counts as a match if isWord is actually set on that final node.",
      },
      {
        code: "startsWith(prefix) {\n  let node = this.root;\n  for (const ch of prefix) {\n    if (!node.children[ch]) return false;\n    node = node.children[ch];\n  }\n  return true;\n}\ntrie.startsWith(\"ca\"); // true\ntrie.startsWith(\"cot\"); // false",
        explanation:
          "Unlike search, startsWith does not check isWord at the end, since a prefix only needs to exist along some path, not be a complete word itself.",
      },
    ],
    realWorldUseCases: [
      "Autocomplete and search-as-you-type suggestions in a search bar.",
      "Spell checkers, finding whether a word or a close variant is in a dictionary.",
      "IP routing tables, matching the longest known prefix of an address.",
      "Storing a dictionary compactly when many words share long prefixes.",
    ],
    relatedProblemIds: ["ds-tries-001", "ds-tries-002", "ds-tries-003", "ds-tries-004"],
    visual: "tries",
    furtherReading: [{ label: "Wikipedia: Trie", url: "https://en.wikipedia.org/wiki/Trie" }],
    pitfalls: [
      "Forgetting to mark isWord (or equivalent) at the end of insert, which makes every inserted string look like just a prefix, never a complete match.",
      "Confusing search (must land on a complete word) with startsWith (only needs the path to exist), and using one where the other is needed.",
      "Assuming a trie always saves memory; many short, unrelated strings with little shared prefix can use more space than a plain hash set.",
    ],
    keyTakeaways: [
      "Each edge in a trie is one character, and words that share a prefix share that same path from the root.",
      "Insert and search both cost O(L), the length of the string, regardless of how many other words are stored.",
      "A node needs an explicit end-of-word marker, since reaching a node by walking a prefix does not by itself mean a full word ends there.",
    ],
    check: {
      question: "The words 'cat' and 'car' are both inserted into an empty trie. What do their paths from the root look like?",
      options: [
        "Two completely separate paths that never touch",
        "The same path through nodes for c and a, branching into separate nodes only at t versus r",
        "One path that overwrites the other, since only one word can be stored per node",
        "A single shared node containing both full words as its value",
      ],
      answerIndex: 1,
      explanation:
        "Both words start with the same two characters, so inserting car reuses the existing c and a nodes cat already created and only adds a new node where the words differ, at r.",
    },
    related: ["hash-maps", "trees", "regular-expressions"],
  },
];
