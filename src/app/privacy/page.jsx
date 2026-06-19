// app/legal/page.jsx
"use client";

import { useTheme } from "@/context/ThemeContext";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiShield,
  FiFileText,
  FiLock,
  FiCheckCircle,
  FiRefreshCw,
} from "react-icons/fi";

export default function LegalPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [activeTab, setActiveTab] = useState("privacy"); // "privacy" | "terms"

  // Animation Variant Sets
  const tabContentVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: { opacity: 0, y: -12, transition: { duration: 0.2, ease: "easeIn" } },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -8 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  return (
    <div
      className={`min-h-screen w-full font-sans relative overflow-hidden py-20 sm:py-28 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
        isDark ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* Absolute Grid Mesh Layer */}
      <div
        className={`absolute inset-0 pointer-events-none transition-all duration-300 ${
          isDark
            ? "bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)]"
            : "bg-[linear-gradient(to_right,rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.015)_1px,transparent_1px)]"
        } bg-[size:3rem_3rem]`}
      />

      <div className="relative z-10 max-w-4xl w-full mx-auto space-y-12">
        {/* HEADER SECTION */}
        <div className="text-center space-y-4">
          <div
            className={`inline-flex items-center space-x-2 px-3 py-1 rounded-md text-xs font-mono uppercase tracking-widest border transition-all duration-300 ${
              isDark
                ? "bg-white/5 border-white/10 text-zinc-400"
                : "bg-slate-200/60 border-slate-300/80 text-slate-600"
            }`}
          >
            <FiShield className="animate-pulse text-zinc-500" />
            <span>Compliance Center</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Legal Protocols
          </h1>
          <p
            className={`font-light text-xs sm:text-sm font-mono max-w-md mx-auto transition-colors duration-300 ${
              isDark ? "text-zinc-500" : "text-slate-400"
            }`}
          >
            Last Core Revision Matrix: June 2026
          </p>
        </div>

        {/* MOTION INTERACTIVE TAB HEADER CHANNEL */}
        <div className="flex justify-center">
          <div
            className={`p-1.5 rounded-xl border flex items-center space-x-1 relative transition-all duration-300 ${
              isDark
                ? "bg-white/[0.02] border-white/5"
                : "bg-slate-200/50 border-slate-200"
            }`}
          >
            {/* Privacy Tab Trigger */}
            <button
              onClick={() => setActiveTab("privacy")}
              className={`relative px-5 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider font-semibold z-10 transition-colors duration-200 flex items-center space-x-2 cursor-pointer ${
                activeTab === "privacy"
                  ? isDark
                    ? "text-black"
                    : "text-white"
                  : isDark
                    ? "text-zinc-400 hover:text-white"
                    : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <FiLock className="text-sm" />
              <span>Privacy Policy</span>
              {activeTab === "privacy" && (
                <motion.div
                  layoutId="activeLegalTab"
                  className={`absolute inset-0 rounded-lg -z-10 shadow-lg ${isDark ? "bg-white" : "bg-slate-900"}`}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>

            {/* Terms Tab Trigger */}
            <button
              onClick={() => setActiveTab("terms")}
              className={`relative px-5 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider font-semibold z-10 transition-colors duration-200 flex items-center space-x-2 cursor-pointer ${
                activeTab === "terms"
                  ? isDark
                    ? "text-black"
                    : "text-white"
                  : isDark
                    ? "text-zinc-400 hover:text-white"
                    : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <FiFileText className="text-sm" />
              <span>Terms of Service</span>
              {activeTab === "terms" && (
                <motion.div
                  layoutId="activeLegalTab"
                  className={`absolute inset-0 rounded-lg -z-10 shadow-lg ${isDark ? "bg-white" : "bg-slate-900"}`}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          </div>
        </div>

        {/* TAB CORE CONTENTS WRAPPER */}
        <div
          className={`border rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-xl transition-all duration-300 ${
            isDark
              ? "bg-white/[0.02] border-white/10 shadow-black/40"
              : "bg-white border-slate-200/90 shadow-slate-200/40"
          }`}
        >
          <AnimatePresence mode="wait">
            {activeTab === "privacy" ? (
              <motion.div
                key="privacy"
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-8"
              >
                <div className="space-y-2">
                  <h2 className="text-xl font-bold tracking-tight">
                    1. Data Architecture Log
                  </h2>
                  <p
                    className={`text-sm font-light leading-relaxed ${isDark ? "text-zinc-400" : "text-slate-600"}`}
                  >
                    We gather metadata directly transmitted during account
                    initialization. This includes specific verification identity
                    fields passed down via certified federated OAuth pipelines
                    (such as Google Identity Sync Services).
                  </p>
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl font-bold tracking-tight">
                    2. Telemetry and Geolocation Points
                  </h2>
                  <p
                    className={`text-sm font-light leading-relaxed ${isDark ? "text-zinc-400" : "text-slate-600"}`}
                  >
                    To perform optimal route calculation operations, our
                    framework requires precise geographical coordinate
                    processing. This tracing only runs continuously during
                    active transaction mapping sequences and drops immediately
                    upon fulfillment.
                  </p>
                </div>

                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className={`p-5 rounded-xl border space-y-3 ${
                    isDark
                      ? "bg-white/[0.01] border-white/5"
                      : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-zinc-500 flex items-center space-x-2">
                    <FiCheckCircle className="text-emerald-500" />
                    <span>Your Security Assurances</span>
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm font-light">
                    <motion.li
                      variants={itemVariants}
                      className="flex items-center space-x-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                      <span>
                        Advanced end-to-end payload envelope isolation
                        structures.
                      </span>
                    </motion.li>
                    <motion.li
                      variants={itemVariants}
                      className="flex items-center space-x-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                      <span>
                        Zero programmatic commercial sales of user mapping
                        history.
                      </span>
                    </motion.li>
                    <motion.li
                      variants={itemVariants}
                      className="flex items-center space-x-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                      <span>
                        Full data eradication endpoints accessible upon user
                        system clearance requests.
                      </span>
                    </motion.li>
                  </ul>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="terms"
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-8"
              >
                <div className="space-y-2">
                  <h2 className="text-xl font-bold tracking-tight">
                    1. System Access Parameters
                  </h2>
                  <p
                    className={`text-sm font-light leading-relaxed ${isDark ? "text-zinc-400" : "text-slate-600"}`}
                  >
                    By interacting with our unified deployment networks, you
                    acknowledge bound agreement parameters. Unauthorized
                    programmatic extraction of route vectors, structural
                    scraping behaviors, or targeted load stress tests are
                    strictly prohibited.
                  </p>
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl font-bold tracking-tight">
                    2. Liability Allocation Boundaries
                  </h2>
                  <p
                    className={`text-sm font-light leading-relaxed ${isDark ? "text-zinc-400" : "text-slate-600"}`}
                  >
                    Our systems process routing parameters as structural
                    estimates. RouteMate holds zero secondary liability for
                    external logistical modifications, transport vehicle delays,
                    or direct downstream coordinate errors generated by unvetted
                    third-party fleet operators.
                  </p>
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl font-bold tracking-tight">
                    3. Account Suspension Frameworks
                  </h2>
                  <p
                    className={`text-sm font-light leading-relaxed ${isDark ? "text-zinc-400" : "text-slate-600"}`}
                  >
                    We preserve absolute administrative authorization to
                    automatically terminate token synchronization for users
                    deploying malicious injection scripts, bypass modules, or
                    violating system-wide identity criteria.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* BOTTOM METRIC DISCLAIMER FOOTER NODE */}
        <div className="text-center flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 text-xs font-mono text-zinc-500">
          <span className="flex items-center space-x-1">
            <FiRefreshCw className="text-[10px]" />
            <span>Cryptographic Integrity Confirmed</span>
          </span>
          <span className="hidden sm:inline text-zinc-700">|</span>
          <span>
            For support parameters reach out directly to operations compliance
            desks.
          </span>
        </div>
      </div>
    </div>
  );
}
