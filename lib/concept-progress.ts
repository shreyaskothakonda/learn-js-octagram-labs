"use client";
import { useSyncExternalStore } from "react";

const STORAGE_KEY = "learned-concepts";

function readRaw(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function parse(raw: string | null): Set<string> {
  if (!raw) return new Set();
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return new Set(parsed.filter((s) => typeof s === "string"));
    return new Set();
  } catch {
    return new Set();
  }
}

export function getLearned(): Set<string> {
  if (typeof window === "undefined") return new Set();
  return parse(readRaw());
}

export function isLearned(slug: string): boolean {
  return getLearned().has(slug);
}

export function toggleLearned(slug: string): void {
  if (typeof window === "undefined") return;
  const learned = getLearned();
  if (learned.has(slug)) learned.delete(slug);
  else learned.add(slug);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...learned]));
  } catch {}
  window.dispatchEvent(new Event("learned-change"));
}

// Module-level cache so getSnapshot returns a stable reference when the
// underlying raw string hasn't changed, as required by useSyncExternalStore.
let cache: { raw: string | null; set: Set<string> } = { raw: undefined as unknown as string | null, set: new Set() };
const EMPTY_SET: Set<string> = new Set();

function getSnapshot(): Set<string> {
  const raw = readRaw();
  if (raw !== cache.raw) {
    cache = { raw, set: parse(raw) };
  }
  return cache.set;
}

function getServerSnapshot(): Set<string> {
  return EMPTY_SET;
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("learned-change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("learned-change", callback);
  };
}

export function useLearnedConcepts(): Set<string> {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
