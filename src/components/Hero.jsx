// components/Hero.jsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMapPin, FiCalendar, FiSearch } from "react-icons/fi";
import { RiNavigationFill } from "react-icons/ri";

// Premium cinematic background textures
const BACKGROUND_IMAGES = [
  "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=1920", // Modern Coach on Highway
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=1920", // Atmospheric Travel Texture
  "https://images.unsplash.com/photo-1557223562-6c77ef16210f?auto=format&fit=crop&q=80&w=1920", // Night Transit Lines
];

export default function Hero() {
  const [currentBg, setCurrentBg] = useState(0);
  const [searchQuery, setSearchQuery] = useState({
    from: "",
    to: "",
    date: "",
  });

  // Automatically cycle through background images every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % BACKGROUND_IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Routing Queries: ", searchQuery);
    // Push routing query parameter arrays to your /tickets discovery page
  };

  return (
    <div className="relative pt-8 w-full min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden bg-black font-sans">
      {/* CINEMATIC BACKDROP SLIDER */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentBg}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.55, scale: 1 }} // Subdued opacity for readability override
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 bg-cover bg-center no-repeat"
            style={{ backgroundImage: `url(${BACKGROUND_IMAGES[currentBg]})` }}
          />
        </AnimatePresence>
        {/* Modern radial gradient overlay wrapper */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/40 z-10" />
      </div>

      {/* HERO CONTENT ARCHITECTURE */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white flex flex-col items-center">
        {/* PREMIUM BADGE OVERLAY */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 mb-6 sm:mb-8 hover:bg-white/15 transition-all duration-300 group cursor-pointer"
        >
          <RiNavigationFill className="text-gray-300 text-xs animate-pulse group-hover:rotate-12 transition-transform" />
          <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-200">
            Next-Gen Transit System Active
          </span>
        </motion.div>

        {/* CATCHY MARKETING HEADLINE */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight max-w-3xl leading-[1.1] mb-4 sm:mb-6"
        >
          Your Next Route, <br className="sm:hidden" />
          <span className="bg-gradient-to-r from-gray-100 via-white to-gray-400 bg-clip-text text-transparent">
            Perfectionized.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-sm sm:text-base md:text-lg text-gray-300 font-light max-w-xl tracking-wide mb-10 sm:mb-12 leading-relaxed"
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
            className="bg-white/[0.06] backdrop-blur-xl border border-white/10 p-3 sm:p-4 rounded-2xl sm:rounded-3xl shadow-2xl grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-3 items-center"
          >
            {/* FROM FIELD */}
            <div className="md:col-span-3 relative flex items-center group">
              <FiMapPin className="absolute left-4 text-gray-400 group-focus-within:text-white transition-colors duration-200 text-lg" />
              <input
                type="text"
                placeholder="Leaving from..."
                value={searchQuery.from}
                onChange={(e) =>
                  setSearchQuery({ ...searchQuery, from: e.target.value })
                }
                className="w-full pl-11 pr-4 py-3 bg-white/[0.04] border border-white/5 focus:border-white/20 rounded-xl text-sm font-medium text-white placeholder-gray-400 focus:outline-none transition-all duration-300"
                required
              />
            </div>

            {/* TO FIELD */}
            <div className="md:col-span-3 relative flex items-center group">
              <FiMapPin className="absolute left-4 text-gray-400 group-focus-within:text-white transition-colors duration-200 text-lg" />
              <input
                type="text"
                placeholder="Going to..."
                value={searchQuery.to}
                onChange={(e) =>
                  setSearchQuery({ ...searchQuery, to: e.target.value })
                }
                className="w-full pl-11 pr-4 py-3 bg-white/[0.04] border border-white/5 focus:border-white/20 rounded-xl text-sm font-medium text-white placeholder-gray-400 focus:outline-none transition-all duration-300"
                required
              />
            </div>

            {/* DATE SELECTION FIELD */}
            <div className="md:col-span-3 relative flex items-center group">
              <FiCalendar className="absolute left-4 text-gray-400 group-focus-within:text-white transition-colors duration-200 text-lg" />
              <input
                type="date"
                value={searchQuery.date}
                onChange={(e) =>
                  setSearchQuery({ ...searchQuery, date: e.target.value })
                }
                className="w-full pl-11 pr-4 py-3 bg-white/[0.04] border border-white/5 focus:border-white/20 rounded-xl text-sm font-medium text-white placeholder-gray-400 focus:outline-none transition-all duration-300 [color-scheme:dark]"
                required
              />
            </div>

            {/* ACTION TRIGGER CTA BUTTON */}
            <div className="md:col-span-3">
              <button
                type="submit"
                className="w-full bg-white text-black hover:bg-gray-100 font-semibold text-sm py-3 px-6 rounded-xl flex items-center justify-center space-x-2 transition-all duration-300 active:scale-[0.98] shadow-lg shadow-white/5"
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
