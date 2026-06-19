"use client";

import { useTheme } from "@/context/ThemeContext";
import TicketCard from "./TicketCard";
import { RiTimeLine } from "react-icons/ri";

export default function LatestTickets({ tickets }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  if (!tickets || tickets.length === 0) return null;

  return (
    <section className="py-20 border-t border-gray-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* SECTION HEADER AREA */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="max-w-xl">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-100 text-black mb-4 border border-gray-200/60">
              <RiTimeLine className="text-xs text-gray-600" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600">
                Just Added
              </span>
            </div>
            <h2
              className={`text-3xl font-extrabold tracking-tight sm:text-4xl ${
                isDark ? "text-white" : "text-black"
              }`}
            >
              Latest Live Deliveries
            </h2>
            <p
              className={`text-sm font-light tracking-wide mt-2 leading-relaxed ${
                isDark ? "text-white" : "text-black"
              }`}
            >
              Freshly scheduled transit operations posted by verified vendors.
              Book early to secure premium seating arrangements.
            </p>
          </div>
        </div>

        {/* 6-8 RESPONSIVE ITEM GRID CARD LAYOUT */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tickets.map((ticket, index) => (
            <TicketCard
              key={ticket._id.toString()}
              ticket={ticket}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
