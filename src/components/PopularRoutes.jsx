// components/PopularRoutes.jsx
"use client";

import { motion } from "framer-motion";
import { FiArrowRight, FiTrendingUp } from "react-icons/fi";
import Link from "next/link";

const POPULAR_ROUTES = [
  {
    id: 1,
    from: "Dhaka",
    to: "Chittagong",
    duration: "5h 30m",
    basePrice: "12",
  },
  { id: 2, from: "Sylhet", to: "Dhaka", duration: "4h 45m", basePrice: "15" },
  {
    id: 3,
    from: "Cox's Bazar",
    to: "Dhaka",
    duration: "8h 15m",
    basePrice: "22",
  },
  { id: 4, from: "Dhaka", to: "Khulna", duration: "6h 00m", basePrice: "18" },
];

export default function PopularRoutes() {
  return (
    <section className="py-20 bg-slate-50/40 border-t border-gray-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* SECTION HEADER */}
        <div className="mb-12">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-200/60 text-black mb-4 border border-gray-200/40">
            <FiTrendingUp className="text-xs text-gray-700" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600">
              Top Desired Journeys
            </span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Trending Hub Routes
          </h2>
          <p className="text-sm text-gray-500 font-light max-w-lg tracking-wide mt-2">
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
              className="bg-white border border-gray-100 p-5 rounded-2xl hover:border-black/15 hover:shadow-lg transition-all duration-300 group cursor-pointer"
            >
              <Link href={`/tickets?from=${route.from}&to=${route.to}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-gray-900">
                      {route.from}
                    </span>
                    <FiArrowRight className="text-gray-400 group-hover:text-black transition-colors group-hover:translate-x-0.5 transform duration-200" />
                    <span className="text-sm font-bold text-gray-900">
                      {route.to}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-baseline mt-6 pt-3 border-t border-gray-50">
                  <span className="text-xs text-gray-400 font-medium">
                    {route.duration} avg
                  </span>
                  <p className="text-sm font-medium text-gray-400">
                    From{" "}
                    <span className="text-base font-extrabold text-black tracking-tight">
                      ${route.basePrice}
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
