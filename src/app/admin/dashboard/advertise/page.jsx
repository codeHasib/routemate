// app/admin/dashboard/advertise/page.jsx
"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import {
  FiSearch,
  FiRefreshCw,
  FiLoader,
  FiAlertCircle,
  FiAward,
  FiCheckCircle,
} from "react-icons/fi";

export default function AdvertiseTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [actioningId, setActioningId] = useState(null);

  // 1. LOCKED TOKEN STORAGE STRUCTURE
  const [token, setToken] = useState(null);

  useEffect(() => {
    async function fetchToken() {
      const { data } = await authClient.token();
      setToken(data.token);
    }
    fetchToken();
  }, []);

  // Fetch approved tickets from your backend database
  const fetchApprovedTickets = async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const res = await fetch(
        "https://routemate-backend-nine.vercel.app/api/admin/tickets",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok)
        throw new Error(
          "Could not retrieve ticket listings from the database system.",
        );

      const data = await res.json();

      // Separate or filter tickets to make sure we ONLY show approved ("active") ones
      const rawTickets = data.tickets || data;
      const approvedOnly = rawTickets.filter(
        (ticket) => ticket.status === "active",
      );

      setTickets(approvedOnly);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchApprovedTickets();
    }
  }, [token]);

  // Calculate total currently active advertisements on home screen layout elements
  const currentAdvertisedCount = tickets.filter(
    (t) => t.isFeatured === true,
  ).length;

  // Handle toggle logic for featured status
  const handleToggleAdvertise = async (ticketId, currentFeaturedStatus) => {
    if (!token) return;
    setError("");
    setSuccessMessage("");

    const targetNextStatus = !currentFeaturedStatus;

    // 2. HARD LOCK ENFORCEMENT: Block choice if count exceeds 6 slots at a time
    if (targetNextStatus === true && currentAdvertisedCount >= 6) {
      setError(
        "Maximum limit reached. You can only advertise up to 6 tickets at a time. Please turn off another advertisement first.",
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setActioningId(ticketId);

    try {
      // Connecting directly to your PUT /tickets/:id/review route handler
      const res = await fetch(
        `https://routemate-backend-nine.vercel.app/api/admin/tickets/${ticketId}/review`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            isFeatured: targetNextStatus, // Passing your expected boolean configuration value
          }),
        },
      );

      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(
          data.message || "Failed to alter system advertisement metrics.",
        );
      }

      setSuccessMessage(
        targetNextStatus
          ? "Ticket successfully added to the homepage advertisement board!"
          : "Ticket removed from homepage advertisements.",
      );

      // Update UI layout state immediately
      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket._id === ticketId
            ? { ...ticket, isFeatured: targetNextStatus }
            : ticket,
        ),
      );
    } catch (err) {
      setError(
        err.message ||
          "An error occurred while updating the advertisement configuration.",
      );
    } finally {
      setActioningId(null);
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    const searchTarget =
      `${ticket.from} ${ticket.to} ${ticket.vendorName}`.toLowerCase();
    return searchTarget.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* HEADER CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl flex items-center space-x-2">
            <FiAward className="text-slate-800" />
            <span>Advertise Tickets</span>
          </h1>
          <p className="text-xs text-slate-400 font-light mt-0.5">
            Select which approved vendor tickets are featured in the promotion
            showcase section on the homepage.
          </p>
        </div>

        <button
          onClick={fetchApprovedTickets}
          disabled={loading || !token}
          className="inline-flex items-center space-x-2 px-3.5 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-all shadow-xs disabled:opacity-50"
        >
          <FiRefreshCw className={`text-xs ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Listings</span>
        </button>
      </div>

      {/* ADVERTISEMENT QUOTA SLOT TRACKER INDICATOR */}
      <div className="bg-slate-950 text-white rounded-2xl p-4 border border-slate-900 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Active Ad Slots Filled
          </h3>
          <p className="text-xs text-slate-300 font-light mt-0.5">
            The platform homepage displays a maximum of 6 promotional entries
            simultaneously.
          </p>
        </div>
        <div className="flex items-baseline space-x-1 bg-slate-900 px-4 py-2 border border-slate-800 rounded-xl">
          <span className="text-2xl font-black font-mono tracking-tighter text-emerald-400">
            {currentAdvertisedCount}
          </span>
          <span className="text-slate-500 text-xs font-bold">/ 6 slots</span>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-xs flex items-center">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <FiSearch className="text-sm" />
          </div>
          <input
            type="text"
            placeholder="Search by route or travel provider..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium placeholder-slate-400 focus:outline-none focus:border-black focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* SYSTEM MESSAGES */}
      {error && (
        <div className="p-3.5 bg-red-50 border border-red-100 rounded-xl text-red-700 text-xs font-medium flex items-center space-x-2">
          <FiAlertCircle className="text-sm shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 text-xs font-semibold flex items-center space-x-2">
          <FiCheckCircle className="text-sm text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* TABULAR LAYOUT MATRIX CONTAINER */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
        {loading && !tickets.length ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <FiLoader className="text-xl text-black animate-spin mb-2" />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Gathering catalog details...
            </span>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs font-medium">
            No approved vendor tickets found matching your layout parameters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-4">Travel Provider</th>
                  <th className="py-3 px-4">Journey Path</th>
                  <th className="py-3 px-4">Departure Date</th>
                  <th className="py-3 px-4">Fare Pricing</th>
                  <th className="py-3 px-4">Promotion Placement</th>
                  <th className="py-3 px-4 text-right">
                    Showcase Status Toggle
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {filteredTickets.map((ticket) => (
                  <tr
                    key={ticket._id}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    {/* VENDOR NAME */}
                    <td className="py-4 px-4 font-bold text-slate-900">
                      {ticket.vendorName}
                    </td>

                    {/* ROUTE */}
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-slate-900">{ticket.from}</span>
                        <span className="text-slate-300">→</span>
                        <span className="text-slate-900">{ticket.to}</span>
                      </div>
                    </td>

                    {/* DATE */}
                    <td className="py-4 px-4 text-slate-500 font-light">
                      {ticket.date}
                    </td>

                    {/* PRICE */}
                    <td className="py-4 px-4 font-bold text-slate-900">
                      ৳ {ticket.price}
                    </td>

                    {/* CURRENT RUNNING STATUS ELEMENT SUMMARY */}
                    <td className="py-4 px-4">
                      {ticket.isFeatured ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-100">
                          Live on Homepage
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-slate-100 text-slate-400 border border-slate-200">
                          Not Featured
                        </span>
                      )}
                    </td>

                    {/* TOGGLE SLIDER CONTROL ROW ACCENT BUTTON */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end">
                        <button
                          onClick={() =>
                            handleToggleAdvertise(ticket._id, ticket.isFeatured)
                          }
                          disabled={actioningId !== null}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ring-offset-2 focus:ring-1 focus:ring-slate-900 ${
                            ticket.isFeatured ? "bg-black" : "bg-slate-200"
                          } ${actioningId === ticket._id ? "opacity-50 pointer-events-none" : ""}`}
                          role="switch"
                          aria-checked={ticket.isFeatured}
                        >
                          <span
                            aria-hidden="true"
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                              ticket.isFeatured
                                ? "translate-x-5"
                                : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>
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
