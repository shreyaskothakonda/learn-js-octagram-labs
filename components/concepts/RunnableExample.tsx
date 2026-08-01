"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { runScript } from "@/lib/runner/run-script";

export function RunnableExample({
  code,
  highlighted,
  explanation,
}: {
  code: string;
  highlighted: string;
  explanation: string;
}) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(code);
  const [output, setOutput] = useState<{ logs: string[]; error?: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleRun() {
    setBusy(true);
    const r = await runScript(editing ? text : code);
    setOutput(r);
    setBusy(false);
  }

  function handleEditToggle() {
    setEditing((v) => !v);
  }

  function handleCopy() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(editing ? text : code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  }

  function handleReset() {
    setText(code);
    setEditing(false);
    setOutput(null);
  }

  const rows = Math.max(3, code.split("\n").length);

  return (
    <div>
      <div className="rounded-lg border overflow-hidden">
        {editing ? (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            spellCheck={false}
            rows={rows}
            className="w-full resize-y bg-muted/40 p-3 font-mono text-sm outline-none"
            aria-label="Edit example code"
          />
        ) : (
          <div
            className="shiki-wrap overflow-x-auto p-3 text-sm"
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />
        )}
        <div className="flex items-center gap-2 border-t p-2">
          <Button size="sm" variant="outline" onClick={handleRun} disabled={busy}>
            {busy ? "Running..." : "Run"}
          </Button>
          <Button size="sm" variant="outline" onClick={handleEditToggle}>
            {editing ? "Done" : "Edit"}
          </Button>
          <Button size="sm" variant="outline" onClick={handleCopy}>
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button size="sm" variant="outline" onClick={handleReset}>
            Reset
          </Button>
        </div>
        {output !== null && (
          <div className="border-t p-3 text-sm font-mono">
            {output.error ? (
              <div className="text-[var(--color-destructive)]">
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Error</div>
                <div className="whitespace-pre-wrap">{output.error}</div>
              </div>
            ) : output.logs.length ? (
              <div>
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Output</div>
                {output.logs.map((log, i) => (
                  <div key={i} className="whitespace-pre-wrap">
                    {log}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Ran with no console output.</p>
            )}
          </div>
        )}
      </div>
      {explanation && <p className="text-sm text-muted-foreground mt-1">{explanation}</p>}
    </div>
  );
}
