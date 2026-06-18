// app/loading.jsx
export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 font-sans px-4">
      {/* Absolute Background Ambient Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] opacity-40 pointer-events-none" />

      <div className="relative flex flex-col items-center max-w-sm w-full text-center space-y-6">
        {/* Modern Utility Geometric Spinner Component */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          {/* Outer glowing track */}
          <div className="absolute inset-0 rounded-full border-2 border-white/5" />
          {/* Active spinning node interceptor */}
          <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-white animate-spin [animation-duration:0.8s]" />
          {/* Steady central target core */}
          <div className="w-2 h-2 rounded-full bg-zinc-400 animate-pulse" />
        </div>

        {/* Dynamic Status Readout Metrics */}
        <div className="space-y-1.5 z-10">
          <h3 className="text-sm font-semibold tracking-widest uppercase text-white">
            Syncing Terminal
          </h3>
          <p className="text-xs text-zinc-500 font-mono tracking-tight animate-pulse">
            Optimizing active transit pathways...
          </p>
        </div>

        {/* Minimalist Tech Progress Wireframe Bar */}
        <div className="w-32 h-[2px] bg-white/5 rounded-full overflow-hidden relative">
          <div className="absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-transparent via-zinc-400 to-transparent animate-[shimmer_1.5s_infinite] translate-x-[-100%]" />
        </div>
      </div>

      {/* Embedded keyframe configuration injector override */}
      <style jsx global>{`
        @keyframes shimmer {
          100% {
            transform: translateX(200%);
          }
        }
      `}</style>
    </div>
  );
}
