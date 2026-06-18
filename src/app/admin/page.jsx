export default function AdminDashboardIndex() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
          Core Operations Console
        </h2>
        <p className="text-xs text-slate-400 font-light mt-0.5">
          Select an architectural pipeline directory configuration from the
          controller sidebar to execute management tasks.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mt-6">
        {["System Load", "Active Leases", "User Ingress", "Gross Yield"].map(
          (stat, i) => (
            <div
              key={i}
              className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs"
            >
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {stat}
              </span>
              <p className="text-2xl font-black text-slate-900 mt-1">0.00%</p>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
