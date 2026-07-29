import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { supabaseEnv } from "@/lib/supabase/env";
import { withTimeout } from "@/lib/with-timeout";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const { url, key } = supabaseEnv();
  // Without Supabase config there is no session to refresh. Skip rather than
  // throw, so a missing/misnamed env var never 500s every route.
  if (!url || !key) return response;

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (toSet) => {
        toSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        toSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  // Bound the auth refresh: a request carrying a stale Supabase cookie makes
  // getUser() attempt a token refresh, and if Supabase is slow or unreachable
  // that call hangs until the middleware is killed (504). Failing open here
  // serves the page (unauthenticated for this request) instead of timing out.
  await withTimeout(supabase.auth.getUser(), 2500);
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
