// app/admin/dashboard/error.jsx
"use client";

import { useEffect } from "react";
import { FiAlertOctagon, FiRotateCcw } from "react-icons/fi";

export default function AdminError({ error, reset }) {
  useEffect(() => {
    console.error("Admin Panel Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      {/* WARNING GRAPHIC ACCENT */}
      <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 mb-4 shadow-xs">
        <FiAlertOctagon className="text-xl" />
      </div>

      {/* TEXT DATA BLOCKS */}
      <h2 className="text-base font-extrabold tracking-tight text-slate-900">
        System Gateway Exception
      </h2>

      <p className="mt-1 text-xs text-slate-400 font-light max-w-sm leading-relaxed">
        The dashboard met an unexpected issue compiling database metrics or
        processing authorization certificates.
      </p>

      {/* DYNAMIC ERROR MESSAGE OUTPUT PANEL */}
      <div className="mt-4 p-3 bg-slate-50 border border-slate-100 rounded-xl max-w-md w-full">
        <p className="text-[11px] font-mono text-slate-500 text-left truncate break-all">
          Code Trace:{" "}
          {error?.message || "Unknown communication breakdown encountered."}
        </p>
      </div>

      {/* RESET/TRY AGAIN CALL TO ACTION ACTIONER */}
      <button
        onClick={() => reset()}
        className="mt-6 inline-flex items-center space-x-2 px-4 py-2 bg-black text-white text-xs font-bold rounded-xl hover:bg-slate-900 active:scale-95 transition-all shadow-xs"
      >
        <FiRotateCcw className="text-xs" />
        <span>Retry Handshake</span>
      </button>
    </div>
  );
}
