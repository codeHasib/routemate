"use client";
import { motion } from "framer-motion";
import { FiArrowRight, FiClock, FiCheckCircle } from "react-icons/fi";

export default function UserDashboardIndex() {
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Welcome Hero */}
      <div className="bg-black rounded-3xl p-8 text-white shadow-xl shadow-indigo-200">
        <h2 className="text-3xl font-black">Welcome back, Traveler!</h2>
        <p className="opacity-80 mt-2 max-w-md">
          Your next adventure awaits. Check your current bookings or browse new
          routes.
        </p>
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          variants={item}
          className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <FiClock />
            </div>
            <h3 className="font-bold">Pending Bookings</h3>
          </div>
          <p className="text-sm text-slate-500">
            You have 0 active requests waiting for vendor confirmation.
          </p>
        </motion.div>

        <motion.div
          variants={item}
          className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <FiCheckCircle />
            </div>
            <h3 className="font-bold">Total Completed</h3>
          </div>
          <p className="text-sm text-slate-500">
            View your travel history and past invoices here.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
