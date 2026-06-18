"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  FiCheckCircle,
  FiPrinter,
  FiArrowLeft,
  FiLoader,
  FiMapPin,
  FiCalendar,
  FiUser,
  FiHash,
} from "react-icons/fi";
import { authClient } from "@/lib/auth-client";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");

  const [verifying, setVerifying] = useState(true);
  const [bookingData, setBookingData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!sessionId) {
      setErrorMessage("No active payment token context detected.");
      setVerifying(false);
      return;
    }

    async function completeTransactionPipeline() {
      try {
        // 1. Ask our API Route what booking matches this Stripe checkout token
        const verifyRes = await fetch(
          `/api/checkout_sessions/verify?session_id=${sessionId}`,
        );
        const verifyData = await verifyRes.json();

        if (!verifyRes.ok || !verifyData.bookingId) {
          throw new Error(
            verifyData.error || "Failed to confirm payment clear state.",
          );
        }

        const { bookingId, paymentIntentId, paymentStatus } = verifyData;

        if (paymentStatus !== "paid") {
          throw new Error(
            "Stripe reports transaction is incomplete or outstanding.",
          );
        }

        // 2. Transmit the updates directly to our Express Mongo database
        const { data: auth } = await authClient.token();
        const updateRes = await fetch(
          `http://localhost:5000/api/bookings/${bookingId}/status`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth?.token}`,
            },
            body: JSON.stringify({
              status: "paid",
              paymentIntentId: paymentIntentId,
            }),
          },
        );

        if (!updateRes.ok) {
          throw new Error("Database sync rejected payment completion tags.");
        }

        // 3. Fetch all booking parameters to paint our receipt ticket interface
        const baseBookingsRes = await fetch(
          "http://localhost:5000/api/bookings",
          {
            headers: { Authorization: `Bearer ${auth?.token}` },
          },
        );
        const allBookings = await baseBookingsRes.json();

        if (allBookings.success) {
          const targetedMatch = allBookings.data.find(
            (b) => b._id === bookingId,
          );
          setBookingData(targetedMatch);
        }
      } catch (err) {
        console.error("Pipeline breakdown:", err);
        setErrorMessage(err.message || "An unexpected error occurred.");
      } finally {
        setVerifying(false);
      }
    }

    completeTransactionPipeline();
  }, [sessionId]);

  const handlePrint = () => {
    window.print();
  };

  if (verifying) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <FiLoader className="animate-spin text-indigo-600 mb-4" size={40} />
        <p className="text-slate-600 font-bold tracking-tight">
          Securing payment clearance manifest...
        </p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-full mb-4">⚠️</div>
        <h2 className="text-xl font-black text-slate-900">
          Verification Failure
        </h2>
        <p className="text-slate-500 mt-2 max-w-sm text-sm">{errorMessage}</p>
        <button
          onClick={() => router.push("/user/dashboard/my-bookings")}
          className="mt-6 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold"
        >
          Return to History
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8 print:bg-white print:py-0">
      <div className="max-w-2xl mx-auto space-y-8 print:max-w-full">
        {/* SUCCESS CARD BANNER - HIDDEN ON PRINT */}
        <div className="bg-white border border-slate-100 rounded-3xl p-8 text-center shadow-xl shadow-slate-100/40 print:hidden">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-50 rounded-full text-emerald-500 mb-4">
            <FiCheckCircle size={36} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Payment Complete!
          </h1>
          <p className="text-slate-500 mt-2 text-sm">
            Your seats are successfully reserved. Your printable voucher receipt
            is generated below.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-indigo-600 text-white px-5 py-3 rounded-2xl text-xs font-bold transition-all shadow-md active:scale-98"
            >
              <FiPrinter size={16} /> Print / Save PDF Document
            </button>
            <button
              onClick={() => router.push("/user/dashboard/my-bookings")}
              className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-3 rounded-2xl text-xs font-bold transition-all"
            >
              <FiArrowLeft size={16} /> Back to My Bookings
            </button>
          </div>
        </div>

        {/* PRINTABLE VOUCHER TICKET WRAPPER */}
        <div
          id="printable-ticket-body"
          className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm print:border-0 print:shadow-none"
        >
          <div className="bg-slate-900 p-8 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:bg-black">
            <div>
              <p className="text-indigo-400 font-black tracking-widest text-[10px] uppercase">
                RouteMate Transit Pass
              </p>
              <h2 className="text-xl font-bold tracking-tight mt-1">
                {bookingData?.ticketTitle || "Official Journey Voucher"}
              </h2>
            </div>
            <div className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider print:text-emerald-600 print:border-emerald-600">
              Transaction Settled
            </div>
          </div>

          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-slate-100 pb-6">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                  <FiUser /> Passenger Account
                </span>
                <p className="font-bold text-slate-800 text-sm">
                  {bookingData?.userName || "Verified Passenger"}
                </p>
                <p className="text-xs text-slate-500">
                  {bookingData?.userEmail || ""}
                </p>
              </div>
              <div className="space-y-1 sm:text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center justify-start sm:justify-end gap-1">
                  <FiHash /> Transaction ID
                </span>
                <p className="font-mono text-xs text-slate-700 break-all">
                  {bookingData?.paymentIntentId || "Stripe Test Mode Reference"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-slate-100 pb-6">
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                  <FiMapPin className="text-indigo-500" /> Logistics Routing
                </span>
                <p className="text-sm font-black text-slate-800">
                  {bookingData?.from}{" "}
                  <span className="text-indigo-500 mx-1">→</span>{" "}
                  {bookingData?.to}
                </p>
              </div>
              <div className="space-y-2 sm:text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center justify-start sm:justify-end gap-1">
                  <FiCalendar className="text-indigo-500" /> Planned Departure
                </span>
                <p className="text-sm font-bold text-slate-800">
                  {bookingData?.departureTime
                    ? new Date(bookingData.departureTime).toLocaleString(
                        undefined,
                        { dateStyle: "medium", timeStyle: "short" },
                      )
                    : "N/A"}
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl grid grid-cols-2 gap-4 print:bg-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Allocated Fleet Seats
                </span>
                <p className="text-xl font-black text-slate-800 mt-0.5">
                  {bookingData?.selectedSeats?.length || 1} Reserved
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Gross Capital Charged
                </span>
                <p className="text-xl font-black text-indigo-600 mt-0.5">
                  ৳{bookingData?.totalAmount?.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="pt-2 text-center text-[10px] text-slate-400 font-medium italic">
              Thank you for traveling with RouteMate. Present this digital code
              voucher or physical printout upon boarding.
            </div>
          </div>
        </div>
      </div>

      {/* TAILWIND INLINE PRINT CSS OVERRIDES */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:bg-black {
            background-color: #000000 !important;
          }
          .print\\:bg-slate-100 {
            background-color: #f1f5f9 !important;
          }
          .print\\:border-0 {
            border: 0 !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
          <FiLoader className="animate-spin text-indigo-600 mb-4" size={40} />
          <p className="text-slate-600 font-bold">Mounting view framework...</p>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
