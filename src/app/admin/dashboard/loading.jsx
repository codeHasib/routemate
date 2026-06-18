// app/admin/dashboard/loading.jsx
"use client";

import { FiLoader } from "react-icons/fi";

export default function AdminLoading() {
  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center space-y-4">
      {/* MINIMAL ANIMATED LOADER */}
      <div className="relative flex items-center justify-center">
        <FiLoader className="text-3xl text-black animate-spin" />
        <span className="absolute w-8 h-8 rounded-full border-2 border-slate-100 border-t-transparent animate-ping opacity-20" />
      </div>

      {/* TEXT LABEL */}
      <div className="text-center space-y-1">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
          Syncing Directory
        </h3>
        <p className="text-[11px] text-slate-400 font-light">
          Securing system pathways and loading database registries...
        </p>
      </div>

      {/* CLEAN APP SKELETON PLACEHOLDER BAR */}
      <div className="w-48 h-1 bg-slate-100 rounded-full overflow-hidden relative">
        <div className="absolute top-0 left-0 h-full w-1/3 bg-black rounded-full animate-[loading_1.5s_infinite_ease-in-out]" />
      </div>

      {/* TAILWIND KEYFRAME INLINE STYLE INJECTION FOR THE PROGRESS BAR */}
      <style jsx global>{`
        @keyframes loading {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(300%);
          }
        }
      `}</style>
    </div>
  );
}
