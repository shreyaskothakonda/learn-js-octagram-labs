export function mapWorkerResult(data: { consoleLogs?: string[]; error?: string }): {
  logs: string[];
  error?: string;
} {
  return { logs: data.consoleLogs ?? [], error: data.error };
}

export function runScript(code: string, timeoutMs = 3000): Promise<{ logs: string[]; error?: string }> {
  return new Promise((resolve) => {
    const worker = new Worker("/runner-worker.js");
    const timer = setTimeout(() => {
      worker.terminate();
      resolve({ logs: [], error: "Execution timed out" });
    }, timeoutMs);

    worker.onmessage = (e: MessageEvent<{ consoleLogs?: string[]; error?: string }>) => {
      clearTimeout(timer);
      worker.terminate();
      resolve(mapWorkerResult(e.data));
    };
    worker.onerror = () => {
      clearTimeout(timer);
      worker.terminate();
      resolve({ logs: [], error: "Execution timed out" });
    };
    worker.postMessage({ kind: "script", code });
  });
}
