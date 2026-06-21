// components/PopularRoutes.jsx
"use client";

import { motion } from "framer-motion";
import { FiArrowRight, FiTrendingUp } from "react-icons/fi";
import { useTheme } from "@/context/ThemeContext"; // Adjust this path to your custom theme context
import Link from "next/link";

const POPULAR_ROUTES = [
  {
    id: 1,
    from: "Dhaka",
    to: "Chittagong",
    duration: "5h 30m",
    basePrice: "1200",
  },
  { id: 2, from: "Sylhet", to: "Dhaka", duration: "4h 45m", basePrice: "1500" },
  {
    id: 3,
    from: "Cox's Bazar",
    to: "Dhaka",
    duration: "8h 15m",
    basePrice: "1200",
  },
  { id: 4, from: "Dhaka", to: "Khulna", duration: "6h 00m", basePrice: "1800" },
];

export default function PopularRoutes() {
  // Pull theme state from your custom context hook
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section
      className={`py-20 border-t font-sans transition-colors duration-300 ${
        isDark
          ? "bg-zinc-950 border-zinc-900"
          : "bg-slate-50/40 border-gray-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* SECTION HEADER */}
        <div className="mb-12">
          <div
            className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full border transition-all duration-300 mb-4 ${
              isDark
                ? "bg-zinc-800/60 text-white border-zinc-700/40"
                : "bg-slate-200/60 text-black border-gray-200/40"
            }`}
          >
            <FiTrendingUp
              className={`text-xs transition-colors duration-300 ${
                isDark ? "text-zinc-400" : "text-gray-700"
              }`}
            />
            <span
              className={`text-[10px] font-bold uppercase tracking-widest transition-colors duration-300 ${
                isDark ? "text-zinc-400" : "text-gray-600"
              }`}
            >
              Top Desired Journeys
            </span>
          </div>
          <h2
            className={`text-3xl font-extrabold tracking-tight sm:text-4xl transition-colors duration-300 ${
              isDark ? "text-zinc-100" : "text-gray-900"
            }`}
          >
            Trending Hub Routes
          </h2>
          <p
            className={`text-sm font-light max-w-lg tracking-wide mt-2 transition-colors duration-300 ${
              isDark ? "text-zinc-400" : "text-gray-500"
            }`}
          >
            The most frequently traversed connection loops running across the
            platform daily.
          </p>
        </div>

        {/* INTERACTIVE ROUTE GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {POPULAR_ROUTES.map((route, index) => (
            <motion.div
              key={route.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className={`p-5 rounded-2xl transition-all duration-300 border group cursor-pointer ${
                isDark
                  ? "bg-zinc-900 border-zinc-800 hover:border-white/15 hover:shadow-2xl hover:shadow-black/40"
                  : "bg-white border-gray-100 hover:border-black/15 hover:shadow-lg"
              }`}
            >
              <Link href={`/tickets?from=${route.from}&to=${route.to}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-sm font-bold transition-colors duration-300 ${
                        isDark ? "text-zinc-200" : "text-gray-900"
                      }`}
                    >
                      {route.from}
                    </span>
                    <FiArrowRight
                      className={`transition-all transform duration-200 group-hover:translate-x-0.5 ${
                        isDark
                          ? "text-zinc-500 group-hover:text-white"
                          : "text-gray-400 group-hover:text-black"
                      }`}
                    />
                    <span
                      className={`text-sm font-bold transition-colors duration-300 ${
                        isDark ? "text-zinc-200" : "text-gray-900"
                      }`}
                    >
                      {route.to}
                    </span>
                  </div>
                </div>

                <div
                  className={`flex justify-between items-baseline mt-6 pt-3 border-t transition-colors duration-300 ${
                    isDark ? "border-zinc-800" : "border-gray-50"
                  }`}
                >
                  <span
                    className={`text-xs font-medium transition-colors duration-300 ${
                      isDark ? "text-zinc-500" : "text-gray-400"
                    }`}
                  >
                    {route.duration} avg
                  </span>
                  <p
                    className={`text-sm font-medium transition-colors duration-300 ${
                      isDark ? "text-zinc-500" : "text-gray-400"
                    }`}
                  >
                    From{" "}
                    <span
                      className={`text-base font-extrabold tracking-tight transition-colors duration-300 ${
                        isDark ? "text-white" : "text-black"
                      }`}
                    >
                      BDT{route.basePrice}
                    </span>
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
