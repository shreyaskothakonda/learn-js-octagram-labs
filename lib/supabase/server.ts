import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseEnv } from "./env";

export async function createClient() {
  const cookieStore = await cookies();
  const { url, key } = supabaseEnv();
  return createServerClient(url!, key!, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (toSet) => {
        try {
          toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // called from a Server Component, where middleware refreshes the session
        }
      },
    },
  });
}

// Reads the signed-in user without throwing when Supabase isn't configured.
// Returns null instead, so server components render a signed-out view rather
// than crashing the whole page.
export async function getOptionalUser() {
  const { url, key } = supabaseEnv();
  if (!url || !key) return null;
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch {
    return null;
  }
}
