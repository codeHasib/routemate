// app/vendor/dashboard/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { authClient } from "@/lib/auth-client";
import {
  FiMap,
  FiShoppingBag,
  FiTrendingUp,
  FiLoader,
  FiUser,
  FiCalendar,
  FiArrowRight,
} from "react-icons/fi";

export default function VendorDashboardIndex() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [metrics, setMetrics] = useState({
    totalAdded: 0,
    totalSold: 0,
    totalRevenue: 0,
    paidTickets: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchRevenueStats() {
      try {
        // Authenticate dynamically using your precise token resolver structure
        const { data: tokenData } = await authClient.token();
        const token = tokenData?.token;

        if (!token) {
          setError(
            "Session expired. Please re-authenticate your operator account.",
          );
          setLoading(false);
          return;
        }

        const res = await fetch(
          "https://routemate-backend-nine.vercel.app/api/vendor/revenue-stats",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const result = await res.json();
        if (result.success) {
          setMetrics(result.data);
        } else {
          setError(
            result.message || "Failed to sync endpoint telemetry matrices.",
          );
        }
      } catch (err) {
        setError(
          "Network connection failure parsing backend statistics pipeline.",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchRevenueStats();
  }, []);

  // Structural dynamic alignment configuration for the primary card nodes
  const statsDisplayConfig = [
    {
      label: "Total Created Routes",
      value: metrics.totalAdded.toLocaleString(),
      icon: <FiMap className="text-base text-blue-500" />,
    },
    {
      label: "Individual Seats Sold",
      value: metrics.totalSold.toLocaleString(),
      icon: <FiShoppingBag className="text-base text-emerald-500" />,
    },
    {
      label: "Total Gross Revenue",
      value: `৳ ${metrics.totalRevenue.toLocaleString()}`,
      icon: <FiTrendingUp className="text-base text-indigo-500" />,
    },
  ];

  return (
    <div className="space-y-6 transition-colors duration-300">
      {/* HEADER CONTROLS */}
      <div>
        <h2
          className={`text-xl font-extrabold tracking-tight sm:text-2xl transition-colors ${
            isDark ? "text-zinc-100" : "text-slate-900"
          }`}
        >
          Vendor Operations Console
        </h2>
        <p
          className={`text-xs font-light mt-0.5 transition-colors ${
            isDark ? "text-zinc-500" : "text-slate-400"
          }`}
        >
          Select an operational pipeline directory configuration from the
          controller sidebar to execute management tasks.
        </p>
      </div>

      {/* ERROR STATUS FEEDBACK */}
      {error && (
        <div
          className={`p-3.5 border rounded-xl text-xs font-medium transition-colors ${
            isDark
              ? "bg-red-950/40 border-red-900/40 text-red-400"
              : "bg-red-50 border-red-100 text-red-700"
          }`}
        >
          {error}
        </div>
      )}

      {/* METRIC DATA BLOCKS */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mt-6">
        {statsDisplayConfig.map((stat, i) => (
          <div
            key={i}
            className={`border rounded-2xl p-5 transition-all duration-300 ${
              isDark
                ? "bg-zinc-900 border-zinc-800/80 shadow-2xl shadow-black/20"
                : "bg-white border-slate-100 shadow-xs"
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-[10px] font-bold uppercase tracking-widest block transition-colors ${
                  isDark ? "text-zinc-500" : "text-slate-400"
                }`}
              >
                {stat.label}
              </span>
              {stat.icon}
            </div>

            <div className="mt-2 min-h-[2rem] flex items-center">
              {loading ? (
                <FiLoader className="text-sm animate-spin text-zinc-500" />
              ) : (
                <p
                  className={`text-2xl font-black transition-colors font-mono tracking-tight ${
                    isDark ? "text-zinc-100" : "text-slate-900"
                  }`}
                >
                  {stat.value}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* MODERN UTILITY RECENT SALES LEDGER */}
      <div
        className={`border rounded-2xl p-5 transition-all duration-300 ${
          isDark
            ? "bg-zinc-900 border-zinc-800/80"
            : "bg-white border-slate-100"
        }`}
      >
        <div className="mb-4">
          <h3
            className={`text-sm font-bold tracking-tight ${isDark ? "text-zinc-200" : "text-slate-800"}`}
          >
            Recent Line-Item Sales Ledger
          </h3>
          <p
            className={`text-[11px] ${isDark ? "text-zinc-500" : "text-slate-400"}`}
          >
            Real-time breakdown of transactional manifests verified across your
            asset routes.
          </p>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center items-center">
            <FiLoader className="text-xl animate-spin text-zinc-500" />
          </div>
        ) : metrics.paidTickets.length === 0 ? (
          <div
            className={`py-12 text-center text-xs transition-colors ${isDark ? "text-zinc-600" : "text-slate-400"}`}
          >
            No finalized transactions historical manifests indexable currently.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr
                  className={`border-b text-[10px] font-bold uppercase tracking-wider transition-colors ${
                    isDark
                      ? "border-zinc-800 text-zinc-500"
                      : "border-slate-100 text-slate-400"
                  }`}
                >
                  <th className="pb-3 font-semibold">Client Passport</th>
                  <th className="pb-3 font-semibold">Manifest Vector</th>
                  <th className="pb-3 font-semibold">Allocated Seats</th>
                  <th className="pb-3 font-semibold text-right">Yield</th>
                </tr>
              </thead>
              <tbody className="divide-y transition-colors divide-transparent">
                {metrics.paidTickets.map((ticket, idx) => (
                  <tr
                    key={idx}
                    className={`text-xs transition-all hover:bg-transparent ${
                      isDark
                        ? "text-zinc-300 border-zinc-800/60"
                        : "text-slate-600 border-slate-100"
                    } border-b last:border-b-0`}
                  >
                    {/* Customer */}
                    <td className="py-3.5 pr-2">
                      <div className="flex items-start gap-2">
                        <div
                          className={`p-1.5 rounded-lg mt-0.5 ${isDark ? "bg-zinc-800" : "bg-slate-50"}`}
                        >
                          <FiUser
                            size={12}
                            className={
                              isDark ? "text-zinc-400" : "text-slate-500"
                            }
                          />
                        </div>
                        <div>
                          <p
                            className={`font-semibold ${isDark ? "text-zinc-200" : "text-slate-800"}`}
                          >
                            {ticket.userName || "Guest"}
                          </p>
                          <p
                            className={`text-[10px] ${isDark ? "text-zinc-500" : "text-slate-400"}`}
                          >
                            {ticket.userEmail}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Route Details */}
                    <td className="py-3.5 px-2">
                      <div>
                        <div className="flex items-center gap-1.5 font-medium">
                          <span>{ticket.from}</span>
                          <FiArrowRight size={10} className="text-slate-400" />
                          <span>{ticket.to}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                          <FiCalendar size={10} />
                          <span>
                            {ticket.createdAt
                              ? new Date(ticket.createdAt).toLocaleDateString(
                                  undefined,
                                  { dateStyle: "medium" },
                                )
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Seats */}
                    <td className="py-3.5 px-2 font-mono text-[11px]">
                      <div className="flex flex-wrap gap-1">
                        {ticket.selectedSeats?.map((seat, sIdx) => (
                          <span
                            key={sIdx}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              isDark
                                ? "bg-zinc-800 text-zinc-300 border border-zinc-700"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {seat}
                          </span>
                        )) || <span className="text-slate-400">-</span>}
                      </div>
                    </td>

                    {/* Yield / Amount */}
                    <td className="py-3.5 pl-2 font-mono font-bold text-right text-[13px] tracking-tight text-emerald-500">
                      ৳ {ticket.totalAmount?.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
