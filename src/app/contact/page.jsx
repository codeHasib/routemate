// app/contact/page.jsx
"use client";

import { useTheme } from "@/Context/ThemeContext";
import { useState } from "react";
import { FiMail, FiPhone, FiMapPin, FiSend, FiClock } from "react-icons/fi";

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { theme } = useTheme();

  // High-performance theme state pointer evaluation
  const isDark = theme === "dark";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API Network Latency
    await new Promise((resolve) => setTimeout(resolve, 1200));

    console.log("Contact Payload Transmitted: ", formState);
    setIsSubmitting(false);
    setIsSuccess(true);

    // Reset form after a brief window
    setTimeout(() => {
      setFormState({ name: "", email: "", subject: "", message: "" });
      setIsSuccess(false);
    }, 3000);
  };

  return (
    <div
      className={`min-h-screen w-full font-sans relative overflow-hidden flex flex-col justify-center py-16 sm:py-24 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
        isDark ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* Absolute Geometric Backdrop Grid & Glow */}
      <div
        className={`absolute inset-0 pointer-events-none transition-all duration-300 ${
          isDark
            ? "bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)]"
            : "bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px)]"
        } bg-[size:3rem_3rem]`}
      />

      <div
        className={`absolute top-1/4 left-1/4 w-[400px] h-[400px] blur-[100px] rounded-full pointer-events-none transition-colors duration-300 ${
          isDark ? "bg-white/[0.015]" : "bg-slate-900/[0.02]"
        }`}
      />
      <div
        className={`absolute bottom-1/4 right-1/4 w-[400px] h-[400px] blur-[120px] rounded-full pointer-events-none transition-colors duration-300 ${
          isDark ? "bg-white/[0.01]" : "bg-slate-900/[0.015]"
        }`}
      />

      <div className="relative z-10 max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
        {/* COLUMN 1: ARCHITECTURAL METRICS & INFO */}
        <div className="lg:col-span-5 space-y-8 lg:pr-8">
          <div className="space-y-3">
            <div
              className={`inline-flex items-center space-x-2 px-3 py-1 rounded-md text-xs font-mono uppercase tracking-widest border transition-all duration-300 ${
                isDark
                  ? "bg-white/5 border-white/10 text-zinc-400"
                  : "bg-slate-200/60 border-slate-300/80 text-slate-600"
              }`}
            >
              <span>Connect Layer</span>
            </div>
            <h1
              className={`text-4xl sm:text-5xl font-extrabold tracking-tight transition-colors duration-300 ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              Get in Touch
            </h1>
            <p
              className={`font-light text-sm sm:text-base leading-relaxed max-w-md transition-colors duration-300 ${
                isDark ? "text-zinc-400" : "text-slate-600"
              }`}
            >
              Have questions regarding transit routing, operator verification,
              or high-volume enterprise booking accounts? Drop us a log.
            </p>
          </div>

          {/* Core Functional Detail Cards */}
          <div
            className={`space-y-4 border-t pt-8 transition-colors duration-300 ${
              isDark ? "border-white/5" : "border-slate-200"
            }`}
          >
            {/* Email Module */}
            <div className="flex items-start space-x-4">
              <div
                className={`p-3 rounded-xl mt-0.5 border transition-all duration-300 ${
                  isDark
                    ? "bg-white/[0.03] border-white/5 text-zinc-300"
                    : "bg-slate-200/40 border-slate-300/60 text-slate-700"
                }`}
              >
                <FiMail className="text-lg" />
              </div>
              <div>
                <h4
                  className={`text-xs font-mono uppercase tracking-wider transition-colors duration-300 ${
                    isDark ? "text-zinc-500" : "text-slate-400"
                  }`}
                >
                  Support Communications
                </h4>
                <p
                  className={`text-sm font-medium mt-0.5 transition-colors duration-300 ${
                    isDark ? "text-zinc-200" : "text-slate-800"
                  }`}
                >
                  support@routemate.com
                </p>
              </div>
            </div>

            {/* Phone Module */}
            <div className="flex items-start space-x-4">
              <div
                className={`p-3 rounded-xl mt-0.5 border transition-all duration-300 ${
                  isDark
                    ? "bg-white/[0.03] border-white/5 text-zinc-300"
                    : "bg-slate-200/40 border-slate-300/60 text-slate-700"
                }`}
              >
                <FiPhone className="text-lg" />
              </div>
              <div>
                <h4
                  className={`text-xs font-mono uppercase tracking-wider transition-colors duration-300 ${
                    isDark ? "text-zinc-500" : "text-slate-400"
                  }`}
                >
                  Operations Desk
                </h4>
                <p
                  className={`text-sm font-medium mt-0.5 transition-colors duration-300 ${
                    isDark ? "text-zinc-200" : "text-slate-800"
                  }`}
                >
                  +1 (555) 234-8900
                </p>
              </div>
            </div>

            {/* Location Module */}
            <div className="flex items-start space-x-4">
              <div
                className={`p-3 rounded-xl mt-0.5 border transition-all duration-300 ${
                  isDark
                    ? "bg-white/[0.03] border-white/5 text-zinc-300"
                    : "bg-slate-200/40 border-slate-300/60 text-slate-700"
                }`}
              >
                <FiMapPin className="text-lg" />
              </div>
              <div>
                <h4
                  className={`text-xs font-mono uppercase tracking-wider transition-colors duration-300 ${
                    isDark ? "text-zinc-500" : "text-slate-400"
                  }`}
                >
                  HQ Coordinate Matrix
                </h4>
                <p
                  className={`text-sm font-medium mt-0.5 transition-colors duration-300 ${
                    isDark ? "text-zinc-200" : "text-slate-800"
                  }`}
                >
                  742 Transit Way, Suite 400
                </p>
                <p
                  className={`text-xs font-light transition-colors duration-300 ${
                    isDark ? "text-zinc-500" : "text-slate-500"
                  }`}
                >
                  San Francisco, CA 94107
                </p>
              </div>
            </div>
          </div>

          {/* Operational Pulse Component */}
          <div
            className={`p-4 border rounded-2xl flex items-center space-x-4 max-w-sm transition-all duration-300 ${
              isDark
                ? "bg-white/[0.02] border-white/5"
                : "bg-slate-200/30 border-slate-200"
            }`}
          >
            <div
              className={`p-2.5 rounded-xl ${
                isDark
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-emerald-500/15 text-emerald-600"
              }`}
            >
              <FiClock className="text-lg animate-pulse" />
            </div>
            <div>
              <h5
                className={`text-xs font-semibold transition-colors duration-300 ${
                  isDark ? "text-zinc-300" : "text-slate-700"
                }`}
              >
                System Pulse Response
              </h5>
              <p className="text-xs font-mono text-zinc-500">
                Average terminal reply time: &lt; 15 mins
              </p>
            </div>
          </div>
        </div>

        {/* COLUMN 2: UTILITY INPUT CONTAINER */}
        <div className="lg:col-span-7 w-full">
          <form
            onSubmit={handleSubmit}
            className={`backdrop-blur-xl border p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl space-y-5 relative transition-all duration-300 ${
              isDark
                ? "bg-white/[0.02] border-white/10"
                : "bg-white border-slate-200/90"
            }`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* NAME INPUT */}
              <div className="space-y-1.5">
                <label
                  className={`text-xs font-mono tracking-wide uppercase transition-colors duration-300 ${
                    isDark ? "text-zinc-400" : "text-slate-500"
                  }`}
                >
                  Identification Name
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  value={formState.name}
                  onChange={(e) =>
                    setFormState({ ...formState, name: e.target.value })
                  }
                  className={`w-full px-4 py-3 rounded-xl text-sm transition-all duration-300 font-medium focus:outline-none border ${
                    isDark
                      ? "bg-white/[0.03] border-white/5 focus:border-white/20 text-white placeholder-zinc-600"
                      : "bg-slate-100/80 border-slate-200/60 focus:border-slate-400 text-slate-900 placeholder-slate-400"
                  }`}
                  required
                  disabled={isSubmitting || isSuccess}
                />
              </div>

              {/* EMAIL INPUT */}
              <div className="space-y-1.5">
                <label
                  className={`text-xs font-mono tracking-wide uppercase transition-colors duration-300 ${
                    isDark ? "text-zinc-400" : "text-slate-500"
                  }`}
                >
                  Email Protocol
                </label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={formState.email}
                  onChange={(e) =>
                    setFormState({ ...formState, email: e.target.value })
                  }
                  className={`w-full px-4 py-3 rounded-xl text-sm transition-all duration-300 font-medium focus:outline-none border ${
                    isDark
                      ? "bg-white/[0.03] border-white/5 focus:border-white/20 text-white placeholder-zinc-600"
                      : "bg-slate-100/80 border-slate-200/60 focus:border-slate-400 text-slate-900 placeholder-slate-400"
                  }`}
                  required
                  disabled={isSubmitting || isSuccess}
                />
              </div>
            </div>

            {/* SUBJECT INPUT */}
            <div className="space-y-1.5">
              <label
                className={`text-xs font-mono tracking-wide uppercase transition-colors duration-300 ${
                  isDark ? "text-zinc-400" : "text-slate-500"
                }`}
              >
                Transmission Subject
              </label>
              <input
                type="text"
                placeholder="How can our engineering team assist you?"
                value={formState.subject}
                onChange={(e) =>
                  setFormState({ ...formState, subject: e.target.value })
                }
                className={`w-full px-4 py-3 rounded-xl text-sm transition-all duration-300 font-medium focus:outline-none border ${
                  isDark
                    ? "bg-white/[0.03] border-white/5 focus:border-white/20 text-white placeholder-zinc-600"
                    : "bg-slate-100/80 border-slate-200/60 focus:border-slate-400 text-slate-900 placeholder-slate-400"
                }`}
                required
                disabled={isSubmitting || isSuccess}
              />
            </div>

            {/* MESSAGE TEXTAREA */}
            <div className="space-y-1.5">
              <label
                className={`text-xs font-mono tracking-wide uppercase transition-colors duration-300 ${
                  isDark ? "text-zinc-400" : "text-slate-500"
                }`}
              >
                Payload Message
              </label>
              <textarea
                rows={5}
                placeholder="Type your message text parameters here..."
                value={formState.message}
                onChange={(e) =>
                  setFormState({ ...formState, message: e.target.value })
                }
                className={`w-full px-4 py-3 rounded-xl text-sm transition-all duration-300 font-medium resize-none min-h-[120px] focus:outline-none border ${
                  isDark
                    ? "bg-white/[0.03] border-white/5 focus:border-white/20 text-white placeholder-zinc-600"
                    : "bg-slate-100/80 border-slate-200/60 focus:border-slate-400 text-slate-900 placeholder-slate-400"
                }`}
                required
                disabled={isSubmitting || isSuccess}
              />
            </div>

            {/* SUBMIT ENGINE ACTION */}
            <button
              type="submit"
              disabled={isSubmitting || isSuccess}
              className={`w-full font-semibold text-sm py-3.5 px-6 rounded-xl flex items-center justify-center space-x-2 transition-all duration-300 border font-mono tracking-wider uppercase shadow-xl ${
                isSuccess
                  ? isDark
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : "bg-emerald-50 border-emerald-200 text-emerald-600"
                  : isDark
                    ? "bg-white text-black hover:bg-zinc-100 border-white active:scale-[0.98] shadow-white/5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    : "bg-slate-900 text-white hover:bg-slate-800 border-slate-900 active:scale-[0.98] shadow-slate-900/5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              }`}
            >
              {isSubmitting ? (
                <div
                  className={`w-5 h-5 border-2 rounded-full animate-spin ${isDark ? "border-black border-t-transparent" : "border-white border-t-transparent"}`}
                />
              ) : isSuccess ? (
                <span>Transmission Logged Successfully</span>
              ) : (
                <>
                  <FiSend className="text-base stroke-[2.5]" />
                  <span>Transmit Payload</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
