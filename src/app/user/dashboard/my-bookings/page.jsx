"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow, isPast } from "date-fns";
import {
  FiClock,
  FiMapPin,
  FiInbox,
  FiLoader,
  FiDownload,
  FiFileText,
  FiCalendar,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const { data } = await authClient.token();
        const res = await fetch(
          "https://routemate-backend-nine.vercel.app/api/bookings",
          {
            headers: { Authorization: `Bearer ${data?.token}` },
          },
        );
        const result = await res.json();
        if (result.success) setBookings(result.data);
      } catch (error) {
        console.error("Failed to load historical bookings ledger:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

  if (loading)
    return (
      <div className="flex h-[50vh] items-center justify-center text-slate-400 font-medium gap-2">
        <FiLoader className="animate-spin text-indigo-500" size={20} />
        Loading your travel history...
      </div>
    );

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
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

  // ✨ Live Client-Side Ticker State Engine
  const [currentTime, setCurrentTime] = useState(new Date());
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    // Instantiate interval running every 1000ms (1 second)
    const ticker = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(ticker);
  }, []);

  // Compute live expiration state reactively based on interval ticks
  const isExpired = currentTime >= departureDate;

  // Deriving fallback variables for booking quantities safely
  const bookingQuantity =
    booking.bookingQuantity ||
    booking.quantity ||
    booking.selectedSeats?.length ||
    1;

  const handleStripeCheckout = async () => {
    if (isExpired) {
      toast.error(
        "Payment block enforced: This route's departure time has already passed.",
      );
      return;
    }
    setCheckoutLoading(true);
    try {
      const { data } = await authClient.token();
      const derivedUnitAmount = booking.totalAmount / bookingQuantity;

      const response = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data?.token}`,
        },
        body: JSON.stringify({
          bookingId: booking._id,
          ticketTitle: booking.ticketTitle,
          amount: derivedUnitAmount,
          quantity: bookingQuantity,
        }),
      });

      const sessionResult = await response.json();
      if (!response.ok || sessionResult.error) {
        throw new Error(
          sessionResult.error || "Gateway initialization rejection.",
        );
      }

      if (sessionResult.url) {
        window.location.href = sessionResult.url;
      }
    } catch (err) {
      console.error("Stripe Checkout Redirect Error:", err);
      toast.error(`Payment Processing Failed: ${err.message}`);
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    const printWindow = window.open("", "_blank", "width=700,height=750");

    if (!printWindow) {
      toast.error(
        "Popup blocked! Please allow popups to view and download your ticket pass.",
      );
      return;
    }

    printWindow.document.write(`
    <html>
      <head>
        <title>RouteMate_Ticket_${booking._id}</title>
        <style>
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            padding: 40px; 
            color: #1e293b;
            background-color: #fff;
          }
          .ticket-card { 
            border: 2px dashed #6366f1; 
            padding: 32px; 
            border-radius: 24px; 
            max-width: 550px; 
            margin: 0 auto;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);
          }
          .header { 
            text-align: center; 
            border-bottom: 2px solid #f1f5f9; 
            padding-bottom: 24px; 
            position: relative;
          }
          .brand {
            font-size: 28px;
            font-weight: 900;
            color: #0f172a;
            letter-spacing: -0.05em;
          }
          .brand span { color: #6366f1; }
          .badge { 
            background: #dcfce7; 
            color: #166534; 
            padding: 6px 16px; 
            border-radius: 9999px; 
            font-weight: 800; 
            font-size: 11px; 
            text-transform: uppercase;
            letter-spacing: 0.05em;
            display: inline-block;
            margin-bottom: 12px;
          }
          .route-banner { 
            font-size: 20px; 
            margin: 24px 0; 
            font-weight: 800; 
            color: #4f46e5; 
            text-align: center;
            background: #f8fafc;
            padding: 12px;
            border-radius: 12px;
          }
          .grid-info { 
            margin-top: 24px; 
            display: grid;
            grid-template-cols: 1fr;
            gap: 14px;
            font-size: 14px; 
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #f8fafc;
            padding-bottom: 8px;
          }
          .label { color: #64748b; font-weight: 600; }
          .value { color: #0f172a; font-weight: 700; }
          .value-mono { font-family: monospace; color: #334155; }
          .footer { 
            text-align: center; 
            margin-top: 36px; 
            font-size: 11px; 
            color: #94a3b8; 
            border-top: 1px dashed #e2e8f0; 
            padding-top: 20px; 
            line-height: 1.5;
          }
        </style>
      </head>
      <body>
        <div class="ticket-card">
          <div class="header">
            <span class="badge">✓ Ticket Paid & Confirmed</span>
            <div class="brand">Route<span>Mate</span></div>
          </div>
          
          <div class="route-banner">
            ${booking.from} &rarr; ${booking.to}
          </div>
          
          <div class="grid-info">
            <div class="info-row">
              <span class="label">Journey Description</span>
              <span class="value">${booking.ticketTitle}</span>
            </div>
            <div class="info-row">
              <span class="label">Booking Reference ID</span>
              <span class="value value-mono">${booking._id}</span>
            </div>
            <div class="info-row">
              <span class="label">Reserved Seats Volume</span>
              <span class="value">${bookingQuantity} Seat(s)</span>
            </div>
            <div class="info-row">
              <span class="label">Total Fare Settled</span>
              <span class="value" style="color: #16a34a;">BDT ${booking.totalAmount.toLocaleString()}</span>
            </div>
            <div class="info-row">
              <span class="label">Document Issue Date</span>
              <span class="value">${new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}</span>
            </div>
          </div>
          
          <div class="footer">
            Thank you for booking your journey through RouteMate.<br />
            Please present this generated digital PDF pass or physical printout during boarding.
          </div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
              window.close();
            }, 300);
          }
        </script>
      </body>
    </html>
  `);
    printWindow.document.close();
  };

  // Helper logic to format the dynamic countdown safely second-by-second
  const getLiveCountdownString = () => {
    const diff = departureDate.getTime() - currentTime.getTime();
    if (diff <= 0) return "Passed";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    parts.push(`${hours.toString().padStart(2, "0")}h`);
    parts.push(`${minutes.toString().padStart(2, "0")}m`);
    parts.push(`${seconds.toString().padStart(2, "0")}s`);

    return parts.join(" ");
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="group bg-white border border-slate-200/60 rounded-3xl p-5 shadow-sm hover:shadow-xl hover:shadow-slate-100 transition-all duration-300 flex flex-col justify-between"
    >
      <div>
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

        {/* 1. Ticket Title */}
        <h3 className="font-bold text-slate-900 text-lg tracking-tight">
          {booking.ticketTitle}
        </h3>

        {/* 2. From(Location) → To(Location) */}
        <div className="flex items-center text-xs text-slate-500 mt-1 mb-2">
          <FiMapPin className="mr-1 text-indigo-500" /> {booking.from} →{" "}
          {booking.to}
        </div>

        {/* 3. Explicit Static Departure Date & Time Display */}
        <div className="flex items-center text-xs text-slate-400 font-medium mb-4">
          <FiCalendar className="mr-1.5 text-slate-400" />
          {departureDate.toLocaleDateString(undefined, {
            weekday: "short",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>

        {/* 4. Booking Quantity & Total Price Metric Box */}
        <div className="grid grid-cols-2 bg-slate-50 p-4 rounded-2xl mb-4 gap-2">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Total Price
            </p>
            <p className="font-black text-slate-900">
              BDT {booking.totalAmount.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Booking Quantity
            </p>
            <p className="font-bold text-slate-700">{bookingQuantity}</p>
          </div>
        </div>

        {/* 5. Second-by-Second Dynamic Countdown Container (Removed on Rejected Status) */}
        {!isExpired && booking.status !== "rejected" && (
          <div className="flex items-center text-[11px] font-bold text-indigo-600 bg-indigo-50/60 px-3 py-2 rounded-xl mb-4 w-fit border border-indigo-100/50">
            <FiClock
              className="mr-1.5 animate-pulse text-indigo-500"
              size={13}
            />
            Departs in:{" "}
            <span className="font-mono ml-1 tabular-nums">
              {getLiveCountdownString()}
            </span>
          </div>
        )}

        {isExpired &&
          booking.status !== "rejected" &&
          booking.status !== "paid" && (
            <div className="text-[11px] font-bold text-red-600 bg-red-50 px-3 py-2 rounded-xl mb-4 w-fit border border-red-100">
              Departure Time Expired
            </div>
          )}
      </div>

      {/* ACTION MATRICES */}

      {/* CASE A: TICKET IS ACCEPTED AND UNPAID (Locks instantly upon live expiration) */}
      {booking.status === "accepted" && (
        <button
          onClick={handleStripeCheckout}
          disabled={checkoutLoading || isExpired}
          className={`w-full text-white py-3 rounded-2xl text-sm font-bold transition-all shadow-lg flex items-center justify-center gap-2 ${
            isExpired
              ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none border border-slate-300/30"
              : checkoutLoading
                ? "bg-slate-700 cursor-not-allowed shadow-none"
                : "bg-slate-900 hover:bg-indigo-600 active:scale-[0.99] shadow-slate-200"
          }`}
        >
          {checkoutLoading ? (
            <>
              <FiLoader className="animate-spin text-indigo-400" size={16} />
              Spawning Gateway Session...
            </>
          ) : isExpired ? (
            "Payment Unavailable (Expired)"
          ) : (
            "Pay Now"
          )}
        </button>
      )}

      {/* CASE B: TICKET IS ALREADY SUCCESSFULLY PAID */}
      {booking.status === "paid" && (
        <div className="space-y-2 w-full mt-2">
          <button
            onClick={handleDownloadPDF}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-2xl text-xs font-bold transition-all shadow-md shadow-emerald-100 flex items-center justify-center gap-2"
          >
            <FiDownload size={14} /> Download Ticket PDF
          </button>

          <Link
            href="/user/dashboard/transactions"
            className="w-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 block text-center"
          >
            <FiFileText size={14} /> View Payment History
          </Link>
        </div>
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
