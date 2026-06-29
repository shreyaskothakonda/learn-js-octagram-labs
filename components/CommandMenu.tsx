"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type Item = { id: string; title: string; track: string };
const LABEL: Record<string, string> = {
  javascript: "JavaScript", "data-structures": "Data Structures", react: "React",
};

export function CommandMenu({ problems }: { problems: Item[] }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const router = useRouter();

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setOpen((o) => !o); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    const list = query ? problems.filter((p) => p.title.toLowerCase().includes(query)) : problems;
    return list.slice(0, 50);
  }, [q, problems]);

  function go(id: string) { setOpen(false); setQ(""); router.push(`/problem/${id}`); }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)} className="gap-2 text-muted-foreground">
        <Search className="size-3.5" />
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden sm:inline rounded border px-1 text-[10px]">⌘K</kbd>
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 gap-0 overflow-hidden sm:max-w-lg" showCloseButton={false}>
          <DialogHeader className="sr-only"><DialogTitle>Search problems</DialogTitle></DialogHeader>
          <Input
            autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search problems…"
            className="rounded-none border-0 border-b h-12 focus-visible:ring-0"
          />
          <ul className="max-h-80 overflow-auto p-2">
            {results.map((p) => (
              <li key={p.id}>
                <button onClick={() => go(p.id)} className="w-full flex items-center justify-between gap-3 rounded px-3 py-2 text-sm text-left hover:bg-accent">
                  <span className="truncate">{p.title}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">{LABEL[p.track]}</span>
                </button>
              </li>
            ))}
            {results.length === 0 && <li className="px-3 py-6 text-center text-sm text-muted-foreground">No problems found.</li>}
          </ul>
        </DialogContent>
      </Dialog>
    </>
  );
}
