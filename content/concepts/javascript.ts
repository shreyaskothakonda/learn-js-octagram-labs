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
      "A `Set` is a collection of unique values. Adding a value that already exists is a no-op, `set.add(x)` twice still leaves one `x`, which makes Sets a natural way to deduplicate data or track membership. Values are compared the way `===` does, with the special case that `NaN` is considered equal to itself, and the collection remembers insertion order when you iterate it.\n\nA `Map` is a collection of key-value pairs, similar to a plain object, but with two practical advantages: any value can be a key, not just strings and symbols, so objects, functions, or numbers all work as keys directly; and a Map preserves insertion order and reports its size directly through `map.size`. Both `Map` and `Set` offer `O(1)` average-time lookup, `map.get(key)` or `set.has(value)`, because they are backed by a hash table rather than requiring a scan, which is what makes them faster than an array's `includes` or `find` for membership checks on larger collections.",
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
  {
    slug: "higher-order-functions",
    track: "javascript",
    topic: "A Closer Look at Functions",
    title: "Higher-Order Functions",
    oneLiner: "A function that takes another function in, gives one back out, or both.",
    definition:
      "A higher-order function is a function that does at least one of two things: it accepts one or more functions as arguments, or it returns a function as its result. This is possible because functions in JavaScript are first-class values, they can be stored in a variable, passed around like any other argument, and returned from another function, so nothing special has to happen for a function to end up as data flowing through your program.\n\nWhen a function is passed in as an argument, it is usually called a callback, and the outer function decides when to call it back, sometimes once, sometimes many times, sometimes not at all. `Array.prototype.map`, `filter`, and `reduce` are the most common higher-order functions you will use day to day: each one takes a function describing what to do with an element and calls it back for every item in the array. A higher-order function can also build and return a brand new function, which is how function factories work, a call like `multiplyBy(3)` does not multiply anything itself, it hands back a new function that will multiply by 3 whenever it is eventually called.",
    examples: [
      {
        code: "const numbers = [1, 2, 3, 4];\nconst doubled = numbers.map((n) => n * 2);\n// [2, 4, 6, 8]",
        explanation: "map is a higher-order function: it takes the arrow function in as an argument and calls it back once per element.",
      },
      {
        code: "function withLogging(fn) {\n  return (...args) => {\n    console.log(\"calling with\", args);\n    return fn(...args);\n  };\n}\nconst loggedAdd = withLogging((a, b) => a + b);\nloggedAdd(2, 3); // logs, then returns 5",
        explanation: "withLogging both takes a function in and returns a new function out, wrapping the original with extra behavior without changing its code.",
      },
      {
        code: "function multiplyBy(factor) {\n  return (n) => n * factor;\n}\nconst triple = multiplyBy(3);\ntriple(5); // 15",
        explanation: "multiplyBy returns a function instead of a number. Calling triple later runs that returned function with the factor already locked in.",
      },
    ],
    realWorldUseCases: [
      "Array methods like map, filter, and reduce, which take a function describing what to do with each element.",
      "Wrapping a function with extra behavior, such as logging, timing, or memoizing, without editing its original code.",
      "Middleware in web frameworks, where each layer receives the next handler as a function and decides whether to call it.",
      "Function factories that produce a family of related functions, like validators or formatters, from one shared setup.",
      "Registering event listeners, since addEventListener itself is a higher-order function that calls your handler back.",
    ],
    relatedProblemIds: ["js-hof-003", "js-hof-005", "js-hof-006", "js-hof-007"],
    visual: "higher-order-functions",
    furtherReading: [
      { label: "MDN: Higher-order function", url: "https://developer.mozilla.org/en-US/docs/Glossary/Higher-order_function" },
    ],
  },
  {
    slug: "currying",
    track: "javascript",
    topic: "A Closer Look at Functions",
    title: "Currying",
    oneLiner: "Turning a multi-argument function into a chain of one-argument functions.",
    definition:
      "Currying transforms a function that takes several arguments into a sequence of functions that each take one argument, returning a new function after every call until enough arguments have arrived, at which point the result computes. A curried `add` called as `add(1)(2)(3)` works like this: `add(1)` returns a function that remembers 1 and is waiting for the next argument; calling that with `2` returns another function that remembers 1 and 2; calling that with `3` finally has all three arguments, so instead of returning another function it computes and returns `6`.\n\nEach step works because of closures, every returned function keeps a reference to the arguments captured so far. Currying does not change what gets computed, `add(1)(2)(3)` and `add(1, 2, 3)` can produce the same sum, it changes the shape of the calls, splitting one call with three arguments into three calls with one argument each. That shape is useful on its own: you can call a curried function partway, hold onto the result, and reuse it later with different final arguments, which is how currying enables partial application.",
    examples: [
      {
        code: "function add(a) {\n  return function (b) {\n    return function (c) {\n      return a + b + c;\n    };\n  };\n}\nadd(1)(2)(3); // 6",
        explanation: "Each call returns a new function that closes over the arguments seen so far. Only the third call has enough arguments to compute a result.",
      },
      {
        code: "const addTo10 = add(10);\naddTo10(20)(5); // 35\naddTo10(1)(1);  // 12",
        explanation: "Stopping after the first call keeps a reusable function with 10 already captured, which can be finished off with different remaining arguments later.",
      },
      {
        code: "function curry(fn) {\n  return function curried(...args) {\n    if (args.length >= fn.length) return fn(...args);\n    return (...more) => curried(...args, ...more);\n  };\n}\nconst curriedAdd = curry((a, b, c) => a + b + c);\ncurriedAdd(1)(2)(3); // 6\ncurriedAdd(1, 2)(3); // 6",
        explanation: "A generic curry helper checks fn.length, the declared arity, against how many arguments have arrived, and only calls the original function once enough are collected.",
      },
    ],
    realWorldUseCases: [
      "Pre-configuring a reusable function, like fixing a tax rate once and reusing calculateTax(rate) across many amounts.",
      "Building small variants of a general function, such as deriving double and triple from a single curried multiply.",
      "Composing pipelines of transformations where each stage is set up once with its configuration and reused per item.",
      "Creating event handlers bound to specific data, like handleClick(id) returning the actual listener for that id.",
    ],
    relatedProblemIds: ["js-fp-001", "js-fp-002", "js-fp-003", "js-hof-004"],
    visual: "currying",
    furtherReading: [
      { label: "MDN: Currying", url: "https://developer.mozilla.org/en-US/docs/Glossary/Currying" },
    ],
  },
  {
    slug: "call-apply-bind",
    track: "javascript",
    topic: "A Closer Look at Functions",
    title: "call, apply, and bind",
    oneLiner: "Three ways to control what this refers to when a function runs.",
    definition:
      "Every function has access to call, apply, and bind, three methods for controlling what `this` refers to inside it. `fn.call(thisArg, arg1, arg2)` invokes fn immediately, with `this` set to thisArg and the remaining arguments passed in one by one. `fn.apply(thisArg, [arg1, arg2])` does the same thing, invoking fn right away with `this` set to thisArg, but takes the arguments as a single array instead of a list, which is convenient when the arguments are already collected in an array or the count varies.\n\n`fn.bind(thisArg, arg1)` behaves differently: it does not call fn at all. Instead it returns a brand new function with `this` (and optionally some leading arguments) permanently locked to what was passed in, ready to be called later, as many times as needed, with `this` never changing again regardless of how that new function is eventually invoked. One exception applies to all three: arrow functions ignore call, apply, and bind for the purpose of setting `this`, because an arrow function has no `this` of its own, it always uses `this` from the scope where it was defined.",
    examples: [
      {
        code: "function greet() {\n  return `Hi, ${this.name}`;\n}\ngreet.call({ name: \"Ada\" });  // \"Hi, Ada\"\ngreet.apply({ name: \"Ada\" }); // \"Hi, Ada\"",
        explanation: "call and apply both run greet immediately with this pointed at the given object. With no extra arguments, they behave the same here.",
      },
      {
        code: "function introduce(greeting, punctuation) {\n  return `${greeting}, ${this.name}${punctuation}`;\n}\nintroduce.call({ name: \"Grace\" }, \"Hello\", \"!\");\nintroduce.apply({ name: \"Grace\" }, [\"Hello\", \"!\"]);\n// both: \"Hello, Grace!\"",
        explanation: "call takes the extra arguments individually, apply takes them as one array. Both produce the same result, only the argument shape differs.",
      },
      {
        code: "function greet() {\n  return `Hi, ${this.name}`;\n}\nconst boundGreet = greet.bind({ name: \"Alan\" });\n// nothing runs yet\nboundGreet(); // \"Hi, Alan\", called later",
        explanation: "bind returns a new function with this locked to the given object. The original greet is untouched, and boundGreet can be called anywhere, any number of times, always with the same this.",
      },
    ],
    realWorldUseCases: [
      "Locking this for a class method used as a callback, such as this.handleClick = this.handleClick.bind(this) in a constructor.",
      "Borrowing an array method for an array-like object, like Array.prototype.slice.call(arguments) to turn arguments into a real array.",
      "Calling a function with an argument list that is already an array, using apply instead of manually spreading it out.",
      "Pre-filling some arguments of a function with bind to create a smaller, more specific function, like multiply.bind(null, 2) for double.",
    ],
    relatedProblemIds: ["js-scope-002", "js-scope-004", "js-fp-003", "js-multi-001"],
    visual: "call-apply-bind",
    furtherReading: [
      { label: "MDN: Function.prototype.bind()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind" },
    ],
  },
  {
    slug: "map-filter-reduce",
    track: "javascript",
    topic: "Working With Arrays",
    title: "map, filter, and reduce",
    oneLiner: "map transforms every element, filter keeps a subset, and reduce folds everything into one value.",
    definition:
      "map calls a function on every element of an array and returns a brand new array of the same length, made up of whatever that function returns for each element. The original array is left untouched, and no elements are added or removed, only transformed.\n\nfilter also calls a function on every element, but it keeps the element only when that function returns a truthy value, dropping the rest. The result is a new array that can be shorter than the original, or the same length if everything passes, but it is never longer.\n\nreduce walks the array from left to right, calling a function with an accumulator and the current element, and returns whatever that function produces as the new accumulator for the next step. Given an initial value as its second argument, reduce starts the accumulator there and folds every element into it one at a time, ending with a single value, a sum, an object, another array, whatever the callback builds. Chaining the three together, nums.map(...).filter(...).reduce(...), is a common way to transform, narrow, and total a list in one readable pipeline.",
    examples: [
      {
        code: "[1, 2, 3].map((n) => n * 2);\n// [2, 4, 6]",
        explanation: "map returns a new array of the same length, with each value transformed independently of the others.",
      },
      {
        code: "[1, -2, 3, -4].filter((n) => n > 0);\n// [1, 3]",
        explanation: "filter keeps only the elements where the callback returns true, so the result can be shorter than the input.",
      },
      {
        code: "[1, 2, 3, 4].reduce((total, n) => total + n, 0);\n// 10",
        explanation: "reduce walks the array left to right, folding each value into the accumulator that started at the initial value, 0.",
      },
    ],
    realWorldUseCases: [
      "Transforming a list of API records into the shape a component needs to render, with map.",
      "Narrowing a list down to matching rows for a search box or a status filter, with filter.",
      "Totaling a shopping cart's line items into a single price, with reduce.",
      "Folding a list into a lookup object or a count of occurrences, with reduce and an object as the initial value.",
    ],
    relatedProblemIds: ["js-arraymethods-004", "js-arraymethods-005", "js-arraymethods-006", "js-arraymethods-007"],
    visual: "map-filter-reduce",
    furtherReading: [
      { label: "MDN: Array.prototype.reduce()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce" },
    ],
  },
  {
    slug: "sorting-arrays",
    track: "javascript",
    topic: "Working With Arrays",
    title: "Sorting Arrays",
    oneLiner: "Array.prototype.sort reorders elements in place, using a comparator's sign to decide each swap.",
    definition:
      "sort reorders the elements of an array in place and returns the same array reference, it does not make a copy. Called with no arguments, it converts every element to a string and sorts those strings in Unicode code point order, which is why the numbers 10 and 2 end up as [10, 2] instead of [2, 10], the character \"1\" simply sorts before \"2\".\n\nA comparator function, passed as sort's argument, controls the order directly: for two elements a and b, returning a negative number means a should come before b, returning a positive number means b should come before a, and returning 0 leaves their relative order unchanged (this has been guaranteed stable since ES2019). The idiomatic comparator for ascending numbers is (a, b) => a - b: when a is bigger than b the subtraction is positive, so b moves first, when a is smaller the subtraction is negative, so a stays first. Flipping it to (a, b) => b - a sorts descending instead. Because sort mutates, copying the array first with [...arr] or arr.slice() before sorting keeps the original untouched.",
    examples: [
      {
        code: "[10, 1, 2].sort();\n// [1, 10, 2]",
        explanation: "With no comparator, sort converts each value to a string, so \"10\" sorts before \"2\" alphabetically instead of numerically.",
      },
      {
        code: "[10, 1, 2].sort((a, b) => a - b);\n// [1, 2, 10]",
        explanation: "A negative a - b keeps a first, a positive one swaps the pair, giving the correct ascending numeric order.",
      },
      {
        code: "const nums = [3, 1, 2];\nconst sorted = [...nums].sort((a, b) => a - b);\n// sorted is [1, 2, 3], nums is still [3, 1, 2]",
        explanation: "Spreading into a new array before calling sort avoids mutating the original nums array, since sort would otherwise reorder it in place.",
      },
    ],
    realWorldUseCases: [
      "Sorting a table's rows by whichever column the user clicks to sort on.",
      "Ranking a leaderboard of scores from highest to lowest.",
      "Ordering a list of dates or timestamps chronologically.",
      "Alphabetizing names or labels correctly with localeCompare instead of the default string sort.",
    ],
    relatedProblemIds: ["js-s11-007", "js-arrays-004", "js-arraymethods-009", "js-arraymethods-010"],
    visual: "sorting-arrays",
    furtherReading: [
      { label: "MDN: Array.prototype.sort()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort" },
    ],
  },
  {
    slug: "prototypes-inheritance",
    track: "javascript",
    topic: "Object-Oriented Programming",
    title: "Prototypes and Inheritance",
    oneLiner: "When an object does not have a property itself, JavaScript looks for it on the object's prototype instead.",
    definition:
      "Every JavaScript object has an internal link to another object called its prototype, accessible through `Object.getPrototypeOf(obj)` or the legacy `__proto__` accessor. When you read a property, the engine first checks the object's own properties. If the property is not there, it does not give up, it follows the prototype link and checks that object's own properties, then that object's prototype, and so on. This sequence of linked objects is the prototype chain, and it ends at `Object.prototype`, whose own prototype is `null`. If the chain runs out with no match, the read returns `undefined` instead of throwing.\n\nThis is how methods are shared without copying them onto every object. A constructor function's methods usually live on `Constructor.prototype`, one shared object, and every instance created with `new Constructor()` gets its `[[Prototype]]` set to that same object. So `instance.method()` works even though `method` is never an own property of `instance`, the lookup walks up to the prototype and finds it there. Own properties always win over inherited ones: if an instance defines its own version of a name, the chain walk stops at the instance and the prototype's version is never reached.",
    examples: [
      {
        code: "function Dog(name) {\n  this.name = name;\n}\nDog.prototype.speak = function () {\n  return this.name + \" barks\";\n};\nconst rex = new Dog(\"Rex\");\nrex.speak(); // \"Rex barks\"",
        explanation: "rex has no own speak property, so the lookup walks up rex's prototype link to Dog.prototype, finds speak there, and calls it with this bound to rex.",
      },
      {
        code: "const rex = { name: \"Rex\" };\nconst animal = { legs: 4 };\nObject.setPrototypeOf(rex, animal);\nrex.legs; // 4, found on the prototype\nrex.hasOwnProperty(\"legs\"); // false",
        explanation: "legs is not an own property of rex, but the prototype chain reaches animal and finds it there, while hasOwnProperty correctly reports that rex itself never had it.",
      },
      {
        code: "function Base() {}\nBase.prototype.greet = () => \"hi\";\nconst obj = {};\nObject.setPrototypeOf(obj, Base.prototype);\nobj.missing; // undefined, chain reaches Object.prototype then null",
        explanation: "When no object in the chain has the property, the walk reaches Object.prototype, then its prototype null, and the read quietly returns undefined.",
      },
    ],
    realWorldUseCases: [
      "Understanding why every array has methods like map and push without those methods being copied onto each array.",
      "Debugging why a method call works on an object that never explicitly defined that method.",
      "Reasoning about memory: shared prototype methods cost one function per class, not one per instance.",
      "Recognizing why own properties (like an instance field) shadow a same-named prototype method.",
      "Understanding how class syntax and Object.create both build on this same underlying mechanism.",
    ],
    relatedProblemIds: ["js-s14-007", "js-s14-002", "js-classes-007", "js-s14-005"],
    visual: "prototypes-inheritance",
    furtherReading: [
      { label: "MDN: Object prototypes", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Object_prototypes" },
    ],
  },
  {
    slug: "es6-classes",
    track: "javascript",
    topic: "Object-Oriented Programming",
    title: "ES6 Classes",
    oneLiner: "A class is syntax on top of a constructor function and its prototype, not a new kind of object.",
    definition:
      "The `class` keyword, introduced in ES6, is syntactic sugar over the constructor function and prototype pattern JavaScript already had. Writing `class Dog { constructor(name) { this.name = name; } bark() { return this.name + \" barks\"; } }` produces the same shape under the hood as a `function Dog(name)` with `this.name = name`, plus a `bark` method assigned to `Dog.prototype`. Every method written inside the class body, other than the constructor, is placed on the prototype automatically, so all instances share one copy instead of getting their own.\n\nCalling `new Dog(\"Rex\")` creates a new plain object, sets its internal prototype to `Dog.prototype`, runs the constructor with `this` bound to that new object, and returns it. `class Puppy extends Dog` builds `Puppy.prototype` with `Dog.prototype` as its own prototype, chaining the two, and `super(name)` inside `Puppy`'s constructor calls `Dog`'s constructor first. Classes add conveniences the older pattern does not have for free, like a body that throws if called without `new`, and methods that are non-enumerable by default, but the underlying mechanism is the same prototype chain.",
    examples: [
      {
        code: "class Dog {\n  constructor(name) {\n    this.name = name;\n  }\n  bark() {\n    return this.name + \" barks\";\n  }\n}\nconst rex = new Dog(\"Rex\");\nrex.bark(); // \"Rex barks\"\ntypeof Dog.prototype.bark; // \"function\"",
        explanation: "bark is defined in the class body but ends up on Dog.prototype, exactly where a hand-written prototype method would live.",
      },
      {
        code: "class Animal {\n  constructor(name) { this.name = name; }\n  speak() { return this.name + \" makes a sound\"; }\n}\nclass Cat extends Animal {\n  speak() { return this.name + \" meows\"; }\n}\nnew Cat(\"Milo\").speak(); // \"Milo meows\"",
        explanation: "extends links Cat.prototype to Animal.prototype, and Cat's own speak on its prototype shadows Animal's version for Cat instances.",
      },
      {
        code: "class Counter {\n  static instances = 0;\n  constructor() {\n    Counter.instances++;\n  }\n}\nnew Counter();\nnew Counter();\nCounter.instances; // 2",
        explanation: "static fields and methods live on the class itself, Counter, rather than on Counter.prototype or on individual instances.",
      },
    ],
    realWorldUseCases: [
      "Modeling domain objects like ShoppingCart or BankAccount with clear constructors and shared methods.",
      "Building inheritance hierarchies, like a base Shape class with Square and Rect subclasses overriding area().",
      "Reading unfamiliar codebases that mix class syntax with older constructor-function code, knowing they compile to the same thing.",
      "Using static methods for utilities that belong to the class itself rather than to any one instance.",
    ],
    relatedProblemIds: ["js-classes-001", "js-classes-004", "js-classes-005", "js-s14-005"],
    visual: "es6-classes",
    furtherReading: [
      { label: "MDN: Classes", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes" },
    ],
  },
  {
    slug: "getters-setters",
    track: "javascript",
    topic: "Object-Oriented Programming",
    title: "Getters and Setters",
    oneLiner: "A getter runs code when a property is read, and a setter runs code when a property is assigned.",
    definition:
      "A getter, defined with `get propName()`, and a setter, defined with `set propName(value)`, let a property look like a plain field from the outside while actually running a function underneath. Reading `obj.propName` invokes the getter and uses its return value, no parentheses needed, and writing `obj.propName = value` invokes the setter with `value` as its argument instead of just storing it directly.\n\nThis makes two things possible that a plain property cannot do. A getter can compute a value on the fly from other data, like a `fullName` getter that joins `first` and `last`, so there is nothing to keep in sync. A setter can validate or transform an incoming value before it is stored, like rejecting a negative age, throwing, or clamping it, so invalid state never gets written to the backing field. By convention the real data is kept in a differently named property, often prefixed with an underscore like `_age`, since a setter named `age` that also tries to write directly to `this.age` would call itself again and overflow the call stack.",
    examples: [
      {
        code: "class Temperature {\n  constructor(celsius) {\n    this.celsius = celsius;\n  }\n  get fahrenheit() {\n    return this.celsius * 9 / 5 + 32;\n  }\n}\nnew Temperature(20).fahrenheit; // 68, computed on read, no parentheses",
        explanation: "fahrenheit is not stored anywhere, the getter recomputes it from celsius every time it is read.",
      },
      {
        code: "class Account {\n  #balance = 0;\n  get balance() {\n    return this.#balance;\n  }\n  set balance(value) {\n    if (value < 0) throw new Error(\"Balance cannot be negative\");\n    this.#balance = value;\n  }\n}\nconst a = new Account();\na.balance = 100; // setter runs, passes validation\na.balance; // 100\na.balance = -5; // throws, #balance stays 100",
        explanation: "Assigning to balance routes through the setter, which validates the incoming value before touching the private #balance field, so an invalid assignment never changes the stored value.",
      },
      {
        code: "const obj = {\n  _name: \"Ada\",\n  get name() { return this._name; },\n  set name(value) { this._name = value.trim(); },\n};\nobj.name = \"  Grace \";\nobj.name; // \"Grace\", whitespace trimmed by the setter",
        explanation: "The setter transforms the incoming string before storing it, and the getter always reads back the already-cleaned value.",
      },
    ],
    realWorldUseCases: [
      "Validating a value, like rejecting a negative age or an empty username, before it is ever stored.",
      "Exposing a computed, always-up-to-date value, like a fullName or a total, without a separate field to keep in sync.",
      "Normalizing input on write, like trimming whitespace or lowercasing an email, so callers cannot forget to do it.",
      "Guarding a private field so external code can only change it through a validated setter, never directly.",
    ],
    relatedProblemIds: ["js-s14-003", "js-classes-006", "js-s14-006"],
    visual: "getters-setters",
    furtherReading: [
      { label: "MDN: get", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get" },
    ],
  },
  {
    slug: "the-event-loop",
    track: "javascript",
    topic: "Asynchronous JavaScript",
    title: "The Event Loop",
    oneLiner: "The engine finishes the current script, drains every pending microtask, then runs one task from the macrotask queue, on repeat.",
    definition:
      "JavaScript runs on a single thread with one call stack, so it can only execute one piece of code at a time. Asynchronous work, like timers, network responses, and promise resolutions, does not run on that stack while your code is busy; instead the browser or Node schedules the associated callback to run later and holds it in a queue until the stack is free. The event loop is the mechanism that watches the call stack and, once it is empty, decides which queued callback gets to run next.\n\nThere are two kinds of queues involved. The microtask queue holds jobs like resolved-promise `.then`/`.catch`/`.finally` callbacks and `queueMicrotask` callbacks. The macrotask queue, sometimes called the task or callback queue, holds things like `setTimeout`, `setInterval`, and I/O callbacks. Every time the call stack becomes empty, the event loop first drains the entire microtask queue, running every microtask, including any new ones those microtasks schedule, before it looks at the macrotask queue at all. Only once the microtask queue is completely empty does it pull one macrotask off the queue, run it to completion, and then repeat the cycle: drain microtasks again, then take the next macrotask.\n\nThis ordering explains a common surprise: a `setTimeout(fn, 0)` does not run immediately after zero milliseconds, it runs after all synchronous code and all microtasks scheduled up to that point, because the timer callback has to wait its turn in the macrotask queue while promise callbacks jump the line in the microtask queue.",
    examples: [
      {
        code: "console.log(1);\nsetTimeout(() => console.log(4), 0);\nPromise.resolve().then(() => console.log(3));\nconsole.log(2);\n// logs: 1, 2, 3, 4",
        explanation: "1 and 2 run synchronously on the call stack. The Promise callback becomes a microtask and the setTimeout callback becomes a macrotask; once the stack empties, the microtask (3) drains before the single macrotask (4) gets a turn.",
      },
      {
        code: "Promise.resolve().then(() => {\n  console.log(\"microtask A\");\n  Promise.resolve().then(() => console.log(\"microtask B\"));\n});\nsetTimeout(() => console.log(\"macrotask\"), 0);\n// logs: microtask A, microtask B, macrotask",
        explanation: "Microtask A schedules a brand new microtask B while it runs. The event loop keeps draining the microtask queue until it is completely empty, so B also runs before the waiting macrotask gets a turn.",
      },
    ],
    realWorldUseCases: [
      "Explaining why a setTimeout(fn, 0) runs after promise callbacks that were scheduled after it.",
      "Debugging UI updates that seem to lag one tick behind a promise resolution.",
      "Understanding why a long chain of .then() calls can starve macrotasks like rendering or timers if it never stops producing new microtasks.",
      "Reasoning about the order of async/await code relative to setTimeout and DOM events.",
    ],
    relatedProblemIds: ["js-async-003", "js-async-005", "js-s16-003"],
    visual: "the-event-loop",
    furtherReading: [
      { label: "MDN: The event loop", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop" },
    ],
  },
  {
    slug: "promises",
    track: "javascript",
    topic: "Asynchronous JavaScript",
    title: "Promises",
    oneLiner: "A promise is a placeholder for a value that starts pending and settles exactly once, to fulfilled or rejected.",
    definition:
      "A `Promise` represents the eventual result of an asynchronous operation. It starts in the pending state and settles exactly one time, either to fulfilled, meaning the operation succeeded and produced a value, or rejected, meaning the operation failed and produced a reason. Once a promise settles, its state and value are locked in forever: calling `.then()` on an already-fulfilled promise, or `.catch()` on an already-rejected one, still runs the handler, just as if the settlement had just happened.\n\n`.then(onFulfilled, onRejected)` registers callbacks for the two outcomes, `.catch(onRejected)` is shorthand for `.then(undefined, onRejected)`, and `.finally(onSettled)` runs regardless of which way the promise settled, without receiving the value or reason. Each of these methods returns a new promise, which is what makes chaining possible: whatever a handler returns becomes the fulfillment value of that new promise, and a thrown error inside a handler becomes its rejection reason.\n\nHandlers registered with `.then`, `.catch`, and `.finally` never run synchronously, even if the promise is already settled when you attach them; they are always scheduled as microtasks, which is why a `.then()` callback runs after all currently running synchronous code, but before any setTimeout callback.",
    examples: [
      {
        code: "const p = new Promise((resolve, reject) => {\n  const ok = Math.random() > 0.5;\n  if (ok) resolve(\"done\");\n  else reject(new Error(\"failed\"));\n});\np.then((value) => console.log(\"fulfilled:\", value))\n .catch((err) => console.log(\"rejected:\", err.message));",
        explanation: "The executor settles the promise once, to fulfilled or rejected. Only the matching handler runs, .then's callback for a resolve, .catch's callback for a reject, never both.",
      },
      {
        code: "Promise.resolve(1)\n  .then((n) => n + 1)\n  .then((n) => n * 10)\n  .then((n) => console.log(n)); // 20",
        explanation: "Each .then returns a new promise fulfilled with whatever the callback returns, so the value flows through the chain from one handler to the next.",
      },
    ],
    realWorldUseCases: [
      "Wrapping a fetch() call so callers can .then() the parsed response or .catch() a network failure.",
      "Chaining dependent asynchronous steps, like reading a file then parsing then validating, without nesting callbacks.",
      "Using .finally() to hide a loading spinner regardless of whether a request succeeded or failed.",
      "Combining several independent promises with Promise.all or Promise.allSettled.",
    ],
    relatedProblemIds: ["js-async-004", "js-async-007", "js-s16-002", "js-errors-005"],
    visual: "promises",
    furtherReading: [
      { label: "MDN: Promise", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise" },
    ],
  },
  {
    slug: "async-await",
    track: "javascript",
    topic: "Asynchronous JavaScript",
    title: "Async/Await",
    oneLiner: "await pauses an async function until a promise settles, without blocking the rest of the program.",
    definition:
      "The `async` keyword turns a function into one that always returns a promise; whatever it returns becomes the fulfillment value, and a thrown error becomes the rejection reason. Inside an async function, the `await` keyword can be placed in front of a promise, or any thenable, to pause that function's execution until the promise settles.\n\nPausing only affects that one function's frame, not the whole program: control returns to whatever called the async function while the awaited promise is still pending, so other code keeps running normally. When the awaited promise settles, the async function's frame resumes exactly where it left off. If the promise fulfilled, await evaluates to the fulfillment value, and if it rejected, await throws that rejection reason, which a surrounding try/catch can catch.\n\nasync/await is built on top of promises, it is syntax that lets promise-based code read like sequential, synchronous code, but it does not change the underlying scheduling: resuming an async function after an await still happens as a microtask, in the same event loop that runs .then() callbacks.",
    examples: [
      {
        code: "async function getUser(id) {\n  const response = await fetch(`/api/users/${id}`);\n  const user = await response.json();\n  return user;\n}",
        explanation: "Each await pauses getUser's frame until the fetch and then the JSON parsing settle; the calling code was free to keep running while getUser was paused.",
      },
      {
        code: "async function safeFetch(url) {\n  try {\n    const res = await fetch(url);\n    return await res.json();\n  } catch (err) {\n    console.log(\"request failed:\", err.message);\n    return null;\n  }\n}",
        explanation: "If the awaited fetch or json() call rejects, await throws that rejection inside safeFetch, and the try/catch handles it just like a synchronous error.",
      },
    ],
    realWorldUseCases: [
      "Writing sequential-looking code for a series of dependent API calls instead of nesting .then() callbacks.",
      "Wrapping awaited calls in try/catch to handle network or parsing failures in one place.",
      "Awaiting Promise.all([...]) to run independent requests concurrently while still writing linear code.",
      "Pausing a function until a database query or file read resolves without blocking the rest of the app.",
    ],
    relatedProblemIds: ["js-async-001", "js-async-008", "js-s16-004"],
    visual: "async-await",
    furtherReading: [
      { label: "MDN: async function", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function" },
    ],
  },
  {
    slug: "microtasks-vs-macrotasks",
    track: "javascript",
    topic: "Asynchronous JavaScript",
    title: "Microtasks vs. Macrotasks",
    oneLiner: "Microtasks, like promise callbacks, always run before the next macrotask, like a setTimeout, even a zero-delay one.",
    definition:
      "The event loop pulls work from two different queues. The macrotask queue, sometimes called the task or callback queue, holds things like setTimeout and setInterval callbacks, UI events, and I/O callbacks. The microtask queue holds promise callbacks, `.then`, `.catch`, `.finally`, and jobs scheduled with `queueMicrotask`.\n\nThe two queues are not treated equally. After the currently running script finishes and the call stack empties, the event loop drains the microtask queue completely, running every microtask currently in it, plus any new ones those microtasks add along the way, before it is allowed to touch the macrotask queue. Only when the microtask queue is fully empty does the loop take a single macrotask, run it, and then drain microtasks again before considering another macrotask.\n\nThis is why `Promise.resolve().then(fn)` reliably runs before `setTimeout(fn, 0)`, even though both were scheduled at essentially the same moment: the promise callback goes into the higher-priority microtask queue, while the timer callback has to wait in the macrotask queue behind every pending microtask.",
    examples: [
      {
        code: "setTimeout(() => console.log(\"timeout\"), 0);\nPromise.resolve().then(() => console.log(\"promise\"));\n// logs: promise, timeout",
        explanation: "Both are scheduled back to back, but the promise callback is a microtask and always drains before the timer callback, a macrotask, gets its turn.",
      },
      {
        code: "queueMicrotask(() => console.log(\"micro\"));\nsetTimeout(() => console.log(\"macro\"), 0);\nconsole.log(\"sync\");\n// logs: sync, micro, macro",
        explanation: "The synchronous log runs first. Then the microtask queue drains (micro), and only after it is empty does the event loop take the setTimeout callback (macro).",
      },
    ],
    realWorldUseCases: [
      "Predicting whether a setTimeout(fn, 0) will run before or after a chain of .then() callbacks.",
      "Using queueMicrotask to defer work until right after the current synchronous code, but before any timers or rendering.",
      "Debugging why UI updates queued in a promise chain appear before a scheduled timer fires.",
      "Understanding why a runaway chain of microtasks can delay timers and I/O from ever getting a turn.",
    ],
    relatedProblemIds: ["js-async-005", "js-async-006", "js-s16-001"],
    visual: "microtasks-vs-macrotasks",
    furtherReading: [
      { label: "MDN: In depth: Microtasks and the JavaScript runtime environment", url: "https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide" },
    ],
  },
  {
    slug: "es-modules",
    track: "javascript",
    topic: "Modern JavaScript",
    title: "ES Modules",
    oneLiner: "Each file is its own module with its own scope, and export/import wire live values between files, not copies.",
    definition:
      "An ES module is just a JavaScript file that uses export to expose bindings and import to read bindings exposed by other files. Each module has its own top level scope, so a variable declared in one file is not visible in another unless it is explicitly exported. A module can export multiple named values with export, and at most one default export with export default, which is meant to be the file's main thing and is imported without curly braces.\n\nAn import is a live, read only binding to the exporting module's variable, not a copied snapshot taken at import time. If the exporting module later reassigns an exported let, every module that imported it sees the updated value the next time it reads that binding, because they are all looking at the same underlying variable. Modules are also singletons: no matter how many files import a given module, its code runs once, the first time it is loaded, and every importer shares that same single instance. On top of that, module code always runs in strict mode automatically, even without a \"use strict\" directive.",
    examples: [
      {
        code: "// math.js\nexport const PI = 3.14159;\nexport function double(n) {\n  return n * 2;\n}\n\n// app.js\nimport { PI, double } from \"./math.js\";\ndouble(PI); // 6.28318",
        explanation: "math.js exposes two named exports. app.js imports them by name inside curly braces, matching the names they were exported with.",
      },
      {
        code: "// logger.js\nexport default function log(msg) {\n  console.log(msg);\n}\n\n// app.js\nimport log from \"./logger.js\";\nlog(\"ready\"); // ready",
        explanation: "logger.js has one default export, so app.js imports it without curly braces and can name it anything on the way in.",
      },
      {
        code: "// counter.js\nexport let total = 0;\nexport function increment() {\n  total++;\n}\n\n// app.js\nimport { total, increment } from \"./counter.js\";\ntotal; // 0\nincrement();\ntotal; // 1",
        explanation: "increment() mutates counter.js's total. Because the import is a live binding and not a copy, app.js reads the updated value of total after the call, without importing anything new.",
      },
    ],
    realWorldUseCases: [
      "Splitting an app into focused files (a math helper, a logger, a set of constants) instead of one giant script.",
      "Sharing a single configuration object or cache across every file that imports it, since modules run once and are shared.",
      "Choosing a default export for a file's one main component or function, and named exports for its smaller supporting pieces.",
      "Bundlers and build tools like webpack, Rollup, and Vite relying on static export/import syntax to tree shake unused code.",
    ],
    relatedProblemIds: ["js-s17-006", "js-s17-001", "js-s17-003"],
    visual: "es-modules",
    furtherReading: [
      { label: "MDN: JavaScript modules", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules" },
    ],
  },
];
