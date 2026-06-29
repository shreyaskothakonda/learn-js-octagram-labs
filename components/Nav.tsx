import Link from "next/link";
import { getOptionalUser } from "@/lib/supabase/server";
import { SignOutButton } from "./SignOutButton";
import { ThemeToggle } from "./ThemeToggle";
import { NavLink } from "./NavLink";

export async function Nav() {
  const user = await getOptionalUser();
  return (
    <nav className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 h-12 border-b text-sm overflow-x-auto whitespace-nowrap">
      <Link href="/" className="font-semibold shrink-0">Octagram Labs</Link>
      <NavLink href="/learn/javascript">JavaScript</NavLink>
      <NavLink href="/learn/data-structures">Data Structures</NavLink>
      <NavLink href="/learn/react">React</NavLink>
      <div className="ml-auto flex items-center gap-3 sm:gap-4 shrink-0">
        <ThemeToggle />
        {user ? (
          <>
            <NavLink href="/dashboard">Dashboard</NavLink>
            <SignOutButton />
          </>
        ) : (
          <NavLink href="/login">Sign in</NavLink>
        )}
      </div>
    </nav>
  );
}
