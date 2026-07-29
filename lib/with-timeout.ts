/**
 * Resolves to the promise's value, or `undefined` if it does not settle within
 * `ms` (or if it rejects). Never rejects. Use it to bound a slow network call
 * so one hanging dependency cannot stall the whole request: in the auth
 * middleware a stale cookie can trigger a Supabase token refresh, and if
 * Supabase is slow or unreachable that call would otherwise hang until Vercel
 * kills the middleware with a 504 (MIDDLEWARE_INVOCATION_TIMEOUT).
 */
export function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T | undefined> {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(undefined), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      () => {
        clearTimeout(timer);
        resolve(undefined);
      },
    );
  });
}
