"use client";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => { setDark(document.documentElement.classList.contains("dark")); }, []);
  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try { localStorage.setItem("theme", next ? "dark" : "light"); } catch {}
    window.dispatchEvent(new Event("themechange"));
  }
  return (
    <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle dark mode" title="Toggle theme">
      {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );
}
