"use client";
import { useEffect, useState } from "react";
import { formatDistanceToNow, isPast } from "date-fns";
import { FiClock, FiMapPin, FiInbox } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { authClient } from "@/lib/auth-client";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookings() {
      const { data } = await authClient.token();
      const res = await fetch("http://localhost:5000/api/bookings", {
        headers: { Authorization: `Bearer ${data?.token}` },
      });
      const result = await res.json();
      if (result.success) setBookings(result.data);
      setLoading(false);
    }
    fetchBookings();
  }, []);

  if (loading)
    return (
      <div className="p-10 text-center text-slate-400">
        Loading your travel history...
      </div>
    );

  // FORMAL EMPTY STATE
  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center px-4">
        <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mb-6 text-slate-400">
          <FiInbox size={32} />
        </div>
        <h3 className="text-xl font-black text-slate-900">
          No active bookings
        </h3>
        <p className="text-slate-500 mt-2 max-w-sm">
          It looks like you haven't made any reservations yet. Explore our
          routes to start your journey.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence>
        {bookings.map((b) => (
          <BookingCard key={b._id} booking={b} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function BookingCard({ booking }) {
  const departureDate = new Date(booking.departureTime);
  const isExpired = isPast(departureDate);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="group bg-white border border-slate-200/60 rounded-3xl p-5 shadow-sm hover:shadow-xl hover:shadow-slate-100 transition-all duration-300"
    >
      <div className="relative overflow-hidden rounded-2xl mb-4">
        <img
          src={booking.ticketImage || "/placeholder.jpg"}
          className="w-full h-36 object-cover transform group-hover:scale-105 transition-transform duration-500"
          alt="Ticket"
        />
        <div className="absolute top-3 left-3">
          <StatusBadge status={booking.status} />
        </div>
      </div>

      <h3 className="font-bold text-slate-900 text-lg tracking-tight">
        {booking.ticketTitle}
      </h3>
      <div className="flex items-center text-xs text-slate-500 mt-1 mb-4">
        <FiMapPin className="mr-1 text-indigo-500" /> {booking.from} →{" "}
        {booking.to}
      </div>

      <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl mb-4">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase">
            Total Amount
          </p>
          <p className="font-black text-slate-900">
            ৳{booking.totalAmount.toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-slate-400 uppercase">
            Seats
          </p>
          <p className="font-bold text-slate-700">
            {booking.selectedSeats?.length || 1}
          </p>
        </div>
      </div>

      {!isExpired && booking.status !== "rejected" && (
        <div className="flex items-center text-[11px] font-medium text-slate-500 mb-4">
          <FiClock className="mr-1.5 text-indigo-500" />
          Departs in {formatDistanceToNow(departureDate)}
        </div>
      )}

      {booking.status === "accepted" && !isExpired && (
        <button className="w-full bg-slate-900 text-white py-3 rounded-2xl text-sm font-bold hover:bg-indigo-600 transition-colors shadow-lg shadow-slate-200">
          Pay Now
        </button>
      )}
    </motion.div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    pending: "bg-white/90 text-amber-700 border-amber-200",
    accepted: "bg-white/90 text-emerald-700 border-emerald-200",
    paid: "bg-white/90 text-blue-700 border-blue-200",
    rejected: "bg-white/90 text-red-700 border-red-200",
  };
  return (
    <span
      className={`backdrop-blur-sm border px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${styles[status]}`}
    >
      {status}
    </span>
  );
}
