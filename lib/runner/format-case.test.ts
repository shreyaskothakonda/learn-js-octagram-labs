import { describe, it, expect } from "vitest";
import { formatValue, formatCall, formatDuration } from "./format-case";

describe("formatDuration", () => {
  it("rounds whole milliseconds", () => {
    expect(formatDuration(12.4)).toBe("12 ms");
    expect(formatDuration(1)).toBe("1 ms");
  });
  it("keeps sub-millisecond precision", () => {
    expect(formatDuration(0.42)).toBe("0.42 ms");
  });
  it("does not report a clamped zero as 0 ms", () => {
    expect(formatDuration(0)).toBe("under 0.1 ms");
  });
});

describe("formatValue", () => {
  it("formats plain JSON values", () => {
    expect(formatValue([1, 2, 3])).toBe("[1,2,3]");
    expect(formatValue({ a: 1 })).toBe('{"a":1}');
    expect(formatValue("hi")).toBe('"hi"');
    expect(formatValue(null)).toBe("null");
    expect(formatValue(6)).toBe("6");
  });
  it("shows undefined rather than dropping it", () => {
    expect(formatValue(undefined)).toBe("undefined");
  });
  it("shows non-finite numbers by name instead of null", () => {
    expect(formatValue(NaN)).toBe("NaN");
    expect(formatValue(Infinity)).toBe("Infinity");
    expect(formatValue(-Infinity)).toBe("-Infinity");
  });
});

describe("formatCall", () => {
  it("renders the call that was made", () => {
    expect(formatCall("sum", [[1, 2, 3]])).toBe("sum([1,2,3])");
    expect(formatCall("add", [1, 2])).toBe("add(1, 2)");
  });
  it("renders an empty argument list when there is no input", () => {
    expect(formatCall("noop", undefined)).toBe("noop()");
    expect(formatCall("noop", [])).toBe("noop()");
  });
});
