"use client";
import { useEffect, useState } from "react";

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
    <button onClick={toggle} aria-label="Toggle dark mode" title="Toggle theme"
      className="rounded border px-2 py-1 text-xs hover:bg-gray-500/10">
      {dark ? "Light" : "Dark"}
    </button>
  );
}
