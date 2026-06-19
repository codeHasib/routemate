"use client";
import { useEffect, useState } from "react";
import { FiDollarSign, FiClock, FiHash, FiFileText } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTransactionHistory() {
      try {
        // 1. Retrieve the secure user session token
        const { data } = await authClient.token();
        const token = data?.token;

        if (!token) {
          setError("You must be logged in to view transactions.");
          setLoading(false);
          return;
        }

        // 2. Fetch from your Express backend route
        const res = await fetch(
          "https://routemate-backend-nine.vercel.app/api/transactions/history",
          {
            cache: "no-store",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        const result = await res.json();

        if (result.success) {
          setTransactions(result.data);
        } else {
          setError(result.message || "Failed to load payment history.");
        }
      } catch (err) {
        console.error("Transaction fetch error:", err);
        setError("An error occurred while connecting to the server.");
      } finally {
        setLoading(false);
      }
    }

    fetchTransactionHistory();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-sm font-medium text-slate-500">
        Loading your payment history...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-sm font-semibold text-red-500">⚠️ {error}</div>
    );
  }

  return (
    <div className="p-4 space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-xl font-black text-slate-800 tracking-tight">
          Transaction History
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Review and track your successfully settled platform payments.
        </p>
      </div>

      {transactions.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500 text-sm">
          No transactions found. Your completed ticket payments will appear
          here.
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="p-4 flex items-center gap-1">
                    <FiHash /> Transaction ID
                  </th>
                  <th className="p-4">
                    <FiFileText /> Ticket Title
                  </th>
                  <th className="p-4">
                    <FiClock /> Payment Date
                  </th>
                  <th className="p-4 text-right">
                    <FiDollarSign /> Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {transactions.map((tx) => (
                  <tr
                    key={tx._id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    {/* Transaction ID */}
                    <td className="p-4 font-mono text-slate-500 tracking-tight">
                      {tx.paymentIntentId || "Stripe_Test_Id"}
                    </td>

                    {/* Ticket Title */}
                    <td className="p-4 font-bold text-slate-800">
                      {tx.ticketTitle || "Transit Journey Route"}
                    </td>

                    {/* Payment Date */}
                    <td className="p-4 text-slate-500">
                      {tx.createdAt
                        ? new Date(tx.createdAt).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "N/A"}
                    </td>

                    {/* Amount Charged */}
                    <td className="p-4 text-right font-black text-emerald-600 text-sm">
                      BDT{(tx.totalAmount || 0).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
