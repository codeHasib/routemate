"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { isPast, differenceInSeconds } from "date-fns";
import {
  FiMapPin,
  FiX,
  FiUser,
  FiLayers,
  FiClock,
  FiAlertTriangle,
} from "react-icons/fi";
import { authClient } from "@/lib/auth-client";

export default function TicketDetailsPage({ params }) {
  const { id } = use(params);
  const router = useRouter();

  // Core Ticket Data and UI Engine State
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isOutOfStock, setIsOutOfStock] = useState(false);
  const [isPastDeparture, setIsPastDeparture] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Countdown Display Segment State
  const [timeBlocks, setTimeBlocks] = useState({
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  // 1. Initial Data Fetching Hydration
  useEffect(() => {
    fetch(`https://routemate-backend-nine.vercel.app/api/public/tickets/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTicket(data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Hydration Error:", err);
        setLoading(false);
      });
  }, [id]);

  // 2. Real-time Live Inline Input Validation
  useEffect(() => {
    if (ticket) {
      const parsedQuantity = parseInt(quantity, 10);
      const isInvalidValue =
        isNaN(parsedQuantity) ||
        parsedQuantity < 1 ||
        parsedQuantity > ticket.ticketQuantity;
      setIsOutOfStock(isInvalidValue);
    }
  }, [quantity, ticket]);

  // 3. Premium Countdown Clock Engine
  useEffect(() => {
    if (!ticket) return;

    const calculateTimeRemaining = () => {
      const departureDate = new Date(ticket.departureTime);
      const now = new Date();

      if (isPast(departureDate)) {
        setIsPastDeparture(true);
        setTimeBlocks({ hours: "00", minutes: "00", seconds: "00" });
        return;
      }

      const diffInSecs = differenceInSeconds(departureDate, now);
      if (diffInSecs <= 0) {
        setIsPastDeparture(true);
        setTimeBlocks({ hours: "00", minutes: "00", seconds: "00" });
      } else {
        const h = Math.floor(diffInSecs / 3600);
        const m = Math.floor((diffInSecs % 3600) / 60);
        const s = diffInSecs % 60;

        setTimeBlocks({
          hours: h.toString().padStart(2, "0"),
          minutes: m.toString().padStart(2, "0"),
          seconds: s.toString().padStart(2, "0"),
        });
      }
    };

    calculateTimeRemaining();
    const clockInterval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(clockInterval);
  }, [ticket]);

  // 4. Form Submission and Transaction Execution Logic
  const handleBookSubmit = async () => {
    setSubmitError("");

    // 1. Fetch the active token/session data
    const { data: session } = await authClient.token();
    const { data } = await authClient.getSession();
    // 2. Extract the user details dynamically from the session context
    const currentUserName = data?.user?.name || "Passenger";
    const currentUserEmail = data?.user?.email || "customer@routemate.com";

    const bookingQuantity = parseInt(quantity, 10);

    const payload = {
      ticketId: id,
      vendorId: ticket.vendorId,
      selectedSeats: Array(bookingQuantity).fill("Pending"),
      totalAmount: ticket.price * bookingQuantity,
      ticketTitle: ticket.title,

      // --- CRITICAL IDENTITY FIELDS ADDED HERE ---
      userName: currentUserName,
      userEmail: currentUserEmail,
      // -------------------------------------------

      from: ticket.fromLocation,
      to: ticket.toLocation,
      departureTime: ticket.departureTime,
      ticketImage: ticket.imageUrl,
    };

    try {
      const response = await fetch(
        "https://routemate-backend-nine.vercel.app/api/bookings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.message || "Server transaction processing failure.",
        );
      }

      setShowModal(false);
      router.push("/user/dashboard/my-bookings");
    } catch (err) {
      setSubmitError(err.message);
    }
  };

  if (loading)
    return (
      <div className="p-20 text-center font-semibold text-gray-600">
        Retrieving schedule manifest...
      </div>
    );
  if (!ticket)
    return (
      <div className="p-20 text-center font-semibold text-red-500">
        Ticket configuration not found.
      </div>
    );

  // Global Check Against Requirements Conditions
  const isTicketSoldOut = ticket.ticketQuantity === 0;
  const isBookingActionDisabled = isPastDeparture || isTicketSoldOut;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="grid lg:grid-cols-3 gap-12">
        {/* LEFT COLUMN: VISUAL CONTENT AND ROUTE SPECS */}
        <div className="lg:col-span-2 space-y-8">
          <div className="relative overflow-hidden rounded-3xl group shadow-md">
            <img
              src={ticket.imageUrl}
              alt={ticket.title}
              className="w-full h-[420px] object-cover transform group-hover:scale-102 transition duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl font-black tracking-tight text-gray-900">
              {ticket.title}
            </h1>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-gray-700 font-medium text-sm">
              <FiMapPin className="text-indigo-600" /> {ticket.fromLocation} to{" "}
              {ticket.toLocation}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl flex items-center gap-4">
              <div className="p-4 bg-indigo-50 rounded-xl text-indigo-600">
                <FiUser size={24} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                  Assigned Fleet Vendor
                </p>
                <p className="font-bold text-gray-800 text-lg">
                  {ticket.vendorName || "Verified Partner"}
                </p>
              </div>
            </div>

            <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl flex items-center gap-4">
              <div className="p-4 bg-emerald-50 rounded-xl text-emerald-600">
                <FiLayers size={24} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                  Remaining Seat Allocation
                </p>
                <p
                  className={`font-black text-lg ${isTicketSoldOut ? "text-red-500" : "text-gray-800"}`}
                >
                  {isTicketSoldOut
                    ? "Sold Out"
                    : `${ticket.ticketQuantity} Seats Left`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: STICKY BOOKING ACTION CENTER */}
        <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-xl h-fit sticky top-10 space-y-8">
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">
              Standard Fare Price
            </p>
            <p className="text-5xl font-black text-gray-900">৳{ticket.price}</p>
          </div>

          {/* HIGHLY STYLIZED LIVE INTERACTIVE DIGITAL COUNTDOWN BLOCK */}
          <div className="bg-gray-950 text-white p-6 rounded-2xl shadow-inner relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <FiClock size={72} />
            </div>
            <p className="text-[10px] tracking-widest font-black uppercase text-gray-400 mb-3 block text-center">
              {isPastDeparture
                ? "Schedule Status Context"
                : "Live Time Until Departure"}
            </p>

            {isPastDeparture ? (
              <div className="text-center py-2 text-red-400 font-bold tracking-wide uppercase text-sm animate-pulse">
                Departure Window Expired
              </div>
            ) : (
              <div className="flex justify-center items-center gap-2 font-mono">
                <div className="text-center">
                  <span className="text-3xl font-black block tracking-tight bg-gray-900 p-2 rounded-lg border border-gray-800 min-w-[50px]">
                    {timeBlocks.hours}
                  </span>
                  <span className="text-[9px] text-gray-500 uppercase font-bold mt-1 block">
                    Hrs
                  </span>
                </div>
                <span className="text-2xl font-bold text-indigo-500 pb-4 animate-ping">
                  :
                </span>
                <div className="text-center">
                  <span className="text-3xl font-black block tracking-tight bg-gray-900 p-2 rounded-lg border border-gray-800 min-w-[50px]">
                    {timeBlocks.minutes}
                  </span>
                  <span className="text-[9px] text-gray-500 uppercase font-bold mt-1 block">
                    Min
                  </span>
                </div>
                <span className="text-2xl font-bold text-indigo-500 pb-4 animate-ping">
                  :
                </span>
                <div className="text-center">
                  <span className="text-3xl font-black block tracking-tight bg-gray-900 p-2 rounded-lg border border-gray-800 min-w-[50px]">
                    {timeBlocks.seconds}
                  </span>
                  <span className="text-[9px] text-gray-500 uppercase font-bold mt-1 block">
                    Sec
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* BOOKING TRIGGER ACTION SELECTION */}
          <button
            onClick={() => setShowModal(true)}
            disabled={isBookingActionDisabled}
            className={`w-full py-4 rounded-xl font-black text-lg shadow-md tracking-wide transition duration-300 ${
              isBookingActionDisabled
                ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                : "bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-lg active:scale-98"
            }`}
          >
            {isPastDeparture
              ? "Departure Passed"
              : isTicketSoldOut
                ? "Sold Out"
                : "Book Seats Now"}
          </button>
        </div>
      </div>

      {/* MODAL TRANSACTIONS INTERACTION INTERFACE */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-950/60 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all duration-300">
          <div className="bg-white p-8 rounded-3xl w-full max-w-md relative shadow-2xl border border-gray-100 transform scale-100 transition duration-300">
            <button
              onClick={() => {
                setShowModal(false);
                setSubmitError("");
              }}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-2 hover:bg-gray-50 rounded-full transition"
            >
              <FiX size={20} />
            </button>

            <div className="mb-6">
              <h2 className="text-2xl font-black text-gray-900 mb-1">
                Confirm Ticket Reservation
              </h2>
              <p className="text-sm text-gray-500">
                Specify the allocation count needed for this journey.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs uppercase font-black text-gray-400 tracking-wider mb-2 block">
                  Quantity Field
                </label>
                <input
                  type="number"
                  min="1"
                  max={ticket.ticketQuantity}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className={`w-full p-4 border rounded-xl font-bold transition text-lg outline-none ${
                    isOutOfStock
                      ? "border-red-500 bg-red-50 text-red-900 focus:ring-2 focus:ring-red-200"
                      : "border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  }`}
                />
              </div>

              {/* LIVE CONDITION NOTIFICATION WARNING MODULES */}
              {isOutOfStock && (
                <div className="p-4 bg-red-50 text-red-700 text-xs font-semibold rounded-xl flex items-center gap-2 border border-red-100">
                  <FiAlertTriangle className="flex-shrink-0" size={16} />
                  <span>
                    The entry cannot exceed available limits (Max:{" "}
                    {ticket.ticketQuantity} seats).
                  </span>
                </div>
              )}

              {submitError && (
                <div className="p-4 bg-amber-50 text-amber-800 text-xs font-semibold rounded-xl flex items-center gap-2 border border-amber-200">
                  <FiAlertTriangle className="flex-shrink-0" size={16} />
                  <span>{submitError}</span>
                </div>
              )}

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between mb-4">
                <span className="font-bold text-gray-500">
                  Gross Payable Balance:
                </span>
                <span className="text-2xl font-black text-indigo-600">
                  ৳
                  {isNaN(parseInt(quantity))
                    ? 0
                    : ticket.price * parseInt(quantity, 10)}
                </span>
              </div>

              <button
                disabled={isOutOfStock}
                onClick={handleBookSubmit}
                className={`w-full py-4 rounded-xl font-black tracking-wide shadow transition duration-300 ${
                  isOutOfStock
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                    : "bg-black hover:bg-gray-900 text-white active:scale-98"
                }`}
              >
                Confirm Transaction
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
