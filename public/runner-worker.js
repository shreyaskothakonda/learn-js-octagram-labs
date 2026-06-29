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
  const { code, functionName, testCases } = e.data;
  const start = Date.now();
  const consoleLogs = [];
  const fakeConsole = {
    log: (...args) => consoleLogs.push(args.map((a) => (typeof a === "string" ? a : JSON.stringify(a))).join(" ")),
  };
  let fn;
  try {
    fn = new Function("console", `${code}; return ${functionName};`)(fakeConsole);
    if (typeof fn !== "function") {
      self.postMessage({ caseResults: [], consoleLogs, error: `${functionName} is not defined`, runtimeMs: Date.now() - start });
      return;
    }
  } catch (err) {
    self.postMessage({ caseResults: [], consoleLogs, error: String(err && err.message || err), runtimeMs: Date.now() - start });
    return;
  }
  const caseResults = testCases.map((tc, index) => {
    try {
      const actual = fn(...(tc.input || []));
      return { index, passed: deepEqual(actual, tc.expected), expected: tc.expected, actual };
    } catch (err) {
      return { index, passed: false, expected: tc.expected, error: String(err && err.message || err) };
    }
  });
  self.postMessage({ caseResults, consoleLogs, runtimeMs: Date.now() - start });
};
