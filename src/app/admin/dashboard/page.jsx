"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import {
  FiActivity,
  FiLayers,
  FiUsers,
  FiDollarSign,
  FiLoader,
} from "react-icons/fi";
import { authClient } from "@/lib/auth-client";

export default function AdminDashboardIndex() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStats() {
      try {
        const { data } = await authClient.token();
        const token = data.token;

        const res = await fetch(
          "https://routemate-backend-nine.vercel.app/api/admin/dashboard-stats",
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
          setStats(result.data);
        } else {
          setError(result.message || "Failed to load metrics pipeline.");
        }
      } catch (err) {
        setError(
          "Network connection failure parsing backend engine statistics.",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  // Configuration mapping array tying items to styles and icons seamlessly
  const statCardsConfig = [
    {
      key: "systemLoad",
      label: "System Load",
      icon: <FiActivity className="text-base text-blue-500" />,
      fallback: "0.00%",
    },
    {
      key: "activeLeases",
      label: "Active Tickets",
      icon: <FiLayers className="text-base text-amber-500" />,
      fallback: "0",
    },
    {
      key: "userIngress",
      label: "Total Users",
      icon: <FiUsers className="text-base text-emerald-500" />,
      fallback: "0",
    },
    {
      key: "grossYield",
      label: "Gross Income",
      icon: <FiDollarSign className="text-base text-indigo-500" />,
      fallback: "$0",
    },
  ];

  return (
    <div className="space-y-4 transition-colors duration-300">
      <div>
        <h2
          className={`text-xl font-extrabold tracking-tight sm:text-2xl transition-colors ${
            isDark ? "text-black" : "text-slate-900"
          }`}
        >
          Admin Operation Center
        </h2>
        <p
          className={`text-xs font-light mt-0.5 transition-colors ${
            isDark ? "text-zinc-500" : "text-slate-400"
          }`}
        >
          Select an architectural pipeline directory configuration from the
          controller sidebar to execute management tasks.
        </p>
      </div>

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

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mt-6">
        {statCardsConfig.map((card, i) => (
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
                className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${
                  isDark ? "text-zinc-500" : "text-slate-400"
                }`}
              >
                {card.label}
              </span>
              {card.icon}
            </div>

            <div className="mt-2 min-h-[2rem] flex items-center">
              {loading ? (
                <FiLoader className="text-sm animate-spin text-zinc-400" />
              ) : (
                <p
                  className={`text-2xl font-black tracking-tight transition-colors ${
                    isDark ? "text-zinc-100" : "text-slate-900"
                  }`}
                >
                  {stats ? stats[card.key] : card.fallback}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
