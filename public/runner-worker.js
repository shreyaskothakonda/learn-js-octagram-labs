// Mirrors lib/runner/run-function.ts but as plain JS for the Worker context.
function deepEqual(a, b) {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (a === null || b === null) return a === b;
  if (typeof a !== "object") return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const ak = Object.keys(a), bk = Object.keys(b);
  if (ak.length !== bk.length) return false;
  return ak.every((k) => deepEqual(a[k], b[k]));
}

self.onmessage = (e) => {
  const { kind, code, functionName, testCases } = e.data;
  const start = performance.now();
  const consoleLogs = [];
  const fakeConsole = {
    log: (...args) => consoleLogs.push(args.map((a) => (typeof a === "string" ? a : JSON.stringify(a))).join(" ")),
  };

  if (kind === "script") {
    try {
      new Function("console", code)(fakeConsole);
      self.postMessage({ consoleLogs, runtimeMs: Math.round((performance.now() - start) * 100) / 100 });
    } catch (err) {
      self.postMessage({ consoleLogs, error: String((err && err.message) || err), runtimeMs: Math.round((performance.now() - start) * 100) / 100 });
    }
    return;
  }

  if (kind === "harness") {
    const caseResults = testCases.map((tc, index) => {
      const caseStart = performance.now();
      const base = { index, run: tc.run, hidden: !!tc.hidden, description: tc.description, expected: tc.expected };
      try {
        const actual = new Function("console", `${code}\n${tc.run}`)(fakeConsole);
        return { ...base, passed: deepEqual(actual, tc.expected), actual, durationMs: Math.round((performance.now() - caseStart) * 100) / 100 };
      } catch (err) {
        return { ...base, passed: false, error: String((err && err.message) || err), durationMs: Math.round((performance.now() - caseStart) * 100) / 100 };
      }
    });
    self.postMessage({ caseResults, consoleLogs, runtimeMs: Math.round((performance.now() - start) * 100) / 100 });
    return;
  }

  let fn;
  try {
    fn = new Function("console", `${code}; return ${functionName};`)(fakeConsole);
    if (typeof fn !== "function") {
      self.postMessage({ caseResults: [], consoleLogs, error: `${functionName} is not defined`, runtimeMs: Math.round((performance.now() - start) * 100) / 100 });
      return;
    }
  } catch (err) {
    self.postMessage({ caseResults: [], consoleLogs, error: String(err && err.message || err), runtimeMs: Math.round((performance.now() - start) * 100) / 100 });
    return;
  }
  const caseResults = testCases.map((tc, index) => {
    const caseStart = performance.now();
    const base = { index, input: tc.input || [], hidden: !!tc.hidden, expected: tc.expected };
    try {
      const actual = fn(...(tc.input || []));
      return { ...base, passed: deepEqual(actual, tc.expected), actual, durationMs: Math.round((performance.now() - caseStart) * 100) / 100 };
    } catch (err) {
      return { ...base, passed: false, error: String(err && err.message || err), durationMs: Math.round((performance.now() - caseStart) * 100) / 100 };
    }
  });
  self.postMessage({ caseResults, consoleLogs, runtimeMs: Math.round((performance.now() - start) * 100) / 100 });
};
