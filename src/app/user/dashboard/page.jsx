"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { authClient } from "@/lib/auth-client";
import {
  FiClock,
  FiCheckCircle,
  FiCreditCard,
  FiLoader,
  FiMapPin,
  FiArrowRight,
  FiCalendar,
} from "react-icons/fi";

export default function UserDashboardIndex() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUserDashboardData() {
      try {
        // Resolve authentication credentials seamlessly via your client client wrapper
        const { data: tokenData } = await authClient.token();
        const token = tokenData?.token;

        if (!token) {
          setError("Session context unverified. Please log in again.");
          setLoading(false);
          return;
        }

        const res = await fetch(
          "https://routemate-backend-nine.vercel.app/api/bookings",
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
          setBookings(result.data);
        } else {
          setError(
            result.message || "Failed to parse travel records blueprint.",
          );
        }
      } catch (err) {
        setError(
          "Network connection failure syncronizing with backend routing engine.",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchUserDashboardData();
  }, []);

  // Compute stats on the fly from the centralized bookings payload
  const pendingCount = bookings.filter((b) => b.status === "pending").length;
  const completedCount = bookings.filter(
    (b) => b.status === "paid" || b.status === "accepted",
  ).length;
  const totalSpent = bookings
    .filter((b) => b.status === "paid")
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  // Framer Motion layout configurations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  const statCardsConfig = [
    {
      label: "Pending Bookings",
      value: pendingCount.toString(),
      description: `${pendingCount} requests awaiting vendor validation.`,
      icon: <FiClock className="text-base text-amber-500" />,
    },
    {
      label: "Confirmed Travels",
      value: completedCount.toString(),
      description: "Active routes or finalized invoices index.",
      icon: <FiCheckCircle className="text-base text-emerald-500" />,
    },
    {
      label: "Total Invested",
      value: `BDT ${totalSpent.toLocaleString()}`,
      description: "Aggregated gross checkout expenditures.",
      icon: <FiCreditCard className="text-base text-indigo-500" />,
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 transition-colors duration-300"
    >
      {/* Welcome Hero Section */}
      <motion.div
        variants={itemVariants}
        className={`rounded-3xl p-8 transition-all duration-300 ${
          isDark
            ? "bg-zinc-900 border border-zinc-800 shadow-2xl shadow-black/30"
            : "bg-black text-white shadow-sm shadow-slate-200"
        }`}
      >
        <h2
          className={`text-3xl font-black tracking-tight ${isDark ? "text-zinc-100" : "text-white"}`}
        >
          Welcome back, Traveler!
        </h2>
        <p
          className={`text-sm mt-2 max-w-md font-light ${isDark ? "text-zinc-400" : "opacity-80"}`}
        >
          Your next adventure awaits. Check your pipeline validation queues or
          track your active system manifests here.
        </p>
      </motion.div>

      {/* Error Alert Bar */}
      {error && (
        <motion.div
          variants={itemVariants}
          className={`p-3.5 border rounded-xl text-xs font-medium ${
            isDark
              ? "bg-red-950/40 border-red-900/40 text-red-400"
              : "bg-red-50 border-red-100 text-red-700"
          }`}
        >
          {error}
        </motion.div>
      )}

      {/* Metrics Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {statCardsConfig.map((card, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            className={`border rounded-2xl p-5 transition-all duration-300 ${
              isDark
                ? "bg-zinc-900 border-zinc-800/80 shadow-xl"
                : "bg-white border-slate-100 shadow-xs"
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-[10px] font-bold uppercase tracking-widest ${
                  isDark ? "text-zinc-500" : "text-slate-400"
                }`}
              >
                {card.label}
              </span>
              {card.icon}
            </div>

            <div className="mt-3">
              {loading ? (
                <FiLoader className="text-sm animate-spin text-zinc-400" />
              ) : (
                <>
                  <p
                    className={`text-2xl font-black font-mono tracking-tight ${
                      isDark ? "text-zinc-100" : "text-slate-900"
                    }`}
                  >
                    {card.value}
                  </p>
                  <p
                    className={`text-[11px] mt-0.5 ${isDark ? "text-zinc-500" : "text-slate-400"}`}
                  >
                    {card.description}
                  </p>
                </>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Dynamic Booking Manifest History List */}
      <motion.div
        variants={itemVariants}
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
            Active Itinerary & Reservations
          </h3>
          <p
            className={`text-[11px] ${isDark ? "text-zinc-500" : "text-slate-400"}`}
          >
            Real-time status configurations of your pipeline checkout requests.
          </p>
        </div>

        {loading ? (
          <div className="py-10 flex justify-center items-center">
            <FiLoader className="text-xl animate-spin text-zinc-500" />
          </div>
        ) : bookings.length === 0 ? (
          <div
            className={`py-10 text-center text-xs ${isDark ? "text-zinc-600" : "text-slate-400"}`}
          >
            No booking manifests found under your traveller signature.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr
                  className={`border-b text-[10px] font-bold uppercase tracking-wider ${
                    isDark
                      ? "border-zinc-800 text-zinc-500"
                      : "border-slate-100 text-slate-400"
                  }`}
                >
                  <th className="pb-3 font-semibold">Route Asset</th>
                  <th className="pb-3 font-semibold">Vector Path</th>
                  <th className="pb-3 font-semibold">Seats</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Fare</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-transparent">
                {bookings.map((booking, idx) => (
                  <tr
                    key={idx}
                    className={`text-xs ${
                      isDark
                        ? "text-zinc-300 border-zinc-800/60"
                        : "text-slate-600 border-slate-100"
                    } border-b last:border-b-0`}
                  >
                    {/* Route Title */}
                    <td className="py-3.5 pr-2 font-semibold max-w-[160px] truncate">
                      {booking.ticketTitle}
                    </td>

                    {/* Vector / Origin-Destination */}
                    <td className="py-3.5 px-2">
                      <div>
                        <div className="flex items-center gap-1.5 font-medium">
                          <span>{booking.from}</span>
                          <FiArrowRight size={10} className="text-slate-400" />
                          <span>{booking.to}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                          <FiCalendar size={10} />
                          <span>
                            {booking.departureTime || "Flexible Schedule"}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Seats Matrix Array */}
                    <td className="py-3.5 px-2 font-mono text-[11px]">
                      <div className="flex flex-wrap gap-1">
                        {booking.selectedSeats?.map((seat, sIdx) => (
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

                    {/* Status Pill Badge */}
                    <td className="py-3.5 px-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          booking.status === "paid" ||
                          booking.status === "accepted"
                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                            : booking.status === "pending"
                              ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                              : "bg-red-500/10 text-red-500 border border-red-500/20"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>

                    {/* Total Amount */}
                    <td className="py-3.5 pl-2 font-mono font-bold text-right text-[13px] text-slate-900 dark:text-zinc-100">
                      BDT {booking.totalAmount?.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
