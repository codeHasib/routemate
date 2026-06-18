// components/TicketCard.jsx
"use client";

import { motion } from "framer-motion";
import { FiChevronRight, FiLayers, FiTag } from "react-icons/fi";
import {
  RiBus2Line,
  RiTrainLine,
  RiShipLine,
  RiCheckLine,
} from "react-icons/ri";
import Link from "next/link";

export default function TicketCard({ ticket, index }) {
  // Dynamic Icon selector matching transport type variants
  const getTransportIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "train":
        return <RiTrainLine />;
      case "ferry":
      case "ship":
        return <RiShipLine />;
      default:
        return <RiBus2Line />; // Default fallback variant
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: "easeOut" }}
      className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-black/15 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
    >
      <div>
        {/* PREMIUM IMAGE DISPLAY LAYER */}
        <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
          <img
            src={
              ticket.image ||
              "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=600"
            }
            alt={ticket.title}
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />

          {/* TRANSPORT TYPE FLOATING BADGE */}
          <div className="absolute top-3 left-3 inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold tracking-wide uppercase border border-white/10">
            {getTransportIcon(ticket.transportType)}
            <span>{ticket.transportType || "Coach"}</span>
          </div>
        </div>

        {/* DETAILS ARCHITECTURE */}
        <div className="p-5">
          <div className="flex justify-between items-start gap-2 mb-2">
            <h3 className="text-base font-bold text-gray-900 group-hover:text-black tracking-tight transition-colors line-clamp-1">
              {ticket.title || "Premium Intercity Route"}
            </h3>
          </div>

          {/* STOCK INVENTORY & METRICS ACCENT */}
          <div className="flex items-center space-x-4 my-3 text-xs font-medium text-gray-500">
            <div className="flex items-center space-x-1">
              <FiLayers className="text-gray-400 text-sm" />
              <span>
                Available Qty:{" "}
                <strong className="text-gray-900 font-semibold">
                  {ticket.ticketQuantity || 0}
                </strong>
              </span>
            </div>
          </div>

          {/* PREMIUM PERKS LIST MATRIX */}
          {ticket.perks && ticket.perks.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-gray-50">
              {ticket.perks.slice(0, 3).map((perk, idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-slate-50 text-[10px] font-medium text-gray-600 border border-gray-100"
                >
                  <RiCheckLine className="text-black text-xs" />
                  <span className="capitalize">{perk}</span>
                </div>
              ))}
              {ticket.perks.length > 3 && (
                <div className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-gray-50 text-[9px] font-bold text-gray-400 border border-dashed border-gray-200">
                  +{ticket.perks.length - 3} more
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* FOOTER ACTION SUMMARY CARD LAYER */}
      <div className="p-5 pt-0 mt-auto">
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-400 font-medium block uppercase tracking-wider">
              Per Unit Fare
            </span>
            <p className="text-lg font-extrabold text-black tracking-tight">
              ${ticket.price || "0.00"}
            </p>
          </div>

          <Link
            href={`/tickets/${ticket._id}`}
            className="inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-black text-white rounded-xl text-xs font-semibold hover:bg-gray-900 transition-all active:scale-[0.97] shadow-sm group/btn"
          >
            <span>See Details</span>
            <FiChevronRight className="text-sm transition-transform group-hover/btn:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
