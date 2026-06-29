"use client";
import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabaseRef = useRef<SupabaseClient | null>(null);
  function getSupabase() {
    if (!supabaseRef.current) supabaseRef.current = createClient();
    return supabaseRef.current;
  }
  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const { error } = await getSupabase().auth.signInWithOtp({
      email, options: { emailRedirectTo: `${location.origin}/auth/callback` },
    });
    if (error) setError(error.message); else setSent(true);
  }
  return (
    <div className="mx-auto w-full max-w-sm p-8 space-y-4">
      <h1 className="text-2xl font-bold">Sign in</h1>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {sent ? (
        <p className="text-sm text-muted-foreground">Check your email for a magic link.</p>
      ) : (
        <form onSubmit={sendMagicLink} className="space-y-3">
          <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Button type="submit" className="w-full">Send magic link</Button>
        </form>
      )}
    </div>
  );
}
