// components/Hero.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Production App Router
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext"; // Adjust this path to your custom theme context
import { FiMapPin, FiCalendar, FiSearch } from "react-icons/fi";
import { RiNavigationFill as RiNavIcon } from "react-icons/ri"; // Fixed syntax error if necessary, using your exact imports

// Premium cinematic background textures
const BACKGROUND_IMAGES = [
  "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=1920", // Modern Coach on Highway
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=1920", // Atmospheric Travel Texture
  "https://images.unsplash.com/photo-1557223562-6c77ef16210f?auto=format&fit=crop&q=80&w=1920", // Night Transit Lines
];

export default function Hero() {
  const router = useRouter();
  const [currentBg, setCurrentBg] = useState(0);
  const [searchQuery, setSearchQuery] = useState({
    from: "",
    to: "",
    date: "",
  });

  // Pull theme state from your custom context hook
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Automatically cycle through background images every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % BACKGROUND_IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();

    // Build URL search params natively and safely sanitize inputs
    const params = new URLSearchParams({
      from: searchQuery.from.trim(),
      to: searchQuery.to.trim(),
      date: searchQuery.date,
    });

    // Push routing query parameter arrays to your /tickets discovery page
    router.push(`/tickets?${params.toString()}`);
  };

  return (
    <div
      className={`relative w-full min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden font-sans transition-colors duration-300 ${
        isDark ? "bg-black" : "bg-black"
      }`}
    >
      {/* CINEMATIC BACKDROP SLIDER */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentBg}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: isDark ? 0.55 : 0.55, scale: 1 }} // Subdued opacity optimization based on explicit mode
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 bg-cover bg-center no-repeat"
            style={{ backgroundImage: `url(${BACKGROUND_IMAGES[currentBg]})` }}
          />
        </AnimatePresence>
        {/* Modern radial gradient overlay wrapper */}
        <div
          className={`absolute inset-0 z-10 transition-all duration-300 ${
            isDark
              ? "bg-gradient-to-t from-slate-950 via-transparent to-black/40"
              : "bg-gradient-to-t from-slate-950 via-transparent to-black/40"
          }`}
        />
      </div>

      {/* HERO CONTENT ARCHITECTURE */}
      <div
        className={`relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center transition-colors duration-300 ${
          isDark ? "text-white" : "text-zinc-900"
        }`}
      >
        {/* PREMIUM BADGE OVERLAY */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full backdrop-blur-md border mb-6 sm:mb-8 transition-all duration-300 group cursor-pointer ${
            isDark
              ? "bg-white/10 border-white/10 hover:bg-white/15"
              : "bg-zinc-950/5 border-zinc-950/10 hover:bg-zinc-950/10"
          }`}
        >
          <RiNavIcon
            className={`text-xs animate-pulse group-hover:rotate-12 transition-transform ${
              isDark ? "text-gray-300" : "text-zinc-600"
            }`}
          />
          <span
            className={`text-[11px] font-semibold uppercase tracking-widest ${
              isDark ? "text-gray-200" : "text-gray-200"
            }`}
          >
            Next-Gen Transit System Active
          </span>
        </motion.div>

        {/* CATCHY MARKETING HEADLINE */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight max-w-3xl leading-[1.1] mb-4 sm:mb-6 text-white"
        >
          Your Next Route, <br className="sm:hidden" />
          <span
            className={`bg-clip-text text-transparent bg-gradient-to-r ${
              isDark
                ? "from-gray-100 via-white to-gray-400"
                : "from-gray-100 via-white to-gray-400"
            }`}
          >
            Perfectionized.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className={`text-sm sm:text-base md:text-lg font-light max-w-xl tracking-wide mb-10 sm:mb-12 leading-relaxed transition-colors duration-300 ${
            isDark ? "text-gray-300" : "text-gray-300"
          }`}
        >
          Book premium intercity routes instantly. Verified operators, real-time
          seat tracking, and seamless cross-border travel.
        </motion.p>

        {/* MODERN UTILITY MULTI-FILTER SEARCH WIDGET */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="w-full max-w-4xl"
        >
          <form
            onSubmit={handleSearch}
            className={`backdrop-blur-xl border p-3 sm:p-4 rounded-2xl sm:rounded-3xl shadow-2xl grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-3 items-center transition-all duration-300 ${
              isDark
                ? "bg-white/[0.06] border-white/10"
                : "bg-white/80 border-zinc-200/80 shadow-zinc-200/40"
            }`}
          >
            {/* FROM FIELD */}
            <div className="md:col-span-3 relative flex items-center group">
              <FiMapPin
                className={`absolute left-4 transition-colors duration-200 text-lg ${
                  isDark
                    ? "text-gray-400 group-focus-within:text-white"
                    : "text-zinc-400 group-focus-within:text-zinc-900"
                }`}
              />
              <input
                type="text"
                placeholder="Leaving from..."
                value={searchQuery.from}
                onChange={(e) =>
                  setSearchQuery({ ...searchQuery, from: e.target.value })
                }
                className={`w-full pl-11 pr-4 py-3 border rounded-xl text-sm font-medium focus:outline-none transition-all duration-300 ${
                  isDark
                    ? "bg-white/[0.04] border-white/5 focus:border-white/20 text-white placeholder-gray-400"
                    : "bg-zinc-100/70 border-zinc-200 focus:border-zinc-400 text-zinc-900 placeholder-zinc-400"
                }`}
                required
              />
            </div>

            {/* TO FIELD */}
            <div className="md:col-span-3 relative flex items-center group">
              <FiMapPin
                className={`absolute left-4 transition-colors duration-200 text-lg ${
                  isDark
                    ? "text-gray-400 group-focus-within:text-white"
                    : "text-zinc-400 group-focus-within:text-zinc-900"
                }`}
              />
              <input
                type="text"
                placeholder="Going to..."
                value={searchQuery.to}
                onChange={(e) =>
                  setSearchQuery({ ...searchQuery, to: e.target.value })
                }
                className={`w-full pl-11 pr-4 py-3 border rounded-xl text-sm font-medium focus:outline-none transition-all duration-300 ${
                  isDark
                    ? "bg-white/[0.04] border-white/5 focus:border-white/20 text-white placeholder-gray-400"
                    : "bg-zinc-100/70 border-zinc-200 focus:border-zinc-400 text-zinc-900 placeholder-zinc-400"
                }`}
                required
              />
            </div>

            {/* DATE SELECTION FIELD */}
            <div className="md:col-span-3 relative flex items-center group">
              <FiCalendar
                className={`absolute left-4 transition-colors duration-200 text-lg ${
                  isDark
                    ? "text-gray-400 group-focus-within:text-white"
                    : "text-zinc-400 group-focus-within:text-zinc-900"
                }`}
              />
              <input
                type="date"
                value={searchQuery.date}
                onChange={(e) =>
                  setSearchQuery({ ...searchQuery, date: e.target.value })
                }
                className={`w-full pl-11 pr-4 py-3 border rounded-xl text-sm font-medium focus:outline-none transition-all duration-300 ${
                  isDark
                    ? "bg-white/[0.04] border-white/5 focus:border-white/20 text-white placeholder-gray-400 [color-scheme:dark]"
                    : "bg-zinc-100/70 border-zinc-200 focus:border-zinc-400 text-zinc-900 placeholder-zinc-400 [color-scheme:light]"
                }`}
                required
              />
            </div>

            {/* ACTION TRIGGER CTA BUTTON */}
            <div className="md:col-span-3">
              <button
                type="submit"
                className={`w-full font-semibold text-sm py-3 px-6 rounded-xl flex items-center justify-center space-x-2 transition-all duration-300 active:scale-[0.98] shadow-lg ${
                  isDark
                    ? "bg-white text-black hover:bg-gray-100 shadow-white/5"
                    : "bg-zinc-950 text-white hover:bg-zinc-900 shadow-zinc-950/10"
                }`}
              >
                <FiSearch className="text-base stroke-[2.5]" />
                <span>Search Routes</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
