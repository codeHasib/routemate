"use client";
import { useState, useEffect } from "react";
import TicketCard from "@/components/TicketCard";
import {
  FiSearch,
  FiInbox,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

export default function AllTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setPage(1);
  }, [search, type, sort]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          search,
          type,
          sort,
          page,
          limit: 9,
        });
        const res = await fetch(
          `http://localhost:5000/api/public/tickets?${params.toString()}`,
        );
        const json = await res.json();
        if (json.success) {
          setTickets(json.data);
          setTotalPages(json.totalPages);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [search, type, sort, page]);

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-12 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-3.5 text-gray-400" />
          <input
            placeholder="Search city..."
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-100 outline-none focus:border-gray-300 transition-colors"
          />
        </div>
        <select
          onChange={(e) => setType(e.target.value)}
          className="px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-sm font-medium outline-none"
        >
          <option value="">All Types</option>
          <option value="bus">Bus</option>
          <option value="train">Train</option>
          <option value="ship">Ship</option>
        </select>
        <select
          onChange={(e) => setSort(e.target.value)}
          className="px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-sm font-medium outline-none"
        >
          <option value="">Sort Price</option>
          <option value="price-low">Low to High</option>
          <option value="price-high">High to Low</option>
        </select>
      </div>

      {/* Content Rendering */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-96 bg-gray-100 animate-pulse rounded-2xl"
            />
          ))}
        </div>
      ) : tickets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <FiInbox size={48} className="mb-4 opacity-50" />
          <p className="font-semibold text-lg text-gray-900">
            No tickets found
          </p>
          <p className="text-sm">Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tickets.map((t, idx) => (
            <TicketCard key={t._id} ticket={t} index={idx} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && (
        <div className="flex items-center justify-center space-x-4 mt-12">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="p-3 rounded-full bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-30 transition-all"
          >
            <FiChevronLeft />
          </button>

          <span className="font-bold text-sm bg-gray-100 px-4 py-2 rounded-xl">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="p-3 rounded-full bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-30 transition-all"
          >
            <FiChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}
