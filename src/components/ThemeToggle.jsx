"use client";

import { useTheme } from "../context/ThemeContext";
import { FiSun, FiMoon } from "react-icons/fi";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className={`w-10 h-10 rounded-xl border flex items-center justify-center cursor-pointer transition-all duration-300 active:scale-95 shadow-sm group ${
        isDark
          ? "bg-zinc-900 border-zinc-800 text-zinc-100 hover:bg-zinc-800/80 hover:border-zinc-700 shadow-black/40"
          : "bg-white border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300"
      }`}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDark ? (
        <FiSun
          size={18}
          className="text-amber-400 transition-transform duration-500 group-hover:rotate-45"
        />
      ) : (
        <FiMoon
          size={18}
          className="text-slate-700 transition-transform duration-500 group-hover:-rotate-12"
        />
      )}
    </button>
  );
}