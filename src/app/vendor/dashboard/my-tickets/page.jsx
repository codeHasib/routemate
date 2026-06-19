// app/vendor/dashboard/my-tickets/page.jsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import {
  FiLayers,
  FiMapPin,
  FiTruck,
  FiDollarSign,
  FiClock,
  FiEdit3,
  FiTrash2,
  FiLoader,
  FiAlertCircle,
  FiX,
  FiAlertTriangle,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { useTheme } from "@/context/ThemeContext";

export default function MyTicketsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const [token, setToken] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal Update States
  const [editingTicket, setEditingTicket] = useState(null);
  const [updateTitle, setUpdateTitle] = useState("");
  const [updatePrice, setUpdatePrice] = useState("");
  const [updateQuantity, setUpdateQuantity] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);

  // DELETE MODAL STATE PIPELINES
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [ticketToDeleteId, setTicketToDeleteId] = useState(null);

  // 1. Sync User Security Tokens
  useEffect(() => {
    async function fetchToken() {
      try {
        const { data } = await authClient.token();
        if (data?.token) setToken(data.token);
      } catch (err) {
        console.error("Token alignment failure:", err);
      }
    }
    fetchToken();
  }, []);

  // 2. Query Vendor Inventory Catalog
  const fetchMyTickets = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(
        "https://routemate-backend-nine.vercel.app/api/manage/tickets",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      const data = await res.json();
      if (data.success) {
        setTickets(data.tickets);
      } else {
        setError(data.message || "Failed to load your added tickets registry.");
      }
    } catch (err) {
      setError("Unable to connect with target backend service matrix.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTickets();
  }, [token]);

  // INTERCEPT CLICK OPERATIONS TO TRIGGER VISUAL MODAL OVERLAY
  const triggerDeleteConfirmation = (id) => {
    setTicketToDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  // 3. Execution Pipeline: Delete Manifest Entry
  const handleDelete = async () => {
    if (!token || !ticketToDeleteId) return;

    const id = ticketToDeleteId;
    setIsDeleteModalOpen(false);
    setTicketToDeleteId(null);

    try {
      const res = await fetch(
        `https://routemate-backend-nine.vercel.app/api/manage/tickets/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await res.json();
      if (data.success) {
        setTickets((prev) => prev.filter((ticket) => ticket._id !== id));
      } else {
        toast.error(data.message || "Deletion access rejected.");
      }
    } catch (err) {
      toast.error("Error occurred executing delete signal.");
    }
  };

  // 4. Open Modal and Prep Update States
  const openUpdateModal = (ticket) => {
    setEditingTicket(ticket);
    setUpdateTitle(ticket.title);
    setUpdatePrice(ticket.price);
    setUpdateQuantity(ticket.ticketQuantity);
  };

  // 5. Execution Pipeline: Put Payload Changes
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    try {
      const res = await fetch(
        `https://routemate-backend-nine.vercel.app/api/manage/tickets/${editingTicket._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: updateTitle,
            price: Number(updatePrice),
            ticketQuantity: Number(updateQuantity),
          }),
        },
      );
      const data = await res.json();
      if (data.success) {
        setEditingTicket(null);
        fetchMyTickets(); // Refresh view state entries safely
      } else {
        toast.error(data.message || "Modification pipeline rejected updates.");
      }
    } catch (err) {
      toast.error("Error handling inline updates.");
    } finally {
      setUpdateLoading(false);
    }
  };

  if (sessionLoading || loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-slate-400">
        <FiLoader className="text-xl text-black animate-spin mb-2" />
        <span className="text-[10px] font-bold uppercase tracking-wider">
          Reading Asset Matrix...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* SECTION TITLE HEADER */}
      <div>
        <h1
          className={`text-xl font-extrabold tracking-tight sm:text-2xl flex items-center space-x-2 ${isDark ? "text-white" : "text-black"}`}
        >
          <FiLayers className={isDark ? "text-white" : "text-black"} />
          <span>My Added Tickets</span>
        </h1>
        <p className="text-xs text-slate-400 font-light mt-0.5">
          Review, adjust, or remove your registered travel route products.
          Actions are disabled for items rejected by administrators.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 text-xs font-medium flex items-center space-x-2">
          <FiAlertCircle className="text-base text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* RENDER FALLBACK: EMPTY STOCK STATE */}
      {tickets.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-100 rounded-2xl shadow-xs">
          <p className="text-sm font-semibold text-slate-700">
            No ticket listings documented yet
          </p>
          <p className="text-xs text-slate-400 font-light mt-0.5">
            Navigate to Add Ticket inside the operations console to register
            deployment paths.
          </p>
        </div>
      ) : (
        /* RESPONSIVE 3-COLUMN CONTROL GRID MAPPING ARRAY */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map((ticket) => {
            const isRejected = ticket.status === "rejected";
            const isApproved = ticket.status === "approved";

            return (
              <div
                key={ticket._id}
                className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-xs flex flex-col group transition-all hover:shadow-md"
              >
                {/* TICKET CARD TOP IMAGE COVER DISPLAY */}
                <div className="h-40 w-full bg-slate-100 relative overflow-hidden">
                  <img
                    src={
                      ticket.imageUrl ||
                      "https://placehold.co/600x400/0f172a/ffffff?text=Transit"
                    }
                    alt={ticket.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                  />

                  {/* QUARANTINE FLOATING STATUS STAMP */}
                  <span
                    className={`absolute top-3 right-3 text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs border ${
                      isApproved
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : isRejected
                          ? "bg-red-50 text-red-700 border-red-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    {ticket.status || "pending"}
                  </span>
                </div>

                {/* ASSET METRICS DATA SHEET DESK */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3
                      className="text-sm font-bold text-slate-900 tracking-tight line-clamp-1"
                      title={ticket.title}
                    >
                      {ticket.title}
                    </h3>

                    {/* PATHWAY ROUTE LABELS */}
                    <div className="flex items-center space-x-2 text-xs text-slate-600 font-medium bg-slate-50 border border-slate-100 rounded-xl px-3 py-2">
                      <FiMapPin className="text-slate-400 shrink-0" />
                      <span className="truncate">{ticket.fromLocation}</span>
                      <span className="text-slate-300">→</span>
                      <span className="truncate">{ticket.toLocation}</span>
                    </div>

                    {/* SPEC DETAILS ROW MATRIX */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className="text-[11px] text-slate-500 flex items-center space-x-1">
                        <FiTruck className="text-slate-400" />
                        <span>{ticket.transportType}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center space-x-1 justify-end">
                        <FiClock className="text-slate-400" />
                        <span className="truncate">
                          {ticket.departureTime
                            ? ticket.departureTime.split("T")[0]
                            : "No date"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* PRICE & STOCK METRICS BANNER BOTTOM */}
                  <div className="border-t border-slate-50 pt-3 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider block">
                        Price per Unit
                      </span>
                      <p className="text-sm font-black text-slate-900 flex items-center">
                        <FiDollarSign className="text-xs text-slate-400" />
                        <span className="font-mono">{ticket.price}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider block">
                        Remaining seats
                      </span>
                      <p className="text-xs font-bold text-slate-700 font-mono">
                        {ticket.ticketQuantity} available
                      </p>
                    </div>
                  </div>

                  {/* FORM INTERACTIVE OPERATION LOCK SWITCH TRIGGERS */}
                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    <button
                      type="button"
                      disabled={isRejected}
                      onClick={() => openUpdateModal(ticket)}
                      className="flex items-center justify-center space-x-1.5 px-3 py-2 text-xs font-bold border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-slate-200 transition-all cursor-pointer"
                    >
                      <FiEdit3 className="text-xs text-slate-400" />
                      <span>Update</span>
                    </button>
                    <button
                      type="button"
                      disabled={isRejected}
                      onClick={() => triggerDeleteConfirmation(ticket._id)}
                      className="flex items-center justify-center space-x-1.5 px-3 py-2 text-xs font-bold border border-transparent rounded-xl bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-red-50 transition-all cursor-pointer"
                    >
                      <FiTrash2 className="text-xs" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================= */}
      {/* INLINE EDIT POPUP CONTAINER MODAL COMPONENT */}
      {/* ========================================================= */}
      {editingTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl w-full max-w-md border border-slate-100 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* MODAL HEADER BLOCK */}
            <div className="px-6 py-4 bg-slate-950 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FiEdit3 className="text-amber-400" />
                <span className="text-sm font-bold tracking-tight">
                  Modify Asset Parameters
                </span>
              </div>
              <button
                onClick={() => setEditingTicket(null)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <FiX className="text-base" />
              </button>
            </div>

            {/* MODAL EDIT FIELD BODY FORM */}
            <form onSubmit={handleUpdateSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                  Ticket Route Description Title
                </label>
                <input
                  type="text"
                  required
                  value={updateTitle}
                  onChange={(e) => setUpdateTitle(e.target.value)}
                  className="w-full text-sm px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-black focus:bg-white transition-all text-slate-900 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                    Unit Cost (Price)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={update_price}
                    onChange={(e) => setUpdatePrice(e.target.value)}
                    className="w-full text-sm px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-black focus:bg-white transition-all text-slate-900 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                    Ticket Seat Quantity
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={updateQuantity}
                    onChange={(e) => setUpdateQuantity(e.target.value)}
                    className="w-full text-sm px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-black focus:bg-white transition-all text-slate-900 font-mono"
                  />
                </div>
              </div>

              {/* ACTION EXECUTE TRIGGERS */}
              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingTicket(null)}
                  className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateLoading}
                  className="px-5 py-2.5 bg-slate-950 text-white hover:bg-slate-900 rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center space-x-1 cursor-pointer"
                >
                  {updateLoading ? (
                    <>
                      <FiLoader className="animate-spin text-xs" />
                      <span>Saving Parameters...</span>
                    </>
                  ) : (
                    <span>Commit Changes</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GLOBAL PERSISTENT DESTRUCTIVE CONFIRMATION POPUP */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setTicketToDeleteId(null);
        }}
        onConfirm={handleDelete}
        title="Permanently Delete Ticket Listing?"
        message="Are you completely certain you want to permanently delete this ticket listing? This operation is irreversible and will purge item records immediately."
      />
    </div>
  );
}

// INLINE ANCHORED CONFIRMATION VIEW FOR ENHANCED DASHBOARD RESPONSIVENESS
function DeleteConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur Mesh */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity"
          />

          {/* Modal Container Chassis */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: "spring", duration: 0.35 }}
            className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 border border-slate-100 shadow-2xl transition-all"
          >
            {/* Top Close Axis Toggle */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg border border-slate-100 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <FiX size={13} />
            </button>

            {/* Graphic Hazard Header Node */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-50 text-red-600 rounded-xl border border-red-100 shrink-0">
                <FiAlertTriangle size={18} className="animate-pulse" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold tracking-tight text-slate-900">
                  {title}
                </h3>
                <p className="text-[11px] font-light leading-relaxed text-slate-500">
                  {message}
                </p>
              </div>
            </div>

            {/* Direct Interaction Actions Control Deck */}
            <div className="mt-5 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl text-[11px] font-bold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 active:scale-97 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="px-3.5 py-2 rounded-xl text-[11px] font-bold bg-red-600 hover:bg-red-500 active:scale-97 text-white shadow-md shadow-red-600/10 transition-all cursor-pointer"
              >
                Delete Permanently
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
