// components/WhyChooseUs.jsx
"use client";

import { motion } from "framer-motion";
import { FiShield, FiZap, FiCheckCircle } from "react-icons/fi";
import { RiThumbUpLine } from "react-icons/ri";

const HIGHLIGHTS = [
  {
    icon: <FiShield className="text-xl text-black" />,
    title: "Verified Operators Only",
    description:
      "Every operator undergoes screening protocols before onboarding to keep schedules accurate and safe.",
  },
  {
    icon: <FiZap className="text-xl text-black" />,
    title: "Atomic Seat Locking",
    description:
      "Our database guarantees real-time visual alignment. No overlaps, no accidental double-bookings.",
  },
  {
    icon: <FiCheckCircle className="text-xl text-black" />,
    title: "Instant Verification Triggers",
    description:
      "Receive finalized transaction histories and ledger records immediately upon Stripe checkout completion.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-24 bg-white border-t border-gray-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* UPPER TITLE BLOCKS */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-black text-white mb-4 shadow-sm">
            <RiThumbUpLine className="text-xs text-yellow-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Built to Scale
            </span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl mb-4">
            Engineered for Perfect Transit
          </h2>
          <p className="text-sm text-gray-500 font-light tracking-wide leading-relaxed">
            RouteMate provides an enterprise-grade booking ecosystem designed to
            eliminate standard travel friction completely.
          </p>
        </div>

        {/* 3-COLUMN BENEFIT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12">
          {HIGHLIGHTS.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-start text-left group"
            >
              {/* Minimalist Icon Housing Block */}
              <div className="w-12 h-12 bg-slate-50 border border-gray-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-black group-hover:border-black transition-all duration-300 transform group-hover:scale-105">
                <div className="group-hover:invert transition-all duration-300">
                  {item.icon}
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2 tracking-tight">
                {item.title}
              </h3>
              <p className="text-sm text-gray-500 font-light leading-relaxed tracking-wide">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
