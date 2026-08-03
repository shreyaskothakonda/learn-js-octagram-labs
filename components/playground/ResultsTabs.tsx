"use client";
import type { RunResult } from "@/lib/runner/types";
import type { Problem } from "@/content/types";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TestResults } from "./TestResults";
import { ConsoleOutput } from "./ConsoleOutput";
import { HtmlView } from "./HtmlView";

export function ResultsTabs({ problem, result, srcdoc }: { problem: Problem; result: RunResult | null; srcdoc: string | null }) {
  const showHtml = problem.kind === "dom";
  return (
    <Tabs defaultValue="tests" className="flex flex-col h-full border-l gap-0 min-h-0">
      <TabsList className="m-2 self-start">
        <TabsTrigger value="tests">Tests</TabsTrigger>
        <TabsTrigger value="console">Console</TabsTrigger>
        {showHtml && <TabsTrigger value="html">HTML View</TabsTrigger>}
      </TabsList>
      <div className="flex-1 overflow-auto border-t min-h-0" aria-live="polite">
        <TabsContent value="tests"><TestResults result={result} problem={problem} /></TabsContent>
        <TabsContent value="console"><ConsoleOutput result={result} /></TabsContent>
        {showHtml && <TabsContent value="html" className="h-full"><HtmlView srcdoc={srcdoc} /></TabsContent>}
      </div>
    </Tabs>
  );
}
