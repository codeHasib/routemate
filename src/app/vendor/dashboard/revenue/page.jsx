"use client";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  FiTrendingUp,
  FiPackage,
  FiDollarSign,
  FiLoader,
} from "react-icons/fi";
import { authClient } from "@/lib/auth-client";

export default function RevenuePage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        // 1. Await the token first
        const { data } = await authClient.token();
        const token = data?.token;

        if (!token) {
          console.error("No token available. User might be logged out.");
          setLoading(false);
          return;
        }

        // 2. Now fetch the revenue using the retrieved token
        const res = await fetch(
          "http://localhost:5000/api/vendor/revenue-stats",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        const result = await res.json();
        if (result.success) {
          setStats(result.data);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) return <SkeletonLoader />;

  // Empty state handling
  if (!stats || (stats.totalAdded === 0 && stats.totalSold === 0)) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50">
        <div className="bg-white p-4 rounded-full shadow-sm mb-4">
          <FiPackage className="text-3xl text-slate-300" />
        </div>
        <h2 className="text-lg font-bold text-slate-700">No Analytics Yet</h2>
        <p className="text-slate-500 text-sm max-w-xs mt-2">
          Start adding tickets to see your revenue and sales performance metrics
          unfold here.
        </p>
      </div>
    );
  }

  const data = [
    { name: "Tickets Added", value: stats.totalAdded, color: "#3b82f6" },
    { name: "Tickets Sold", value: stats.totalSold, color: "#8b5cf6" },
    { name: "Revenue ($)", value: stats.totalRevenue, color: "#10b981" },
  ];

  return (
    <div className="space-y-8">
      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Added", val: stats.totalAdded, icon: FiPackage },
          { label: "Total Sold", val: stats.totalSold, icon: FiTrendingUp },
          {
            label: "Total Revenue",
            val: `$${stats.totalRevenue.toFixed(2)}`,
            icon: FiDollarSign,
          },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"
          >
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {item.label}
              </span>
              <item.icon className="text-slate-300" />
            </div>
            <p className="text-3xl font-black text-slate-900 mt-2">
              {item.val}
            </p>
          </div>
        ))}
      </div>

      {/* CHART SECTION */}
      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="text-sm font-black text-slate-900 mb-6 uppercase tracking-wider">
          Performance Breakdown
        </h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barSize={60}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: "#f8fafc" }} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// Minimalist Skeleton Loader
function SkeletonLoader() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-slate-100 rounded-2xl" />
        ))}
      </div>
      <div className="h-72 bg-slate-100 rounded-2xl" />
    </div>
  );
}
