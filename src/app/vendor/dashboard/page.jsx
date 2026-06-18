// app/vendor/dashboard/page.jsx
"use client";

export default function VendorDashboardIndex() {
  const vendorStats = [
    { label: "Active Tickets", value: "0" },
    { label: "Pending Bookings", value: "0" },
    { label: "Sold Vouchers", value: "0" },
    { label: "Total Revenue", value: "৳ 0" },
  ];

  return (
    <div className="space-y-4">
      {/* HEADER CONTROLS */}
      <div>
        <h2 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
          Vendor Operations Console
        </h2>
        <p className="text-xs text-slate-400 font-light mt-0.5">
          Select an operational pipeline directory configuration from the
          controller sidebar to execute management tasks.
        </p>
      </div>

      {/* METRIC DATA BLOCKS */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mt-6">
        {vendorStats.map((stat, i) => (
          <div
            key={i}
            className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs"
          >
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
              {stat.label}
            </span>
            <p className="text-2xl font-black text-slate-900 mt-1 font-mono tracking-tight">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
