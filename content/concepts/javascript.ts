import type { Concept } from "./types";

export const javascriptConcepts: Concept[] = [
  {
    slug: "closures",
    track: "javascript",
    topic: "A Closer Look at Functions",
    title: "Closures",
    oneLiner: "A function keeps access to the variables it was born in, even after that scope returns.",
    definition:
      "A closure is a function together with references to the variables from the scope where it was created. When a function is returned from or passed out of its parent, it carries that surrounding state with it, so it can still read and update those variables long after the parent has finished running.",
    examples: [
      {
        code: "function makeCounter() {\n  let count = 0;\n  return () => ++count;\n}\nconst next = makeCounter();\nnext(); // 1\nnext(); // 2",
        explanation: "The returned arrow function keeps a live reference to count, so each call updates the same private variable.",
      },
    ],
    realWorldUseCases: [
      "Private state in a module or hook (a value only the returned functions can touch).",
      "Event handlers and callbacks that remember the data they were set up with.",
      "Function factories like debounce, throttle, once, and memoize.",
    ],
    relatedProblemIds: ["js-closures-007"],
    visual: "closures",
    furtherReading: [
      { label: "MDN: Closures", url: "https://developer.mozilla.org/docs/Web/JavaScript/Closures" },
    ],
  },
  {
    slug: "hoisting",
    track: "javascript",
    topic: "Behind the Scenes",
    title: "Hoisting",
    oneLiner: "JavaScript sets up all your declarations before it runs a single line of your code.",
    definition:
      "Before executing a scope, the JavaScript engine scans it and registers every `var` and `function` declaration in advance. Function declarations are hoisted whole, so they can be called before the line where they appear in the source. `var` declarations are hoisted too, but only the declaration, not the assignment, so the variable exists from the top of the scope and reads as `undefined` until its assignment line actually runs.\n\n`let` and `const` are also registered ahead of time, but they are not usable until their declaration line executes. The span between the start of the scope and that line is called the temporal dead zone, and touching the variable there throws a `ReferenceError` instead of returning `undefined`. This is why `let`/`const` are described as block-scoped and stricter about ordering, while `var` and function declarations feel like they float upward.",
    examples: [
      {
        code: "console.log(a); // undefined\nvar a = 1;\n\ngreet(); // works\nfunction greet() { console.log(\"hi\"); }\n\nconsole.log(b); // ReferenceError\nlet b = 2;",
        explanation: "var is hoisted and initialized to undefined, function declarations are hoisted whole, but let stays in the temporal dead zone until its line runs.",
      },
      {
        code: "function useHoisted(n) {\n  return sq(n);\n  function sq(x) { return x * x; }\n}\nuseHoisted(4); // 16",
        explanation: "The call to sq happens before its definition in the source, but the hoisted function declaration is already in place when useHoisted starts running.",
      },
    ],
    realWorldUseCases: [
      "Explaining why a var-declared loop counter still exists (as undefined) outside the loop.",
      "Understanding why calling a function declared lower in a file still works, but a const-assigned function expression does not.",
      "Debugging a ReferenceError caused by using a let/const variable one line too early.",
      "Knowing why linters flag var and push teams toward let/const, which fail loudly instead of silently returning undefined.",
    ],
    relatedProblemIds: ["js-bts-002", "js-bts-001"],
    visual: "hoisting",
    furtherReading: [
      { label: "MDN: Hoisting", url: "https://developer.mozilla.org/en-US/docs/Glossary/Hoisting" },
    ],
  },
  {
    slug: "scope-chain",
    track: "javascript",
    topic: "Behind the Scenes",
    title: "The Scope Chain",
    oneLiner: "A variable lookup walks outward through nested scopes until it finds a match or runs out of places to look.",
    definition:
      "Every function and block creates its own scope, and scopes can nest inside one another: a global scope, an outer function's scope, and an inner function's scope, for example. When code inside the innermost scope reads a variable, the engine first checks that scope's own bindings. If the name is not there, it steps out to the next enclosing scope and checks again, continuing outward link by link. This chain of enclosing scopes is fixed at the time a function is defined, not at the time it is called, which is why JavaScript uses lexical (static) scoping.\n\nThe lookup stops as soon as a match is found, so a variable in an inner scope shadows one of the same name further out. If the chain is walked all the way to the global scope and still no binding exists, the engine throws a `ReferenceError`, because there is nowhere else to look.",
    examples: [
      {
        code: "const x = \"global\";\nfunction outer() {\n  const y = \"outer\";\n  function inner() {\n    console.log(x, y); // global outer\n  }\n  inner();\n}\nouter();",
        explanation: "inner() has no x or y of its own, so it walks the scope chain outward: first to outer's scope for y, then to the global scope for x.",
      },
      {
        code: "function outer(x) {\n  function inner() { return x + 10; }\n  return inner();\n}\nouter(5); // 15",
        explanation: "inner reads x from the enclosing outer scope through the scope chain, even though x is not a parameter of inner itself.",
      },
    ],
    realWorldUseCases: [
      "Understanding why a callback can read variables from the function that defined it.",
      "Debugging an unexpected ReferenceError, which usually means the lookup reached global with no match.",
      "Reasoning about variable shadowing when an inner scope reuses an outer variable's name.",
      "Knowing why module-level constants are visible inside every nested function without being imported.",
    ],
    relatedProblemIds: ["js-bts-001", "js-scope-002", "js-scope-006"],
    visual: "scope-chain",
    furtherReading: [
      { label: "MDN: Scope", url: "https://developer.mozilla.org/en-US/docs/Glossary/Scope" },
    ],
  },
  {
    slug: "the-this-keyword",
    track: "javascript",
    topic: "Behind the Scenes",
    title: "The this Keyword",
    oneLiner: "this is not fixed to a function; it is decided fresh by how that function gets called.",
    definition:
      "Unlike a regular variable, `this` is not resolved through the scope chain. Its value is determined by the call site, meaning the same function body can produce a different `this` depending on how it is invoked. Called as a method (`obj.greet()`), `this` is the object before the dot. Called standalone (`greet()`), `this` is `undefined` in strict mode (or the global object in non-strict code). Called with `.call()`, `.apply()`, or `.bind()`, `this` is whatever object you explicitly pass in, regardless of how the function is normally attached.\n\nArrow functions break this pattern on purpose: they have no `this` of their own and instead capture `this` lexically from the scope where they were defined, the same way a closure captures a variable. That makes arrow functions useful inside methods or callbacks where you want `this` to stay pointed at the surrounding object instead of being reset by the caller.",
    examples: [
      {
        code: "const person = {\n  name: \"Ada\",\n  greet() { return this.name; },\n};\nperson.greet(); // \"Ada\"\n\nconst detached = person.greet;\ndetached(); // undefined (this is not person anymore)",
        explanation: "As a method call, this is the object before the dot. Once the function is pulled off the object and called standalone, this loses that binding.",
      },
      {
        code: "function greet() { return this.name; }\nconst bound = greet.bind({ name: \"Bo\" });\nbound(); // \"Bo\"\n\nconst arrowGreet = () => this;\n// this inside the arrow is whatever this was outside it, fixed forever",
        explanation: "bind permanently locks this to the object you pass in. An arrow function ignores call-site rules entirely and keeps the this of its enclosing scope.",
      },
    ],
    realWorldUseCases: [
      "Choosing arrow functions for callbacks (event handlers, array methods) so this still points at the class or object that set them up.",
      "Using .bind() to pass an object method as a callback without losing its this.",
      "Debugging a 'cannot read property of undefined' error caused by detaching a method from its object.",
      "Understanding why React class components historically bound handlers in the constructor.",
    ],
    relatedProblemIds: ["js-bts-003", "js-scope-004"],
    visual: "the-this-keyword",
    furtherReading: [
      { label: "MDN: this", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this" },
    ],
  },
  {
    slug: "execution-context-call-stack",
    track: "javascript",
    topic: "Behind the Scenes",
    title: "Execution Context and the Call Stack",
    oneLiner: "Every function call gets its own frame on a stack, and JavaScript only ever runs the frame on top.",
    definition:
      "Every time a function is called, the engine creates a new execution context, a frame that holds that call's local variables, its arguments, and its own value of `this`. That frame is pushed onto the call stack, a last-in-first-out structure. The engine always runs the frame currently on top of the stack; if that function calls another function, a new frame goes on top of it, pausing the caller until the callee finishes.\n\nWhen a function returns, its frame pops off the stack and control resumes in the frame beneath it, exactly where it left off. The global context is the frame at the very bottom, created once when the program starts and never popped until the program ends. This is what a stack trace shows you: the chain of frames, bottom to top, that were active when an error was thrown.",
    examples: [
      {
        code: "function third() { console.trace(); }\nfunction second() { third(); }\nfunction first() { second(); }\nfirst();\n// stack (top to bottom): third, second, first, global",
        explanation: "Each call pushes a new frame on top of the one that called it; console.trace prints the stack as it stood at that moment.",
      },
      {
        code: "function factorial(n) {\n  if (n <= 1) return 1;\n  return n * factorial(n - 1);\n}\nfactorial(3); // 6",
        explanation: "Recursion pushes one frame per call (factorial(3), factorial(2), factorial(1)) before any of them can return, then pops them off in reverse order as each multiplication resolves.",
      },
    ],
    realWorldUseCases: [
      "Reading a stack trace in an error report to see the exact chain of calls that led to a crash.",
      "Understanding 'Maximum call stack size exceeded' errors from runaway or unbounded recursion.",
      "Reasoning about synchronous execution order before mixing in asynchronous callbacks.",
      "Using debugger breakpoints and the call stack panel in devtools to step back through nested calls.",
    ],
    relatedProblemIds: ["js-bts-002", "js-scope-009"],
    visual: "execution-context-call-stack",
    furtherReading: [
      { label: "MDN: Call stack", url: "https://developer.mozilla.org/en-US/docs/Glossary/Call_stack" },
    ],
  },
  {
    slug: "primitives-vs-references",
    track: "javascript",
    topic: "Behind the Scenes",
    title: "Primitives vs. References",
    oneLiner: "Copying a number copies the value; copying an object copies a pointer to the same shared value.",
    definition:
      "Primitive values (strings, numbers, booleans, null, undefined, symbols, bigints) are copied by value. When you assign a primitive to a new variable or pass it into a function, the engine duplicates the value itself, so the two variables are completely independent from that point on. Changing one never affects the other.\n\nObjects and arrays are copied by reference. A variable holding an object does not hold the object's data directly; it holds a reference (effectively an address) pointing at the object in memory. Assigning that variable to another variable, or passing it into a function, copies the reference, not the object, so both variables end up pointing at the exact same object. Mutating the object through either variable, such as setting a property, is visible through both, because there is only ever one object being shared.",
    examples: [
      {
        code: "let a = 5;\nlet b = a;\nb = 10;\nconsole.log(a, b); // 5 10",
        explanation: "b is a separate copy of the number 5. Reassigning b has no effect on a.",
      },
      {
        code: "const obj1 = { count: 1 };\nconst obj2 = obj1;\nobj2.count = 99;\nconsole.log(obj1.count); // 99\n\nconst obj3 = { ...obj1 }; // shallow copy: a new, separate object\nobj3.count = 1;\nconsole.log(obj1.count); // still 99",
        explanation: "obj2 points at the same object as obj1, so mutating through obj2 is visible on obj1. Spreading into obj3 creates a genuinely separate top-level object instead.",
      },
    ],
    realWorldUseCases: [
      "Explaining why mutating a React state object directly does not trigger a re-render, and why { ...state } is used instead.",
      "Debugging a bug where updating 'a copy' of an object also changed the original.",
      "Choosing structuredClone or a deep copy utility when nested objects need real independence.",
      "Understanding why comparing two objects with === checks reference identity, not their contents.",
    ],
    relatedProblemIds: ["js-bts-004", "js-bts-005", "js-bts-006", "js-types-008"],
    visual: "primitives-vs-references",
    furtherReading: [
      { label: "MDN: JavaScript data types and data structures", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures" },
    ],
  },
];
