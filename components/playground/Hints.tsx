"use client";
import { useState } from "react";

export function Hints({ hints }: { hints: string[] }) {
  const [shown, setShown] = useState(0);
  if (hints.length === 0) return null;
  return (
    <div className="text-sm">
      <h3 className="font-semibold mb-1">Hints</h3>
      {shown > 0 && (
        <ul className="list-disc pl-5 space-y-1 mb-1">
          {hints.slice(0, shown).map((h, i) => <li key={i}>{h}</li>)}
        </ul>
      )}
      {shown < hints.length && (
        <button onClick={() => setShown(shown + 1)} className="text-blue-500 underline">
          {shown === 0 ? "Show a hint" : `Show another hint (${shown}/${hints.length})`}
        </button>
      )}
    </div>
  );
}
