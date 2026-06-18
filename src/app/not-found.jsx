// app/not-found.jsx
import Link from "next/link";
import { FiAlertTriangle, FiArrowLeft } from "react-icons/fi";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 font-sans px-6 relative overflow-hidden">
      {/* Background Matrix Mesh Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/[0.02] blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-md w-full text-center flex flex-col items-center">
        {/* Clean Alert Badge Node */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono mb-6">
          <FiAlertTriangle className="stroke-[2.5]" />
          <span className="tracking-wider uppercase">
            Error Code: 404 Route Broken
          </span>
        </div>

        {/* Big Premium Monospace Number Layout */}
        <h1 className="text-8xl sm:text-9xl font-extrabold tracking-tighter text-white font-mono select-none opacity-90 mb-2">
          404
        </h1>

        <h2 className="text-xl font-bold text-zinc-100 tracking-tight mb-3">
          Destination Unreachable
        </h2>

        <p className="text-sm text-zinc-400 font-light leading-relaxed max-w-xs mb-10">
          The routing path you specified does not exist or has been permanently
          decommissioned across our servers.
        </p>

        {/* Actionable Return Interface Button */}
        <Link
          href="/"
          className="group inline-flex items-center space-x-2 bg-white text-black hover:bg-zinc-100 font-semibold text-sm py-3 px-6 rounded-xl transition-all duration-300 active:scale-[0.98] shadow-xl shadow-white/5"
        >
          <FiArrowLeft className="text-base group-hover:-translate-x-1 transition-transform duration-200 stroke-[2.5]" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    </div>
  );
}