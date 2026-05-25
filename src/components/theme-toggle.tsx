import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    const isDark = stored === "dark";
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm text-foreground shadow-[0_4px_20px_-4px_rgba(0,0,0,0.12)] transition-all duration-150 hover:shadow-[0_6px_24px_-4px_rgba(0,0,0,0.18)]"
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      <span className="text-xs">{dark ? "Light" : "Dark"}</span>
    </button>
  );
}
