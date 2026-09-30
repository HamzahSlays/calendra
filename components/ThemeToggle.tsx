"use client";

import { useEffect, useState } from "react";
import { Lamp, Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("calendra-theme");
    if (saved === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
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

  return (
    <button
      onClick={toggleTheme}
      type="button"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark / Lantern Mode"}
      aria-label="Toggle theme lantern"
      className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-[#0b3558] shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-[#0069ff] hover:shadow-xl dark:border-slate-700 dark:bg-slate-900 dark:text-amber-300"
    >
      {isDark ? (
        <Sun className="h-5 w-5 animate-pulse text-amber-400" />
      ) : (
        <Lamp className="h-5 w-5 text-[#0069ff]" />
      )}
    </button>
  );
}