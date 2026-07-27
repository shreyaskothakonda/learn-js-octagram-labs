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
  {
    slug: "data-types-and-coercion",
    track: "javascript",
    topic: "Fundamentals: Part 1",
    title: "Data Types and Coercion",
    oneLiner: "JavaScript has a small set of built-in types, and it converts between them automatically when an operator expects a different one.",
    definition:
      "JavaScript has seven primitive types (string, number, boolean, null, undefined, symbol, bigint) plus object, and `typeof` tells you which one a value currently is. Primitives are compared and copied by value, while objects (including arrays and functions) are reference types.\n\nType coercion is the automatic conversion the engine performs when an operator or context expects a different type than the one it got. The `+` operator prefers strings: if either operand is a string, the other is converted to a string and the two are concatenated. Every other arithmetic operator (`-`, `*`, `/`) prefers numbers, so it converts both operands to numbers first. This is why `\"5\" + 1` produces the string `\"51\"` but `\"5\" - 1` produces the number `4`: the same numeric-looking string takes two different paths depending on which operator is asking.",
    examples: [
      {
        code: "typeof \"hi\";    // \"string\"\ntypeof 42;      // \"number\"\ntypeof true;    // \"boolean\"\ntypeof undefined; // \"undefined\"\ntypeof null;    // \"object\" (a long-standing quirk)",
        explanation: "typeof reports the current type of a value; null famously reports \"object\" due to a bug preserved for compatibility.",
      },
      {
        code: "\"5\" + 1;  // \"51\" (+ prefers strings, so 1 becomes \"1\")\n\"5\" - 1;  // 4    (- prefers numbers, so \"5\" becomes 5)\n\"5\" * \"2\"; // 10   (both operands coerce to numbers)",
        explanation: "The operator decides the coercion direction: + concatenates when a string is involved, while -, *, and / always coerce toward numbers.",
      },
      {
        code: "Number(\"42\");   // 42\nString(42);      // \"42\"\nBoolean(\"\");     // false",
        explanation: "Number(), String(), and Boolean() perform the same conversions explicitly, which is clearer and safer than relying on an operator to coerce implicitly.",
      },
    ],
    realWorldUseCases: [
      "Converting form input (always strings) into numbers with Number() before doing math on it.",
      "Debugging a bug where + concatenated two values instead of adding them.",
      "Using explicit String()/Number() conversions instead of relying on implicit coercion at API boundaries.",
      "Understanding why == triggers coercion while === does not, and why the strict operator is usually preferred.",
    ],
    relatedProblemIds: ["js-types-001", "js-types-004", "js-types-006", "js-operators-003"],
    visual: "data-types-and-coercion",
    furtherReading: [
      { label: "MDN: Type coercion", url: "https://developer.mozilla.org/en-US/docs/Glossary/Type_coercion" },
    ],
  },
  {
    slug: "let-const-var-tdz",
    track: "javascript",
    topic: "Fundamentals: Part 2",
    title: "let, const, var, and the Temporal Dead Zone",
    oneLiner: "let and const are block-scoped and unreachable until their line runs, while var is function-scoped and available as undefined from the top.",
    definition:
      "`var` declarations are function-scoped (or global-scoped) and hoisted with an initial value of `undefined`, so a `var` variable exists and reads as `undefined` from the very top of its scope, even before its declaration line runs. This makes `var` easy to misuse: it ignores block boundaries like `if` and `for`, so the same name can leak out of a loop or conditional.\n\n`let` and `const` are block-scoped, confined to the nearest `{}`. They are registered ahead of time like `var`, but they stay in the temporal dead zone (TDZ) from the start of the block until their declaration line actually executes. Accessing a `let`/`const` variable inside its TDZ throws a `ReferenceError` instead of silently returning `undefined`. `const` additionally forbids reassigning the binding after it is set (though the value it points to, if an object, can still be mutated).",
    examples: [
      {
        code: "console.log(count); // ReferenceError: Cannot access 'count' before initialization\nlet count = 5;\nconsole.log(count); // 5",
        explanation: "count exists as soon as the block starts, but it stays in the temporal dead zone until its declaration line runs, so reading it earlier throws instead of returning undefined.",
      },
      {
        code: "console.log(msg); // undefined (no error)\nvar msg = \"hi\";\nconsole.log(msg); // \"hi\"",
        explanation: "var is hoisted and initialized to undefined immediately, so reading it before its assignment line is legal but returns undefined rather than the eventual value.",
      },
      {
        code: "for (var i = 0; i < 3; i++) {}\nconsole.log(i); // 3, i leaked out of the loop\n\nfor (let j = 0; j < 3; j++) {}\nconsole.log(j); // ReferenceError, j is block-scoped to the loop",
        explanation: "var ignores the for loop's block boundary and leaks into the enclosing scope, while let is confined to the loop body.",
      },
    ],
    realWorldUseCases: [
      "Choosing let/const by default so a typo or early read throws immediately instead of silently producing undefined.",
      "Avoiding the classic var-in-a-loop bug where every closure captures the same leaked variable.",
      "Reasoning about a 'Cannot access before initialization' error, which points at a TDZ violation, not a missing declaration.",
      "Using const to signal a binding will never be reassigned, catching accidental reassignment at parse time.",
    ],
    relatedProblemIds: ["js-fund2-003", "js-fund2-008", "js-fund2-010"],
    visual: "let-const-var-tdz",
    furtherReading: [
      { label: "MDN: Temporal dead zone (TDZ)", url: "https://developer.mozilla.org/en-US/docs/Glossary/Temporal_dead_zone_TDZ" },
    ],
  },
  {
    slug: "truthy-falsy",
    track: "javascript",
    topic: "Fundamentals: Part 2",
    title: "Truthy and Falsy Values",
    oneLiner: "Every value is truthy unless it is one of a short, memorizable list of falsy values.",
    definition:
      "In a boolean context, such as an `if` condition or the `!` operator, JavaScript coerces any value to `true` or `false`. There are only eight falsy values: `false`, `0`, `-0`, `0n`, `\"\"` (empty string), `null`, `undefined`, and `NaN`. Every other value is truthy, including values that might feel empty or negative, like `\"0\"` (a non-empty string), an empty array `[]`, and an empty object `{}`, because arrays and objects are always truthy regardless of what they contain.\n\nThis rule powers common patterns like `if (value)` as a shorthand null/empty check, `value || fallback` for defaults, and `!!value` to force a value into an explicit boolean. It is also a common source of bugs: `value || fallback` treats a legitimate `0` or `\"\"` as missing, which is why the nullish coalescing operator `??` (which only falls back on `null`/`undefined`) is often the safer choice.",
    examples: [
      {
        code: "Boolean(0);         // false\nBoolean(\"\");         // false\nBoolean(null);       // false\nBoolean(undefined);  // false\nBoolean(NaN);        // false",
        explanation: "These are five of the eight falsy values; false, -0, and 0n round out the full list.",
      },
      {
        code: "Boolean(\"0\");  // true, a non-empty string\nBoolean([]);    // true, an array is always truthy\nBoolean({});    // true, an object is always truthy",
        explanation: "The string \"0\" and empty containers are common gotchas: they look empty but coerce to true because only the eight exact falsy values coerce to false.",
      },
      {
        code: "const count = 0;\nconst shown = count || \"no items\"; // \"no items\", a bug: 0 was meaningful\nconst safe = count ?? \"no items\";  // 0, correct: only null/undefined fall back",
        explanation: "|| falls back on any falsy value, so a real 0 gets discarded; ?? only falls back on null or undefined, preserving 0 as a valid value.",
      },
    ],
    realWorldUseCases: [
      "Writing guard clauses like if (!user) return; to short-circuit on null, undefined, or empty values.",
      "Using !!value to coerce an arbitrary value into an explicit true/false for a UI flag.",
      "Debugging a default value that silently overrides a legitimate 0 or empty string because || was used instead of ??.",
      "Checking array.length (truthy when non-zero, falsy when 0) instead of the array itself, which is always truthy.",
    ],
    relatedProblemIds: ["js-fund2-005", "js-fund2-006", "js-fund2-009"],
    visual: "truthy-falsy",
    furtherReading: [
      { label: "MDN: Truthy", url: "https://developer.mozilla.org/en-US/docs/Glossary/Truthy" },
    ],
  },
  {
    slug: "operators-precedence",
    track: "javascript",
    topic: "Fundamentals: Part 1",
    title: "Operator Precedence and Associativity",
    oneLiner: "When an expression mixes operators, precedence decides which one runs first, and associativity decides the order among operators of equal precedence.",
    definition:
      "Every operator has a precedence level that determines how tightly it binds its operands. Multiplication and division bind tighter than addition and subtraction, so `2 + 3 * 4` evaluates the multiplication first (`3 * 4` → `12`) and then the addition (`2 + 12` → `14`), the same left-to-right-by-precedence rule taught in arithmetic. Comparison operators bind looser than arithmetic, logical `&&` binds tighter than `||`, and the assignment operators bind loosest of all, which is why `a = b + c` assigns the sum rather than trying to add `c` to the result of `a = b`.\n\nWhen two operators share the same precedence, associativity breaks the tie. Most binary operators, like `+` and `-`, are left-associative, evaluating left to right. A few, like the exponentiation operator `**` and the assignment operators, are right-associative, so `2 ** 3 ** 2` evaluates the rightmost `**` first (`3 ** 2` → `9`, then `2 ** 9` → `512`). Parentheses always override both rules, which is why wrapping a sub-expression in `()` is the clearest way to force a specific evaluation order.",
    examples: [
      {
        code: "2 + 3 * 4;   // 14, not 20: * runs before +\n(2 + 3) * 4; // 20: parentheses override precedence",
        explanation: "Multiplication has higher precedence than addition, so it evaluates first unless parentheses force a different order.",
      },
      {
        code: "2 ** 3 ** 2; // 512, not 64: ** is right-associative\n(2 ** 3) ** 2; // 64",
        explanation: "Exponentiation groups from the right, so the rightmost ** evaluates first: 3 ** 2 is 9, then 2 ** 9 is 512.",
      },
      {
        code: "true || false && false; // true, && binds tighter than ||\n(true || false) && false; // false",
        explanation: "&& has higher precedence than ||, so it is evaluated as true || (false && false), not (true || false) && false.",
      },
    ],
    realWorldUseCases: [
      "Adding parentheses around a mixed && / || condition so the intended grouping is obvious, not just technically correct.",
      "Debugging a calculation that silently used the wrong order of operations because of missing parentheses.",
      "Understanding why a = b = 5 works (assignment is right-associative) when chaining assignments.",
      "Reading dense conditional expressions in existing code by mentally applying precedence before associativity.",
    ],
    relatedProblemIds: ["js-operators-001", "js-operators-002", "js-operators-006", "js-types-002"],
    visual: "operators-precedence",
    furtherReading: [
      { label: "MDN: Operator precedence", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_precedence" },
    ],
  },
  {
    slug: "destructuring",
    track: "javascript",
    topic: "Data Structures, Operators & Strings",
    title: "Destructuring",
    oneLiner: "Destructuring unpacks values from an array or an object straight into named variables.",
    definition:
      "Destructuring is a syntax for pulling values out of an array or object and binding them to variables in one step, instead of reading each one off by index or property name. Array destructuring matches by position, `const [a, b] = arr` takes the first two elements. Object destructuring matches by property name, `const { name, age } = user` looks up `name` and `age` regardless of where they sit in the object, and `const { name: userName } = user` renames the binding while it unpacks.\n\nBoth forms support defaults for when a value is missing (`const [a = 1] = []`) and nesting, so a property inside a property, or an element inside an element, can be pulled out in the same pattern (`const { address: { city } } = user`). Destructuring also appears in function parameters, letting a function accept an object and immediately unpack the fields it needs.",
    examples: [
      {
        code: "const [first, second] = [10, 20, 30];\n// first = 10, second = 20 (30 is ignored)",
        explanation: "Array destructuring matches by position; extra elements that are not named are simply left alone.",
      },
      {
        code: "const user = { name: \"Ada\", age: 30 };\nconst { name, age: years } = user;\n// name = \"Ada\", years = 30",
        explanation: "Object destructuring matches by key name and can rename the local variable with a colon.",
      },
      {
        code: "function greet({ name = \"friend\" } = {}) {\n  return `Hi, ${name}`;\n}\ngreet(); // \"Hi, friend\"\ngreet({ name: \"Ada\" }); // \"Hi, Ada\"",
        explanation: "A default on the parameter itself covers a missing argument; a default inside the pattern covers a missing property.",
      },
    ],
    realWorldUseCases: [
      "Unpacking named fields straight out of a function's object parameter, like a React component's props.",
      "Pulling specific values off an API response without writing response.data.user.name repeatedly.",
      "Swapping two variables in one line: [a, b] = [b, a].",
      "Reading only the pieces you need from a large config object, with defaults for the rest.",
    ],
    relatedProblemIds: ["js-s9-001", "js-s9-002", "js-es6-008", "js-es6-009"],
    visual: "destructuring",
    furtherReading: [
      { label: "MDN: Destructuring assignment", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment" },
    ],
  },
  {
    slug: "spread-and-rest",
    track: "javascript",
    topic: "Data Structures, Operators & Strings",
    title: "Spread and Rest",
    oneLiner: "The same ... syntax expands a value out in one context and gathers values together in the other.",
    definition:
      "Spread and rest share the `...` syntax, but they do opposite jobs depending on where they appear. Spread expands an iterable, like an array, or an object's own properties, into the surrounding context: `[...a, ...b]` unpacks every element of `a` and `b` into a new array, and `{ ...obj, extra: 1 }` copies every property of `obj` into a new object. Because it builds a new array or object, spread makes a shallow copy: top-level values are duplicated, but nested objects or arrays are still shared by reference with the original.\n\nRest does the reverse: it gathers the remaining items into a single array. In a destructuring pattern, `const [first, ...rest] = arr` collects everything after `first`. In a function signature, `function sum(...nums)` collects every argument the function was called with. A rest element must be the last item in its pattern or parameter list, since it claims everything left over.",
    examples: [
      {
        code: "const a = [1, 2];\nconst b = [3, 4];\nconst combined = [...a, ...b];\n// [1, 2, 3, 4]",
        explanation: "Spread unpacks both arrays' elements into a brand new array; a and b are left untouched.",
      },
      {
        code: "const base = { role: \"user\" };\nconst admin = { ...base, role: \"admin\" };\n// { role: \"admin\" }, base is still { role: \"user\" }",
        explanation: "Spreading an object copies its own properties first, so a later key with the same name overrides the spread value.",
      },
      {
        code: "function sum(first, ...rest) {\n  return first + rest.reduce((a, b) => a + b, 0);\n}\nsum(1, 2, 3, 4); // 10",
        explanation: "Rest collects every argument after the first one into a real array, which is why reduce works on it directly.",
      },
    ],
    realWorldUseCases: [
      "Merging or cloning objects and arrays without mutating the originals, like spreading previous state in a reducer.",
      "Writing a function that accepts any number of arguments, such as a custom Math.max or a logging helper.",
      "Passing an array of values as individual arguments to a function, like Math.max(...scores).",
      "Splitting an array into a head element and the remaining tail with a rest pattern.",
    ],
    relatedProblemIds: ["js-s9-003", "js-s9-004", "js-es6-003", "js-es6-004"],
    visual: "spread-and-rest",
    furtherReading: [
      { label: "MDN: Spread syntax", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax" },
    ],
  },
  {
    slug: "optional-chaining-nullish",
    track: "javascript",
    topic: "Data Structures, Operators & Strings",
    title: "Optional Chaining and Nullish Coalescing",
    oneLiner: "?. stops a property lookup safely at the first null or undefined instead of throwing; ?? picks a default only for null or undefined.",
    definition:
      "Optional chaining, `?.`, checks whether the value to its left is `null` or `undefined` before continuing the lookup. If it is, the whole expression short-circuits to `undefined` immediately, no error is thrown, and nothing further to the right is evaluated. If it is not, the chain continues as a normal property access or method call. This makes it safe to read a deeply nested path like `user?.address?.city` even when `address` might not exist, instead of writing a chain of manual `&&` checks or a try/catch.\n\nNullish coalescing, `??`, returns its right-hand side only when the left-hand side is `null` or `undefined`, and returns the left-hand side unchanged for any other value, including falsy ones like `0`, `\"\"`, `false`, and `NaN`. This is the key difference from `||`, which falls through to its right-hand side for any falsy value. `0 ?? 5` is `0`, but `0 || 5` is `5`. The two operators are often combined: `user?.settings?.volume ?? 100` safely reads a possibly-missing setting and only substitutes a default when it is genuinely absent.",
    examples: [
      {
        code: "const user = { address: null };\nuser.address.city;   // TypeError: Cannot read properties of null\nuser?.address?.city;  // undefined, no error",
        explanation: "Optional chaining stops the lookup the moment it hits null, returning undefined instead of throwing.",
      },
      {
        code: "0 ?? 5;   // 0 (0 is not null/undefined)\n0 || 5;   // 5 (0 is falsy)\n\"\" ?? \"x\"; // \"\" \nnull ?? \"x\"; // \"x\"",
        explanation: "?? only falls back for null or undefined; || falls back for any falsy value, which is why 0 and \"\" behave differently between the two.",
      },
      {
        code: "const settings = { volume: 0 };\nconst volume = settings?.volume ?? 100;\n// 0, not 100",
        explanation: "Even though 0 is falsy, ?? treats it as a present value because it is not null or undefined, so the real setting wins over the default.",
      },
    ],
    realWorldUseCases: [
      "Safely reading a nested API field that might be missing, like response?.data?.user?.email.",
      "Calling an optional callback only if it was provided: onSave?.().",
      "Applying a default for a config value that may legitimately be 0 or an empty string, without accidentally overwriting it.",
      "Replacing long defensive chains of if (a && a.b && a.b.c) checks with a single optional chain.",
    ],
    relatedProblemIds: ["js-s9-005", "js-s9-006", "js-s9-007"],
    visual: "optional-chaining-nullish",
    furtherReading: [
      { label: "MDN: Optional chaining", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining" },
    ],
  },
  {
    slug: "maps-and-sets",
    track: "javascript",
    topic: "Data Structures, Operators & Strings",
    title: "Maps and Sets",
    oneLiner: "A Set stores unique values with no duplicates; a Map stores key-value pairs with keys of any type and fast lookup.",
    definition:
      "A `Set` is a collection of unique values. Adding a value that already exists is a no-op, `set.add(x)` twice still leaves one `x`, which makes Sets a natural way to deduplicate data or track membership. Values are compared with the same-value-zero algorithm, close to `===` but treating `NaN` as equal to itself, and the collection remembers insertion order when you iterate it.\n\nA `Map` is a collection of key-value pairs, similar to a plain object, but with two practical advantages: any value can be a key, not just strings and symbols, so objects, functions, or numbers all work as keys directly; and a Map preserves insertion order and reports its size directly through `map.size`. Both `Map` and `Set` offer `O(1)` average-time lookup, `map.get(key)` or `set.has(value)`, because they are backed by a hash table rather than requiring a scan, which is what makes them faster than an array's `includes` or `find` for membership checks on larger collections.",
    examples: [
      {
        code: "const seen = new Set();\nseen.add(\"a\");\nseen.add(\"a\");\nseen.add(\"b\");\n// seen has 2 values: \"a\", \"b\"",
        explanation: "Adding a value that is already in the Set changes nothing; a Set never holds duplicates.",
      },
      {
        code: "const scores = new Map();\nscores.set(\"ada\", 90);\nscores.set(\"grace\", 95);\nscores.get(\"grace\"); // 95\nscores.has(\"linus\"); // false",
        explanation: "get and has look a key up directly in the hash table, an O(1) operation on average regardless of how many entries the Map holds.",
      },
      {
        code: "const unique = [...new Set([1, 2, 2, 3, 1])];\n// [1, 2, 3]",
        explanation: "Spreading a Set built from an array back into an array is a common one-line way to deduplicate a list.",
      },
    ],
    realWorldUseCases: [
      "Deduplicating an array of ids or tags while preserving their original order.",
      "Tracking which items have already been processed in a loop to avoid doing the work twice.",
      "Building a fast lookup table from an array of records, keyed by id, instead of calling find repeatedly.",
      "Using non-string keys, like DOM nodes or objects, as lookup keys in a Map when a plain object cannot express that.",
    ],
    relatedProblemIds: ["js-s9-008", "js-s9-009", "js-s9-010", "js-es6-006"],
    visual: "maps-and-sets",
    furtherReading: [
      { label: "MDN: Map", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map" },
    ],
  },
];
