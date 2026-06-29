# Supabase Setup

1. Create a project at supabase.com.
2. In Project Settings → API, copy the Project URL and anon public key into `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. In the SQL Editor, run `supabase/migrations/0001_init.sql`.
4. In Authentication → Providers, enable Email (magic link) and optionally GitHub/Google
   (add their OAuth client id/secret). Set the Site URL and redirect URLs to your
   local (`http://localhost:3000`) and production domains.
