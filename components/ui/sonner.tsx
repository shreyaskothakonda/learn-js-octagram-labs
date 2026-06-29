"use client";
import { useEffect, useState } from "react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

export function Toaster(props: ToasterProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  useEffect(() => {
    const sync = () => setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
    sync();
    window.addEventListener("themechange", sync);
    return () => window.removeEventListener("themechange", sync);
  }, []);
  return (
    <Sonner
      theme={theme}
      className="toaster group"
      style={{
        "--normal-bg": "var(--popover)",
        "--normal-text": "var(--popover-foreground)",
        "--normal-border": "var(--border)",
        "--border-radius": "var(--radius)",
      } as React.CSSProperties}
      {...props}
    />
  );
}
