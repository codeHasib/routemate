// app/admin/dashboard/profile/page.jsx
"use client";

import { authClient } from "@/lib/auth-client";
import {
  FiUser,
  FiMail,
  FiShield,
  FiCalendar,
  FiActivity,
} from "react-icons/fi";

export default function AdminProfilePage() {
  // Pulling the real logged-in admin data from Better Auth
  const { data: session } = authClient.useSession();

  // Safety fallback if session hasn't loaded yet
  if (!session || !session.user) return null;

  const user = session.user;

  // Clean date formatting (e.g., June 17, 2026)
  const joinDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "June 17, 2026";

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
          Admin Profile
        </h1>
        <p className="text-xs text-slate-400 font-light mt-0.5">
          View your account information, login details, and administrator
          permissions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* COLUMN 1: PROFILE PICTURE CARD */}
        <div className="lg:col-span-1 bg-slate-950 text-white rounded-2xl p-6 border border-slate-900 flex flex-col items-center text-center shadow-xs">
          <div className="relative mb-4">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name}
                className="w-24 h-24 rounded-2xl object-cover ring-4 ring-slate-900 border border-slate-800"
              />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-white text-slate-950 font-black text-2xl flex items-center justify-center ring-4 ring-slate-900">
                {user.name?.slice(0, 2).toUpperCase() || "AD"}
              </div>
            )}

            {/* ROLE ACCENT BADGE */}
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 font-black text-[10px] uppercase tracking-wider px-3 py-0.5 rounded-full shadow-md border-2 border-slate-950">
              {user.role || "Admin"}
            </span>
          </div>

          <div className="mt-2 space-y-1">
            <h2 className="text-lg font-bold tracking-tight text-white">
              {user.name || "System Admin"}
            </h2>
            <p className="text-xs text-slate-400 tracking-tight break-all max-w-xs">
              {user.email || "admin@routemate.com"}
            </p>
          </div>

          <div className="w-full border-t border-slate-900 my-5" />

          {/* STATUS INDICATOR CARD */}
          <div className="w-full flex items-center justify-between bg-slate-900/50 border border-slate-900 rounded-xl px-4 py-3 text-left">
            <div className="flex items-center space-x-2.5">
              <FiActivity className="text-emerald-400 text-sm shrink-0" />
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 leading-none">
                  Account Status
                </p>
                <span className="text-xs font-semibold text-white mt-0.5 inline-block">
                  Active Now
                </span>
              </div>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
          </div>
        </div>

        {/* COLUMN 2 & 3: ACCOUNT DATA ENTRIES */}
        <div className="lg:col-span-2 space-y-6">
          {/* PROFILE DETAILS CARD */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-4 flex items-center space-x-2">
              <FiUser className="text-slate-400" />
              <span>Account Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* DISPLAY NAME */}
              <div className="bg-slate-50/60 border border-slate-100 p-4 rounded-xl">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Full Name
                </span>
                <span className="text-sm font-semibold text-slate-900 mt-1 block">
                  {user.name || "System Admin"}
                </span>
              </div>

              {/* EMAIL */}
              <div className="bg-slate-50/60 border border-slate-100 p-4 rounded-xl">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Email Address
                </span>
                <span className="text-sm font-semibold text-slate-900 mt-1 block">
                  {user.email || "admin@routemate.com"}
                </span>
              </div>

              {/* ACCOUNT ROLE */}
              <div className="bg-slate-50/60 border border-slate-100 p-4 rounded-xl">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Permission Level
                </span>
                <span className="text-sm font-bold text-emerald-600 mt-1 block capitalize flex items-center space-x-1.5">
                  <FiShield className="text-xs shrink-0" />
                  <span>Full {user.role || "Admin"} Access</span>
                </span>
              </div>

              {/* UNIQUE ACCOUNT ID */}
              <div className="bg-slate-50/60 border border-slate-100 p-4 rounded-xl">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  User ID Number
                </span>
                <span
                  className="text-xs font-mono font-medium text-slate-500 mt-1 block truncate select-all"
                  title={user.id}
                >
                  {user.id || "6a32c403d191cb46ea37e488"}
                </span>
              </div>
            </div>
          </div>

          {/* DATES & HISTORY CARD */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-4 flex items-center space-x-2">
              <FiCalendar className="text-slate-400" />
              <span>Account Timeline</span>
            </h3>

            <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center bg-slate-50/40 border border-slate-100 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-slate-950 text-white flex items-center justify-center">
                  <FiCalendar className="text-sm" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">
                    Registration Date
                  </p>
                  <span className="text-sm font-semibold text-slate-900 mt-1 inline-block">
                    {joinDate}
                  </span>
                </div>
              </div>

              <div className="text-xs font-light text-slate-400 sm:text-right border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0">
                Your login session is securely verified. No further actions are
                needed.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
