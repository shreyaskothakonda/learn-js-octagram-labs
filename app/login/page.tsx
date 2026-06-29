"use client";
import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const supabaseRef = useRef<SupabaseClient | null>(null);
  function getSupabase() {
    if (!supabaseRef.current) supabaseRef.current = createClient();
    return supabaseRef.current;
  }

  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault();
    await getSupabase().auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    });
    setSent(true);
  }
  async function oauth(provider: "github" | "google") {
    await getSupabase().auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
  }

  return (
    <div className="mx-auto max-w-sm p-8 space-y-4">
      <h1 className="text-2xl font-bold">Sign in</h1>
      {sent ? (
        <p>Check your email for a magic link.</p>
      ) : (
        <form onSubmit={sendMagicLink} className="space-y-2">
          <input className="w-full border rounded px-3 py-2 bg-transparent" type="email"
            placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <button className="w-full rounded bg-blue-600 text-white py-2" type="submit">Send magic link</button>
        </form>
      )}
      <div className="flex gap-2">
        <button onClick={() => oauth("github")} className="flex-1 rounded border py-2">GitHub</button>
        <button onClick={() => oauth("google")} className="flex-1 rounded border py-2">Google</button>
      </div>
    </div>
  );
}
