"use client";

import { useEffect, useState } from "react";
import { Lamp, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("calendra-theme");
    if (
      saved === "dark" ||
      (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("calendra-theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("calendra-theme", "dark");
      setIsDark(true);
    }
  };

  if (!mounted) {
    return (
      <div className="h-9 w-9 rounded-xl border border-slate-200 bg-white" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark / Lantern Mode"}
      aria-label="Toggle theme"
      className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-[#0b3558] shadow-sm transition hover:border-[#0069ff] hover:bg-slate-50 hover:text-[#0069ff] active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-amber-300"
    >
      {isDark ? (
        <Sun className="h-4 w-4 animate-pulse text-amber-400" />
      ) : (
        <Lamp className="h-4 w-4 text-[#0069ff]" />
      )}
    </button>
  );
}