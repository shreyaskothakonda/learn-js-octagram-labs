// Resolves the public Supabase config. Accepts the current key name
// (NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) and falls back to the legacy
// NEXT_PUBLIC_SUPABASE_ANON_KEY so the app works regardless of which name
// is configured in the deployment environment.
export function supabaseEnv(): { url: string | undefined; key: string | undefined } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return { url, key };
}
