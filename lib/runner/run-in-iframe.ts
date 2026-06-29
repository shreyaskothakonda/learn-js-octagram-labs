import type { CaseResult, RunResult } from "./types";
import type { TestCase } from "@/content/types";

/** Builds the srcdoc used for execution: runs all asserts and postMessages results. */
export function buildRunnerSrcdoc(html: string, code: string, testCases: TestCase[]): string {
  const asserts = testCases.map((tc) => ({ description: tc.description ?? "", assert: tc.assert ?? "false" }));
  return `<!doctype html><html><head><meta charset="utf-8"></head><body>
${html}
<script>
(function () {
  var logs = [];
  var _log = console.log;
  console.log = function () {
    logs.push(Array.prototype.slice.call(arguments).map(function (a) {
      return typeof a === "string" ? a : JSON.stringify(a);
    }).join(" "));
    _log.apply(console, arguments);
  };
  var fatal;
  try { ${code} } catch (e) { fatal = String(e && e.message || e); }
  var cases = ${JSON.stringify(asserts)};
  var caseResults = cases.map(function (c, i) {
    try {
      var passed = !!eval(c.assert);
      return { index: i, passed: passed, description: c.description };
    } catch (e) {
      return { index: i, passed: false, description: c.description, error: String(e && e.message || e) };
    }
  });
  parent.postMessage({ __runner: true, caseResults: caseResults, consoleLogs: logs, error: fatal }, "*");
})();
</script>
</body></html>`;
}

/** Builds the srcdoc shown to the user: only the user code + console capture, no assert harness. */
export function buildDisplaySrcdoc(html: string, code: string): string {
  return `<!doctype html><html><head><meta charset="utf-8"></head><body>
${html}
<script>
(function () {
  var _log = console.log;
  console.log = function () {
    _log.apply(console, arguments);
  };
  try { ${code} } catch (e) { console.error(e); }
})();
</script>
</body></html>`;
}

export function runInIframe(
  html: string,
  code: string,
  testCases: TestCase[],
  timeoutMs = 3000,
): Promise<{ result: RunResult; srcdoc: string }> {
  const runnerSrcdoc = buildRunnerSrcdoc(html, code, testCases);
  const displaySrcdoc = buildDisplaySrcdoc(html, code);
  return new Promise((resolve) => {
    const iframe = document.createElement("iframe");
    iframe.setAttribute("sandbox", "allow-scripts");
    iframe.style.display = "none";
    const start = Date.now();

    const timer = setTimeout(() => {
      cleanup();
      resolve({ result: { caseResults: [], consoleLogs: [], error: "Execution timed out", runtimeMs: timeoutMs }, srcdoc: displaySrcdoc });
    }, timeoutMs);

    function onMessage(e: MessageEvent) {
      if (!e.data || !e.data.__runner) return;
      if (e.source !== iframe.contentWindow) return;
      cleanup();
      const caseResults = e.data.caseResults as CaseResult[];
      resolve({
        result: { caseResults, consoleLogs: e.data.consoleLogs ?? [], error: e.data.error, runtimeMs: Date.now() - start },
        srcdoc: displaySrcdoc,
      });
    }
    function cleanup() {
      clearTimeout(timer);
      window.removeEventListener("message", onMessage);
      iframe.remove();
    }

    window.addEventListener("message", onMessage);
    iframe.srcdoc = runnerSrcdoc;
    document.body.appendChild(iframe);
  });
}
