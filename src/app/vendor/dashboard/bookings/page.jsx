// app/vendor/dashboard/bookings/page.jsx
"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import {
  FiInbox,
  FiUser,
  FiMail,
  FiMapPin,
  FiCheck,
  FiX,
  FiLoader,
  FiAlertCircle,
  FiInfo,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { useTheme } from "@/context/ThemeContext";

export default function RequestedBookingsPage() {
  const { isPending: sessionLoading } = authClient.useSession();
  const [token, setToken] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const { theme } = useTheme();
  const isDark = theme === "dark";

  // 1. Sync User Cryptographic Authorization Token
  useEffect(() => {
    async function fetchToken() {
      try {
        const { data } = await authClient.token();
        if (data?.token) setToken(data.token);
      } catch (err) {
        console.error("Token lookup error:", err);
      }
    }
    fetchToken();
  }, []);

  // 2. Fetch Bookings Targeted to the Logged-In Vendor ID
  const fetchBookings = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(
        "https://routemate-backend-nine.vercel.app/api/bookings",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      const result = await res.json();
      if (result.success) {
        setBookings(result.data);
      } else {
        setError(result.message || "Failed to load requested bookings.");
      }
    } catch (err) {
      setError("Failed to link with database routing server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [token]);

  // 3. Update Booking Status (Accept / Reject Lifecycle Actions)
  const handleStatusChange = async (bookingId, newStatus) => {
    setActionLoadingId(bookingId);
    try {
      const res = await fetch(
        `https://routemate-backend-nine.vercel.app/api/bookings/${bookingId}/status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        },
      );
      const result = await res.json();

      if (result.success) {
        // Dynamically update state array row values instead of triggering a full page flash
        setBookings((prev) =>
          prev.map((b) =>
            b._id === bookingId ? { ...b, status: newStatus } : b,
          ),
        );
      } else {
        toast.error(
          result.message || "Status adjustment update rejected by server.",
        );
      }
    } catch (err) {
      toast.error("Error processing booking operational state status change.");
    } finally {
      setActionLoadingId(null);
    }
  };

  if (sessionLoading || loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-slate-400">
        <FiLoader className="text-xl text-black animate-spin mb-2" />
        <span className="text-[10px] font-black uppercase tracking-wider">
          Loading manifest ledger...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* PAGE SECTION HEADINGS */}
      <div>
        <h1
          className={`text-xl font-extrabold tracking-tight ${isDark ? "text-white" : "text-black"} sm:text-2xl flex items-center space-x-2 `}
        >
          <FiInbox className={isDark ? "text-white" : "text-black"} />
          <span>Requested Bookings</span>
        </h1>
        <p className="text-xs text-slate-400 font-light mt-0.5">
          Process incoming customer space requests. Approving requests validates
          seats, while rejecting releases locks back into regional routing maps.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 text-xs font-medium flex items-center space-x-2">
          <FiAlertCircle className="text-base text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* CONDITIONAL RENDER: BLANK STATE NO BOOKINGS FOUND */}
      {bookings.length === 0 ? (
        <div className="p-16 border border-slate-100 bg-white rounded-2xl text-center shadow-xs">
          <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <FiInbox className="text-slate-400 text-lg" />
          </div>
          <p className="text-sm font-bold text-slate-700">No bookings found</p>
          <p className="text-xs text-slate-400 font-light mt-0.5">
            Incoming traveler registrations will automatically populate here in
            real-time.
          </p>
        </div>
      ) : (
        /* CORE DATA ARCHITECTURE DATA TABLE DISPLAY SYSTEM */
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] uppercase font-black text-slate-400 tracking-wider">
                  <th className="px-6 py-4">Customer Identity</th>
                  <th className="px-6 py-4">Ticket Fleet Route</th>
                  <th className="px-6 py-4 text-center">Qty</th>
                  <th className="px-6 py-4">Total Price</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">
                    Action Handler Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs font-medium text-slate-700">
                {bookings.map((booking) => {
                  // Fallbacks for nested properties to protect table compilation
                  const userEmail =
                    booking.userEmail || "customer@routemate.com";
                  const userName = booking.userName || "Traveler Client";
                  const ticketTitle =
                    booking.ticketTitle ||
                    `ID: ...${booking.ticketId?.slice(-6)}`;

                  // Compute aggregate totals dynamically from seat array length counts
                  const quantity = booking.selectedSeats?.length || 1;
                  const totalPrice = booking.totalAmount || 0;

                  const isPending = booking.status === "pending";
                  const isAccepted =
                    booking.status === "accepted" || booking.status === "paid";
                  const isRejected = booking.status === "rejected";

                  return (
                    <tr
                      key={booking._id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      {/* USER DETAILS STACK */}
                      <td className="px-6 py-4 max-w-[200px]">
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-900 truncate">
                            {userName}
                          </p>
                          <p className="text-[11px] font-mono text-slate-400 truncate">
                            {userEmail}
                          </p>
                        </div>
                      </td>

                      {/* TICKET DETAILS DESCRIPTION */}
                      <td className="px-6 py-4 max-w-[240px]">
                        <div className="space-y-1">
                          <p
                            className="font-bold text-slate-800 truncate"
                            title={ticketTitle}
                          >
                            {ticketTitle}
                          </p>
                          {booking.selectedSeats && (
                            <span className="inline-flex items-center gap-1 bg-slate-100 border border-slate-200/50 px-1.5 py-0.5 rounded-sm font-mono text-[10px] text-slate-500 font-bold">
                              Seats: {booking.selectedSeats.join(", ")}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* BOOKING QUANTITY VALUE DISPLAY */}
                      <td className="px-6 py-4 text-center font-mono font-bold text-slate-900">
                        {quantity}
                      </td>

                      {/* TOTAL NET INVOICE PRICING */}
                      <td className="px-6 py-4 font-mono font-bold text-slate-900 text-sm">
                        ${totalPrice.toFixed(2)}
                      </td>

                      {/* STATUS CLASSIFICATION BADGES */}
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-block text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-sm border ${
                            isAccepted
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : isRejected
                                ? "bg-red-50 text-red-700 border-red-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>

                      {/* ACTION HANDLER BUTTON ELEMENT CONTROL DOCK */}
                      <td className="px-6 py-4 text-right">
                        {isPending ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              disabled={actionLoadingId !== null}
                              onClick={() =>
                                handleStatusChange(booking._id, "accepted")
                              }
                              className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-slate-950 text-white hover:bg-slate-900 border border-transparent text-[11px] font-bold rounded-lg transition-all active:scale-97 disabled:opacity-40"
                            >
                              {actionLoadingId === booking._id ? (
                                <FiLoader className="animate-spin" />
                              ) : (
                                <>
                                  <FiCheck className="text-xs text-amber-400" />
                                  <span>Accept</span>
                                </>
                              )}
                            </button>
                            <button
                              type="button"
                              disabled={actionLoadingId !== null}
                              onClick={() =>
                                handleStatusChange(booking._id, "rejected")
                              }
                              className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 border border-transparent text-[11px] font-bold rounded-lg transition-all active:scale-97 disabled:opacity-40"
                            >
                              <FiX className="text-xs" />
                              <span>Reject</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-light italic flex items-center justify-end space-x-1">
                            <FiInfo className="text-xs shrink-0" />
                            <span>Processed</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
