import { describe, it, expect, afterEach } from "vitest";
import { supabaseEnv } from "./env";

const KEYS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
] as const;
const saved = Object.fromEntries(KEYS.map((k) => [k, process.env[k]]));

afterEach(() => {
  for (const k of KEYS) {
    if (saved[k] === undefined) delete process.env[k];
    else process.env[k] = saved[k];
  }
});

function reset() {
  for (const k of KEYS) delete process.env[k];
}

describe("supabaseEnv", () => {
  it("uses the publishable key when set", () => {
    reset();
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://x.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "pub";
    expect(supabaseEnv()).toEqual({ url: "https://x.supabase.co", key: "pub" });
  });
  it("falls back to the legacy anon key name", () => {
    reset();
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://x.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon";
    expect(supabaseEnv().key).toBe("anon");
  });
  it("prefers publishable over the legacy name when both are set", () => {
    reset();
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "pub";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon";
    expect(supabaseEnv().key).toBe("pub");
  });
  it("returns an undefined key when neither name is set", () => {
    reset();
    expect(supabaseEnv().key).toBeUndefined();
  });
});
