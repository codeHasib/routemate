"use client";

import { authClient } from "@/lib/auth-client";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiShield, FiCalendar } from "react-icons/fi";

export default function UserProfilePage() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="p-8 text-slate-400 font-medium">
        Loading profile data...
      </div>
    );
  }

  const user = session?.user;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl space-y-8"
    >
      <div>
        <h2 className="text-2xl font-black text-slate-900">Personal Profile</h2>
        <p className="text-sm text-slate-500">
          Manage your account information and preferences.
        </p>
      </div>

      <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
        {/* Profile Header */}
        <div className="flex items-center space-x-5 mb-8">
          {user?.image ? (
            <img
              src={user.image}
              alt={user.name || "Profile"}
              className="w-20 h-20 rounded-2xl object-cover border border-slate-200 shadow-sm"
            />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 text-3xl font-black uppercase">
              {user?.name?.charAt(0) || "U"}
            </div>
          )}
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              {user?.name || "Guest User"}
            </h3>
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-600">
              {user?.role || "Traveler"}
            </span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid gap-6">
          <ProfileField
            icon={FiMail}
            label="Email Address"
            value={user?.email}
          />
          <ProfileField
            icon={FiShield}
            label="Account Role"
            value={user?.role?.toUpperCase()}
          />
          <ProfileField
            icon={FiCalendar}
            label="Member Since"
            value={new Date(user?.createdAt).toLocaleDateString()}
          />
        </div>
      </div>
    </motion.div>
  );
}

// Reusable Field Component
function ProfileField({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
      <div className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm text-indigo-500 mr-4">
        <Icon />
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {label}
        </p>
        <p className="font-semibold text-slate-900">{value || "N/A"}</p>
      </div>
    </div>
  );
}
