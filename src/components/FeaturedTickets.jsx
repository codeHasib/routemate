// components/FeaturedTickets.jsx
import TicketCard from "./TicketCard";
import { RiSparkling2Fill } from "react-icons/ri";

export default function FeaturedTickets({ tickets }) {
  if (!tickets || tickets.length === 0) return null;

  return (
    <section className="py-20 border-t border-gray-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER BRANDING AREA */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-black text-white mb-4 shadow-sm">
            <RiSparkling2Fill className="text-xs text-yellow-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Premium Choices
            </span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl mb-4">
            Featured Premium Routes
          </h2>
          <p className="text-sm sm:text-base font-light tracking-wide leading-relaxed">
            Handpicked premium departures matching maximum reliability metrics.
            Approved directly by RouteMate Admins.
          </p>
        </div>

        {/* RESPONSIBLE AUTO-FITTING RESPONSIVE INVENTORY GRID */}
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
