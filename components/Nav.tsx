import Link from "next/link";
import { getOptionalUser } from "@/lib/supabase/server";
import { getAllProblems } from "@/content";
import { SignOutButton } from "./SignOutButton";
import { ThemeToggle } from "./ThemeToggle";
import { NavLink } from "./NavLink";
import { CommandMenu } from "./CommandMenu";
import { MobileNav } from "./MobileNav";

export async function Nav() {
  const user = await getOptionalUser();
  const problems = getAllProblems().map((p) => ({ id: p.id, title: p.title, track: p.track }));
  return (
    <nav className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 h-12 border-b text-sm">
      <MobileNav signedIn={!!user} />
      <Link href="/" className="font-semibold shrink-0">Octagram Labs</Link>
      <div className="hidden lg:flex items-center gap-4">
        <NavLink href="/learn/javascript">JavaScript</NavLink>
        <NavLink href="/learn/data-structures">Data Structures</NavLink>
        <NavLink href="/learn/react">React</NavLink>
        <NavLink href="/learn/concepts">Concepts</NavLink>
      </div>
      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <CommandMenu problems={problems} />
        <ThemeToggle />
        <div className="hidden lg:flex items-center gap-3">
          {user ? (<><NavLink href="/dashboard">Dashboard</NavLink><SignOutButton /></>) : (<NavLink href="/login">Sign in</NavLink>)}
        </div>
      </div>
    </nav>
  );
}
