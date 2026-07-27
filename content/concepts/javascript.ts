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
];
