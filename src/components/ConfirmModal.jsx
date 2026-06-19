"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { FiAlertTriangle, FiX } from "react-icons/fi";

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  loading,
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
          />

          {/* Modal Card Structure */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", duration: 0.4 }}
            className={`relative w-full max-w-md transform overflow-hidden rounded-2xl p-6 border shadow-2xl transition-colors ${
              isDark
                ? "bg-zinc-950 border-zinc-800 shadow-black/80"
                : "bg-white border-slate-100 shadow-slate-200"
            }`}
          >
            {/* Close Accent Corner Button */}
            <button
              onClick={onClose}
              className={`absolute top-4 right-4 p-1.5 rounded-lg border transition-colors cursor-pointer ${
                isDark
                  ? "border-zinc-800 text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300"
                  : "border-slate-100 text-slate-400 hover:bg-slate-50 hover:text-slate-600"
              }`}
            >
              <FiX size={14} />
            </button>

            {/* Content Core Grid */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-500/10 text-red-500 rounded-xl border border-red-500/20 shrink-0">
                <FiAlertTriangle size={20} className="animate-pulse" />
              </div>
              <div className="space-y-1">
                <h3
                  className={`text-base font-extrabold tracking-tight ${
                    isDark ? "text-zinc-100" : "text-slate-900"
                  }`}
                >
                  {title || "Confirm Action"}
                </h3>
                <p
                  className={`text-xs font-light leading-relaxed ${
                    isDark ? "text-zinc-400" : "text-slate-500"
                  }`}
                >
                  {message}
                </p>
              </div>
            </div>

            {/* Operational Layout Action Controls */}
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  isDark
                    ? "border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 active:scale-98"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 active:scale-98"
                } disabled:opacity-50`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={loading}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-500 active:scale-98 text-white font-medium shadow-md shadow-red-600/10 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                {loading ? "Processing..." : "Yes, Flag Vendor"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}