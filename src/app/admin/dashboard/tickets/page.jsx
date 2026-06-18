// app/admin/dashboard/tickets/page.jsx
"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client"; // Importing your authClient
import {
  FiCheck,
  FiX,
  FiAlertCircle,
  FiLoader,
  FiSearch,
  FiRefreshCw,
} from "react-icons/fi";
import { IoTicketSharp } from "react-icons/io5";

export default function ManageTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [actioningId, setActioningId] = useState(null);

  // 1. YOUR EXACT TOKEN STATE ARCHITECTURE
  const [token, setToken] = useState(null);

  useEffect(() => {
    async function fetchToken() {
      const { data } = await authClient.token();
      setToken(data.token);
    }
    fetchToken();
  }, []);

  // 2. FETCH TICKETS WITH SYSTEM BEARER HEADER
  const fetchTickets = async () => {
    if (!token) return; // Wait until your token state resolves
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`http://localhost:5000/api/admin/tickets`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ Using your exact token state parameter
        },
      });

      if (!res.ok)
        throw new Error("Could not load the tickets from the database system.");

      const data = await res.json();
      setTickets(data.tickets || data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  // Trigger load sequence as soon as the component mounts AND your token format settles
  useEffect(() => {
    if (token) {
      fetchTickets();
    }
  }, [token]);

  // 3. UPDATE TICKET STATUS
  const handleUpdateStatus = async (ticketId, targetStatus) => {
    if (!token) return;
    setActioningId(ticketId);
    setError("");

    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/tickets/${ticketId}/review`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ Passed correctly via state
          },
          body: JSON.stringify({ status: targetStatus }),
        },
      );

      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(
          data.message || `Failed to update status to ${targetStatus}.`,
        );
      }

      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket._id === ticketId
            ? { ...ticket, status: targetStatus }
            : ticket,
        ),
      );
    } catch (err) {
      setError(err.message || "An error occurred while updating the ticket.");
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
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl flex items-center space-x-2">
            <IoTicketSharp className="text-slate-800" />
            <span>Manage Vendor Tickets</span>
          </h1>
          <p className="text-xs text-slate-400 font-light mt-0.5">
            Review, approve, or reject travel tickets uploaded by platform
            vendors. Approved tickets display publicly.
          </p>
        </div>

        <button
          onClick={fetchTickets}
          disabled={loading || !token}
          className="inline-flex items-center space-x-2 px-3.5 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-all shadow-xs disabled:opacity-50"
        >
          <FiRefreshCw className={`text-xs ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* FILTER CONTROL BAR */}
      <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-xs flex items-center">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <FiSearch className="text-sm" />
          </div>
          <input
            type="text"
            placeholder="Search by route or vendor name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium placeholder-slate-400 focus:outline-none focus:border-black focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* WARNING POPUPS */}
      {error && (
        <div className="p-3.5 bg-red-50 border border-red-100 rounded-xl text-red-700 text-xs font-medium flex items-center space-x-2">
          <FiAlertCircle className="text-sm shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* DATA TABLE */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
        {loading && !tickets.length ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <FiLoader className="text-xl text-black animate-spin mb-2" />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Loading tickets...
            </span>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs font-medium">
            No vendor tickets were found matching your search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-4">Vendor Partner</th>
                  <th className="py-3 px-4">Journey Route</th>
                  <th className="py-3 px-4">Travel Date</th>
                  <th className="py-3 px-4">Ticket Price</th>
                  <th className="py-3 px-4">Current Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {filteredTickets.map((ticket) => (
                  <tr
                    key={ticket._id}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="py-4 px-4 font-bold text-slate-900">
                      {ticket.vendorName}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-slate-900">{ticket.from}</span>
                        <span className="text-slate-300">→</span>
                        <span className="text-slate-900">{ticket.to}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-500 font-light">
                      {ticket.date}
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-900">
                      ৳ {ticket.price}
                    </td>
                    <td className="py-4 px-4">
                      {ticket.status === "active" && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-100">
                          Active Publicly
                        </span>
                      )}
                      {ticket.status === "rejected" && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-red-50 text-red-700 border border-red-100">
                          Rejected
                        </span>
                      )}
                      {ticket.status === "pending" && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-amber-50 text-amber-700 border border-amber-100">
                          Awaiting Review
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() =>
                            handleUpdateStatus(ticket._id, "active")
                          }
                          disabled={
                            actioningId !== null || ticket.status === "active"
                          }
                          className={`inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all shadow-xs ${
                            ticket.status === "active"
                              ? "bg-slate-50 text-slate-300 border border-slate-100 pointer-events-none shadow-none"
                              : "bg-black text-white hover:bg-slate-900 active:scale-95 disabled:opacity-40"
                          }`}
                        >
                          {actioningId === ticket._id ? (
                            <FiLoader className="animate-spin text-xs" />
                          ) : (
                            <FiCheck className="text-xs" />
                          )}
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() =>
                            handleUpdateStatus(ticket._id, "rejected")
                          }
                          disabled={
                            actioningId !== null || ticket.status === "rejected"
                          }
                          className={`inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition-all shadow-xs ${
                            ticket.status === "rejected"
                              ? "bg-slate-50 text-slate-300 border-slate-100 pointer-events-none shadow-none"
                              : "bg-white border-slate-200 text-red-600 hover:bg-red-50 hover:border-red-200 active:scale-95 disabled:opacity-40"
                          }`}
                        >
                          <FiX className="text-xs" />
                          <span>Reject</span>
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
