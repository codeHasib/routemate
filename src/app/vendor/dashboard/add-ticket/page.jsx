// app/vendor/dashboard/add-ticket/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  FiPlusCircle,
  FiMapPin,
  FiTruck,
  FiDollarSign,
  FiLayers,
  FiClock,
  FiCheckSquare,
  FiUploadCloud,
  FiUser,
  FiMail,
  FiLoader,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";
import { useTheme } from "@/context/ThemeContext";

export default function AddTicketPage() {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Security Token Storage
  const [token, setToken] = useState(null);

  // Form State Layout
  const [title, setTitle] = useState("");
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [transportType, setTransportType] = useState("Bus");
  const [price, setPrice] = useState("");
  const [ticketQuantity, setTicketQuantity] = useState("");
  const [departureTime, setDepartureTime] = useState("");

  // Perks Map Array Matrix
  const [perks, setPerks] = useState({
    AC: false,
    Breakfast: false,
    WiFi: false,
    Water: false,
    Pillow: false,
  });

  // Image Upload Parameters
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // Interface State Signals
  const [formLoading, setFormLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Pull Cryptographic JWT Access Token out of Better Auth Cache
  useEffect(() => {
    async function fetchToken() {
      try {
        const { data } = await authClient.token();
        if (data?.token) setToken(data.token);
      } catch (err) {
        console.error("Failed to sync authorization headers:", err);
      }
    }
    fetchToken();
  }, []);

  // Handle local image file previews safely
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Toggle utility choices array
  const handleCheckboxChange = (key) => {
    setPerks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Central submission handler pipeline
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setFormLoading(true);

    if (!token) {
      setErrorMessage("Authorization token missing. Re-authenticate to save.");
      setFormLoading(false);
      return;
    }

    try {
      let uploadedImageUrl = "";
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);

        const imgbbApiKey = `${process.env.NEXT_PUBLIC_IMGBB_API}`;

        const imgbbResponse = await fetch(
          `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
          {
            method: "POST",
            body: formData,
          },
        );

        const imgbbData = await imgbbResponse.json();

        if (imgbbData.success) {
          uploadedImageUrl = imgbbData.data.url;
        } else {
          throw new Error(
            imgbbData.error?.message || "ImgBB image hosting upload failed.",
          );
        }
      }

      // 2. PARSE COMPLETED STRUCTURAL PAYLOAD COMPONENT
      const selectedPerks = Object.keys(perks).filter((key) => perks[key]);

      const ticketPayload = {
        title,
        fromLocation,
        toLocation,
        transportType,
        price: Number(price),
        ticketQuantity: Number(ticketQuantity), // This value will decrement safely inside the DB during checkouts
        departureTime,
        perks: selectedPerks,
        imageUrl:
          uploadedImageUrl ||
          "https://placehold.co/600x400/0f172a/ffffff?text=RouteMate+Ticket",
        vendorName: session?.user?.name || "Unknown Merchant",
        vendorEmail: session?.user?.email || "unknown@merchant.com",
      };

      // 3. EXECUTE REQ.BODY TARGET TO EXPRESS ENGINE BACKEND
      const res = await fetch(
        "https://routemate-backend-nine.vercel.app/api/manage/tickets",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(ticketPayload),
        },
      );

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(
          result.message || "Failed to post ticket mapping parameters.",
        );
      }

      setSuccessMessage(
        "Ticket posted successfully! Awaiting administrator approval before release.",
      );

      // Auto-reroute user over to pipeline index tracking panel view after delay
      setTimeout(() => {
        router.push("/vendor/dashboard/my-tickets");
      }, 2000);
    } catch (err) {
      setErrorMessage(
        err.message ||
          "An unexpected validation exception was trapped inside the console.",
      );
    } finally {
      setFormLoading(false);
    }
  };

  if (sessionLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-slate-400">
        <FiLoader className="text-xl text-black animate-spin mb-2" />
        <span className="text-[10px] font-bold uppercase tracking-wider">
          Loading Platform Context...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl pb-12">
      {/* HEADER ROW CONTROL CORES */}
      <div>
        <h1
          className={`text-xl font-extrabold tracking-tight sm:text-2xl flex items-center space-x-2 ${isDark ? "text-white" : "text-black"}`}
        >
          <FiPlusCircle className="text-amber-500" />
          <span>Publish Travel Ticket Listing</span>
        </h1>
        <p className="text-xs text-slate-400 font-light mt-0.5">
          Deploy a fresh vector route ticket manifest to the staging directory
          database. Listings initialize with a strict quarantined{" "}
          <span className="font-semibold text-amber-600">pending</span>{" "}
          clearance flag.
        </p>
      </div>

      {/* ALERTS NOTIFICATION LOG HOUSING */}
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 text-xs font-medium flex items-center space-x-2.5 shadow-xs">
          <FiAlertCircle className="text-base shrink-0 text-red-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 text-xs font-medium flex items-center space-x-2.5 shadow-xs">
          <FiCheckCircle className="text-base shrink-0 text-emerald-500" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* CORE INPUT DATA FORM SHEET */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION I: PRIMARY MANIFEST DETAILS */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 md:p-6 shadow-xs space-y-4">
          <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest border-b border-slate-50 pb-2">
            ADD ROUTES
          </h3>

          {/* TICKET TITLE */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
              Ticket Description Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Dhaka to Chattogram Premium AC Express Sleeper"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-sm px-4 py-3 bg-slate-50 border border-slate-200/70 rounded-xl focus:outline-hidden focus:border-black focus:bg-white transition-all text-slate-900 font-medium placeholder-slate-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* FROM LOCATION */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 flex items-center space-x-1">
                <FiMapPin className="text-slate-400" />
                <span>Origin (From)</span>
              </label>
              <input
                type="text"
                required
                placeholder="Departure terminal hub city"
                value={fromLocation}
                onChange={(e) => setFromLocation(e.target.value)}
                className="w-full text-sm px-4 py-3 bg-slate-50 border border-slate-200/70 rounded-xl focus:outline-hidden focus:border-black focus:bg-white transition-all text-slate-900"
              />
            </div>

            {/* TO LOCATION */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 flex items-center space-x-1">
                <FiMapPin className="text-slate-400" />
                <span>Destination (To)</span>
              </label>
              <input
                type="text"
                required
                placeholder="Arrival destination city terminal"
                value={toLocation}
                onChange={(e) => setToLocation(e.target.value)}
                className="w-full text-sm px-4 py-3 bg-slate-50 border border-slate-200/70 rounded-xl focus:outline-hidden focus:border-black focus:bg-white transition-all text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* SECTION II: DEPLOYMENT METRICS MATRIX */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 md:p-6 shadow-xs space-y-4">
          <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest border-b border-slate-50 pb-2">
            Add category date and price
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* TRANSPORT TYPE */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 flex items-center space-x-1">
                <FiTruck className="text-slate-400" />
                <span>Transport Type</span>
              </label>
              <select
                value={transportType}
                onChange={(e) => setTransportType(e.target.value)}
                className="w-full text-sm px-4 py-3 bg-slate-50 border border-slate-200/70 rounded-xl focus:outline-hidden focus:border-black focus:bg-white transition-all text-slate-900 font-semibold"
              >
                <option value="Bus">Bus Carrier</option>
                <option value="Train">Railway Transport</option>
                <option value="Air">Aviation Flight</option>
                <option value="Launch">Waterway Vessel / Launch</option>
              </select>
            </div>

            {/* PRICE PER UNIT */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 flex items-center space-x-1">
                <FiDollarSign className="text-slate-400" />
                <span>Unit Cost (Price per Unit)</span>
              </label>
              <input
                type="number"
                required
                min="1"
                placeholder="Price value"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full text-sm px-4 py-3 bg-slate-50 border border-slate-200/70 rounded-xl focus:outline-hidden focus:border-black focus:bg-white transition-all text-slate-900 font-mono"
              />
            </div>

            {/* TICKET QUANTITY */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 flex items-center space-x-1">
                <FiLayers className="text-slate-400" />
                <span>Total Seats</span>
              </label>
              <input
                type="number"
                required
                min="1"
                placeholder="Available stock volume"
                value={ticketQuantity}
                onChange={(e) => setTicketQuantity(e.target.value)}
                className="w-full text-sm px-4 py-3 bg-slate-50 border border-slate-200/70 rounded-xl focus:outline-hidden focus:border-black focus:bg-white transition-all text-slate-900 font-mono"
              />
            </div>
          </div>

          {/* DEPARTURE DATE & TIME */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 flex items-center space-x-1">
              <FiClock className="text-slate-400" />
              <span>Departure Schedule Date & Time Timestamp</span>
            </label>
            <input
              type="datetime-local"
              required
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
              className="w-full text-sm px-4 py-3 bg-slate-50 border border-slate-200/70 rounded-xl focus:outline-hidden focus:border-black focus:bg-white transition-all text-slate-900 font-medium"
            />
          </div>
        </div>

        {/* SECTION III: UTILITY PERKS & MEDIA ATTACHMENTS */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 md:p-6 shadow-xs space-y-5">
          <div>
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest border-b border-slate-50 pb-2">
              Extra facilities
            </h3>
          </div>

          {/* PERKS CHECKBOXES ROW */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">
              Complementary Route Perks Provided
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {Object.keys(perks).map((key) => (
                <button
                  type="button"
                  key={key}
                  onClick={() => handleCheckboxChange(key)}
                  className={`flex items-center space-x-2 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all text-left ${
                    perks[key]
                      ? "bg-slate-950 border-slate-950 text-white shadow-xs"
                      : "bg-slate-50 border-slate-200/60 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <FiCheckSquare
                    className={`text-sm ${perks[key] ? "text-amber-400" : "text-slate-300"}`}
                  />
                  <span>{key}</span>
                </button>
              ))}
            </div>
          </div>

          {/* SEPARATOR VECTOR LINE */}
          <div className="border-t border-slate-100" />

          {/* IMAGE UPLOAD HOUSING PANEL */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">
              Add Transport image
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              {/* FILE FIELD DROP DRAG EMULATOR */}
              <div className="md:col-span-2 relative border-2 border-dashed border-slate-200 hover:border-black rounded-2xl p-6 bg-slate-50/40 text-center transition-colors group cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                />
                <FiUploadCloud className="text-2xl text-slate-400 group-hover:text-black mx-auto mb-2 transition-colors" />
                <span className="text-xs font-bold text-slate-800 block">
                  {imageFile ? imageFile.name : "Select Transport Image"}
                </span>
                <span className="text-[10px] text-slate-400 font-light mt-0.5 block">
                  PNG, JPG, or WEBP type only
                </span>
              </div>

              {/* IMAGE LIVE VIEW PREVIEW PANEL WINDOW */}
              <div className="md:col-span-1 flex justify-center">
                <div className="w-full h-32 bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden relative flex items-center justify-center">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview layout"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 text-center px-4">
                      Image Preview
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION IV: IMMUTABLE IDENTITY READONLY METADATA */}
        <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-5 md:p-6 shadow-inner space-y-4">
          <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest border-b border-slate-200/50 pb-2">
            Vendor Infos
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* VENDOR NAME READONLY */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center space-x-1">
                <FiUser />
                <span>Vendor Name</span>
              </label>
              <input
                type="text"
                readOnly
                value={session?.user?.name || "Loading context signature..."}
                className="w-full text-xs font-semibold px-4 py-3 bg-slate-200/60 border border-slate-300/40 rounded-xl text-slate-500 cursor-not-allowed select-none focus:outline-hidden"
              />
            </div>

            {/* VENDOR EMAIL READONLY */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center space-x-1">
                <FiMail />
                <span>Vendor Email</span>
              </label>
              <input
                type="text"
                readOnly
                value={session?.user?.email || "Loading context signature..."}
                className="w-full text-xs font-mono px-4 py-3 bg-slate-200/60 border border-slate-300/40 rounded-xl text-slate-500 cursor-not-allowed select-none focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* SUBMISSION SUB-DOCK INTERACTION BUTTON */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={formLoading}
            className="w-full sm:w-auto min-w-[180px] bg-slate-950 text-white hover:bg-slate-900 font-bold text-sm px-6 py-3.5 rounded-xl transition-all shadow-md active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {formLoading ? (
              <>
                <FiLoader className="text-base animate-spin" />
                <span>Processing Upload Pipelines...</span>
              </>
            ) : (
              <span>Add Ticket Listing</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
