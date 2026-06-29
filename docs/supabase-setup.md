# Supabase Setup

1. Create a project at supabase.com.
2. In Project Settings → API Keys, copy the Project URL and the **publishable** key
   into `.env.local`. (Supabase's newer key format is `sb_publishable_…`; the legacy
   "anon" JWT key still works too. Either way, put the value under the env name the app
   reads, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.)
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`  ← set this to your publishable (or anon) key
   The publishable key is safe to expose in the browser; never put the secret/service_role
   key in any `NEXT_PUBLIC_` variable.
3. In the SQL Editor, run `supabase/migrations/0001_init.sql`. This creates the
   `profiles`, `attempts`, and `progress` tables, enables Row-Level Security on all three,
   and adds owner-only policies scoped `to authenticated` using `(select auth.uid())`.
4. In Authentication → Providers, enable Email (magic link) and optionally GitHub/Google
   (add their OAuth client id/secret). Set the Site URL and redirect URLs to your
   local (`http://localhost:3000`) and production domains, including `/auth/callback`.
5. Verify: sign in via magic link locally, solve a problem (Submit), and check that a row
   appears in `attempts` and `progress` for your user in the Table Editor.
