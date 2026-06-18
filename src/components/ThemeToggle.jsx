"use client";
import { useTheme } from "../Context/ThemeContext";
import { FiSun, FiMoon } from "react-icons/fi";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 shadow-sm hover:bg-slate-50 transition-all duration-200 active:scale-95 flex items-center justify-center cursor-pointer"
      title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
    >
      {theme === "light" ? (
        <div className="flex items-center gap-2 text-xs font-semibold">
          <FiMoon size={16} className="text-slate-700" />
          <span>Dark Mode</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-xs font-semibold">
          <FiSun size={16} className="text-amber-500 animate-pulse" />
          <span>Light Mode</span>
        </div>
      )}
    </button>
  );
}
