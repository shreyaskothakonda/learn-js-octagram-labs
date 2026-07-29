import { describe, it, expect } from "vitest";
import { withTimeout } from "./with-timeout";

describe("withTimeout", () => {
  it("returns the resolved value when the promise settles in time", async () => {
    const result = await withTimeout(Promise.resolve("ok"), 50);
    expect(result).toBe("ok");
  });

  it("resolves to undefined when the promise exceeds the timeout", async () => {
    const never = new Promise<string>(() => {}); // never settles
    const result = await withTimeout(never, 10);
    expect(result).toBeUndefined();
  });

  it("resolves to undefined when the promise rejects", async () => {
    const result = await withTimeout(Promise.reject(new Error("boom")), 50);
    expect(result).toBeUndefined();
  });
});
