"use client";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FiTrendingUp, FiPackage, FiDollarSign } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";

export default function RevenuePage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const { data } = await authClient.token();
        const token = data?.token;

        if (!token) return setLoading(false);

        const res = await fetch(
          "https://routemate-backend-nine.vercel.app/api/vendor/revenue-stats",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        const result = await res.json();
        if (result.success) setStats(result.data);
      } catch (err) {
        console.error("Error loading stats:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading)
    return <div className="p-6 text-slate-500">Loading charts...</div>;
  if (!stats) return <div className="p-6 text-slate-500">No data found.</div>;

  // Chart 1: Simple volume tracking data
  const volumeData = [
    { name: "Tickets Added", count: stats.totalAdded || 0 },
    { name: "Tickets Sold", count: stats.totalSold || 0 },
  ];

  // Chart 2: Simple revenue tracking data
  const revenueData = [
    { name: "Total Revenue", amount: stats.totalRevenue || 0 },
  ];

  return (
    <div className="space-y-6 p-4 min-h-screen">
      {/* 1. SIMPLE COUNTER CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="text-slate-400 text-xs font-bold uppercase">
            Tickets Added
          </div>
          <div className="text-2xl font-black text-slate-800 mt-1">
            {stats.totalAdded || 0}
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="text-slate-400 text-xs font-bold uppercase">
            Tickets Sold
          </div>
          <div className="text-2xl font-black text-slate-800 mt-1">
            {stats.totalSold || 0}
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="text-slate-400 text-xs font-bold uppercase">
            Total Revenue
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            ৳{(stats.totalRevenue || 0).toLocaleString()}
          </div>
        </div>
      </div>

      {/* 2. SIMPLE CHARTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Side: Tickets Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-sm font-bold text-slate-700 mb-4">
            Ticket Volume Metrics
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volumeData}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Side: Revenue Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-sm font-bold text-slate-700 mb-4">
            Financial Earnings (৳)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [
                    `৳${value.toLocaleString()}`,
                    "Amount",
                  ]}
                />
                <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
