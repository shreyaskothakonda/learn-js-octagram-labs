import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export async function Nav() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return (
    <nav className="flex items-center gap-4 px-6 h-12 border-b text-sm">
      <Link href="/" className="font-semibold">Octagram Labs</Link>
      <Link href="/learn/javascript">JavaScript</Link>
      <Link href="/learn/data-structures">Data Structures</Link>
      <div className="ml-auto flex gap-4">
        {user ? <Link href="/dashboard">Dashboard</Link> : <Link href="/login">Sign in</Link>}
      </div>
    </nav>
  );
}
