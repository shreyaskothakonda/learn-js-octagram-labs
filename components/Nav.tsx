import Link from "next/link";
import { getOptionalUser } from "@/lib/supabase/server";
import { SignOutButton } from "./SignOutButton";

export async function Nav() {
  const user = await getOptionalUser();
  return (
    <nav className="flex items-center gap-4 px-6 h-12 border-b text-sm">
      <Link href="/" className="font-semibold">Octagram Labs</Link>
      <Link href="/learn/javascript">JavaScript</Link>
      <Link href="/learn/data-structures">Data Structures</Link>
      <div className="ml-auto flex gap-4">
        {user ? (
          <>
            <Link href="/dashboard">Dashboard</Link>
            <SignOutButton />
          </>
        ) : (
          <Link href="/login">Sign in</Link>
        )}
      </div>
    </nav>
  );
}
