import { describe, it, expect } from "vitest";
import { validateProblem } from "./validate";
import type { Problem } from "./types";

const fnProblem: Problem = {
  id: "js-arrays-001",
  track: "javascript",
  topic: "Arrays",
  difficulty: "easy",
  title: "Sum array",
  prompt: "Return the sum.",
  kind: "function",
  starterCode: "function sum(arr){}",
  solution: "function sum(arr){return arr.reduce((a,b)=>a+b,0)}",
  functionName: "sum",
  testCases: [{ input: [[1, 2, 3]], expected: 6 }],
  resources: [{ label: "MDN reduce", url: "https://mdn" }],
};

const domProblem: Problem = {
  id: "js-dom-001",
  track: "javascript",
  topic: "DOM Manipulation",
  difficulty: "easy",
  title: "Add item",
  prompt: "Append a list item.",
  kind: "dom",
  starterCode: "document.querySelector('ul').innerHTML += '<li>x</li>'",
  solution: "document.querySelector('ul').innerHTML += '<li>x</li>'",
  html: "<ul></ul>",
  testCases: [{ description: "one li exists", assert: "document.querySelectorAll('li').length === 1" }],
  resources: [],
};

describe("validateProblem", () => {
  it("accepts a valid function problem", () => {
    expect(validateProblem(fnProblem)).toEqual([]);
  });
  it("accepts a valid dom problem", () => {
    expect(validateProblem(domProblem)).toEqual([]);
  });
  it("rejects a function problem missing functionName", () => {
    const bad = { ...fnProblem, functionName: undefined };
    expect(validateProblem(bad as Problem)).toContain("function problem missing functionName");
  });
  it("rejects a dom problem missing html", () => {
    const bad = { ...domProblem, html: undefined };
    expect(validateProblem(bad as Problem)).toContain("dom problem missing html");
  });
  it("rejects a problem with no test cases", () => {
    const bad = { ...fnProblem, testCases: [] };
    expect(validateProblem(bad)).toContain("problem has no test cases");
  });
});
