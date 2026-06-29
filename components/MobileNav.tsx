"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MobileNav({ signedIn }: { signedIn: boolean }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  function go(href: string) { setOpen(false); router.push(href); }
  const links = [
    ["/learn/javascript", "JavaScript"],
    ["/learn/data-structures", "Data Structures"],
    ["/learn/react", "React"],
    signedIn ? ["/dashboard", "Dashboard"] : ["/login", "Sign in"],
  ] as const;
  return (
    <div className="lg:hidden">
      <Button variant="ghost" size="icon" onClick={() => setOpen(true)} aria-label="Open menu">
        <Menu className="size-5" />
      </Button>
      {open && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setOpen(false)} />
          <div className="fixed left-0 top-0 z-50 h-full w-64 bg-background border-r p-4 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold">Octagram Labs</span>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close menu"><X className="size-4" /></Button>
            </div>
            <nav className="flex flex-col">
              {links.map(([href, label]) => (
                <button key={href} onClick={() => go(href)} className="text-left rounded px-3 py-2 text-sm hover:bg-accent">{label}</button>
              ))}
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
